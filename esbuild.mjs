import * as esbuild from "esbuild";

const args = process.argv.filter((val, index, array) => val.includes("--"));

if (args.find((v) => v === "--watch")) {
  const ctx = await esbuild.context({
    entryPoints: ["src/index.ts"],
    outdir: "dist",
    bundle: true,
    minify: false,
    platform: "node",
    logLevel: "info",
    legalComments: "none",
    treeShaking: false,
    sourcemap: "linked",
    // external: ["p5"],
  });
  await ctx.watch();
} else {
  await esbuild.build({
    entryPoints: ["src/index.ts"],
    outdir: "dist",
    bundle: true,
    minify: true,
    platform: "node",
    logLevel: "info",
    legalComments: "none",
    treeShaking: false,
    sourcemap: "linked",
    external: ["p5"],
  });
}
