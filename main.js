// Nonflowers - Main entry point
// Procedurally generated paintings of nonexistent flowers.

// Import statements organized by category

// Core utilities
import {
    initializePolyfills,
    initializePRNG,
    parseArgs,
} from "./utils/index.js";
import { makeDownload, toggle, makeBG, reloadWSeed } from "./ui/index.js";

// Generators
import { generate } from "./generators/index.js";

// Constants and global state management
import { setSeed, UI_DISPLAY_MODES } from "./constants.js";

// Initialize everything
const load = () => {
    // Initialize array polyfills
    initializePolyfills();

    // Initialize PRNG
    initializePRNG();

    // Parse URL arguments for seed
    let seed = `${Date.now()}`;
    parseArgs({ seed: (x) => (seed = x == "" ? seed : x) });
    setSeed(seed);
    Math.seed(seed);
    console.log(seed);

    // Create background texture
    makeBG();
    setTimeout(() => {
        const ctx = generate();
        document.getElementById("canvas-container").appendChild(ctx.canvas);
        document.getElementById("loader").style.display = UI_DISPLAY_MODES.NONE;
        document.getElementById("content").style.display =
            UI_DISPLAY_MODES.BLOCK;
        document.getElementById("inp-seed").value = seed;
        document.getElementById(
            "share-twitter"
        ).href = `https://twitter.com/share?url=${encodeURIComponent(
            window.location.href
        )}&hashtags=nonflowers`;
    }, 100);
};

// Expose functions to window for HTML onclick handlers
window.toggle = toggle;
window.makeDownload = makeDownload;
window.reloadWSeed = reloadWSeed;

// Initialize when DOM is ready
window.addEventListener("DOMContentLoaded", load);
