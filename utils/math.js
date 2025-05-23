// Math utilities and helper functions

import { prng } from "../src/prng.js";
import { MATH_CONSTANTS } from "../constants.js";

const { pow, floor, random: _rand } = Math;

// Override Math.random with seedable PRNG
export const initializePRNG = () => {
    Math.oldRandom = _rand;
    Math.random = () => prng.next();
    Math.seed = (x) => prng.seed(x);
};

// Angle conversions
export const rad = (x) => x * MATH_CONSTANTS.deg2rad;
export const deg = (x) => x * MATH_CONSTANTS.rad2deg;

// Distance between 2 coordinates in 2D
export const distance = ([x0, y0], [x1, y1]) => Math.hypot(x1 - x0, y1 - y0);

// Map float from one range to another
export const mapval = (value, istart, istop, ostart, ostop) => {
    return (
        ostart +
        (ostop - ostart) * (((value - istart) * 1.0) / (istop - istart))
    );
};

// Random element from array
export const randChoice = (arr) => arr[floor(arr.length * Math.random())];

// Normalized random number
export const normRand = (m, M) => mapval(Math.random(), 0, 1, m, M);

// Random integer
export const randint = (x, y) => floor(normRand(x, y));

// Weighted randomness
export const wtrand = (func) => {
    const x = Math.random(),
        y = Math.random();
    return y < func(x) ? x : wtrand(func);
};

// Gaussian randomness
export const randGaussian = () =>
    wtrand((x) => pow(Math.E, -24 * pow(x - 0.5, 2))) * 2 - 1;

// Sigmoid curve
export const sigmoid = (x, k = 10) => 1 / (1 + Math.exp(-k * (x - 0.5)));

// Pseudo bean curve
export const bean = (x) =>
    pow(0.25 - pow(x - 0.5, 2), 0.5) * (2.6 + 2.4 * pow(x, 1.5)) * 0.54;
