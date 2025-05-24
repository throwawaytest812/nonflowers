// Color-related utility functions
import { mapval } from "./index.js";
const { floor, abs } = Math;

// RGBA to CSS color string
export const rgba = (r = 255, g = r, b = g, a = 1) =>
    `rgba(${floor(r)},${floor(g)},${floor(b)},${a.toFixed(3)})`;

// HSV to CSS color string
export const hsv = (h, s, v, a) => {
    const c = v * s,
        x = c * (1 - abs(((h / 60) % 2) - 1)),
        m = v - c;

    const [rv, gv, bv] = [
        [c, x, 0],
        [x, c, 0],
        [0, c, x],
        [0, x, c],
        [x, 0, c],
        [c, 0, x],
    ][floor(h / 60)];

    const [r, g, b] = [(rv + m) * 255, (gv + m) * 255, (bv + m) * 255];
    return rgba(r, g, b, a);
};

// Lerp hue wrapping around 360 degrees
export const lerpHue = (h0, h1, p) => {
    const methods = [
        [abs(h1 - h0), mapval(p, 0, 1, h0, h1)],
        [abs(h1 + 360 - h0), mapval(p, 0, 1, h0, h1 + 360)],
        [abs(h1 - 360 - h0), mapval(p, 0, 1, h0, h1 - 360)],
    ];
    methods.sort((x, y) => x[0] - y[0]);
    return (methods[0][1] + 720) % 360;
};
