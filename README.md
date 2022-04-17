# Dicephrase

## About

Instead of repeating myself — [read about the project here](https://dicephrase.xyz/about).

## Prerequisites

- [`pnpm v6`](https://pnpm.io/6.x/installation)
  - Manages dependencies. The project is split into [workspaces](https://pnpm.io/6.x/workspaces)
- `node`
  - Manage your node installation with [fnm](https://github.com/Schniz/fnm), or [`pnpm env`](https://pnpm.io/6.x/cli/env)
- [Local self signed HTTPS certs](https://web.dev/how-to-use-local-https/#setup)
  - ```shell
    $ cd apps/main && mkcert localhost
    ```

## First steps

1. Install all dependencies

```shell
$ pnpm i
```

## Development

### Main web app

From the root of the repo, you can run the dev script by filtering to start the vite dev server.

```shell
$ pnpm -F ./apps/main dev
```

## Building

Build the main web app

```shell
$ pnpm -F ./apps/main build
```

This script performs a few key steps:

1. Builds the app in [vite's ssg mode](https://vitejs.dev/guide/ssr.html#pre-rendering-ssg) to a single plain JS file
2. Builds the app using vite for browser based environments
3. Builds a ServiceWorker using esbuild
4. Pre-renders the app to plain HTML using the ssg assets
5. Copies the `_headers` file to `dist`
6. Optimizes the HTML using [critical](https://github.com/addyosmani/critical) to inline styles into the document head (to prevent FOUC) and finally minifies the whole file

## Running Tests

### E2E

1. Build the main web app

```shell
$ pnpm -F ./apps/main build
```

2. Run a local web server to serve the static content

```shell
$ pnpm -F ./apps/main preview-t
```

3. Run Playwright

```shell
$ pnpm -F ./apps/main-e2e test
```

### Unit

We only have unit tests for the pure functions in the gen-utils pkg. The UI is tested mainly by the E2E test for robustness, but also I couldn't get solid-testing-library to work 😕

1. Run the tests!

```shell
$ pnpm -F ./pkgs/gen-utils test
```
