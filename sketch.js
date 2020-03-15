// Resolution 
let res_x = 400;
let res_y = 400;
let ms;
let scale;
let gradcolor = [];

function setup() {
    // Create p5 canvas to show the Mandelbrot Set image
    createCanvas(res_x, res_y);
    frameRate(60);

    // Initialize algorithm
    ms = new MandelbrotSetGraph(res_x, res_y);
    scale = 1.0 * 2.0 / res_x;
    ms.setRegion(0, 0, scale);

    gradcolor[0] = color(66, 30, 15);
    gradcolor[1] = color(25, 7, 26);
    gradcolor[2] = color(9, 1, 47);
    gradcolor[3] = color(4, 4, 73);
    gradcolor[4] = color(0, 7, 100);
    gradcolor[5] = color(12, 44, 138);
    gradcolor[6] = color(24, 82, 177);
    gradcolor[7] = color(57, 125, 209);
    gradcolor[8] = color(134, 181, 229);
    gradcolor[9] = color(211, 236, 248);
    gradcolor[10] = color(241, 233, 191);
    gradcolor[11] = color(248, 201, 95);
    gradcolor[12] = color(255, 170, 0);
    gradcolor[13] = color(204, 128, 0);
    gradcolor[14] = color(153, 87, 0);
    gradcolor[15] = color(106, 52, 3);
}

function draw() {
    ms.draw();
}

function mouseClicked() {
    let c = ms.getPixelComplex(mouseX, mouseY);
    scale = scale * 0.2;
    ms.setRegion(c.re, c.im, scale);
}

function getColor(step) {
    if(step == 0) {
        return color(0, 0, 0);
    }
    if(step > 100) {
        return color(255, 255, 255);
    }
    return gradcolor[step % 16];
}

class MandelbrotFunction {
    /**
     * Create Mandelbrot function for 1 point of the plane.
     * @param {number} c_re The real part of the point. 
     * @param {number} c_im The imaginary part of the point. 
     */
    constructor(c_re, c_im) {
        this.z_re = 0;
        this.z_im = 0;
        this.c_re = c_re;
        this.c_im = c_im;
    }

    initialize(c_re, c_im) {
        this.z_re = 0;
        this.z_im = 0;
        this.c_re = c_re;
        this.c_im = c_im;
    }

    /**
     * Do one step of the following function
     * f(z) = z^2 + c
     */
    step() {
        let re = this.z_re * this.z_re - this.z_im * this.z_im + this.c_re;
        let im = this.z_re * this.z_im + this.z_im * this.z_re + this.c_im;
        this.z_re = re;
        this.z_im = im;
    }

    /**
     * Check if distance to origin is larger than 2 (out of Mandelbrot set)
     */
    isOutOfMandelbrotSet() {
        return this.z_re * this.z_re + this.z_im * this.z_im > 4;
    }
}

class MandelbrotSetGraph {
    getPixelComplex(x, y) {
        let re = map(x, 0, this.res_x, this.re_min, this.re_max);
        let im = map(y, 0, this.res_y, this.im_min, this.im_max);
        return { re: re, im: im };
    }

    constructor(res_x, res_y) {
        // Set graph resolution
        this.res_x = res_x;
        this.res_y = res_y;

        // Set default region
        this.re_min = -2;
        this.re_max = 2;
        this.im_min = -2;
        this.im_max = 2;

        this.step = 0;
        this.data = [];
        for (let x = 0; x < this.res_x; x++) {
            this.data[x] = [];
            for (let y = 0; y < this.res_y; y++) {
                // Get the complex number of this pixel
                let c = this.getPixelComplex(x, y);
                this.data[x][y] = new MandelbrotFunction(c.re, c.im);
            }
        }
    }

    initialize() {
        this.step = 0;
        for (let x = 0; x < this.res_x; x++) {
            for (let y = 0; y < this.res_y; y++) {
                // Get the complex number of this pixel
                let c = this.getPixelComplex(x, y);
                this.data[x][y].initialize(c.re, c.im);
            }
        }
    }

    setRegion(center_re, center_im, scale) {
        this.re_min = center_re - this.res_x * scale;
        this.re_max = center_re + this.res_x * scale;
        this.im_min = center_im - this.res_y * scale;
        this.im_max = center_im + this.res_y * scale;
        console.log(center_re, center_im, scale, this.re_min, this.re_max, this.im_min, this.im_max);

        this.initialize();
    }

    draw() {
        // Set point color for the mandelbrot set
        stroke(getColor(this.step));

        // For all pixel in the graph
        for (let x = 0; x < this.res_x; x++) {
            for (let y = 0; y < this.res_y; y++) {
                // Handle case where the pixel is out of Mandelbrot set
                if (this.data[x][y].isOutOfMandelbrotSet()) {
                    continue;
                }

                // Handle case where it can still be in Mandelbrot set
                this.data[x][y].step();
                point(x, y);
            }
        }

        this.step = this.step + 1;
        console.log(this.step);
    }
}
