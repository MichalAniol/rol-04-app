import esbuild from 'esbuild'
import fs from 'node:fs'

const mode = process.argv[2] || 'dev'
const isProd = mode === 'prod'

const envFile = isProd ? '.env.prod' : '.env.dev'

console.log(`[build] mode=${mode}`)
console.log(`[build] env=${envFile}`)

const env = Object.fromEntries(
    fs.readFileSync(envFile, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('#'))
        .map(l => {
            const i = l.indexOf('=')
            return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
        })
)

const define = Object.fromEntries(
    Object.entries(env).map(([key, value]) => [
        `process.env.${key}`,
        JSON.stringify(value)
    ])
)
console.log('define:', define)


const ctx = await esbuild.context({
    entryPoints: ['src/app.ts'],
    bundle: true,
    format: 'iife',
    platform: 'browser',
    outfile: 'dist/index.js',
    target: 'es2023',
    sourcemap: !isProd,
    // minify: isProd,
    define
})

// 🔴 KLUCZOWE
await ctx.rebuild()

if (isProd) {
    await ctx.dispose()
    console.log('[build] production build complete')
} else {
    await ctx.watch()
    console.log('[build] watching...')
}