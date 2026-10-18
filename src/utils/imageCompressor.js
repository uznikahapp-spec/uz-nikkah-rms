/**
 * دستخط یا مہر کی تصویر سے وائٹ پیپر ہٹا کر شفاف (Transparent PNG) بنانا
 * تاکہ جب الفاظ یا پرنٹ کے اوپر آئے تو الفاظ چھپنے کی بجائے واضح نظر آئیں
 */
export async function compressAndMakeTransparent(file, makeTransparent = true, maxWidth = 1000) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        if (makeTransparent) {
          try {
            const imgData = ctx.getImageData(0, 0, width, height);
            const d = imgData.data;

            // وائٹ پیپر کا پس منظر ہٹا کر شفاف (Transparent) بنانا
            for (let i = 0; i < d.length; i += 4) {
              const r = d[i];
              const g = d[i + 1];
              const b = d[i + 2];
              const brightness = (r + g + b) / 3;

              // اگر پس منظر سفید یا انتہائی ہلکا ہو تو مکمل شفاف کر دیں
              if (r > 195 && g > 195 && b > 195) {
                d[i + 3] = 0; // Transparent
              } else if (brightness > 165) {
                // کناروں کو ہموار کرنے کے لیے گریڈینٹ الفا
                const factor = (195 - brightness) / 30;
                d[i + 3] = Math.round(d[i + 3] * Math.max(0, Math.min(1, factor)));
              } else {
                // سیاہی یا مہر کے رنگ کو نمایاں اور کرسپ رکھیں
                d[i + 3] = 255;
              }
            }
            ctx.putImageData(imgData, 0, 0);
            const pngData = canvas.toDataURL('image/png');
            return resolve(pngData);
          } catch (e) {
            console.warn('Transparency processing fallback:', e);
          }
        }

        // عام دستاویزات کے لیے معیاری کمپریسڈ
        try {
          const webpData = canvas.toDataURL('image/webp', 0.8);
          resolve(webpData);
        } catch {
          const jpegData = canvas.toDataURL('image/jpeg', 0.8);
          resolve(jpegData);
        }
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}

export const compressImage = (file, maxWidth = 1200) => compressAndMakeTransparent(file, false, maxWidth);

/**
 * بائٹس کو انسانی پڑھنے کے قابل سائز میں تبدیل کریں
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
