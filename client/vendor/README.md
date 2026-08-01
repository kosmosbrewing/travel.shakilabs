# ShakiLabs UI artifact

`shakilabs-ui-0.3.11.tgz` is the active exact artifact for `@shakilabs/ui` 0.3.11.

- Source repository: `00.root-shakilabs`
- Source commit: `657cf80b72ef4a977b7b34e765b8ddb4ce9fbef7`
- SHA-256: `2c9587d9fd74af697f0a95bc50e39bccf169fb48dcebf37afe5991926b713b54`
- Consumed by: `client/package.json` → `"@shakilabs/ui": "file:vendor/shakilabs-ui-0.3.11.tgz"`
- Rollback artifacts: available from Git history when needed

Only the active exact artifact is committed so an isolated Vercel checkout can run `npm ci` without a private registry token.

## Verify

```sh
shasum -a 256 client/vendor/shakilabs-ui-0.3.11.tgz
```

The digest must match the SHA-256 recorded above. CI enforces this on every run:
`client/scripts/verify-vendor-readme.mjs` cross-checks three facts that drifted apart in
the past — the committed tgz filename, the SHA-256 written here, and the `file:` reference
in `client/package.json`. A vendor bump that forgets this file now fails the build instead
of leaving a wrong supply-chain record behind.

## Update procedure

1. Pack the new version in `00.root-shakilabs` and copy the tgz into `client/vendor/`.
2. Delete the previous tgz — exactly one artifact stays committed.
3. Point `client/package.json` at the new file (`file:vendor/shakilabs-ui-<version>.tgz`)
   and run `npm install` so `package-lock.json` records the new integrity hash.
4. Rewrite this file: version, source commit, and `shasum -a 256` digest.
5. Run `npm run verify:supply-chain` in `client/` before pushing.
