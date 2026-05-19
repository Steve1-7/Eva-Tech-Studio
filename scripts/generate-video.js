const { execSync } = require('child_process')
const path = require('path')

const publicDir = path.join(__dirname, '..', 'public')
const input = path.join(publicDir, 'map.mp4')
const webm = path.join(publicDir, 'map.webm')
const mp4_1500 = path.join(publicDir, 'map-1500.mp4')
const mp4_800 = path.join(publicDir, 'map-800.mp4')

function run(cmd) {
  console.log('Running:', cmd)
  try {
    execSync(cmd, { stdio: 'inherit' })
  } catch (e) {
    console.error('Command failed:', e.message)
    process.exit(1)
  }
}

console.log('This script requires ffmpeg to be installed and available on PATH.')

// WebM (VP9) - good compression
run(`ffmpeg -y -i "${input}" -c:v libvpx-vp9 -b:v 0 -crf 30 -vf "scale=1280:-2" -an "${webm}")`)

// MP4 variants for different bitrates
run(`ffmpeg -y -i "${input}" -c:v libx264 -preset slow -crf 23 -b:v 1500k -vf "scale=1280:-2" -an "${mp4_1500}"`)
run(`ffmpeg -y -i "${input}" -c:v libx264 -preset slow -crf 24 -b:v 800k -vf "scale=800:-2" -an "${mp4_800}"`)

console.log('Video generation complete. Created:', webm, mp4_1500, mp4_800)
