// Leaf generation functions

import { v3Instance } from "../src/index.js";
import {
    polygon,
    stroke,
    hsv,
    rgba,
    lerpHue,
    mapval,
    normRand,
} from "../utils/index.js";
import { CTX } from "../constants.js";

const { PI, sin, abs } = Math;

// Generate leaf-like structure
export const leaf = ({
    ctx = CTX,
    xof = 0,
    yof = 0,
    rot = [PI / 2, 0, 0],
    len = 500,
    seg = 40,
    wid = (x) => sin(x * PI) * 20,
    vei = [1, 3],
    flo = false,
    col = { min: [90, 0.2, 0.3, 1], max: [90, 0.1, 0.9, 1] },
    cof = (x) => x,
    ben = (x) => [normRand(-10, 10), 0, normRand(-5, 5)],
} = {}) => {
    let disp = v3Instance.zero;
    let crot = v3Instance.zero;
    const P = [disp],
        ROT = [crot],
        L = [disp],
        R = [disp];

    const orient = (v) => v3Instance.roteuler(v, rot);

    for (let i = 0; i < seg; i++) {
        const p = i / (seg - 1);
        crot = v3Instance.add(crot, v3Instance.scale(ben(p), 1 / seg));
        disp = v3Instance.add(disp, orient(v3Instance.roteuler([0, 0, len / seg], crot)));
        const w = wid(p);
        const l = v3Instance.add(disp, orient(v3Instance.roteuler([-w, 0, 0], crot)));
        const r = v3Instance.add(disp, orient(v3Instance.roteuler([w, 0, 0], crot)));

        if (i > 0) {
            const v0 = v3Instance.subtract(disp, L[-1]);
            const v1 = v3Instance.subtract(l, disp);
            const v2 = v3Instance.cross(v0, v1);
            let lt = !flo
                ? mapval(abs(v3Instance.ang(v2, [0, -1, 0])), 0, PI, 1, 0)
                : p * normRand(0.95, 1);
            lt = cof(lt) || 0;

            const h = lerpHue(col.min[0], col.max[0], lt);
            const s = mapval(lt, 0, 1, col.min[1], col.max[1]);
            const v = mapval(lt, 0, 1, col.min[2], col.max[2]);
            const a = mapval(lt, 0, 1, col.min[3], col.max[3]);

            polygon({
                ctx,
                pts: [l, L[-1], P[-1], disp],
                xof,
                yof,
                fil: true,
                str: true,
                col: hsv(h, s, v, a),
            });
            polygon({
                ctx,
                pts: [r, R[-1], P[-1], disp],
                xof,
                yof,
                fil: true,
                str: true,
                col: hsv(h, s, v, a),
            });
        }
        P.push(disp);
        ROT.push(crot);
        L.push(l);
        R.push(r);
    }

    if (vei[0] === 1) {
        for (let i = 1; i < P.length; i++) {
            for (let j = 0; j < vei[1]; j++) {
                const p = j / vei[1];

                const p0 = v3Instance.lerp(L[i - 1], P[i - 1], p);
                const p1 = v3Instance.lerp(L[i], P[i], p);

                const q0 = v3Instance.lerp(R[i - 1], P[i - 1], p);
                const q1 = v3Instance.lerp(R[i], P[i], p);
                polygon({
                    ctx,
                    pts: [p0, p1],
                    xof,
                    yof,
                    fil: false,
                    col: hsv(0, 0, 0, normRand(0.4, 0.9)),
                });
                polygon({
                    ctx,
                    pts: [q0, q1],
                    xof,
                    yof,
                    fil: false,
                    col: hsv(0, 0, 0, normRand(0.4, 0.9)),
                });
            }
        }
        stroke({ ctx, pts: P, xof, yof, col: rgba(0, 0, 0, 0.3) });
    } else if (vei[0] === 2) {
        for (let i = 1; i < P.length - vei[1]; i += vei[2]) {
            polygon({
                ctx,
                pts: [P[i], L[i + vei[1]]],
                xof,
                yof,
                fil: false,
                col: hsv(0, 0, 0, normRand(0.4, 0.9)),
            });
            polygon({
                ctx,
                pts: [P[i], R[i + vei[1]]],
                xof,
                yof,
                fil: false,
                col: hsv(0, 0, 0, normRand(0.4, 0.9)),
            });
        }
        stroke({ ctx, pts: P, xof, yof, col: rgba(0, 0, 0, 0.3) });
    }
    stroke({ ctx, pts: L, xof, yof, col: rgba(120, 100, 0, 0.3) });
    stroke({ ctx, pts: R, xof, yof, col: rgba(120, 100, 0, 0.3) });
    return P;
};
