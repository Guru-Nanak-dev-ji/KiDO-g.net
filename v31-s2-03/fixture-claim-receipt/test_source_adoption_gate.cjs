'use strict';const test=require('node:test'),assert=require('node:assert/strict');const {reviewSourceAdoption}=require('./source_adoption_gate.cjs');
function args(){return {selected:{schema:'kdn.s2-03.v31.selected-source/1',backend:'ganesh-strict',sha256:'a'.repeat(64),revision:4,stopEpoch:2,stopActive:false},proposal:{schema:'kdn.s2-03.v31.source-proposal/1',backend:'ganesh-strict',sha256:'a'.repeat(64),revision:4,fixtureOnly:true},stopEpoch:2,fixtureMode:true}}
function bad(code,edit){let d=args();edit(d);assert.throws(()=>reviewSourceAdoption(d),{code})}
test('01 matching fixture',()=>assert.equal(reviewSourceAdoption(args()).decision,'SOURCE_BOUND_FIXTURE_ONLY'));
test('02 never real receiver',()=>assert.equal(reviewSourceAdoption(args()).realReceiverAdmitted,false));
test('03 no production',()=>assert.equal(reviewSourceAdoption(args()).productionApproved,false));
test('04 backend mismatch',()=>bad('BACKEND_FAMILY_MISMATCH',x=>x.proposal.backend='ei-fenced'));
test('05 altered SHA',()=>bad('SELECTED_SOURCE_MISMATCH',x=>x.proposal.sha256='b'.repeat(64)));
test('06 revision mismatch',()=>bad('SOURCE_REVISION_MISMATCH',x=>x.proposal.revision=5));
test('07 stop epoch mismatch',()=>bad('STOP_EPOCH_HOLD',x=>x.stopEpoch=1));
test('08 stop active',()=>bad('STOP_EPOCH_HOLD',x=>x.selected.stopActive=true));
test('09 untrusted mode denied',()=>bad('REAL_RUNTIME_NO_AUTH',x=>x.fixtureMode=false));
test('10 nonfixture denied',()=>bad('REAL_RUNTIME_NO_AUTH',x=>x.proposal.fixtureOnly=false));
test('11 invalid digest',()=>bad('SOURCE_SHA_INVALID',x=>x.proposal.sha256='bad'));
test('12 unsupported family',()=>bad('BACKEND_FAMILY_MISMATCH',x=>{x.selected.backend='unknown';x.proposal.backend='unknown'}));
test('13 invalid schema',()=>bad('ADOPTION_SCHEMA',x=>x.proposal.schema='bad'));
test('14 stored stop epoch mismatch',()=>bad('STOP_EPOCH_HOLD',x=>x.selected.stopEpoch=3));
