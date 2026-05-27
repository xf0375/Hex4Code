# Security Policy

## Supported Versions

| Version | Status         |
|---------|----------------|
| 1.1.x   | ✅ Active support |

## Reporting a Vulnerability

If you discover a security vulnerability, **please do not report it in a public Issue**.

Instead, report it privately through one of these channels:

1. Send an email to the project maintainers with the vulnerability details
2. Use the private reporting feature on the AtomGit repository

## Vulnerability Report Contents

Please include the following information:

- **Affected component**: core / cli / vscode
- **Vulnerability type**: e.g., XXE, injection, privilege escalation, sensitive information disclosure
- **Steps to reproduce**: Detailed instructions to trigger the vulnerability
- **Impact scope**: Assessment of potential impact
- **Remediation suggestions** (optional): Any suggested fixes

## Response Process

1. **Acknowledgement**: Confirmation of receipt within 72 hours
2. **Assessment**: Initial evaluation within 7 business days
3. **Fix release**: Fix published as soon as possible after confirmation
4. **Public disclosure**: After the fix is released, disclosed in the CHANGELOG (without exploitable details)

## Security Best Practices

- **API Keys**: Do not hardcode API keys in code; use configuration files or environment variables
- **Configuration**: `settings.json` contains sensitive information; do not commit it to version control
- **Dependency updates**: Regularly run `npm audit` to check for dependency security vulnerabilities
