// Array prototype polyfills for .x, .y, .z and negative indices

export const initializePolyfills = () => {
    // index arrays with .x, .y, .z
    ["x", "y", "z"].forEach((prop, idx) => {
        Object.defineProperty(Array.prototype, prop, {
            get() {
                return this[idx];
            },
            set(val) {
                this[idx] = val;
            },
        });
    });

    // negative indices
    [1, 2, 3].forEach((i) => {
        Object.defineProperty(Array.prototype, `-${i}`, {
            get() {
                return this[this.length - i];
            },
            set(val) {
                this[this.length - i] = val;
            },
        });
    });
};
