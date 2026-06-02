[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# =====================
# CONFIG
# =====================
$path = ".\dist"
$outPath = ".\dist\ready"

$version = "1.0.52"
$versionMark = "__VERSION__"

$files = @(
    "manifest.json",
    "sw.js",
    "index.html"
)

$filesSW = @(
    "index.js",
    "style.css"
)

# =====================
# PREPARE OUTPUT DIR
# =====================
if (!(Test-Path $outPath)) {
    New-Item -ItemType Directory -Path $outPath -Force | Out-Null
}
else {

    Get-ChildItem -Path $outPath -Force | ForEach-Object {

        if ($_.PSIsContainer) {

            # NIE usuwaj tych katalogów
            if ($_.Name -in @("fonts", "icon")) {
                return
            }

            Remove-Item $_.FullName -Recurse -Force
        }
        else {
            Remove-Item $_.FullName -Force
        }
    }
}

# =====================
# VERSION CONVERTER
# =====================
function Convert-VersionToNumber([string]$version) {
    $parts = $version.Split(".")

    return (
        ([int]$parts[0] * 1000000) +
        ([int]$parts[1] * 1000) +
        [int]$parts[2]
    )
}

# =====================
# BUILD RENAME MAP
# =====================
$versionNumber = Convert-VersionToNumber $version

$renameMap = @{}

foreach ($file in $filesSW) {

    $ext = [System.IO.Path]::GetExtension($file)
    $base = [System.IO.Path]::GetFileNameWithoutExtension($file)

    $renameMap[$file] = "$base-$versionNumber$ext"
}

# =====================
# COPY + RENAME JS/CSS FILES
# =====================
foreach ($file in $filesSW) {

    $src = Join-Path $path $file
    $dst = Join-Path $outPath $renameMap[$file]

    if (Test-Path $src) {
        Copy-Item $src $dst -Force
    }
}

# =====================
# UTF-8 SAFE READ (FIX POLISH CHARACTERS)
# =====================
function Read-Utf8($path) {
    return [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
}

# =====================
# UTF-8 SAFE WRITE (NO BOM)
# =====================
function Write-Utf8NoBom($path, $content) {
    [System.IO.File]::WriteAllText(
        $path,
        $content,
        (New-Object System.Text.UTF8Encoding $false)
    )
}

# =====================
# PROCESS manifest.json, sw.js, index.html
# =====================
foreach ($file in $files) {

    $src = Join-Path $path $file
    $dst = Join-Path $outPath $file

    if (!(Test-Path $src)) {
        continue
    }

    # FIX: proper UTF-8 read
    $content = Read-Utf8 $src

    # podmiana wersji
    $content = $content -replace [regex]::Escape($versionMark), $version

    # podmiana nazw plików
    foreach ($originalFile in $renameMap.Keys) {
        $content = $content -replace `
            [regex]::Escape($originalFile), `
            $renameMap[$originalFile]
    }

    Write-Utf8NoBom $dst $content
}


