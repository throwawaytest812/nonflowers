// Parameter visualization functions

import Layer from "../src/layer.js";
import { hsv } from "../utils/color.js";
import { TAB_STYLE } from "../constants.js";

// Visualize parameters into HTML table & canvas
export const vizParams = (PAR) => {
    const div = document.createElement("div");
    let viz = "";

    const fmt = (a) => {
        if (typeof a === "number") {
            return a.toFixed(3);
        } else if (typeof a === "object") {
            const cells = Object.values(a)
                .map((v) => `<td\u0020${TAB_STYLE}>${fmt(v)}</td>`)
                .join("");
            return `<table><tr>${cells}</tr></table>`;
        }
    };

    viz += `<table><tr><td\u0020${TAB_STYLE}>Summary</td></tr><tr><td\u0020${TAB_STYLE}><table><tr>`;
    let cnt = 0;

    for (const k in PAR) {
        if (typeof PAR[k] == "number") {
            cnt += 1;
            viz += `<td><td\u0020${TAB_STYLE}>
                ${k}
                </td><td\u0020${TAB_STYLE}>
                ${fmt(PAR[k])}
                </td></td>`;
            if (cnt % 4 == 0) {
                viz += "</tr><tr>";
            }
        }
    }
    viz += "</tr></table>";
    viz += "<table><tr>";
    cnt = 0;
    for (let k in PAR) {
        if (typeof PAR[k] == "object") {
            viz += `<td\u0020${TAB_STYLE}>
                <table><tr><td\u0020colspan='2'\u0020${TAB_STYLE}> 
                ${k} 
                </td></tr>`;

            for (let i in PAR[k]) {
                viz += `<tr><td\u0020${TAB_STYLE}> 
                    ${i} 
                    </td><td\u0020${TAB_STYLE}> 
                    ${fmt(PAR[k][i])}
                    </td>`;
                if (k.includes("olor")) {
                    viz += `<td\u0020${TAB_STYLE}> 
                        <div\u0020style='background-color: 
                        ${hsv(...PAR[k][i])} '>&nbsp&nbsp&nbsp&nbsp&nbsp</div>
                        </td>`;
                }
                viz += "</tr>";
            }
            viz += "</table><td>";

            if (cnt % 2 == 1) {
                viz += "</tr><tr>";
            }
            cnt += 1;
        }
    }
    viz += "</tr></table>";
    viz += `</td></tr><tr><td\u0020align='left'\u0020${TAB_STYLE}></td></tr></table>`;
    const graphs = document.createElement("div");
    for (let k in PAR) {
        if (typeof PAR[k] == "function") {
            const lay = Layer.empty(100);
            lay.fillStyle = "silver";
            for (let i = 0; i < 100; i++) {
                lay.fillRect(i, 100 - 100 * PAR[k](i / 100, 0.5), 2, 2);
            }
            lay.fillText(k, 2, 10);
            lay.canvas.style = "border: 1px solid grey";
            graphs.appendChild(lay.canvas);
        }
    }
    div.innerHTML = viz;
    div.lastChild.lastChild.lastChild.lastChild.appendChild(graphs);
    document.getElementById("summary").appendChild(div);
};
