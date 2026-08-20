export function extractPalette(src: string, count = 6): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const size = 64;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      let data: Uint8ClampedArray;
      try {
        data = ctx.getImageData(0, 0, size, size).data;
      } catch (err) {
        reject(err);
        return;
      }
      const step = 24;
      const buckets = new Map<
        string,
        { count: number; r: number; g: number; b: number }
      >();
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a < 200) continue;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const key = `${Math.round(r / step)}-${Math.round(g / step)}-${Math.round(b / step)}`;
        const bucket = buckets.get(key);
        if (bucket) {
          bucket.count += 1;
          bucket.r += r;
          bucket.g += g;
          bucket.b += b;
        } else {
          buckets.set(key, { count: 1, r, g, b });
        }
      }
      const sorted = Array.from(buckets.values()).sort(
        (a, b) => b.count - a.count,
      );
      const colors: string[] = [];
      for (const bucket of sorted) {
        const r = Math.round(bucket.r / bucket.count);
        const g = Math.round(bucket.g / bucket.count);
        const b = Math.round(bucket.b / bucket.count);
        const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
        if (!colors.includes(hex)) colors.push(hex);
        if (colors.length >= count) break;
      }
      resolve(colors);
    };
    img.onerror = () => reject(new Error("Failed to load image"));

    if (!src.startsWith("data:")) {
      img.crossOrigin = "anonymous";
    }
    img.src = src;
  });
}
