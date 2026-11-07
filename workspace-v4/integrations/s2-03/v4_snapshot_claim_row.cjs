'use strict';
// KIDO V33 Ganesh: source-reported claim row for EXISTING Workspace V4 import schema.
// This is a pure projection. No remote ACK, task execution, secrets, or network.
const TASK=/^[A-Z0-9-]{3,100}$/;
const HEX=/^[a-f0-9]{64}$/;
const deny=code=>{const e=new Error(code);e.code=code;throw e};
function projectClaimRow({taskId,owner='S2-03',task,state,stopActive,sourceEvidence}={}){
 if(typeof taskId!=='string'||!TASK.test(taskId)||owner!=='S2-03')deny('UNSUPPORTED_OWNER_OR_ID');
 if(!task||task.taskId!==taskId||task.owner!==owner||task.scope!=='GREEN_MOCK'||task.status!=='CLAIMED')deny('UNTRUSTED_TASK');
 if(!Number.isSafeInteger(task.fence)||task.fence<1||!Number.isSafeInteger(task.leaseExpiresAt)||task.leaseExpiresAt<1)deny('BAD_LEASE');
 if(stopActive!==false)deny('STOP_HOLD');
 if(!state||!Array.isArray(state.events)||state.tasks?.[taskId]!==task)deny('SOURCE_REQUIRED');
 const claims=state.events.filter(x=>x.event?.kind==='CLAIMED'&&x.event?.taskId===taskId);
 if(claims.length!==1||claims[0].event.fence!==task.fence)deny('CLAIM_CHAIN_MISMATCH');
 if(typeof task.sourceSha!=='string'||!HEX.test(task.sourceSha))deny('SOURCE_SHA_REQUIRED');
 if(typeof sourceEvidence!=='string'||!/^https:\/\/(?:drive\.google\.com\/file\/d\/|github\.com\/|docs\.google\.com\/document\/d\/)/.test(sourceEvidence))deny('EVIDENCE_URL_INVALID');
 return Object.freeze({id:taskId,owner:'S2-03',state:'TEST_REPORTED',next:'LOCAL_FIXTURE_CLAIM; authentic worker ACK=PENDING; real dispatcher NOT CONNECTED',evidence:sourceEvidence});
}
function addToV4Snapshot(snapshot,row){
 if(!snapshot||snapshot.schema!=='KIDO_WORKSPACE_V4_SNAPSHOT_1'||!Array.isArray(snapshot.tasks)||!Array.isArray(snapshot.rooms)||!Array.isArray(snapshot.domains))deny('V4_SCHEMA');
 if(snapshot.tasks.some(t=>t.id===row?.id))deny('DUPLICATE_TASK');
 if(row?.state!=='TEST_REPORTED'||row?.owner!=='S2-03')deny('UNTRUSTED_PROJECTION');
 if(!snapshot.rooms.some(r=>r.id==='S2-03'))deny('WORKER_ROSTER_MISMATCH');
 return {...snapshot,tasks:[...snapshot.tasks,row]};
}
module.exports={projectClaimRow,addToV4Snapshot};
