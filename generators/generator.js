import { Layer } from "../src/index.js";
import { paper, woody, herbal, genParams } from "../generators/index.js";
import { vizParams } from "../ui/index.js";
import {
    setGlobalContext,
    PAPER_COLORS,
    CANVAS_DIMENSIONS,
} from "../constants.js";
import { squircle } from "../utils/index.js";

// Generate new plant
export const generate = () => {
    const ctx = Layer.empty();
    setGlobalContext(ctx);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const ppr = paper({ col: PAPER_COLORS.PAPER_COL1 });
    for (
        let i = 0;
        i < ctx.canvas.width;
        i += CANVAS_DIMENSIONS.PAPER_TEXTURE_SIZE
    ) {
        for (
            let j = 0;
            j < ctx.canvas.height;
            j += CANVAS_DIMENSIONS.PAPER_TEXTURE_SIZE
        ) {
            ctx.drawImage(ppr, i, j);
        }
    }

    const PAR = genParams();
    vizParams(PAR);

    Math.random() <= 0.5
        ? woody({ ctx, xof: 300, yof: 550, PAR })
        : herbal({ ctx, xof: 300, yof: 600, PAR });

    Layer.border(ctx, squircle(0.98, 3));

    return ctx;
};
