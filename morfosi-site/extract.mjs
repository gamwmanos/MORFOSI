import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegStatic);

const input = path.join(__dirname, 'public', 'morfosixynw.mp4');
const outputDir = path.join(__dirname, 'public', 'video-frames');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
} else {
  // Clean up old frames
  fs.readdirSync(outputDir).forEach(f => fs.rmSync(path.join(outputDir, f)));
}

console.log('Extracting frames... This might take a minute.');

ffmpeg(input)
  .outputOptions([
    '-vf fps=24',           // 24 frames per second to save lots of space
    '-qscale:v 3'           // Slightly lower quality (3) to keep file size optimized for web (range 2-31)
  ])
  .on('end', () => console.log('✅ Frames extracted successfully!'))
  .on('error', (err) => console.error('❌ Error during extraction:', err))
  .save(path.join(outputDir, 'frame_%04d.jpg'));
