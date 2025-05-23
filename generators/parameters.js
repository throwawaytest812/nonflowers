// Parameter generation for plants

import { noise } from "../src/noise.js";
import { randChoice, normRand, randint, mapval } from "../utils/math.js";
import { sigmoid } from "../utils/math.js";

const { PI, sin, pow, floor, min } = Math;

// Generate random parameters
export const genParams = () => {
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
    const flowerValue0 = min(1, normRand(0.5, 1.3));
    const flowerValue1 = min(1, normRand(0.5, 1.3));
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
    PAR.flowerLength = normRand(5, 55);
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

    PAR.innerLength = min(normRand(0, 20), PAR.flowerLength * 0.8);
    PAR.innerWidth = min(
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

    return PAR;
};
