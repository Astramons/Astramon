# Release Process

## Versioning

Astramon uses semantic versioning.

## Checklist

1. Update `CHANGELOG.md`.
2. Update `package.json` version.
3. Run validation:

```bash
npm run validate
```

4. Commit changes.
5. Tag the release:

```bash
git tag v0.1.0
```

6. Push the tag:

```bash
git push origin v0.1.0
```

7. Create a GitHub Release using `RELEASE_NOTES.md`.

## GitHub Pages

The Pages workflow deploys from `main`. The custom domain is controlled by `CNAME`.
