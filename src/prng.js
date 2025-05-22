export class Prng {
    constructor() {
        this.s = 1234;
        this.p = 999979;
        this.q = 999983;
        this.m = this.p * this.q;
    }

    hash(x) {
        const y = window.btoa(JSON.stringify(x));
        return [...y].reduce(
            (acc, ch, i) => acc + ch.charCodeAt(0) * 128 ** i,
            0
        );
    }

    seed(x = new Date().getTime()) {
        let y = 0,
            z = 0;
        const redo = () => {
            y = (this.hash(x) + z) % this.m;
            z++;
        };
        while (y % this.p == 0 || y % this.q == 0 || y == 0 || y == 1) {
            redo();
        }
        this.s = y;
        console.log(["int seed", this.s]);
        for (let i = 0; i < 10; i++) this.next();
    }

    next() {
        this.s = (this.s * this.s) % this.m;
        return this.s / this.m;
    }

    test(f = () => this.next()) {
        const t0 = new Date().getTime();
        const chart = new Array(10).fill(0);
        for (let i = 0; i < 10000000; i++) {
            chart[Math.floor(f() * 10)] += 1;
        }
        console.log(chart);
        console.log(`finished in ${new Date().getTime() - t0}`);
        return chart;
    }
}

export const prng = new Prng();
