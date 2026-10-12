# ScrapMaster AI foundation status

## Current repository mismatch

This repository currently uses Vite + React + Express and a browser-local inventory. The required application stack is Macaly + TanStack Start + Convex. This branch does not claim to implement Auth or persistence.

## Change in this branch

- Adds stable `data-testid="tab-*"` attributes to current navigation tabs for browser automation.
- Adds an explicit visible warning that authentication and Convex persistence are not implemented in this prototype.

## Verification status

- Browser scenario: not run (no browser session available via GitHub connector).
- TypeScript/CSS check: not run (GitHub connector cannot run repository commands).
- `.sandbox/check-errors`: not run.
- Authentication / OTP: not implemented.
- Convex Live: not deployed.

## Next required step

Create or switch to the Macaly-generated TanStack Start + Convex project scaffold before implementing Convex Auth. Do not treat this branch as production-ready.