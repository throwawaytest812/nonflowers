// Stem generation functions

import { v3 } from "../src/vector3.js";
import { noise } from "../src/noise.js";
import { polygon, stroke } from "../utils/renderers.js";
import { tubify } from "../utils/geometry.js";
import { hsv, rgba, lerpHue } from "../utils/color.js";
import { mapval, normRand } from "../utils/math.js";
import { CTX } from "../constants.js";

const { PI } = Math;

// Generate stem-like structure
export const stem = ({
    ctx = CTX,
    xof = 0,
    yof = 0,
    rot = [PI / 2, 0, 0],
    len = 400,
    seg = 40,
    wid = (x) => 6,
    col = { min: [250, 0.2, 0.4, 1], max: [250, 0.3, 0.6, 1] },
    ben = (x) => [normRand(-10, 10), 0, normRand(-5, 5)],
} = {}) => {
    let disp = v3.zero,
        crot = v3.zero;
    let P = [disp],
        ROT = [crot];

    const orient = (v) => v3.roteuler(v, rot);

    for (let i = 0; i < seg; i++) {
        const p = i / (seg - 1);
        crot = v3.add(crot, v3.scale(ben(p), 1 / seg));
        disp = v3.add(disp, orient(v3.roteuler([0, 0, len / seg], crot)));
        ROT.push(crot);

        P.push(disp);
    }
    const [L, R] = tubify({ pts: P, wid });

    const wseg = 4;
    for (let i = 1; i < P.length; i++) {
        for (let j = 1; j < wseg; j++) {
            const m = (j - 1) / (wseg - 1),
                n = j / (wseg - 1),
                p = i / (P.length - 1);
            const p0 = v3.lerp(L[i - 1], R[i - 1], m);
            const p1 = v3.lerp(L[i], R[i], m);

            const p2 = v3.lerp(L[i - 1], R[i - 1], n);
            const p3 = v3.lerp(L[i], R[i], n);

            const lt = n / p;
            const h =
                lerpHue(col.min[0], col.max[0], lt) *
                mapval(noise.noise(p * 10, m * 10, n * 10), 0, 1, 0.5, 1);
            const s =
                mapval(lt, 0, 1, col.max[1], col.min[1]) *
                mapval(noise.noise(p * 10, m * 10, n * 10), 0, 1, 0.5, 1);
            const v =
                mapval(lt, 0, 1, col.min[2], col.max[2]) *
                mapval(noise.noise(p * 10, m * 10, n * 10), 0, 1, 0.5, 1);
            const a = mapval(lt, 0, 1, col.min[3], col.max[3]);

            polygon({
                ctx,
                pts: [p0, p1, p3, p2],
                xof,
                yof,
                fil: true,
                str: true,
                col: hsv(h, s, v, a),
            });
        }
    }
    stroke({ ctx, pts: L, xof, yof, col: rgba(0, 0, 0, 0.5) });
    stroke({ ctx, pts: R, xof, yof, col: rgba(0, 0, 0, 0.5) });
    return P;
};
