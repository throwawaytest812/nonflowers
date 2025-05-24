// Plant generation functions (woody and herbal)

import { Layer, Filter, noiseInstance } from "../../src/index.js";
import { mapval, normRand, grot } from "../../utils/index.js";
import { leaf, stem, genParams } from "../index.js";
import { CTX, CANVAS_DIMENSIONS } from "../../constants.js";

const { PI, sin, pow, max } = Math;

// Generate a herbaceous plant
export const herbal = ({
    ctx = CTX,
    xof = 0,
    yof = 0,
    PAR = genParams(),
} = {}) => {
    const cwid = CANVAS_DIMENSIONS.DEFAULT_WIDTH;
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
                    noiseInstance.noise(x * 10) *
                    0.5 +
                    0.5),
            ben: (x) => [
                mapval(noiseInstance.noise(x * 1, i), 0, 1, -1, 1) *
                    x *
                    PAR.stemBend,
                0,
                mapval(noiseInstance.noise(x * 1, i + PI), 0, 1, -1, 1) *
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

        for (let j = 0; j < max(1, PAR.shootCount * normRand(0.5, 1.5)); j++) {
            const P_ = stem({
                ctx: lay0,
                xof: x0 + P[-1].x,
                yof: y0 + P[-1].y,
                rot: hr,
                len: PAR.shootLength * normRand(0.5, 1.5),
                col: { min: [70, 0.2, 0.9, 1], max: [70, 0.2, 0.9, 1] },
                wid: () => 2,
                ben: (x) => [
                    mapval(noiseInstance.noise(x * 1, j), 0, 1, -1, 1) * x * 10,
                    0,
                    mapval(noiseInstance.noise(x * 1, j + PI), 0, 1, -1, 1) *
                        x *
                        10,
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
                    mapval(noiseInstance.noise(x * 1, i), 0, 1, -1, 1) * 10,
                    0,
                    mapval(noiseInstance.noise(x * 1, i + PI), 0, 1, -1, 1) *
                        10,
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
