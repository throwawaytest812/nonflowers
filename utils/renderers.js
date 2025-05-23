import { noise } from "../src/noise.js";
import { mapval } from "./math.js";
import { CTX } from "../constants.js";
import { tubify } from "./geometry.js";

const { PI, sin } = Math;
// Polygon for HTML canvas
export const polygon = ({
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

// Line work with weight function
export const stroke = ({
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
