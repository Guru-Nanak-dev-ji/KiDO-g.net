'use strict';
/* V31 S2-03 source-binding fixture review. Never grants real receiver admission. */
const H=/^[a-f0-9]{64}$/; const F=new Set(['ganesh-strict','ei-fenced','m1-original']);
function deny(code){const e=new Error(code);e.code=code;throw e}
function reviewSourceAdoption({selected,proposal,stopEpoch,fixtureMode}={}){
 if(!selected||!proposal)deny('ADOPTION_INPUT');
 if(selected.schema!=='kdn.s2-03.v31.selected-source/1'||proposal.schema!=='kdn.s2-03.v31.source-proposal/1')deny('ADOPTION_SCHEMA');
 if(!F.has(selected.backend)||selected.backend!==proposal.backend)deny('BACKEND_FAMILY_MISMATCH');
 if(typeof selected.sha256!=='string'||typeof proposal.sha256!=='string'||!H.test(selected.sha256)||!H.test(proposal.sha256))deny('SOURCE_SHA_INVALID');
 if(selected.sha256!==proposal.sha256)deny('SELECTED_SOURCE_MISMATCH');
 if(!Number.isSafeInteger(selected.revision)||selected.revision<1||selected.revision!==proposal.revision)deny('SOURCE_REVISION_MISMATCH');
 if(!Number.isSafeInteger(stopEpoch)||stopEpoch<0||stopEpoch!==selected.stopEpoch||selected.stopActive!==false)deny('STOP_EPOCH_HOLD');
 if(fixtureMode!==true||proposal.fixtureOnly!==true)deny('REAL_RUNTIME_NO_AUTH');
 return Object.freeze({decision:'SOURCE_BOUND_FIXTURE_ONLY',backend:selected.backend,sha256:selected.sha256,realReceiverAdmitted:false,productionApproved:false,strictAutonomousLoops:0});
}
module.exports={reviewSourceAdoption};
