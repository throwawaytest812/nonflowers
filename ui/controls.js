// UI control functions

import Layer from "../src/layer.js";
import { paper } from "../generators/paper.js";
import {
    BGCANV,
    CTX,
    SEED,
    PAPER_COLORS,
    UI_DISPLAY_MODES,
    UI_ELEMENTS,
    setBackgroundCanvas,
} from "../constants.js";

// Download generated image
export const makeDownload = () => {
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

// Toggle visibility of sub menus
export const toggle = (x, disp = UI_DISPLAY_MODES.BLOCK) => {
    const d = document.getElementById(x).style.display;
    UI_ELEMENTS.forEach(
        (el) =>
            (document.getElementById(el).style.display = UI_DISPLAY_MODES.NONE)
    );
    if (d == UI_DISPLAY_MODES.NONE)
        document.getElementById(x).style.display = disp;
};

// Fill HTML background with paper texture
export const makeBG = () =>
    new Promise((resolve) => {
        setTimeout(() => {
            const bgcanv = paper({
                col: PAPER_COLORS.PAPER_COL0,
                tex: 10,
                spr: 0,
            });
            const img = bgcanv.toDataURL("image/png");
            document.body.style.backgroundImage = "url(" + img + ")";
            setBackgroundCanvas(bgcanv);
            resolve(bgcanv);
        }, 10);
    });

// Reload page with given seed
export const reloadWSeed = (s) => {
    const u = window.location.href.split("?")[0];
    window.location.href = u + "?seed=" + s;
};

// Parse URL arguments
export const parseArgs = (key2f) => {
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
