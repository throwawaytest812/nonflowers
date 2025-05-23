// Constants and configuration values

export const MATH_CONSTANTS = {
    deg2rad: Math.PI / 180,
    rad2deg: 180 / Math.PI
};

export const PAPER_COLORS = {
    PAPER_COL0: [1, 0.99, 0.9],
    PAPER_COL1: [0.98, 0.91, 0.74]
};

export const CANVAS_DIMENSIONS = {
    DEFAULT_WIDTH: 1200,
    DEFAULT_HEIGHT: 1200,
    PAPER_TEXTURE_SIZE: 512
};

export const UI_DISPLAY_MODES = {
    BLOCK: "block",
    TABLE: "table",
    NONE: "none"
};

export const UI_ELEMENTS = ["summary", "settings", "share"];

export const PLANT_DEFAULTS = {
    STEM_LENGTH: { MIN: 300, MAX: 400 },
    STEM_WIDTH: { MIN: 2, MAX: 11 },
    LEAF_LENGTH: { MIN: 30, MAX: 100 },
    FLOWER_LENGTH: { MIN: 5, MAX: 55 },
    BRANCH_DEPTH: { OPTIONS: [3, 4] },
    BRANCH_FORK: { OPTIONS: [4, 5, 6, 7] }
};

export const TAB_STYLE = "style='border:1px solid grey'";

// Global context reference (will be initialized in main.js)
export let CTX = null;
export let BGCANV = null;
export let SEED = `${Date.now()}`;

// Functions to update global references
export const setGlobalContext = (ctx) => {
    CTX = ctx;
};

export const setBackgroundCanvas = (canvas) => {
    BGCANV = canvas;
};

export const setSeed = (seed) => {
    SEED = seed;
};
