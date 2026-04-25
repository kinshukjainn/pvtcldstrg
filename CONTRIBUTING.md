# Contributing to pvtcldstrg

Thanks for considering a contribution! This is a personal portfolio project, but I'm genuinely happy to accept improvements — bug fixes, performance wins, security hardening, accessibility, or thoughtful refactors. Read the rules below before opening a PR.

## Ground rules

- **Open an issue first** for anything non-trivial. A two-line bug fix is fine to PR directly. A new feature, refactor, or change to the upload flow needs discussion first so we don't waste your time.
- **One PR, one concern.** Don't bundle a typo fix, a refactor, and a feature into the same PR.
- **Keep the architecture intact.** Files must never touch the server. If your change makes the server proxy uploads, it will be rejected.
- **No new dependencies without justification.** If lodash, axios, or a 200kb library shows up in a PR, explain why the standard library or existing deps can't do it.

## How to set up locally

1. Fork the repo and clone your fork.
2. Follow the [Getting started](./README.md#getting-started) section in the README for env vars, S3 bucket setup, and Clerk webhooks.
3. Create a branch off `main`:

   ```bash
   git checkout -b fix/short-description
   ```

   Branch prefixes: `fix/`, `feat/`, `refactor/`, `docs/`, `chore/`.

4. Make your changes.
5. Run the linter and make sure it passes:

   ```bash
   npm run lint
   ```

6. Commit using clear, imperative messages:

   ```text
   fix: prevent storage counter drift on failed S3 verification
   feat: add bulk delete endpoint
   docs: clarify S3 CORS requirements
   ```

7. Push and open a PR against `main`.

## What I'll look at in a PR

- **Does it solve the stated problem?** PR description should explain *what* and *why*, not just *what*.
- **Is the change minimal?** Smallest diff that solves the problem wins.
- **Does it preserve atomicity?** Anything touching uploads, deletes, or the storage counter must keep its database transaction intact.
- **Does it handle the orphaned-file case?** If your change adds a delete path, walk me through how S3 cleanup happens.
- **Does it lint cleanly?** No warnings.

## What I won't merge

- Cosmetic refactors with no functional benefit ("renamed every variable for clarity")
- Style changes against the existing Prettier/ESLint config
- Anything that introduces a server-side file proxy
- "AI-generated" PRs that the author can't explain in their own words

## Reporting bugs

Use the bug report template in [Issues](../../issues/new/choose). Include:

- What you did
- What you expected
- What happened instead
- Browser, OS, Node version
- Console errors and the relevant network request (with sensitive headers redacted)

## Reporting security issues

**Don't open a public issue.** See [SECURITY.md](./SECURITY.md) for the disclosure process.

## Code of conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md). Be decent.

## Questions?

For general questions about how things work, leave a note on [clkfeedbacks.cloudkinshuk.in](https://clkfeedbacks.cloudkinshuk.in) or reach out via the contact links in the README.
