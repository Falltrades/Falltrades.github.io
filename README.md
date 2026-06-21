# falltrades.github.io

Personal portfolio site for **Falltrades** — a single-page, static site showcasing apps, cloud infrastructure work, and platform-engineering write-ups.

🔗 Live: [falltrades.github.io](https://falltrades.github.io)

## Features

- **Single static HTML file** (`public/index.html`) — no build step, no framework
- **Dark / light theme toggle**, persisted via `localStorage`
- **EN / FR language toggle** via inline `data-i18n` content swapping
- Animated terminal-style typewriter intro
- Responsive, accessible (focus states, `prefers-reduced-motion` support)
- Project sections linking out to:
  - [StellaSecret](https://stellasecret.github.io) — Android/Flutter apps
  - [cloud-example](https://github.com/Falltrades/cloud-example) — AWS IaC reference implementations
  - Engineering notes (GitOps, Playwright/k8s, release automation)

## Project structure

```
.
├── public/
│   └── index.html        # the entire site
├── tests/
│   └── portfolio.spec.js # Playwright E2E tests
├── playwright.config.js  # test runner config (chromium + firefox)
├── .github/workflows/
│   └── deploy.yml         # validate → test → deploy pipeline
├── .pre-commit-config.yaml
└── package.json
```

## Local development

```bash
npm install
npx playwright install   # one-time: downloads the browser binaries tests need
npm run serve     # serves public/ at http://localhost:8080
```

## Testing

End-to-end tests run with [Playwright](https://playwright.dev) against `public/`:

```bash
npm test           # headless, chromium + firefox
npm run test:headed
```

> **First time, or after bumping `@playwright/test`?** Run `npx playwright install` first. If you skip it you'll see `Error: browserType.launch: Executable doesn't exist at .../ms-playwright/...` — that just means the browser binaries for the currently-pinned version haven't been downloaded on this machine yet. On Linux, if the launch error mentions missing shared libraries instead, use `npx playwright install --with-deps`.

## CI/CD

On every push/PR to `main`, GitHub Actions (`.github/workflows/deploy.yml`):

1. **Validates** the HTML5/CSS and checks that all `target="_blank"` links carry `rel="noopener"`
2. **Runs** the Playwright E2E suite in a containerized browser environment
3. **Deploys** `public/` to GitHub Pages (on `main` pushes only)

Pre-commit hooks (`.pre-commit-config.yaml`) additionally guard against trailing whitespace, missing EOF newlines, merge conflict markers, leaked secrets ([detect-secrets](https://github.com/Yelp/detect-secrets)), and `target="_blank"` without `noopener`.

### Enabling pre-commit locally

[pre-commit](https://pre-commit.com) runs these checks automatically before each commit. To set it up:

```bash
# 1. Install pre-commit (requires Python)
pip install pre-commit
# or: pipx install pre-commit
# or on macOS: brew install pre-commit

# 2. From the repo root, install the git hook
pre-commit install

# 3. (first time only) generate a secrets baseline so detect-secrets
#    has something to diff against
detect-secrets scan > .secrets.baseline
```

From then on, `git commit` automatically runs all configured hooks against staged files. To run them manually against the whole repo (e.g. before opening a PR):

```bash
pre-commit run --all-files
```

To update hook versions to their latest releases:

```bash
pre-commit autoupdate
```

### Keeping Playwright in sync

The E2E job runs inside the `mcr.microsoft.com/playwright:vX.Y.Z-noble` container, which only ships browser binaries matching that exact Playwright version. `@playwright/test` in `package.json` is pinned to an **exact** version (not `^`) for this reason — if it drifts ahead of the image tag in `.github/workflows/deploy.yml`, tests fail with `Executable doesn't exist at /ms-playwright/...`.

When bumping Playwright:

```bash
npm install @playwright/test@latest --save-exact
```

Then update the image tag in `deploy.yml` to match the new version, e.g.:

```yaml
image: mcr.microsoft.com/playwright:v1.61.0-noble
```

## License

[MIT](LICENSE) © Falltrades
