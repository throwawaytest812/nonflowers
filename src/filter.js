import { noise } from "./noise.js";
import { mapval } from "../utils/math.js";

export class Filter {
    static wispy(x, y, r, g, b, a) {
        const n = noise.noise(x * 0.2, y * 0.2),
            m = noise.noise(x * 0.5, y * 0.5, 2);
        return [
            r,
            g * mapval(m, 0, 1, 0.95, 1),
            b * mapval(m, 0, 1, 0.9, 1),
            a * mapval(n, 0, 1, 0.5, 1),
        ];
    }

    static fade(x, y, r, g, b, a) {
        const n = noise.noise(x * 0.01, y * 0.01);
        return [r, g, b, a * Math.min(Math.max(mapval(n, 0, 1, 0, 1), 0), 1)];
    }
}
