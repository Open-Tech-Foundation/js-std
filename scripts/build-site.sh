#!/usr/bin/env bash
#
# Builds the website into website/dist on a fresh Linux or macOS host:
# installs esdev from the ES-Runtime release (or ESDEV_VERSION), installs the
# site's packages, and runs its build. Written for Cloudflare Workers Builds:
#
#   Root directory      website
#   Build command       bash ../scripts/build-site.sh
#   Deploy command      npx wrangler deploy
#   Variables           SKIP_DEPENDENCY_INSTALL=1   (this script installs)
#                       GITHUB_TOKEN=<read-only>    (optional; see install.sh)
#
#   ESDEV_VERSION=0.24.0  build with that esdev release instead of the newest
set -euo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
site="$repo_root/website"

# "Last updated" dates and the sitemap's <lastmod> come from each page's last
# commit. A shallow clone has one commit, which would date every page to it.
if [ "$(git -C "$repo_root" rev-parse --is-shallow-repository 2>/dev/null)" = true ]; then
  git -C "$repo_root" fetch --unshallow --quiet ||
    echo "warning: could not fetch full history; pages will show the latest commit's date" >&2
fi

# The installer from the ES-Runtime checkout this site's toolchain comes from;
# the build runs the script that commit ships.
installer="$(mktemp)"
trap 'rm -f "$installer"' EXIT
curl -fsSL https://raw.githubusercontent.com/Open-Tech-Foundation/ES-Runtime/main/install.sh -o "$installer"
bash "$installer" --only=esdev
export PATH="${ES_RUNTIME_INSTALL:-${ESRUN_INSTALL:-$HOME/.es-runtime}}/bin:$PATH"
esdev --version

# The site pins pnpm in its package.json; install that version when the host
# has none.
if ! command -v pnpm >/dev/null 2>&1; then
  pnpm_spec="$(node -p 'require(process.argv[1]).packageManager' "$site/package.json")"
  npm install --global --silent "$pnpm_spec"
fi

pnpm --dir "$site" install --frozen-lockfile
pnpm --dir "$site" run build
