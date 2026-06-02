const fs = require("fs/promises");
const path = require("path");
const chokidar = require("chokidar");

// =====================
// PATHS
// =====================
const srcPath = path.resolve("./dist");
const outPath = path.resolve("./ready");
const versionFilePath = path.resolve("./version.json");

// =====================
// CONFIG (static)
// =====================
const versionMark = "__VERSION__";

const files = ["manifest.json", "sw.js", "index.html"];
const filesSW = ["index.js", "style.css"];

// =====================
// VERSION LOAD
// =====================
async function loadVersion() {
    try {
        const raw = await fs.readFile(versionFilePath, "utf8");
        const json = JSON.parse(raw);

        if (!json.version) {
            throw new Error("Brak pola 'version' w version.json");
        }

        return json.version;
    } catch (err) {
        throw new Error(`Nie można wczytać wersji: ${err.message}`);
    }
}

// =====================
// VERSION CONVERTER
// =====================
function convertVersionToNumber(version) {
    const parts = version.split(".").map(Number);

    return (
        parts[0] * 1_000_000 +
        parts[1] * 1_000 +
        parts[2]
    );
}

// =====================
// IO HELPERS
// =====================
async function readUtf8(filePath) {
    return fs.readFile(filePath, "utf8");
}

async function writeUtf8(filePath, content) {
    return fs.writeFile(filePath, content, "utf8");
}

// =====================
// CLEAN OUTPUT
// =====================
async function prepareOutputDir() {
    await fs.mkdir(outPath, { recursive: true });

    const entries = await fs.readdir(outPath, { withFileTypes: true });

    for (const entry of entries) {
        const full = path.join(outPath, entry.name);

        if (entry.isDirectory()) {
            if (["fonts", "icon"].includes(entry.name)) continue;
            await fs.rm(full, { recursive: true, force: true });
        } else {
            await fs.rm(full, { force: true });
        }
    }
}

// =====================
// RENAME MAP
// =====================
function buildRenameMap(versionNumber) {
    const map = {};

    for (const file of filesSW) {
        const ext = path.extname(file);
        const base = path.basename(file, ext);

        map[file] = `${base}-${versionNumber}${ext}`;
    }

    return map;
}

// =====================
// BUILD
// =====================
async function build() {
    const version = await loadVersion(); // <-- NOWE
    const versionNumber = convertVersionToNumber(version);

    const renameMap = buildRenameMap(versionNumber);

    await prepareOutputDir();

    // SW files copy
    for (const file of filesSW) {
        const src = path.join(srcPath, file);
        const dst = path.join(outPath, renameMap[file]);

        try {
            await fs.copyFile(src, dst);
        } catch { }
    }

    // main files processing
    for (const file of files) {
        const src = path.join(srcPath, file);
        const dst = path.join(outPath, file);

        let content;
        try {
            content = await readUtf8(src);
        } catch {
            continue;
        }

        // version replace
        content = content.replaceAll(versionMark, version);

        // rename SW references
        for (const [original, renamed] of Object.entries(renameMap)) {
            const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            content = content.replaceAll(new RegExp(escaped, "g"), renamed);
        }

        await writeUtf8(dst, content);
    }

    console.log(`[BUILD] done (version: ${version})`);
}

// =====================
// WATCH MODE
// =====================
function startWatch() {
    const watchFiles = [
        ...files,
        ...filesSW,
        path.basename(versionFilePath),
    ].map(f => path.join(srcPath, f)).concat([versionFilePath]);

    const watcher = chokidar.watch(watchFiles, {
        ignoreInitial: true,
        awaitWriteFinish: {
            stabilityThreshold: 200,
            pollInterval: 50,
        },
    });

    let timeout = null;

    const triggerBuild = () => {
        clearTimeout(timeout);

        timeout = setTimeout(async () => {
            try {
                await build();
            } catch (e) {
                console.error("[BUILD ERROR]", e);
            }
        }, 150);
    };

    watcher.on("add", triggerBuild)
        .on("change", triggerBuild)
        .on("unlink", triggerBuild);

    console.log("[WATCH] active...");
}

// =====================
// RUN
// =====================
(async () => {
    await build();
    startWatch();
})();