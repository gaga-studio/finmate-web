# Frontend design handoff

The design implementation received on 2026-07-14 must be preserved without
modification on branch `design-handoff/2026-07-14` and tag
`design-handoff-2026-07-14`.

## Required manifest

- Source type and original commit SHA or archive SHA-256
- Node version, package manager, install and run commands
- Screen and route inventory
- Original assets, fonts, licenses and design source links
- Supported mobile viewports and interaction recordings
- Mock data assumptions, environment variables and known issues

## Porting status

- `KEEP`: port without visual changes
- `REFINE`: retain the visual direction and rewrite the structure
- `REBUILD`: rebuild from the reference screen
- `DROP`: exclude from the MVP

No handoff branch is merged wholesale into `main`.
