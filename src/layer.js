export class Layer {
    static empty(w = 600, h = w) {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        return canvas.getContext("2d");
    }

    static blit(ctx0, ctx1, { ble = "normal", xof = 0, yof = 0 } = {}) {
        ctx0.globalCompositeOperation = ble;
        ctx0.drawImage(ctx1.canvas, xof, yof);
    }

    static filter(ctx, fn) {
        const { width: w, height: h } = ctx.canvas;
        const imgd = ctx.getImageData(0, 0, w, h);
        const pix = imgd.data;
        for (let i = 0; i < pix.length; i += 4) {
            const [r, g, b, a] = pix.slice(i, i + 4);
            const x = (i / 4) % w;
            const y = Math.floor(i / 4 / w);
            const [r1, g1, b1, a1] = fn(x, y, r, g, b, a);
            pix.set([r1, g1, b1, a1], i);
        }
        ctx.putImageData(imgd, 0, 0);
    }

    static border(ctx, f) {
        const { width: w, height: h } = ctx.canvas;
        const imgd = ctx.getImageData(0, 0, w, h);
        const pix = imgd.data;
        for (let i = 0; i < pix.length; i += 4) {
            const idx = i / 4;
            const x = idx % w;
            const y = Math.floor(idx / w);
            const nx = (x / w - 0.5) * 2;
            const ny = (y / h - 0.5) * 2;
            const theta = Math.atan2(ny, nx);
            if (Math.hypot(nx, ny) > f(theta)) {
                pix[i] = pix[i + 1] = pix[i + 2] = pix[i + 3] = 0;
            }
        }
        ctx.putImageData(imgd, 0, 0);
    }

    static bound(ctx) {
        const { width: w, height: h } = ctx.canvas;
        let xmin = w,
            xmax = 0,
            ymin = h,
            ymax = 0;
        const imgd = ctx.getImageData(0, 0, w, h);
        const pix = imgd.data;
        for (let i = 0; i < pix.length; i += 4) {
            const [r, g, b, a] = pix.slice(i, i + 4);
            if (a > 0.001) {
                const idx = i / 4;
                const x = idx % w;
                const y = Math.floor(idx / w);
                xmin = Math.min(xmin, x);
                xmax = Math.max(xmax, x);
                ymin = Math.min(ymin, y);
                ymax = Math.max(ymax, y);
            }
        }
        return { xmin, xmax, ymin, ymax };
    }
}
export default Layer;
