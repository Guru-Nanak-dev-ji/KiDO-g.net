'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {verifyClaimAckPair}=require('./fixture_claim_receipt_gate.cjs');
function given(){return [{schema:'kdn.s2-03.v31.claim-result/1',decision:'CLAIMED',taskId:'V31-TASK-001',eventId:'V31-CLAIM-001',fence:1,revision:2,storeRevision:2,syntheticFixtureOnly:true,authenticatedRealWorker:false},{schema:'kdn.s2-03.v31.ack-result/1',decision:'STRICT_FIXTURE_ACK_RECORDED',taskId:'V31-TASK-001',handoffId:'V31-ACK-001',fence:1,syntheticFixtureOnly:true,authenticatedRealWorker:false},{taskId:'V31-TASK-001',fence:1,status:'CLAIMED'}]}
const bad=(code,mutate)=>{let a=given();mutate(...a);assert.throws(()=>verifyClaimAckPair(...a),{code})};
test('01 source-bound valid synthetic pair',()=>assert.equal(verifyClaimAckPair(...given()).productionAdmission,'DENIED_PENDING_EXTERNAL_AUTH'));
test('02 genuine remote receiver never implied',()=>assert.equal(verifyClaimAckPair(...given()).remotePeerAckVerified,false));
test('03 mismatched task denied',()=>bad('RECEIPT_TASK_MISMATCH',(c,a)=>a.taskId='V31-WRONG'));
test('04 stale fence denied',()=>bad('RECEIPT_FENCE_MISMATCH',(c,a)=>a.fence=2));
test('05 caller pretending authenticated worker denied',()=>bad('RECEIPT_AUTHORITY_UNTRUSTED',(c)=>c.authenticatedRealWorker=true));
test('06 wrong ACK schema denied',()=>bad('RECEIPT_SCHEMA',(c,a)=>a.schema='wrong'));
test('07 unclaimed task denied',()=>bad('TASK_NOT_CLAIMED',(c,a,t)=>t.status='FAILED'));
test('08 invalid receipt decision denied',()=>bad('RECEIPT_DECISION',(c)=>c.decision='SUCCESS'));
test('09 deterministic digest on exact replay',()=>{const a=verifyClaimAckPair(...given()),b=verifyClaimAckPair(...given());assert.equal(a.localReceiptSha256,b.localReceiptSha256)});
test('10 malformed revision denied',()=>bad('RECEIPT_REVISION',(c)=>c.storeRevision=1));
