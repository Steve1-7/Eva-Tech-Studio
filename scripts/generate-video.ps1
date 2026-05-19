# PowerShell helper to generate webm and multi-bitrate mp4 variants from public/map.mp4
# Requires ffmpeg installed and in PATH
$publicDir = Join-Path $PSScriptRoot '..\public'
$input = Join-Path $publicDir 'map.mp4'
$webm = Join-Path $publicDir 'map.webm'
$mp4_1500 = Join-Path $publicDir 'map-1500.mp4'
$mp4_800 = Join-Path $publicDir 'map-800.mp4'

if (!(Test-Path $input)) {
  Write-Error "Input file not found: $input"
  exit 1
}

Write-Host "Generating $webm (vp9)"
ffmpeg -y -i "$input" -c:v libvpx-vp9 -b:v 0 -crf 30 -vf "scale=1280:-2" -an "$webm"

Write-Host "Generating $mp4_1500"
ffmpeg -y -i "$input" -c:v libx264 -preset slow -crf 23 -b:v 1500k -vf "scale=1280:-2" -an "$mp4_1500"

Write-Host "Generating $mp4_800"
ffmpeg -y -i "$input" -c:v libx264 -preset slow -crf 24 -b:v 800k -vf "scale=800:-2" -an "$mp4_800"

Write-Host "Done. Files created in public/"
