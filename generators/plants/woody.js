// Plant generation functions (woody and herbal)

import { Layer, Filter, noiseInstance } from "../../src/index.js";
import { mapval, normRand, grot } from "../../utils/index.js";
import { branch, leaf, stem, genParams } from "../index.js";
import { CTX, CANVAS_DIMENSIONS } from "../../constants.js";

const { PI, sin } = Math;

// Generate a woody plant
export const woody = ({
    ctx = CTX,
    xof = 0,
    yof = 0,
    PAR = genParams(),
} = {}) => {
    const cwid = CANVAS_DIMENSIONS.DEFAULT_WIDTH;
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
                            mapval(noiseInstance.noise(x * 1, i), 0, 1, -1, 1) *
                                5,
                            0,
                            mapval(
                                noiseInstance.noise(x * 1, i + PI),
                                0,
                                1,
                                -1,
                                1
                            ) * 5,
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
