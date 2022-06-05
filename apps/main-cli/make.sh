#!/bin/bash

if [ ! -f ./src/deps/gen-utils.js ]
then
    deno run --no-check --allow-all build-deps.ts
    echo "Compiled ReScript utils to JavaScript"
fi

if [[ "$1" == "run" ]]
then
    # passing along the rest of the args  --------------------------vvvv
    deno run --no-check --allow-net=deno.land,unpkg.com src/main.ts "$@"
else
    echo "Compiling to binary"
    deno --unstable compile --allow-net=deno.land,unpkg.com -o dist/dicephrase src/main.ts
fi
