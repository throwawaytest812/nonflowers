// Stem generation functions

import { v3Instance, noiseInstance } from "../src/index.js";
import {
    polygon,
    stroke,
    tubify,
    hsv,
    rgba,
    lerpHue,
    mapval,
    normRand,
} from "../utils/index.js";
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
    let disp = v3Instance.zero,
        crot = v3Instance.zero;
    let P = [disp],
        ROT = [crot];

    const orient = (v) => v3Instance.roteuler(v, rot);

    for (let i = 0; i < seg; i++) {
        const p = i / (seg - 1);
        crot = v3Instance.add(crot, v3Instance.scale(ben(p), 1 / seg));
        disp = v3Instance.add(
            disp,
            orient(v3Instance.roteuler([0, 0, len / seg], crot))
        );
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
            const p0 = v3Instance.lerp(L[i - 1], R[i - 1], m);
            const p1 = v3Instance.lerp(L[i], R[i], m);

            const p2 = v3Instance.lerp(L[i - 1], R[i - 1], n);
            const p3 = v3Instance.lerp(L[i], R[i], n);

            const lt = n / p;
            const h =
                lerpHue(col.min[0], col.max[0], lt) *
                mapval(
                    noiseInstance.noise(p * 10, m * 10, n * 10),
                    0,
                    1,
                    0.5,
                    1
                );
            const s =
                mapval(lt, 0, 1, col.max[1], col.min[1]) *
                mapval(
                    noiseInstance.noise(p * 10, m * 10, n * 10),
                    0,
                    1,
                    0.5,
                    1
                );
            const v =
                mapval(lt, 0, 1, col.min[2], col.max[2]) *
                mapval(
                    noiseInstance.noise(p * 10, m * 10, n * 10),
                    0,
                    1,
                    0.5,
                    1
                );
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
