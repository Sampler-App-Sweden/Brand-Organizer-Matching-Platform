#!/bin/bash
# Optimize all images in assets/raw-images to WebP in assets/optimized/images
mkdir -p assets/optimized/images
npx sharp-cli assets/raw-images/* --webp --quality 80 --output assets/optimized/images

# Optimize all videos in assets/raw-videos to MP4 in assets/optimized/videos
mkdir -p assets/optimized/videos
for f in assets/raw-videos/*; do
  name=$(basename "$f")
  npx ffmpeg -i "$f" -vcodec libx264 -crf 28 -preset slow -movflags +faststart "assets/optimized/videos/${name%.*}.mp4"
done
