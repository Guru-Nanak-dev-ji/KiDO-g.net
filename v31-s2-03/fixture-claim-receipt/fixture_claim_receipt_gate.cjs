'use strict';
/* KIDO V31 S2-03 additive claim/ACK receipt gate for local fixtures only.
 * Not a credential checker, production worker, dispatcher or remote ACK proof. */
const crypto=require('node:crypto');
const DIGEST=/^[a-f0-9]{64}$/;
const ID=/^[A-Za-z0-9][A-Za-z0-9_.:-]{2,95}$/;
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const deny=code=>{const e=new Error(code);e.code=code;throw e};
function verifyClaimAckPair(claim,ack,task){
  if(!claim||!ack||!task||typeof claim!=='object'||typeof ack!=='object'||typeof task!=='object')deny('RECEIPT_INPUT');
  if(claim.schema!=='kdn.s2-03.v31.claim-result/1'||ack.schema!=='kdn.s2-03.v31.ack-result/1')deny('RECEIPT_SCHEMA');
  if(claim.authenticatedRealWorker!==false||ack.authenticatedRealWorker!==false||claim.syntheticFixtureOnly!==true||ack.syntheticFixtureOnly!==true)deny('RECEIPT_AUTHORITY_UNTRUSTED');
  if(!ID.test(claim.taskId)||!ID.test(ack.taskId)||!ID.test(task.taskId)||!ID.test(claim.eventId)||!ID.test(ack.handoffId))deny('RECEIPT_ID');
  if(claim.taskId!==ack.taskId||task.taskId!==claim.taskId)deny('RECEIPT_TASK_MISMATCH');
  if(!Number.isSafeInteger(claim.fence)||claim.fence<1||claim.fence!==ack.fence||claim.fence!==task.fence)deny('RECEIPT_FENCE_MISMATCH');
  if(!Number.isSafeInteger(claim.revision)||claim.revision<1||!Number.isSafeInteger(claim.storeRevision)||claim.storeRevision<claim.revision)deny('RECEIPT_REVISION');
  if(!['CLAIMED','REPLAY_NOOP'].includes(claim.decision)||!['STRICT_FIXTURE_ACK_RECORDED','STRICT_FIXTURE_ACK_REPLAY_NOOP'].includes(ack.decision))deny('RECEIPT_DECISION');
  if(task.status!=='CLAIMED')deny('TASK_NOT_CLAIMED');
  const digest=sha(JSON.stringify({taskId:task.taskId,fence:task.fence,claimId:claim.eventId,ackId:ack.handoffId,revision:claim.revision}));
  return Object.freeze({schema:'kdn.s2-03.v31.fixture-pair/1',taskId:task.taskId,fence:task.fence,localReceiptSha256:digest,realReceiverAuthenticated:false,remotePeerAckVerified:false,productionAdmission:'DENIED_PENDING_EXTERNAL_AUTH'});
}
module.exports={verifyClaimAckPair};
