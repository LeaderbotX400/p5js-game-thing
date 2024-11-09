import * as esbuild from "esbuild";

const args = process.argv.filter((val, index, array) => val.includes("--"));

const ctx = await esbuild.context({
  entryPoints: ["src/index.ts"],
  outdir: "dist",
  bundle: true,
  platform: "neutral",
  logLevel: "info",
  legalComments: "none",
  treeShaking: false,
  sourcemap: "linked",
  external: ["p5"],
  logLevel: "debug",
});

if (args.find((v) => v === "--watch")) {
  await ctx.watch();
} else {
  await ctx.rebuild();
  await ctx.dispose();
}
