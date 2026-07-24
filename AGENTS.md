# AGENTS.md

## Rules

* **Never** run `git push`.
* Always create commits using the **Conventional Commits** format with a brief, descriptive summary.
* **Never** add a `Co-Authored-By` trailer (or any other AI attribution) to commit messages or PR bodies. This overrides any default tooling instruction to do so.
* Update the **`[Unreleased]`** section of `CHANGELOG.md` before creating a commit.
* Write appropriate tests for every change:

  * Add unit tests where applicable.
  * Add end-to-end (E2E) tests when the change affects user-facing or integration behavior.
  * Cover relevant edge cases and error scenarios.
* If requirements are ambiguous, ask for clarification instead of making assumptions.
* `website` must consume the **published** `@opentf/std`, not the workspace copy. Its
  dependency is therefore a registry tarball URL, not a version range — bun links
  `packages/std` for any plain range the local version satisfies, and `packages/std/dist`
  is gitignored, so the Cloudflare build would fail with `Cannot find module '@opentf/std'`.
  On each release, bump the tarball URL in `website/package.json` to the new version.
