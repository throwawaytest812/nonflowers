import { prng } from "./prng.js";
export class Noise {
    constructor() {
        this.PERLIN_YWRAPB = 4;
        this.PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB;
        this.PERLIN_ZWRAPB = 8;
        this.PERLIN_ZWRAP = 1 << this.PERLIN_ZWRAPB;
        this.PERLIN_SIZE = 4095;
        this.perlin_octaves = 4;
        this.perlin_amp_falloff = 0.5;
        this.perlin = null;
    }
    static scaledCosine(i) {
        return (1 - Math.cos(i * Math.PI)) / 2;
    }

    noise(x, y = 0, z = 0) {
        if (this.perlin == null) {
            this.perlin = Array.from({ length: this.PERLIN_SIZE + 1 }, () =>
                Math.random()
            );
        }
        [x, y, z] = [x, y, z].map((v) => Math.abs(v));
        let xi = Math.floor(x),
            yi = Math.floor(y),
            zi = Math.floor(z),
            xf = x - xi,
            yf = y - yi,
            zf = z - zi,
            r = 0,
            ampl = 0.5,
            n1,
            n2,
            n3;
        for (let o = 0; o < this.perlin_octaves; o++) {
            let of =
                xi + (yi << this.PERLIN_YWRAPB) + (zi << this.PERLIN_ZWRAPB);
            const rxf = Noise.scaledCosine(xf),
                ryf = Noise.scaledCosine(yf);
            n1 = this.perlin[of & this.PERLIN_SIZE];
            n1 += rxf * (this.perlin[(of + 1) & this.PERLIN_SIZE] - n1);
            n2 = this.perlin[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
            n2 +=
                rxf *
                (this.perlin[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] -
                    n2);
            n1 += ryf * (n2 - n1);

            of += this.PERLIN_ZWRAP;
            n2 = this.perlin[of & this.PERLIN_SIZE];
            n2 += rxf * (this.perlin[(of + 1) & this.PERLIN_SIZE] - n2);
            n3 = this.perlin[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
            n3 +=
                rxf *
                (this.perlin[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] -
                    n3);
            n2 += ryf * (n3 - n2);
            n1 += Noise.scaledCosine(zf) * (n2 - n1);
            r += n1 * ampl;
            ampl *= this.perlin_amp_falloff;
            xi <<= 1;
            xf *= 2;
            yi <<= 1;
            yf *= 2;
            zi <<= 1;
            zf *= 2;
            if (xf >= 1.0) {
                xi++;
                xf--;
            }
            if (yf >= 1.0) {
                yi++;
                yf--;
            }
            if (zf >= 1.0) {
                zi++;
                zf--;
            }
        }
        return r;
    }

    noiseDetail(lod, falloff) {
        if (lod > 0) this.perlin_octaves = lod;
        if (falloff > 0) this.perlin_amp_falloff = falloff;
    }

    noiseSeed(seed) {
        const m = 4294967296,
            a = 1664525,
            c = 1013904223;
        let z = (seed == null ? Math.random() * m : seed) >>> 0;
        const rand = () => {
            z = (a * z + c) % m;
            return z / m;
        };
        this.perlin = Array.from({ length: this.PERLIN_SIZE + 1 }, () =>
            rand()
        );
    }
}

export const noise = new Noise();
