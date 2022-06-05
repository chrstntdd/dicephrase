let [firstArg, ...restArgs] = Deno.args

let sharedOpts = [
  "--allow-net=deno.land,unpkg.com",
  "--import-map=./import-map.json"
]

if (firstArg == "run") {
  await Deno.run({
    cmd: [
      "deno",
      "run",
      "--no-check",
      ...sharedOpts,
      ...restArgs,
      "src/main.ts"
    ]
  }).status()
} else {
  await Deno.run({
    cmd: [
      "deno",
      "run",
      "--no-check",
      "--allow-all",
      ...sharedOpts,
      "./build-deps.ts"
    ]
  }).status()

  console.info("⚙️ Compiled ReScript dependencies")

  await Deno.run({
    cmd: [
      "deno",
      "--unstable",
      "compile",
      ...sharedOpts,
      "-o",
      "dist/dicephrase",
      "src/main.ts"
    ]
  }).status()

  console.info("🦕 Compiled to binary")
}
