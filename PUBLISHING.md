# Publishing Guide

This document outlines the process for publishing Tiptap UI Kit to NPM.

## 📋 Pre-Publishing Checklist

Before publishing, ensure:

- [ ] All tests pass (`pnpm test` - when tests are available)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Version number is updated in `package.json`
- [ ] CHANGELOG.md is updated with changes
- [ ] README.md is up to date
- [ ] LICENSE file is present
- [ ] All files are committed to git
- [ ] You're on the `main` branch
- [ ] Working directory is clean (`git status`)

## 🔐 NPM Authentication

### First Time Setup

1. Create an NPM account at [npmjs.com](https://www.npmjs.com/signup)

2. Enable 2FA (Two-Factor Authentication) for publishing:
   ```bash
   npm profile enable-2fa auth-and-writes
   ```

3. Login to NPM:
   ```bash
   npm login
   ```

4. Verify login:
   ```bash
   npm whoami
   ```

### Using NPM Token (CI/CD)

For automated publishing, use an access token:

1. Generate token:
   ```bash
   npm token create
   ```

2. Store in environment:
   ```bash
   export NPM_TOKEN=your_token_here
   ```

3. Configure `.npmrc`:
   ```
   //registry.npmjs.org/:_authToken=${NPM_TOKEN}
   ```

## 📦 Publishing Process

### Manual Publishing

#### 1. Update Version

Use semantic versioning (MAJOR.MINOR.PATCH):

```bash
# Patch release (0.1.0 → 0.1.1) - Bug fixes
npm version patch

# Minor release (0.1.0 → 0.2.0) - New features
npm version minor

# Major release (0.1.0 → 1.0.0) - Breaking changes
npm version major
```

Or manually update `package.json`:
```json
{
  "version": "0.2.0"
}
```

#### 2. Update CHANGELOG.md

Add release notes:

```markdown
## [0.2.0] - 2026-02-01

### Added
- New feature X
- New feature Y

### Fixed
- Bug fix A
- Bug fix B

### Changed
- Updated dependency Z
```

#### 3. Commit Changes

```bash
git add package.json CHANGELOG.md
git commit -m "chore: bump version to 0.2.0"
git push
```

#### 4. Build Package

```bash
pnpm build
```

Verify build output:
```bash
ls -la dist/
```

Expected files:
- `index.esm.js` - ES module build
- `index.js` - CommonJS build
- `index.d.ts` - TypeScript definitions
- `tiptap-ui-kit.css` - Styles

#### 5. Test Package Locally

Create a tarball and test it:

```bash
# Create tarball
npm pack

# This creates tiptap-ui-kit-0.2.0.tgz

# Test in another project
cd /path/to/test-project
npm install /path/to/tiptap-ui-kit-0.2.0.tgz
```

Verify:
- Package installs correctly
- TypeScript types work
- Imports work
- Styles load

#### 6. Publish to NPM

```bash
# Dry run first (recommended)
npm publish --dry-run

# Publish for real
npm publish

# Or use the script
pnpm release
```

For scoped packages:
```bash
npm publish --access public
```

#### 7. Create Git Tag

```bash
git tag v0.2.0
git push origin v0.2.0
```

#### 8. Create GitHub Release

Go to GitHub → Releases → New Release:

- **Tag**: v0.2.0
- **Title**: Release 0.2.0
- **Description**: Copy from CHANGELOG.md
- Attach the `.tgz` file (optional)
- Click "Publish release"

Or use GitHub CLI:
```bash
gh release create v0.2.0 \
  --title "Release 0.2.0" \
  --notes-file CHANGELOG.md
```

### Automated Publishing (CI/CD)

The project includes a GitHub Actions workflow for automated releases.

#### Using GitHub Actions

1. Create NPM token:
   ```bash
   npm token create
   ```

2. Add to GitHub Secrets:
   - Go to repository Settings → Secrets → Actions
   - Add `NPM_TOKEN` with your token

3. Push a version tag:
   ```bash
   git tag v0.2.0
   git push origin v0.2.0
   ```

4. GitHub Actions will:
   - Run tests and build
   - Publish to NPM
   - Create GitHub release

See `.github/workflows/release.yml` for configuration.

## 🏷️ Version Tags

We use these tags for special releases:

### Latest (default)

```bash
npm publish
# Published as: tiptap-ui-kit@latest
```

### Beta Releases

```bash
npm version 0.2.0-beta.1
npm publish --tag beta
```

Install:
```bash
npm install tiptap-ui-kit@beta
```

### Next (Canary) Releases

```bash
npm version 0.2.0-next.1
npm publish --tag next
```

Install:
```bash
npm install tiptap-ui-kit@next
```

## 📊 Post-Publishing

### Verify Publication

1. Check on NPM:
   ```
   https://www.npmjs.com/package/tiptap-ui-kit
   ```

2. Install and test:
   ```bash
   npm install tiptap-ui-kit@latest
   ```

3. Check unpkg CDN (give it a few minutes):
   ```
   https://unpkg.com/tiptap-ui-kit@latest/
   ```

### Update Documentation

- Update README.md badges
- Update installation instructions
- Announce on social media
- Update demo site

### Monitor

- Watch for issues on GitHub
- Monitor npm download stats
- Check for security vulnerabilities

## 🐛 Troubleshooting

### "You must be logged in to publish"

```bash
npm login
npm whoami
```

### "Package name already exists"

Check package name availability:
```bash
npm view tiptap-ui-kit
```

### "You do not have permission to publish"

Ensure you're logged in with the correct account:
```bash
npm whoami
```

### "Package.json is missing required fields"

Ensure these fields are present:
- `name`
- `version`
- `description`
- `license`
- `repository`

### Build fails during publish

The `prepublishOnly` script runs before publishing. If it fails:

```bash
# Run build manually to see errors
pnpm build

# Fix errors, then try again
npm publish
```

### Accidentally published wrong version

Deprecate the version:
```bash
npm deprecate tiptap-ui-kit@0.2.0 "Accidental publish, use 0.2.1 instead"
```

Note: You cannot unpublish packages after 24 hours.

## 🔄 Unpublishing

⚠️ **Use with extreme caution!**

Within 72 hours of publishing:
```bash
npm unpublish tiptap-ui-kit@0.2.0
```

This should only be done for:
- Accidentally published private code
- Security vulnerabilities
- Legal issues

For other issues, publish a new patch version instead.

## 📚 Resources

- [NPM Publishing Documentation](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [Keeping Changelog](https://keepachangelog.com/)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)

---

## 🎯 Quick Command Reference

```bash
# Version bumps
npm version patch    # 0.1.0 → 0.1.1
npm version minor    # 0.1.0 → 0.2.0
npm version major    # 0.1.0 → 1.0.0

# Build
pnpm build

# Test package
npm pack
npm publish --dry-run

# Publish
npm publish
npm publish --tag beta

# Git
git tag v0.2.0
git push origin v0.2.0

# GitHub release
gh release create v0.2.0
```

---

**Need help?** [Open an issue](https://github.com/benngaihk/Tiptap-UI-Kit/issues)
