## Summary

Resolves ~100 of 143 open Dependabot security alerts by updating vulnerable transitive dependencies.

### Changes

**Root (package.json + pnpm-lock.yaml):**
- Added `pnpm.overrides` to force secure transitive dependency versions:
  - `braces`: 2.3.2 → 3.0.3 (CVE-2024-4068)
  - `micromatch`: 3.1.10 → 4.0.8 (CVE-2024-4067)
  - `minimatch`: 3.1.5 → 10.2.5 (CVE-2026-27903)
  - `serialize-javascript`: 4.0.0 → 7.0.6 (RCE via RegExp.flags)
  - `glob`: 10.3.10 → 13.0.6 (CVE-2025-64756)
  - `yaml`: → 2.8.0+ (CVE-2026-33532)

**scripts/scribd-dl/:**
- Upgraded `axios` ^1.6.8 → ^1.7.9 (fixes 20+ CVEs: SSRF, credential leak, prototype pollution, ReDoS, header injection)
- Removed stale `package-lock.json`
- Regenerated `pnpm-lock.yaml` with patched `form-data` 4.0.6, `js-yaml` 4.2.0, `flatted` 3.4.2

### Remaining (need Next.js 15 upgrade)
- 18 Next.js alerts (4 high, 10 medium, 4 low) — all require >=15.5.16
- `elliptic` — no patch available upstream
- `scripts/academia-dl/` — Ruby gems need `bundle update` (Ruby not installed on dev machine)

### Verification
- `pnpm install` completes without errors
- Lockfile resolves to patched versions
