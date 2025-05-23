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
