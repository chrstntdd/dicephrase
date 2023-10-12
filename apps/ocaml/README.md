# OCaml/Melange

This is a sort of hybrid app/library. It has a native HTTP web server with piaf and depends on some internal OCaml libraries.

Eventually the JavaScript output via Melange will be a bigger thing and likely replace the ReScript version, but the basics are already setup.

## OCaml gems

- Using the latest multi-core OCaml 5.1.0 with eio
- A ppx to inline a JSON file to the binary instead of reading at runtime
- Using `.mli` files to explicitly set module boundaries — this also affects what JavaScript Melange emits
- Hand-written tail-recursive functions for custom iteration
- Use of Result types to handle parsing environment variables and `URLSearchParams`. A custom infix operator too 🙃
- Using functors to abstract the specific dependencies between the JS and Native platforms
  - This may actually be overkill, but I really like what it enables.

## Initial setup

- Install opam
- Create a local switch to use a version of the ocaml compiler matching the `Dockerfile.ocml`
  ```
  opam switch create . ocaml-variants.5.1.0+options ocaml-option-flambda
  ```
- Install the key dependencies based on the opam lockfiles
  ```
  opam install ./dicephrase.opam.locked ./server.opam.locked ./native.opam.locked --deps-only --locked
  ```
- Setup environment `eval $(opam env)`
- Build everything `dune build`

## Building Native

Run dune to build just the server executable

```shell
dune build ./apps/ocaml/bin/server.exe
```

### Hot reloading for development

```shell
dune exec ./apps/ocaml/bin/server.exe --watch
```

## Building JS

```shell
dune build @melange
```

Then peep the emitted code in `_build/default/app/apps/ocaml/lib/javascript/javascript.mjs`. Note the structure mirrors the overall monorepo structure. The directory `app` is controlled in the root `dune` file:

```
(melange.emit
 (target app)
 (libraries javascript)
 (module_systems
  (es6 mjs)))
```

## Building the HTTP server

All commands must be executed from root of the repo

From scratch, just build with docker with a few flags.

```shell
docker build -t dice-http-server  --file ./apps/ocaml/Dockerfile.ocaml .
```

Run it

```shell
docker run --init --rm -it -p 8080:8080 dice-http-server
```

Use

```shell
xh :8080/gen c==7 s=="🐫" fmt==txt

# Or curl
curl 'http://0.0.0.0:8080/gen?c=7&s=%F0%9F%90%AB&fmt=txt'

# Or in a browser
open 'http://0.0.0.0:8080/gen?c=7&s=%F0%9F%90%AB&fmt=txt'
```

### Docker builds

This project builds a lean production-ready HTTP web server by using a combination of opam's lockfiles for reproducible OCaml environment and multi-stage Docker builds to ensure a final runtime image of _just_ alpine linux and the executable.

At the time of writing, a final build is 28.4 MB. The bare alpine node (18 lts) image is 174.87 MB. A reduction of 83.75% or say ~1/6th the size. Not apples to apples mind you, but shows where the floor is for _any_ node app.
