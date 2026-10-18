/**
 * Client-side image compression utility using HTML5 Canvas & ImageBitmap.
 * Resizes large smartphone camera photos (e.g. 12-20 MB, 4000x3000px) down to web-optimized
 * dimensions (default max 1600px) and compresses to JPEG, drastically reducing upload size
 * to ~300KB-600KB while maintaining sharp visual quality and correcting EXIF orientation.
 */

export interface CompressionResult {
  blob: Blob;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
}

/**
 * Format bytes into human-readable string (KB / MB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Compresses an image file in the browser.
 *
 * @param file - Input File from <input type="file">
 * @param maxDimension - Maximum width or height in pixels (default: 1600)
 * @param quality - JPEG compression quality 0.0 to 1.0 (default: 0.82)
 */
export async function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<CompressionResult> {
  const originalSize = file.size;

  // 1. Load image using createImageBitmap with EXIF orientation support if available
  let width: number;
  let height: number;
  let source: CanvasImageSource;

  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: 'from-image',
      });
      width = bitmap.width;
      height = bitmap.height;
      source = bitmap;
    } catch {
      // Fallback if createImageBitmap fails (e.g. older browser or unsupported format)
      const img = await loadImageFallback(file);
      width = img.naturalWidth;
      height = img.naturalHeight;
      source = img;
    }
  } else {
    const img = await loadImageFallback(file);
    width = img.naturalWidth;
    height = img.naturalHeight;
    source = img;
  }

  // 2. Calculate target dimensions maintaining aspect ratio
  let targetWidth = width;
  let targetHeight = height;

  if (width > maxDimension || height > maxDimension) {
    if (width >= height) {
      targetHeight = Math.round((height * maxDimension) / width);
      targetWidth = maxDimension;
    } else {
      targetWidth = Math.round((width * maxDimension) / height);
      targetHeight = maxDimension;
    }
  }

  // 3. Render to offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // High-quality image downscaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, targetWidth, targetHeight);

  // Close ImageBitmap if used to release GPU memory
  if ('close' in source && typeof source.close === 'function') {
    source.close();
  }

  // 4. Export as JPEG Blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) {
          resolve(b);
        } else {
          reject(new Error('Failed to create compressed image blob'));
        }
      },
      'image/jpeg',
      quality
    );
  });

  return {
    blob,
    width: targetWidth,
    height: targetHeight,
    originalSize,
    compressedSize: blob.size,
  };
}

/**
 * Fallback loader using HTMLImageElement and Object URL.
 */
function loadImageFallback(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression'));
    };
    img.src = url;
  });
}
