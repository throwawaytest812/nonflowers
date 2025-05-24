import { rad } from "../utils/index.js";

export class V3 {
    constructor() {
        this.forward = [0, 0, 1];
        this.up = [0, 1, 0];
        this.right = [1, 0, 0];
        this.zero = [0, 0, 0];
    }

    rotvec([x, y, z], [l, m, n], th) {
        const costh = Math.cos(th),
            sinth = Math.sin(th);
        const mat = {
            11: l * l * (1 - costh) + costh,
            12: m * l * (1 - costh) - n * sinth,
            13: n * l * (1 - costh) + m * sinth,
            21: l * m * (1 - costh) + n * sinth,
            22: m * m * (1 - costh) + costh,
            23: n * m * (1 - costh) - l * sinth,
            31: l * n * (1 - costh) - m * sinth,
            32: m * n * (1 - costh) + l * sinth,
            33: n * n * (1 - costh) + costh,
        };
        return [
            x * mat[11] + y * mat[12] + z * mat[13],
            x * mat[21] + y * mat[22] + z * mat[23],
            x * mat[31] + y * mat[32] + z * mat[33],
        ];
    }

    roteuler(vec, { x = 0, y = 0, z = 0 }) {
        let v = vec;
        if (z !== 0) v = this.rotvec(v, this.forward, z);
        if (x !== 0) v = this.rotvec(v, this.right, x);
        if (y !== 0) v = this.rotvec(v, this.up, y);
        return v;
    }

    scale([x, y, z], p) {
        return [x * p, y * p, z * p];
    }

    copy([x, y, z]) {
        return [x, y, z];
    }

    add([x1, y1, z1], [x2, y2, z2]) {
        return [x1 + x2, y1 + y2, z1 + z2];
    }

    subtract([x1, y1, z1], [x2, y2, z2]) {
        return [x1 - x2, y1 - y2, z1 - z2];
    }

    mag([x, y, z]) {
        return Math.hypot(x, y, z);
    }

    normalize(v) {
        const p = 1 / this.mag(v);
        return this.scale(v, p);
    }

    dot([x1, y1, z1], [x2, y2, z2]) {
        return x1 * x2 + y1 * y2 + z1 * z2;
    }

    cross([x1, y1, z1], [x2, y2, z2]) {
        return [y1 * z2 - z1 * y2, z1 * x2 - x1 * z2, x1 * y2 - y1 * x2];
    }

    angcos(u, v) {
        return this.dot(u, v) / (this.mag(u) * this.mag(v));
    }

    ang(u, v) {
        return Math.acos(this.angcos(u, v));
    }

    toeuler(v0) {
        const ep = 5;
        let ma = 2 * Math.PI;
        let mr = [0, 0, 0];
        let cnt = 0;
        for (let x = -180; x < 180; x += ep) {
            for (let y = -90; y < 90; y += ep) {
                cnt++;
                const r = [rad(x), rad(y), 0];
                const v = this.roteuler([0, 0, 1], r);
                const a = this.ang(v0, v);
                if (a < rad(ep)) {
                    return r;
                }
                if (a < ma) {
                    ma = a;
                    mr = r;
                }
            }
        }
        return mr;
    }

    lerp([x1, y1, z1], [x2, y2, z2], p) {
        return [
            x1 * (1 - p) + x2 * p,
            y1 * (1 - p) + y2 * p,
            z1 * (1 - p) + z2 * p,
        ];
    }
}

export const v3 = new V3();
