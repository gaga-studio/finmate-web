# FinMate Screen Inventory

| Route | States | Source handoff status | Target implementation status |
| --- | --- | --- | --- |
| `/signup`, `/login` | default, validation | Not received; no handoff branch/tag created | Implemented |
| `/onboarding/:step` | steps 1-6 | Not received; no handoff branch/tag created | Implemented |
| `/goal/confirm`, `/goal/success` | candidate, confirmed | Not received; no handoff branch/tag created | Implemented |
| `/home` | fresh, loading, error | Not received; no handoff branch/tag created | Implemented |
| `/report` | report, loading, error | Not received; no handoff branch/tag created | Implemented |
| `/mates`, `/mates/group/:groupId` | list, group detail | Not received; no handoff branch/tag created | Implemented |
| `/mates/group/:groupId/adventurer/:adventurerId/routine/:routineId` | anonymous routine detail | Not received; no handoff branch/tag created | Implemented |
| `/routine/:groupId/:adventurerId/:routineId`, `/routine/confirm` | adaptation, candidate choice, replacement confirmation, active | Not received; no handoff branch/tag created | Implemented |
| `/quests` | ready, education | Not received; no handoff branch/tag created | Implemented |
| `/record` | 30-day grid, day bottom sheet | Not received; no handoff branch/tag created | Implemented |
| `/demo`, `/goal/complete` | demo advance, completed | Not received; no handoff branch/tag created | Implemented |
| `/dev`, `/dev/:state` | loading, empty, stale, error | Not received; no handoff branch/tag created | Implemented |
