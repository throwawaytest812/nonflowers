// Branch generation functions

import { noiseInstance } from "../src/index.js";
import { grot, normRand, mapval } from "../utils/index.js";
import { stem } from "./index.js";
import { CTX } from "../constants.js";

const { PI, floor, abs } = Math;

// Generate fractal-like branches
export const branch = ({
    ctx = CTX,
    xof = 0,
    yof = 0,
    rot = [PI / 2, 0, 0],
    len = 400,
    seg = 40,
    wid = 1,
    twi = 5,
    col = { min: [50, 0.2, 0.8, 1], max: [50, 0.2, 0.8, 1] },
    dep = 3,
    frk = 4,
} = {}) => {
    const jnt = [];
    for (let i = 0; i < twi; i++) {
        jnt.push([floor(Math.random() * seg), normRand(-1, 1)]);
    }

    const jntdist = (x) => {
        let m = seg,
            j = 0;
        for (let i = 0; i < jnt.length; i++) {
            const n = abs(x * seg - jnt[i][0]);
            if (n < m) {
                m = n;
                j = i;
            }
        }
        return [m, jnt[j][1]];
    };

    const wfun = (x) => {
        const [m, j] = jntdist(x);
        return m < 1
            ? wid * (3 + 5 * (1 - x))
            : wid *
                  (2 +
                      7 *
                          (1 - x) *
                          mapval(noiseInstance.noise(x * 10), 0, 1, 0.5, 1));
    };

    const bfun = (x) => {
        const [m, j] = jntdist(x);
        return m < 1 ? [0, j * 20, 0] : [0, normRand(-5, 5), 0];
    };

    const P = stem({ ctx, xof, yof, rot, len, seg, wid: wfun, col, ben: bfun });

    const child = [];
    if (dep > 0 && wid > 0.1) {
        for (let i = 0; i < frk * Math.random(); i++) {
            const ind = floor(normRand(1, P.length));
            const r = grot(P, ind);
            const L = branch({
                ctx,
                xof: xof + P[ind].x,
                yof: yof + P[ind].y,
                rot: [
                    r[0] + (normRand(-1, 1) * PI) / 6,
                    r[1] + (normRand(-1, 1) * PI) / 6,
                    r[2] + (normRand(-1, 1) * PI) / 6,
                ],
                seg,
                len: len * normRand(0.4, 0.6),
                wid: wid * normRand(0.4, 0.7),
                twi: twi * 0.7,
                dep: dep - 1,
            });
            child.push(...L);
        }
    }
    return [[dep, P.map((v) => [v.x + xof, v.y + yof, v.z])], ...child];
};
