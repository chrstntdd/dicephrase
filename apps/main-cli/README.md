## Compiling to binary executable

```shell
$ deno --unstable compile --allow-env=NODE_ENV -o dist/dicephrase src/main.ts
```

## Installation

1. [Download the artifact from the GitHub actions artifacts section of the latest build](https://github.com/chrstntdd/dicephrase-final/actions/workflows/cli-bin.yml)
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
