# KIDO V31 — S2-03 Ganesh fixture claim/ACK receipt gate

This is an **isolated local test contract**, not a production claim router or connected-AI identity verification mechanism. Existing Ganesh V20/V27/V30 source is preserved and not overwritten.

## Run the code

```sh
node --test v31-s2-03/fixture-claim-receipt/test_fixture_claim_receipt_gate.cjs
```

Tested locally on Node v22.16.0: 10 new tests passed, 0 failed.

The separate V31 local `claim_bridge.cjs` / `claim_cli.cjs` uses the existing SQLite adapter, and had 24 new tests PASS plus 56 V30 regressions PASS (80 tests); complete portable ZIP upload to Drive is **SYNC_PENDING**, not uploaded.

## Scope and trust

`verifyClaimAckPair` checks task IDs, fence, claim revision, exact typed schema, replay decisions and requires all records to be explicitly synthetic. Returned result **always** says `realReceiverAuthenticated: false`, `remotePeerAckVerified: false`, `productionAdmission: DENIED_PENDING_EXTERNAL_AUTH`.

Does not authenticate another ChatGPT room or a real receiver; does not grant STOP/GREEN, sign receipts, touch Termux, pay for API calls, deploy, alter DNS or count autonomous loops.

## NEXT_TASK

`V31-S2-03-N03-OWNER_SELECTED_BACKEND_AND_REAL_RECEIVER_INTEGRATION`: requires G03/G10 exact selected source/revision, G09/G11 independent security review, S2-10 authenticated receiver issuer, and real connected claim/ACK evidence. Do not substitute posted docs for peer ACK.
