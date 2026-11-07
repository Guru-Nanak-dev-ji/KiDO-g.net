'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {projectClaimRow,addToV4Snapshot}=require('./v4_snapshot_claim_row.cjs');
const id='V33-S203-CLAIM-001',evidence='https://drive.google.com/file/d/1lZc7eUoAYqGwAwFfUy3V0HOSZ77kMOcJ/view';
function fixture(){const task={taskId:id,owner:'S2-03',scope:'GREEN_MOCK',status:'CLAIMED',fence:1,leaseExpiresAt:1000,sourceSha:'a'.repeat(64)};const state={events:[{event:{kind:'CLAIMED',taskId:id,fence:1}}],tasks:{[id]:task}};return{taskId:id,task,state,stopActive:false,sourceEvidence:evidence}}
const bad=(code,fn)=>assert.throws(fn,{code});
test('01 legitimate local source is projected as TEST_REPORTED',()=>assert.equal(projectClaimRow(fixture()).state,'TEST_REPORTED'));
test('02 never claims authentic receiver',()=>assert.match(projectClaimRow(fixture()).next,/PENDING/));
test('03 STOP holds',()=>bad('STOP_HOLD',()=>projectClaimRow({...fixture(),stopActive:true})));
test('04 wrong owner held',()=>bad('UNTRUSTED_TASK',()=>{const f=fixture();f.task.owner='S2-10';return projectClaimRow(f)}));
test('05 missing chain held',()=>bad('CLAIM_CHAIN_MISMATCH',()=>{const f=fixture();f.state.events=[];return projectClaimRow(f)}));
test('06 stale fence held',()=>bad('CLAIM_CHAIN_MISMATCH',()=>{const f=fixture();f.task.fence=2;return projectClaimRow(f)}));
test('07 source hash invalid held',()=>bad('SOURCE_SHA_REQUIRED',()=>{const f=fixture();f.task.sourceSha='x';return projectClaimRow(f)}));
test('08 malicious evidence URL held',()=>bad('EVIDENCE_URL_INVALID',()=>projectClaimRow({...fixture(),sourceEvidence:'javascript:alert(1)'})));
test('09 merge preserves V4 rooms and domains',()=>{const s={schema:'KIDO_WORKSPACE_V4_SNAPSHOT_1',tasks:[],rooms:[{id:'S2-03',url:null}],domains:['not4you.world']};const r=addToV4Snapshot(s,projectClaimRow(fixture()));assert.equal(r.rooms.length,1);assert.equal(r.domains[0],'not4you.world');assert.equal(r.tasks.length,1)});
test('10 duplicate task never imported twice',()=>{const s={schema:'KIDO_WORKSPACE_V4_SNAPSHOT_1',tasks:[],rooms:[{id:'S2-03'}],domains:[]};const r=projectClaimRow(fixture());bad('DUPLICATE_TASK',()=>addToV4Snapshot(addToV4Snapshot(s,r),r))});
test('11 no trusted roster held',()=>bad('WORKER_ROSTER_MISMATCH',()=>addToV4Snapshot({schema:'KIDO_WORKSPACE_V4_SNAPSHOT_1',tasks:[],rooms:[],domains:[]},projectClaimRow(fixture()))));
test('12 source remains unchanged after pure projection',()=>{const f=fixture(),before=JSON.stringify(f);projectClaimRow(f);assert.equal(JSON.stringify(f),before)});
