// Geometry and shape utility functions

import { v3 } from "../src/vector3.js";

const { PI, sin, cos, pow, atan2 } = Math;

// Interpolate between square and circle
export const squircle = (r, a) => (th) => {
    let t = th;
    while (t > PI / 2) t -= PI / 2;
    while (t < 0) t += PI / 2;
    return r * pow(1 / (pow(cos(t), a) + pow(sin(t), a)), 1 / a);
};

// Mid-point of an array of points
export const midPt = (...pts) => {
    const plist = pts.length === 1 ? pts[0] : pts;
    return plist.reduce(
        (acc, v) => [
            v[0] / plist.length + acc[0],
            v[1] / plist.length + acc[1],
            v[2] / plist.length + acc[2],
        ],
        [0, 0, 0]
    );
};

// Rational bezier curve
export const bezmh = (P, w = 1) => {
    if (P.length === 2) P = [P[0], midPt(P[0], P[1]), P[1]];
    const plist = [];
    for (let j = 0; j < P.length - 2; j++) {
        const p0 = j == 0 ? P[j] : midPt(P[j], P[j + 1]);
        const p1 = P[j + 1];
        const p2 = j == P.length - 3 ? P[j + 2] : midPt(P[j + 1], P[j + 2]);
        const pl = 20;
        for (let i = 0; i < pl + (j === P.length - 3 ? 1 : 0); i++) {
            const t = i / pl;
            const u = pow(1 - t, 2) + 2 * t * (1 - t) * w + pow(t, 2);
            plist.push([
                (pow(1 - t, 2) * p0[0] +
                    2 * t * (1 - t) * p1[0] * w +
                    t * t * p2[0]) /
                    u,
                (pow(1 - t, 2) * p0[1] +
                    2 * t * (1 - t) * p1[1] * w +
                    t * t * p2[1]) /
                    u,
                (pow(1 - t, 2) * p0[2] +
                    2 * t * (1 - t) * p1[2] * w +
                    t * t * p2[2]) /
                    u,
            ]);
        }
    }
    return plist;
};

// Get rotation at given index of a poly-line
export const grot = (P, ind) => {
    const d = v3.subtract(P[ind + 1], P[ind]);
    return v3.toeuler(d);
};

// Generate 2D tube shape from list of points
export const tubify = ({ pts = [], wid = (x) => 10 } = {}) => {
    const vtxlist0 = [],
        vtxlist1 = [];
    pts.slice(1, -1).forEach((p, i) => {
        const w = wid((i + 1) / pts.length);

        const a1 = atan2(p[1] - pts[i][1], p[0] - pts[i][0]);
        const a2 = atan2(p[1] - pts[i + 2][1], p[0] - pts[i + 2][0]);
        let a = (a1 + a2) / 2;
        if (a < a2) a += PI;
        vtxlist0.push([p[0] + w * cos(a), p[1] + w * sin(a)]);
        vtxlist1.push([p[0] - w * cos(a), p[1] - w * sin(a)]);
    });
    const l = pts.length - 1;
    const a0 = atan2(pts[1][1] - pts[0][1], pts[1][0] - pts[0][0]) - PI / 2;
    const a1 =
        atan2(pts[l][1] - pts[l - 1][1], pts[l][0] - pts[l - 1][0]) - PI / 2;
    const w0 = wid(0),
        w1 = wid(1);
    vtxlist0.unshift([pts[0][0] + w0 * cos(a0), pts[0][1] + w0 * sin(a0)]);
    vtxlist1.unshift([pts[0][0] - w0 * cos(a0), pts[0][1] - w0 * sin(a0)]);
    vtxlist0.push([pts[l][0] + w1 * cos(a1), pts[l][1] + w1 * sin(a1)]);
    vtxlist1.push([pts[l][0] - w1 * cos(a1), pts[l][1] - w1 * sin(a1)]);
    return [vtxlist0, vtxlist1];
};
