// Nonflowers
// Procedurally generated paintings of nonexistent flowers.
import { prng } from "./src/prng.js";
import { noise } from "./src/noise.js";
import { v3 } from "./src/vector3.js";
import Layer from "./src/layer.js";
import { Filter } from "./src/filter.js";

// index arrays with .x, .y, .z and negative indices
// Polyfill Array indices .x, .y, .z and negative indices
["x", "y", "z"].forEach((prop, idx) => {
    Object.defineProperty(Array.prototype, prop, {
        get() {
            return this[idx];
        },
        set(val) {
            this[idx] = val;
        },
    });
});
[1, 2, 3].forEach((i) => {
    Object.defineProperty(Array.prototype, `-${i}`, {
        get() {
            return this[this.length - i];
        },
        set(val) {
            this[this.length - i] = val;
        },
    });
});


// math constants
const { PI, sin, cos, abs, pow, floor, random: _rand } = Math;
const deg2rad = PI / 180;
const rad2deg = 180 / PI;
export const rad = (x) => x * deg2rad;
const deg = (x) => x * rad2deg;

// Override Math.random with seedable PRNG
Math.oldRandom = _rand;
Math.random = () => prng.next();
Math.seed = (x) => prng.seed(x);

// parse url arguments
// URL args parser
const parseArgs = (key2f) => {
    let par = window.location.href.split("?")[1];
    if (par == undefined) {
        return;
    }
    par = par.split("&");
    for (let i = 0; i < par.length; i++) {
        const e = par[i].split("=");
        try {
            key2f[e[0]](e[1]);
        } catch (e) {
            console.log(e);
        }
    }
};
let SEED = `${Date.now()}`;
parseArgs({ seed: (x) => (SEED = x == "" ? SEED : x) });
Math.seed(SEED);
console.log(SEED);

// distance between 2 coordinates in 2D
const distance = ([x0, y0], [x1, y1]) => Math.hypot(x1 - x0, y1 - y0);

// map float from one range to another
export const mapval = (value, istart, istop, ostart, ostop) => {
    return (
        ostart +
        (ostop - ostart) * (((value - istart) * 1.0) / (istop - istart))
    );
};

// random element from array
const randChoice = (arr) => arr[floor(arr.length * Math.random())];

// normalized random number
const normRand = (m, M) => mapval(Math.random(), 0, 1, m, M);

// weighted randomness
const wtrand = (func) => {
    const x = Math.random(),
        y = Math.random();
    return y < func(x) ? x : wtrand(func);
};
// gaussian randomness
const randGaussian = () =>
    wtrand((x) => pow(Math.E, -24 * pow(x - 0.5, 2))) * 2 - 1;

// sigmoid curve
const sigmoid = (x, k = 10) => 1 / (1 + Math.exp(-k * (x - 0.5)));

// pseudo bean curve
const bean = (x) =>
    pow(0.25 - pow(x - 0.5, 2), 0.5) * (2.6 + 2.4 * pow(x, 1.5)) * 0.54;

// interpolate between square and circle
const squircle = (r, a) => (th) => {
    let t = th;
    while (t > PI / 2) t -= PI / 2;
    while (t < 0) t += PI / 2;
    return r * pow(1 / (pow(cos(t), a) + pow(sin(t), a)), 1 / a);
};
// mid-point of an array of points
const midPt = (...pts) => {
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
// rational bezier curve
const bezmh = (P, w = 1) => {
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
// rgba to css color string
const rgba = (r = 255, g = r, b = g, a = 1) =>
    `rgba(${floor(r)},${floor(g)},${floor(b)},${a.toFixed(3)})`;

// hsv to css color string
const hsv = (h, s, v, a) => {
    const c = v * s,
        x = c * (1 - abs(((h / 60) % 2) - 1)),
        m = v - c;
    debugger;
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
// polygon for HTML canvas
const polygon = ({
    ctx = CTX,
    xof = 0,
    yof = 0,
    pts = [],
    col = "black",
    fil = true,
    str = !fil,
} = {}) => {
    ctx.beginPath();
    if (pts.length) ctx.moveTo(pts[0][0] + xof, pts[0][1] + yof);
    pts.slice(1).forEach(([x, y]) => ctx.lineTo(x + xof, y + yof));
    if (fil) {
        ctx.fillStyle = col;
        ctx.fill();
    }
    if (str) {
        ctx.strokeStyle = col;
        ctx.stroke();
    }
};
// lerp hue wrapping around 360 degs
const lerpHue = (h0, h1, p) => {
    const methods = [
        [abs(h1 - h0), mapval(p, 0, 1, h0, h1)],
        [abs(h1 + 360 - h0), mapval(p, 0, 1, h0, h1 + 360)],
        [abs(h1 - 360 - h0), mapval(p, 0, 1, h0, h1 - 360)],
    ];
    methods.sort((x, y) => x[0] - y[0]);
    return (methods[0][1] + 720) % 360;
};
// get rotation at given index of a poly-line
const grot = (P, ind) => {
    const d = v3.subtract(P[ind + 1], P[ind]);
    return v3.toeuler(d);
};

// generate 2d tube shape from list of points
const tubify = ({ pts = [], wid = (x) => 10 } = {}) => {
    const vtxlist0 = [],
        vtxlist1 = [];
    pts.slice(1, -1).forEach((p, i) => {
        const w = wid((i + 1) / pts.length);

        const a1 = Math.atan2(p[1] - pts[i][1], p[0] - pts[i][0]);
        const a2 = Math.atan2(p[1] - pts[i + 2][1], p[0] - pts[i + 2][0]);
        let a = (a1 + a2) / 2;
        if (a < a2) a += PI;
        vtxlist0.push([p[0] + w * cos(a), p[1] + w * sin(a)]);
        vtxlist1.push([p[0] - w * cos(a), p[1] - w * sin(a)]);
    });
    const l = pts.length - 1;
    const a0 =
        Math.atan2(pts[1][1] - pts[0][1], pts[1][0] - pts[0][0]) - PI / 2;
    const a1 =
        Math.atan2(pts[l][1] - pts[l - 1][1], pts[l][0] - pts[l - 1][0]) -
        PI / 2;
    const w0 = wid(0),
        w1 = wid(1);
    vtxlist0.unshift([pts[0][0] + w0 * cos(a0), pts[0][1] + w0 * sin(a0)]);
    vtxlist1.unshift([pts[0][0] - w0 * cos(a0), pts[0][1] - w0 * sin(a0)]);
    vtxlist0.push([pts[l][0] + w1 * cos(a1), pts[l][1] + w1 * sin(a1)]);
    vtxlist1.push([pts[l][0] - w1 * cos(a1), pts[l][1] - w1 * sin(a1)]);
    return [vtxlist0, vtxlist1];
};
// line work with weight function
const stroke = ({
    ctx = CTX,
    xof = 0,
    yof = 0,
    pts = [],
    col = "black",
    wid,
} = {}) => {
    wid ??= (x) => sin(x * PI) * mapval(noise.noise(x * 10), 0, 1, 0.5, 1);
    const [vtxlist0, vtxlist1] = tubify({ pts, wid });
    polygon({ ctx, pts: [...vtxlist0, ...vtxlist1.reverse()], col, xof, yof });
    return [vtxlist0, vtxlist1];
};
// generate paper texture
const paper = ({ col = PAPER_COL1, tex = 20, spr = 1 } = {}) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const reso = 512;
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
// generate leaf-like structure
const leaf = ({
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
    let disp = v3.zero;
    let crot = v3.zero;
    const P = [disp],
        ROT = [crot],
        L = [disp],
        R = [disp];

    const orient = (v) => v3.roteuler(v, rot);

    for (let i = 0; i < seg; i++) {
        const p = i / (seg - 1);
        crot = v3.add(crot, v3.scale(ben(p), 1 / seg));
        disp = v3.add(disp, orient(v3.roteuler([0, 0, len / seg], crot)));
        const w = wid(p);
        const l = v3.add(disp, orient(v3.roteuler([-w, 0, 0], crot)));
        const r = v3.add(disp, orient(v3.roteuler([w, 0, 0], crot)));

        if (i > 0) {
            const v0 = v3.subtract(disp, L[-1]);
            const v1 = v3.subtract(l, disp);
            const v2 = v3.cross(v0, v1);
            let lt = !flo
                ? mapval(abs(v3.ang(v2, [0, -1, 0])), 0, PI, 1, 0)
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

                const p0 = v3.lerp(L[i - 1], P[i - 1], p);
                const p1 = v3.lerp(L[i], P[i], p);

                const q0 = v3.lerp(R[i - 1], P[i - 1], p);
                const q1 = v3.lerp(R[i], P[i], p);
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

// generate stem-like structure
const stem = ({
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

// generate fractal-like branches
const branch = ({
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
                  (2 + 7 * (1 - x) * mapval(noise.noise(x * 10), 0, 1, 0.5, 1));
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

// vizualize parameters into HTML table & canvas
const vizParams = (PAR) => {
    const div = document.createElement("div");
    let viz = ""
    const tabstyle = "style='border:1px solid grey'";

    const fmt = (a) => {
        if (typeof a === "number") {
            return a.toFixed(3);
        } else if (typeof a === "object") {
            const cells = Object.values(a)
                .map((v) => `<td\u0020${tabstyle}>${fmt(v)}</td>`)
                .join("");
            return `<table><tr>${cells}</tr></table>`;
        }
    };
    viz += `<table><tr><td\u0020${tabstyle}>Summary</td></tr><tr><td\u0020${tabstyle}><table><tr>`;
    let cnt = 0;

    for (const k in PAR) {
        if (typeof PAR[k] == "number") {
            cnt += 1;
            viz += `<td><td\u0020${tabstyle}>
                ${k}
                </td><td\u0020${tabstyle}>
                ${fmt(PAR[k])}
                </td></td>`;
            if (cnt % 4 == 0) {
                viz += "</tr><tr>";
            }
        }
    }
    viz += "</tr></table>";
    viz += "<table><tr>";
    cnt = 0;
    for (let k in PAR) {
        if (typeof PAR[k] == "object") {
            viz += `<td\u0020${tabstyle}>
                <table><tr><td\u0020colspan='2'\u0020${tabstyle}> 
                ${k} 
                </td></tr>`;

            for (let i in PAR[k]) {
                viz += `<tr><td\u0020${tabstyle}> 
                    ${i} 
                    </td><td\u0020${tabstyle}> 
                    ${fmt(PAR[k][i])}
                    </td>`;
                if (k.includes("olor")) {
                    viz += `<td\u0020${tabstyle}> 
                        <div\u0020style='background-color: 
                        ${hsv(...PAR[k][i])} '>&nbsp&nbsp&nbsp&nbsp&nbsp</div>
                        </td>`;
                }
                viz += "</tr>";
            }
            viz += "</table><td>";

            if (cnt % 2 == 1) {
                viz += "</tr><tr>";
            }
            cnt += 1;
        }
    }
    viz += "</tr></table>";
    viz += `</td></tr><tr><td\u0020align='left'\u0020${tabstyle}></td></tr></table>`;
    const graphs = document.createElement("div");
    for (let k in PAR) {
        if (typeof PAR[k] == "function") {
            const lay = Layer.empty(100);
            lay.fillStyle = "silver";
            for (let i = 0; i < 100; i++) {
                lay.fillRect(i, 100 - 100 * PAR[k](i / 100, 0.5), 2, 2);
            }
            lay.fillText(k, 2, 10);
            lay.canvas.style = "border: 1px solid grey";
            graphs.appendChild(lay.canvas);
        }
    }
    div.innerHTML = viz;
    div.lastChild.lastChild.lastChild.lastChild.appendChild(graphs);
    document.getElementById("summary").appendChild(div);
};

// generate random parameters
const genParams = () => {
    const randint = (x, y) => floor(normRand(x, y));

    const PAR = {};

    const flowerShapeMask = (x) => pow(sin(PI * x), 0.2);
    const leafShapeMask = (x) => pow(sin(PI * x), 0.5);

    PAR.flowerChance = randChoice([normRand(0, 0.08), normRand(0, 0.03)]);
    PAR.leafChance = randChoice([0, normRand(0, 0.1), normRand(0, 0.1)]);
    PAR.leafType = randChoice([
        [1, randint(2, 5)],
        [2, randint(3, 7), randint(3, 8)],
        [2, randint(3, 7), randint(3, 8)],
    ]);

    const flowerShapeNoiseSeed = Math.random() * PI;
    const flowerJaggedness = normRand(0.5, 8);
    PAR.flowerShape = (x) =>
        noise.noise(x * flowerJaggedness, flowerShapeNoiseSeed) *
        flowerShapeMask(x);

    const leafShapeNoiseSeed = Math.random() * PI;
    const leafJaggedness = normRand(0.1, 40);
    const leafPointyness = normRand(0.5, 1.5);
    PAR.leafShape = randChoice([
        (x) =>
            noise.noise(x * leafJaggedness, leafShapeNoiseSeed) *
            leafShapeMask(x),
        (x) => pow(sin(PI * x), leafPointyness),
    ]);

    const flowerHue0 = (normRand(0, 180) - 130 + 360) % 360;
    const flowerHue1 = floor((flowerHue0 + normRand(-70, 70) + 360) % 360);
    const flowerValue0 = Math.min(1, normRand(0.5, 1.3));
    const flowerValue1 = Math.min(1, normRand(0.5, 1.3));
    const flowerSaturation0 = normRand(0, 1.1 - flowerValue0);
    const flowerSaturation1 = normRand(0, 1.1 - flowerValue1);

    PAR.flowerColor = {
        min: [flowerHue0, flowerSaturation0, flowerValue0, normRand(0.8, 1)],
        max: [flowerHue1, flowerSaturation1, flowerValue1, normRand(0.5, 1)],
    };

    PAR.leafColor = {
        min: [
            normRand(10, 200),
            normRand(0.05, 0.4),
            normRand(0.3, 0.7),
            normRand(0.8, 1),
        ],
        max: [
            normRand(10, 200),
            normRand(0.05, 0.4),
            normRand(0.3, 0.7),
            normRand(0.8, 1),
        ],
    };

    const curveCoeff0 = [normRand(-0.5, 0.5), normRand(5, 10)];
    const curveCoeff1 = [Math.random() * PI, normRand(1, 5)];

    const curveCoeff2 = [Math.random() * PI, normRand(5, 15)];
    const curveCoeff3 = [Math.random() * PI, normRand(1, 5)];
    const curveCoeff4 = [Math.random() * 0.5, normRand(0.8, 1.2)];

    PAR.flowerOpenCurve = randChoice([
        (x, op) =>
            x < 0.1
                ? 2 + op * curveCoeff2[1]
                : noise.noise(x * 10, curveCoeff2[0]),
        (x, op) =>
            x < curveCoeff4[0]
                ? 0
                : 10 - x * mapval(op, 0, 1, 16, 20) * curveCoeff4[1],
    ]);

    PAR.flowerColorCurve = randChoice([
        (x) => sigmoid(x + curveCoeff0[0], curveCoeff0[1]),
        //(x)=>(noise.noise(x*curveCoeff1[1],curveCoeff1[0]))
    ]);

    PAR.leafLength = normRand(30, 100);
    PAR.flowerLength = normRand(5, 55); //* (0.1-PAR.flowerChance)*10
    PAR.pedicelLength = normRand(5, 30);

    PAR.leafWidth = normRand(5, 30);

    PAR.flowerWidth = normRand(5, 30);

    PAR.stemWidth = normRand(2, 11);
    PAR.stemBend = normRand(2, 16);
    PAR.stemLength = normRand(300, 400);
    PAR.stemCount = randChoice([2, 3, 4, 5]);

    PAR.sheathLength = randChoice([0, normRand(50, 100)]);
    PAR.sheathWidth = normRand(5, 15);
    PAR.shootCount = normRand(1, 7);
    PAR.shootLength = normRand(50, 180);
    PAR.leafPosition = randChoice([1, 2]);

    PAR.flowerPetal = Math.round(mapval(PAR.flowerWidth, 5, 50, 10, 3));

    PAR.innerLength = Math.min(normRand(0, 20), PAR.flowerLength * 0.8);
    PAR.innerWidth = Math.min(
        randChoice([0, normRand(1, 8)]),
        PAR.flowerWidth * 0.8
    );
    PAR.innerShape = (x) => pow(sin(PI * x), 1);
    const innerHue = normRand(0, 60);
    PAR.innerColor = {
        min: [
            innerHue,
            normRand(0.1, 0.7),
            normRand(0.5, 0.9),
            normRand(0.8, 1),
        ],
        max: [
            innerHue,
            normRand(0.1, 0.7),
            normRand(0.5, 0.9),
            normRand(0.5, 1),
        ],
    };

    PAR.branchWidth = normRand(0.4, 1.3);
    PAR.branchTwist = Math.round(normRand(2, 5));
    PAR.branchDepth = randChoice([3, 4]);
    PAR.branchFork = randChoice([4, 5, 6, 7]);

    const branchHue = normRand(30, 60);
    const branchSaturation = normRand(0.05, 0.3);
    const branchValue = normRand(0.7, 0.9);
    PAR.branchColor = {
        min: [branchHue, branchSaturation, branchValue, 1],
        max: [branchHue, branchSaturation, branchValue, 1],
    };

    console.log(PAR);

    vizParams(PAR);
    return PAR;
};

// generate a woody plant
const woody = ({ ctx = CTX, xof = 0, yof = 0, PAR = genParams() } = {}) => {
    const cwid = 1200;
    const lay0 = Layer.empty(cwid);
    const lay1 = Layer.empty(cwid);

    const PL = branch({
        ctx: lay0,
        xof: cwid * 0.5,
        yof: cwid * 0.7,
        wid: PAR.branchWidth,
        twi: PAR.branchTwist,
        dep: PAR.branchDepth,
        col: PAR.branchColor,
        frk: PAR.branchFork,
    });

    for (let i = 0; i < PL.length; i++) {
        if (i / PL.length > 0.1) {
            const pts = PL[i][1];
            for (let j = 0; j < pts.length; j++) {
                if (Math.random() < PAR.leafChance) {
                    leaf({
                        ctx: lay0,
                        xof: pts[j].x,
                        yof: pts[j].y,
                        len: PAR.leafLength * normRand(0.8, 1.2),
                        vei: PAR.leafType,
                        col: PAR.leafColor,
                        rot: [
                            normRand(-1, 1) * PI,
                            normRand(-1, 1) * PI,
                            normRand(-1, 1) * 0,
                        ],
                        wid: (x) => PAR.leafShape(x) * PAR.leafWidth,
                        ben: (x) => [
                            mapval(noise.noise(x * 1, i), 0, 1, -1, 1) * 5,
                            0,
                            mapval(noise.noise(x * 1, i + PI), 0, 1, -1, 1) * 5,
                        ],
                    });
                }

                if (Math.random() < PAR.flowerChance) {
                    const hr = [
                        normRand(-1, 1) * PI,
                        normRand(-1, 1) * PI,
                        normRand(-1, 1) * 0,
                    ];

                    const P_ = stem({
                        ctx: lay0,
                        xof: pts[j].x,
                        yof: pts[j].y,
                        rot: hr,
                        len: PAR.pedicelLength,
                        col: { min: [50, 1, 0.9, 1], max: [50, 1, 0.9, 1] },
                        wid: (x) => sin(x * PI) * x * 2 + 1,
                        ben: () => [0, 0, 0],
                    });

                    const op = Math.random();

                    const r = grot(P_, -1);
                    const hhr = r;
                    for (let k = 0; k < PAR.flowerPetal; k++) {
                        leaf({
                            ctx: lay1,
                            flo: true,
                            xof: pts[j].x + P_[-1].x,
                            yof: pts[j].y + P_[-1].y,
                            rot: [
                                hhr[0],
                                hhr[1],
                                hhr[2] + (k / PAR.flowerPetal) * PI * 2,
                            ],
                            len: PAR.flowerLength * normRand(0.7, 1.3),
                            wid: (x) => PAR.flowerShape(x) * PAR.flowerWidth,
                            vei: [0],
                            col: PAR.flowerColor,
                            cof: PAR.flowerColorCurve,
                            ben: (x) => [PAR.flowerOpenCurve(x, op), 0, 0],
                        });

                        leaf({
                            ctx: lay1,
                            flo: true,
                            xof: pts[j].x + P_[-1].x,
                            yof: pts[j].y + P_[-1].y,
                            rot: [
                                hhr[0],
                                hhr[1],
                                hhr[2] + (k / PAR.flowerPetal) * PI * 2,
                            ],
                            len: PAR.innerLength * normRand(0.8, 1.2),
                            wid: (x) => sin(x * PI) * 4,
                            vei: [0],
                            col: PAR.innerColor,
                            cof: (x) => x,
                            ben: (x) => [PAR.flowerOpenCurve(x, op), 0, 0],
                        });
                    }
                }
            }
        }
    }
    Layer.filter(lay0, Filter.fade);
    Layer.filter(lay0, Filter.wispy);
    Layer.filter(lay1, Filter.wispy);
    const b1 = Layer.bound(lay0);
    const b2 = Layer.bound(lay1);
    const bd = {
        xmin: Math.min(b1.xmin, b2.xmin),
        xmax: Math.max(b1.xmax, b2.xmax),
        ymin: Math.min(b1.ymin, b2.ymin),
        ymax: Math.max(b1.ymax, b2.ymax),
    };
    const xref = xof - (bd.xmin + bd.xmax) / 2;
    const yref = yof - bd.ymax;
    Layer.blit(ctx, lay0, { ble: "multiply", xof: xref, yof: yref });
    Layer.blit(ctx, lay1, { ble: "normal", xof: xref, yof: yref });
};

// generate a herbaceous plant
const herbal = ({ ctx = CTX, xof = 0, yof = 0, PAR = genParams() } = {}) => {
    const cwid = 1200;
    const lay0 = Layer.empty(cwid);
    const lay1 = Layer.empty(cwid);

    const x0 = cwid * 0.5;
    const y0 = cwid * 0.7;

    for (let i = 0; i < PAR.stemCount; i++) {
        const r = [PI / 2, 0, normRand(-1, 1) * PI];
        const P = stem({
            ctx: lay0,
            xof: x0,
            yof: y0,
            len: PAR.stemLength * normRand(0.7, 1.3),
            rot: r,
            wid: (x) =>
                PAR.stemWidth *
                (pow(sin((x * PI) / 2 + PI / 2), 0.5) *
                    noise.noise(x * 10) *
                    0.5 +
                    0.5),
            ben: (x) => [
                mapval(noise.noise(x * 1, i), 0, 1, -1, 1) * x * PAR.stemBend,
                0,
                mapval(noise.noise(x * 1, i + PI), 0, 1, -1, 1) *
                    x *
                    PAR.stemBend,
            ],
        });

        if (PAR.leafPosition === 2) {
            for (let j = 0; j < P.length; j++) {
                if (Math.random() < PAR.leafChance * 2) {
                    leaf({
                        ctx: lay0,
                        xof: x0 + P[j].x,
                        yof: y0 + P[j].y,
                        len: 2 * PAR.leafLength * normRand(0.8, 1.2),
                        vei: PAR.leafType,
                        col: PAR.leafColor,
                        rot: [
                            normRand(-1, 1) * PI,
                            normRand(-1, 1) * PI,
                            normRand(-1, 1) * 0,
                        ],
                        wid: (x) => 2 * PAR.leafShape(x) * PAR.leafWidth,
                        ben: (x) => [
                            mapval(noise.noise(x * 1, i), 0, 1, -1, 1) * 5,
                            0,
                            mapval(noise.noise(x * 1, i + PI), 0, 1, -1, 1) * 5,
                        ],
                    });
                }
            }
        }

        const hr = grot(P, -1);
        if (PAR.sheathLength !== 0) {
            stem({
                ctx: lay0,
                xof: x0 + P[-1].x,
                yof: y0 + P[-1].y,
                rot: hr,
                len: PAR.sheathLength,
                col: { min: [60, 0.3, 0.9, 1], max: [60, 0.3, 0.9, 1] },
                wid: (x) =>
                    PAR.sheathWidth * (pow(sin(x * PI), 2) - x * 0.5 + 0.5),
                ben: () => [0, 0, 0],
            });
        }

        for (
            let j = 0;
            j < Math.max(1, PAR.shootCount * normRand(0.5, 1.5));
            j++
        ) {
            const P_ = stem({
                ctx: lay0,
                xof: x0 + P[-1].x,
                yof: y0 + P[-1].y,
                rot: hr,
                len: PAR.shootLength * normRand(0.5, 1.5),
                col: { min: [70, 0.2, 0.9, 1], max: [70, 0.2, 0.9, 1] },
                wid: () => 2,
                ben: (x) => [
                    mapval(noise.noise(x * 1, j), 0, 1, -1, 1) * x * 10,
                    0,
                    mapval(noise.noise(x * 1, j + PI), 0, 1, -1, 1) * x * 10,
                ],
            });
            const op = Math.random();
            const hhr = [
                normRand(-1, 1) * PI,
                normRand(-1, 1) * PI,
                normRand(-1, 1) * PI,
            ];
            for (let k = 0; k < PAR.flowerPetal; k++) {
                leaf({
                    ctx: lay1,
                    flo: true,
                    xof: x0 + P[-1].x + P_[-1].x,
                    yof: y0 + P[-1].y + P_[-1].y,
                    rot: [
                        hhr[0],
                        hhr[1],
                        hhr[2] + (k / PAR.flowerPetal) * PI * 2,
                    ],
                    len: PAR.flowerLength * normRand(0.7, 1.3) * 1.5,
                    wid: (x) => 1.5 * PAR.flowerShape(x) * PAR.flowerWidth,
                    vei: [0],
                    col: PAR.flowerColor,
                    cof: PAR.flowerColorCurve,
                    ben: (x) => [PAR.flowerOpenCurve(x, op), 0, 0],
                });

                leaf({
                    ctx: lay1,
                    flo: true,
                    xof: x0 + P[-1].x + P_[-1].x,
                    yof: y0 + P[-1].y + P_[-1].y,
                    rot: [
                        hhr[0],
                        hhr[1],
                        hhr[2] + (k / PAR.flowerPetal) * PI * 2,
                    ],
                    len: PAR.innerLength * normRand(0.8, 1.2),
                    wid: (x) => sin(x * PI) * 4,
                    vei: [0],
                    col: PAR.innerColor,
                    cof: (x) => x,
                    ben: (x) => [PAR.flowerOpenCurve(x, op), 0, 0],
                });
            }
        }
    }

    if (PAR.leafPosition === 1) {
        for (let i = 0; i < PAR.leafChance * 100; i++) {
            leaf({
                ctx: lay0,
                xof: x0,
                yof: y0,
                rot: [PI / 3, 0, normRand(-1, 1) * PI],
                len: 4 * PAR.leafLength * normRand(0.8, 1.2),
                wid: (x) => 2 * PAR.leafShape(x) * PAR.leafWidth,
                vei: PAR.leafType,
                ben: (x) => [
                    mapval(noise.noise(x * 1, i), 0, 1, -1, 1) * 10,
                    0,
                    mapval(noise.noise(x * 1, i + PI), 0, 1, -1, 1) * 10,
                ],
            });
        }
    }

    Layer.filter(lay0, Filter.fade);
    Layer.filter(lay0, Filter.wispy);
    Layer.filter(lay1, Filter.wispy);
    const b1 = Layer.bound(lay0);
    const b2 = Layer.bound(lay1);
    const bd = {
        xmin: Math.min(b1.xmin, b2.xmin),
        xmax: Math.max(b1.xmax, b2.xmax),
        ymin: Math.min(b1.ymin, b2.ymin),
        ymax: Math.max(b1.ymax, b2.ymax),
    };
    const xref = xof - (bd.xmin + bd.xmax) / 2;
    const yref = yof - bd.ymax;
    Layer.blit(ctx, lay0, { ble: "multiply", xof: xref, yof: yref });
    Layer.blit(ctx, lay1, { ble: "normal", xof: xref, yof: yref });
};

let CTX = Layer.empty();
let BGCANV;

const PAPER_COL0 = [1, 0.99, 0.9],
    PAPER_COL1 = [0.98, 0.91, 0.74];

// download generated image
const makeDownload = () => {
    const down = document.createElement("a");
    down.textContent = "[Download]";
    down.onclick = () => {
        const ctx = Layer.empty();
        for (let i = 0; i < ctx.canvas.width; i += 512)
            for (let j = 0; j < ctx.canvas.height; j += 512)
                ctx.drawImage(BGCANV, i, j);
        ctx.drawImage(CTX.canvas, 0, 0);
        down.href = ctx.canvas.toDataURL();
        down.download = SEED;
    };
    document.body.appendChild(down);
    down.click();
    document.body.removeChild(down);
};

// toggle visibility of sub menus
const toggle = (x, disp = "block") => {
    const alle = ["summary", "settings", "share"];
    const d = document.getElementById(x).style.display;
    alle.forEach((el) => (document.getElementById(el).style.display = "none"));
    if (d == "none") document.getElementById(x).style.display = disp;
};

// fill HTML background with paper texture
const makeBG = () =>
    setTimeout(() => {
        BGCANV = paper({ col: PAPER_COL0, tex: 10, spr: 0 });
        const img = BGCANV.toDataURL("image/png");
        document.body.style.backgroundImage = "url(" + img + ")";
    }, 10);

// generate new plant
const generate = () => {
    CTX = Layer.empty();
    CTX.fillStyle = "white";
    CTX.fillRect(0, 0, CTX.canvas.width, CTX.canvas.height);
    const ppr = paper({ col: PAPER_COL1 });
    for (let i = 0; i < CTX.canvas.width; i += 512) {
        for (let j = 0; j < CTX.canvas.height; j += 512) {
            CTX.drawImage(ppr, i, j);
        }
    }
    Math.random() <= 0.5
        ? woody({ ctx: CTX, xof: 300, yof: 550 })
        : herbal({ ctx: CTX, xof: 300, yof: 600 });
    Layer.border(CTX, squircle(0.98, 3));
};

// reload page with given seed
const reloadWSeed = (s) => {
    const u = window.location.href.split("?")[0];
    window.location.href = u + "?seed=" + s;
};

// initialize everything
const load = () => {
    makeBG();
    setTimeout(() => {
        generate();
        document.getElementById("canvas-container").appendChild(CTX.canvas);
        document.getElementById("loader").style.display = "none";
        document.getElementById("content").style.display = "block";
        document.getElementById("inp-seed").value = SEED;
        document.getElementById(
            "share-twitter"
        ).href = `https://twitter.com/share?url=${encodeURIComponent(
            window.location.href
        )}&hashtags=nonflowers`;
    }, 100);
};

window.toggle = toggle;

window.addEventListener("DOMContentLoaded", load);
