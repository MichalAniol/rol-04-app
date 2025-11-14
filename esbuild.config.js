const esbuild = require('esbuild');
const { copyFileSync, mkdirSync, existsSync } = require('fs');

// kopiowanie plików, np. service worker
const copyAssets = () => {
    if (!existsSync("dist")) mkdirSync("dist");
    copyFileSync("src/serviceWorker.ts", "dist/serviceWorker.ts");
};

// build jednorazowy
const build = async () => {
    await esbuild.build({
        entryPoints: ["src/_index.ts"],
        outfile: "dist/index.js",
        bundle: true,
        minify: true,
        sourcemap: false,
        target: "es2020",
        platform: "browser",
        format: "iife",
        tsconfig: "tsconfig.json",
    });

    copyAssets();
};

// build + watch
const watch = async () => {
    await esbuild.build({
        entryPoints: ["src/_index.ts"],
        outfile: "dist/index.js",
        bundle: true,
        minify: false,
        sourcemap: true,
        target: "es2020",
        platform: "browser",
        format: "iife",
        tsconfig: "tsconfig.json",
        watch: {
            onRebuild(error) {
                if (error) console.error("❌ Error:", error);
                else {
                    console.log("🔄 Rebuilt");
                    copyAssets();
                }
            }
        }
    });

    copyAssets();
    console.log("👀 Watching…");
};

// uruchamianie
if (process.argv.includes("--watch")) {
    watch();
} else {
    build();
}
