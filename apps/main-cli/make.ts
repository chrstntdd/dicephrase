let [firstArg, ...restArgs] = Deno.args

if (firstArg == "run") {
  await Deno.run({
    cmd: [
      "deno",
      "run",
      "--no-check",
      "--allow-net=deno.land,unpkg.com",
      "src/main.ts",
      ...restArgs
    ]
  }).status()
} else {
  await Deno.run({
    cmd: ["deno", "run", "--no-check", "--allow-all", "./build-deps.ts"]
  }).status()

  console.info("⚙️ Compiled ReScript dependencies")

  await Deno.run({
    cmd: [
      "deno",
      "--unstable",
      "compile",
      "--allow-net=deno.land,unpkg.com",
      "-o",
      "dist/dicephrase",
      "src/main.ts"
    ]
  }).status()

  console.info("🦕 Compiled to binary")
}
