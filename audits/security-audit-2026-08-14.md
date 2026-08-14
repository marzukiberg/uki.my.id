# Security Audit Report: uki.my.id

**Date:** August 14, 2026  
**Target:** uki.my.id (Next.js Portfolio)  
**Scope:** Full repository audit including internal code and external dependencies

---

## Verdict: BLOCK

Multiple critical vulnerabilities require immediate remediation before production deployment.

---

## Executive Summary

| Category | Count | Status |
|----------|-------|--------|
| Critical CVEs | 1 | Requires immediate patch |
| High CVEs | 6 | Requires urgent update |
| High Internal Issues | 4 | Requires immediate fix |
| Medium Internal Issues | 5 | Requires fix before release |
| Low Internal Issues | 4 | Recommended improvements |

---

## Part 1: External Vulnerabilities (CVE)

### 1.1 CRITICAL Vulnerabilities

#### CVE-GHSA-f82v-jwr5-mffw: Authorization Bypass in Next.js Middleware

| Field | Value |
|-------|-------|
| **Severity** | CRITICAL |
| **Package** | next |
| **Vulnerable Versions** | >=13.0.0 <13.5.9 |
| **Patched Versions** | >=13.5.9 |
| **Current Version** | 13.1.4 |
| **CVSS** | 9.1 (Critical) |
| **Attack Vector** | Network |
| **Attack Complexity** | Low |

**Description:**  
Next.js middleware has an authorization bypass vulnerability that allows attackers to circumvent authentication checks.

**Impact:**  
Attackers can access protected routes (dashboard, admin APIs) without valid authentication.

**Affected Code:**  
`middleware.js` protects `/dashboard` route - vulnerable to bypass.

**Remediation:**
```bash
pnpm update next@latest
# Or minimum: pnpm update next@14.2.15
```

---

### 1.2 HIGH Severity CVEs

#### CVE-GHSA-7gfc-8cq8-jh5f: Next.js Authorization Bypass

| Field | Value |
|-------|-------|
| **Severity** | HIGH |
| **Patched Version** | >=14.2.15 |
| **CWE** | CWE-287 (Improper Authentication) |

**Description:** Authorization bypass vulnerability in Next.js.

---

#### CVE-GHSA-h25m-26qc-wcjf: HTTP Request Deserialization DoS

| Field | Value |
|-------|-------|
| **Severity** | HIGH |
| **Patched Version** | >=15.0.8 |
| **CWE** | CWE-400 (Uncontrolled Resource Consumption) |

**Description:** HTTP request deserialization can lead to Denial of Service when using insecure React Server Components.

---

#### CVE-GHSA-q4gf-8mx6-v5v3: Denial of Service

| Field | Value |
|-------|-------|
| **Severity** | HIGH |
| **Patched Version** | >=15.5.15 |
| **CWE** | CWE-400 (Uncontrolled Resource Consumption) |

---

#### CVE-GHSA-8h8q-6873-q5fj: Server Components DoS

| Field | Value |
|-------|-------|
| **Severity** | HIGH |
| **Patched Version** | >=15.5.16 |
| **CWE** | CWE-400 (Uncontrolled Resource Consumption) |

---

#### CVE-GHSA-grv7-fg5c-xmjg: Braces Resource Consumption

| Field | Value |
|-------|-------|
| **Severity** | HIGH |
| **Package** | braces (transitive) |
| **Patched Version** | >=3.0.3 |
| **CWE** | CWE-400 (Uncontrolled Resource Consumption) |

**Description:** Uncontrolled resource consumption in braces (via file-loader > webpack > micromatch).

---

#### CVE-GHSA-5c6j-r48x-rmvq: serialize-javascript RCE

| Field | Value |
|-------|-------|
| **Severity** | HIGH |
| **Package** | serialize-javascript (transitive) |
| **Patched Version** | >=7.0.3 |
| **CWE** | CWE-94 (Code Injection) |

**Description:** Serialize JavaScript vulnerable to RCE via RegExp.flags and Date.prototype.toISOString().

---

## Part 2: Internal Security Issues

### 2.1 HIGH Severity Issues

#### H-1: Outdated Next.js Version (Critical CVE Exposure)

| Field | Value |
|-------|-------|
| **Severity** | HIGH |
| **Location** | `package.json:39` |
| **Current** | `next: "13.1.4"` |
| **Required** | `>=15.5.16` |

**Evidence:**
```json
"next": "13.1.4",
```

**Attack Path:**  
The outdated Next.js version is directly exposed to all 5 critical/high CVEs affecting middleware authorization bypass and DoS attacks.

**Impact:**  
- Complete authentication bypass on protected routes
- Server crash via crafted requests
- Potential RCE via deserialization

**Remediation:**
```bash
pnpm update next@latest
```

---

#### H-2: Weak Authentication - Static Secret Cookie

| Field | Value |
|-------|-------|
| **Severity** | HIGH |
| **Location** | `middleware.js`, `pages/api/auth/secret.js` |
| **CWE** | CWE-307 (Improper Restriction of Excessive Authentication Attempts) |

**Evidence:**
```javascript
// middleware.js:8
if (!auth || auth.value !== "true") {
  return NextResponse.redirect(new URL("/login", request.url));
}

// pages/api/auth/secret.js:14
serialize("auth", "true", { /* ... */ });
```

**Attack Path:**  
1. No rate limiting on `/api/auth/secret`
2. Simple boolean cookie (`auth=true`) with no session token or rotation
3. Example secret in `.env.example` is weak: `ukaythedev123`

**Impact:**  
Brute-force attack to gain dashboard access.

**Remediation:**
1. Add rate limiting to auth endpoint
2. Use signed JWT tokens with expiration
3. Use strong, randomly generated secrets
4. Add account lockout after failed attempts

---

#### H-3: Arbitrary File Upload - No Content Validation

| Field | Value |
|-------|-------|
| **Severity** | HIGH |
| **Location** | `pages/api/upload.js` |
| **CWE** | CWE-434 (Unrestricted Upload of File with Dangerous Type) |

**Evidence:**
```javascript
// pages/api/upload.js:19-24
const form = formidable({
  uploadDir: path.join(process.cwd(), "public", "img", "logos"),
  keepExtensions: true,
  maxFileSize: 10 * 1024 * 1024, // 10MB limit
  filename: (name, ext) => `${uuidv4()}${ext}`,
});
```

**Attack Path:**  
1. Upload malicious file with double extension: `shell.php.jpg`
2. Upload SVG with embedded JavaScript for XSS
3. Upload executable scripts with valid-looking extensions

**Impact:**  
- Stored XSS via SVG files
- Remote Code Execution if file becomes executable
- Server storage exhaustion

**Remediation:**
```javascript
// Add MIME type validation
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!allowedTypes.includes(file.mimetype)) {
  return res.status(400).json({ message: "Invalid file type" });
}

// Add magic byte validation
const allowedSignatures = {
  'ffd8ff': 'image/jpeg',
  '89504e47': 'image/png',
  '47494638': 'image/gif',
};
```

---

#### H-4: SSRF via URL Validation Bypass

| Field | Value |
|-------|-------|
| **Severity** | HIGH |
| **Location** | `pages/api/scribd-download.js:42-49` |
| **CWE** | CWE-918 (Server-Side Request Forgery) |

**Evidence:**
```javascript
const supportedDomains = ['scribd.com', 'slideshare.net', 'everand.com'];
const isSupported = supportedDomains.some(domain => url.includes(domain));
```

**Attack Path:**  
1. Register domain: `scribd.com.evil.com`
2. Passes validation: `url.includes('scribd.com')` → true
3. Request triggers SSRF to internal services

**Impact:**  
- Access internal services (databases, APIs)
- Port scanning internal network
- Cloud metadata access (169.254.169.254)

**Remediation:**
```javascript
// Use URL parsing for proper validation
const { hostname } = new URL(url);
const isSupported = supportedDomains.some(domain => hostname === domain || hostname.endsWith('.' + domain));
```

---

### 2.2 MEDIUM Severity Issues

#### M-1: Hardcoded Fallback API URL with Internal IP

| Field | Value |
|-------|-------|
| **Severity** | MEDIUM |
| **Location** | `pages/api/ai-chat.js:14` |
| **CWE** | CWE-547 (Use of Hard-coded, Security-relevant String) |

**Evidence:**
```javascript
const apiUrl = process.env.LLM_API_URL || "http://100.121.65.10:20128/v1";
```

**Issue:** Internal IP address exposed in source code.

---

#### M-2: Command Injection Risk via PATH Environment

| Field | Value |
|-------|-------|
| **Severity** | MEDIUM |
| **Location** | `pages/api/scribd-download.js:87-94` |
| **CWE** | CWE-78 (OS Command Injection) |

**Evidence:**
```javascript
env: {
  ...process.env,
  PATH: `${process.env.PATH || ''}:/usr/local/bin:/usr/bin`,
}
```

**Issue:** If `process.env.PATH` is attacker-controlled, arbitrary paths could be injected.

---

#### M-3: No CSRF Protection

| Field | Value |
|-------|-------|
| **Severity** | MEDIUM |
| **Location** | `pages/api/portfolio.js`, `pages/api/techstack.js` |
| **CWE** | CWE-352 (Cross-Site Request Forgery) |

**Issue:** No CSRF tokens on state-changing endpoints (POST, PUT, DELETE).

---

#### M-4: No Input Sanitization on JSON Writes

| Field | Value |
|-------|-------|
| **Severity** | MEDIUM |
| **Location** | `pages/api/portfolio.js:47` |
| **CWE** | CWE-79 (Cross-site Scripting) |

**Evidence:**
```javascript
const newItem = req.body; // Direct write to JSON
```

**Issue:** `req.body` written directly to `data/portfolio.json` without sanitization.

---

#### M-5: Missing Security Headers

| Field | Value |
|-------|-------|
| **Severity** | MEDIUM |
| **Location** | `middleware.js` |
| **CWE** | CWE-693 (Protection Mechanism Not Used) |

**Issue:** No security headers configured:
- Content-Security-Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security (HSTS)

---

### 2.3 LOW Severity Issues

#### L-1: Debug Logging Exposes Sensitive Info

| Field | Value |
|-------|-------|
| **Severity** | LOW |
| **Location** | Multiple API routes |

**Issue:** `console.error` logs may expose internal paths and stack traces.

---

#### L-2: Temp Directory Not Cleaned on Error

| Field | Value |
|-------|-------|
| **Severity** | LOW |
| **Location** | `pages/api/scribd-download.js` |

**Issue:** `tempDir` may not be cleaned if process crashes.

---

#### L-3: Error Messages Leak Internal Details

| Field | Value |
|-------|-------|
| **Severity** | LOW |
| **Location** | Multiple API routes |

**Evidence:**
```javascript
res.status(500).json({ message: "Error uploading file", error: error.message });
```

---

#### L-4: No Input Length Limits

| Field | Value |
|-------|-------|
| **Severity** | LOW |
| **Location** | `pages/api/portfolio.js` |

**Issue:** No validation on input field lengths.

---

## Part 3: Remediation Roadmap

### Immediate (Before Next Deployment)

| Priority | Issue | Action | Estimated Time |
|----------|-------|--------|----------------|
| P0 | H-1 | Upgrade Next.js to 15.5.16+ | 5 min |
| P0 | H-2 | Add rate limiting to auth endpoint | 30 min |
| P1 | H-3 | Add file content validation | 1 hour |
| P1 | H-4 | Fix URL validation in scribd-download | 15 min |

### Before Production Release

| Priority | Issue | Action | Estimated Time |
|----------|-------|--------|----------------|
| P2 | M-1 | Remove hardcoded fallback IP | 5 min |
| P2 | M-2 | Use absolute paths in spawn | 15 min |
| P2 | M-3 | Implement CSRF protection | 2 hours |
| P2 | M-4 | Add input sanitization | 1 hour |
| P2 | M-5 | Add security headers | 30 min |

### Recommended (Security Hardening)

| Priority | Issue | Action |
|----------|-------|--------|
| P3 | L-1 | Sanitize production logs |
| P3 | L-2 | Implement temp cleanup on exit |
| P3 | L-3 | Generic error messages in production |
| P3 | L-4 | Add input length validation |

---

## Appendix: Vulnerability Details

### A.1 CVSS v4.0 Scoring Reference

| Severity | Score Range | Description |
|----------|-------------|-------------|
| None | 0.0 | No vulnerability |
| Low | 0.1 - 3.9 | Minimal impact |
| Medium | 4.0 - 6.9 | Moderate impact |
| High | 7.0 - 8.9 | Serious impact |
| Critical | 9.0 - 10.0 | Severe impact |

### A.2 CWE Reference

| CWE ID | Name |
|--------|------|
| CWE-287 | Improper Authentication |
| CWE-307 | Improper Restriction of Excessive Authentication Attempts |
| CWE-352 | Cross-Site Request Forgery |
| CWE-400 | Uncontrolled Resource Consumption |
| CWE-434 | Unrestricted Upload of File with Dangerous Type |
| CWE-547 | Use of Hard-coded, Security-relevant String |
| CWE-693 | Protection Mechanism Not Used |
| CWE-78 | OS Command Injection |
| CWE-918 | Server-Side Request Forgery |
| CWE-94 | Code Injection |

---

**Report Generated:** August 14, 2026  
**Auditor:** Sisyphus Security Agent  
**Next Review:** After all P0/P1 items are resolved
