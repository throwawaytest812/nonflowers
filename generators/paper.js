// Paper texture generation

import { noise } from "../src/noise.js";
import { rgba } from "../utils/color.js";
import { PAPER_COLORS, CANVAS_DIMENSIONS } from "../constants.js";

// Generate paper texture
export const paper = ({
    col = PAPER_COLORS.PAPER_COL1,
    tex = 20,
    spr = 1,
} = {}) => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_DIMENSIONS.PAPER_TEXTURE_SIZE;
    canvas.height = CANVAS_DIMENSIONS.PAPER_TEXTURE_SIZE;
    const ctx = canvas.getContext("2d");
    const reso = CANVAS_DIMENSIONS.PAPER_TEXTURE_SIZE;

    for (let i = 0; i < reso / 2 + 1; i++) {
        for (let j = 0; j < reso / 2 + 1; j++) {
            let c = 255 - noise.noise(i * 0.1, j * 0.1) * tex * 0.5;
            c -= Math.random() * tex;
            let r = c * col[0],
                g = c * col[1],
                b = c * col[2];
            if (
                noise.noise(i * 0.04, j * 0.04, 2) * Math.random() * spr >
                    0.7 ||
                Math.random() < 0.005 * spr
            ) {
                r = c * 0.7;
                g = c * 0.5;
                b = c * 0.2;
            }
            ctx.fillStyle = rgba(r, g, b);
            ctx.fillRect(i, j, 1, 1);
            ctx.fillRect(reso - i, j, 1, 1);
            ctx.fillRect(i, reso - j, 1, 1);
            ctx.fillRect(reso - i, reso - j, 1, 1);
        }
    }
    return canvas;
};
