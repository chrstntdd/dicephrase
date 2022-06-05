# Dicephrase CLI

> [dicephrase](https://dicephrase.xyz/) for the CLI — powered by deno

## Concept

A thin wrapper around the core functionality of the dicephrase PWA. Built with the same utilities.

## Build and run

For development, run the `make.ts` script with "run"

```shell
$ deno run --no-check --allow-all make.ts run
```

To build for production, run the `make.ts` script directly

```shell
$ deno run --no-check --allow-all make.ts
```

## Installation

1. [Download the artifact from the GitHub actions artifacts section of the latest build](https://github.com/chrstntdd/dicephrase/actions/workflows/cli-bin.yml)
2. Allow the executable to run

   - Alternatively, clone the repo and build the executable on your machine using the script in `make.sh`

   ```shell
   $ chmod 700 ./Downloads/dicephrase
   ```

> 🕵🏼 [Allow permissions in macOS](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/mac)

3. Test run

   ```shell
   ./Downloads/dicephrase --count 10 --separator ,
   ```

4. [Add it to your path](https://stackoverflow.com/questions/11530090/adding-a-new-entry-to-the-path-variable-in-zsh)
