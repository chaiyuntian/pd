/**
 * Created by Yuntian Chai on 15-3-10.
 */

var pupil = {
    Version:0.5,

    kernel: {
        k0: {
            ky: [1, 0, -1,
                2, 0, -2,
                1, 0, -1],
            kx: [
                1, 2, 1,
                0, 0, 0,
                -1, -2, -1
            ]
        },
        k1: {
            ky: [3, 0, -3,
                10, 0, -10,
                3, 0, -3],
            kx: [
                3, 10, 3,
                0, 0, 0,
                -3, -10, -3
            ]
        }
    }
};

// input image is a 4 channel RGBA image
pupil.gs = function(s,d)
{
    var l = s.length;if (!d) d = new Uint32Array(l >> 2);
    for (var i = 0; i < l; i += 2) {d[i >> 2] = (s[i] * 4899 + s[++i] * 9617 + s[++i] * 1868 + 8192) >> 14;}
    return d;
};

// input image is a single channel image
pupil.invs = function(s,d) {
    var l = s.length;
    if (!d) d = new Uint32Array(l);
    for (var i = 0; i < l; i += 1) {
        d[i] = 255 - s[i];
    }
    return d;
};

pupil.dcut = function(s,thd,rpl,d){
    var t = thd|0;
    var v = rpl|0;
    var l = s.length;if (!d) d = new Uint32Array(l);
    for (var i = 0; i < l; i += 1) {if(s[i]>t){d[i]=s[i];}else{d[i]=v}}
    return d;
};

pupil.ucut = function(s,thd,rpl,d){
    var t = thd|0;
    var v = rpl|0;
    var l = s.length;if (!d) d = new Uint32Array(l);
    for (var i = 0; i < l; i += 1) {if(s[i]<t){d[i]=s[i];}else{d[i]=v}}
    return d;
};

pupil.bin = function(s,thd,d){
    var t = thd|0;
    var l = s.length;if (!d) d = new Uint32Array(l);
    for (var i = 0; i < l; i += 1) {if(s[i]>t){d[i]=255;}else{d[i]=0}}
    return d;
};

pupil.hist = function(s,step){
    var l = s.length;
    if (!step) step = 1;

    // Compute histogram and histogram sum:
    var h= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0];

    for (var i = 0; i < l; i += step) {
        ++h[s[i]];
    }

    return h;
};

// find a threshold that best fit the percent
pupil.fT=function(h,l,p){
    // find threshold
    var sum=0;
    for (var i = 0; i < 256; i++) {
        if(sum>=p*l){return i;}
        sum+=h[i];
    }
    return 255;
};

pupil.cny=function(s,w,h,d){
    var l = w*h;
    if (!d){d = new s.constructor(l);}
    var b1 = d === s ? new s.constructor(l) : d;
    var b2 = new s.constructor(l);

    // Gaussian filter with size=5, sigma=sqrt(2) horizontal pass:
    for (var x = 2; x < w - 2; ++x) {
        var index = x;
        for (var y = 0; y < h; ++y) {
            b1[index] =
                0.1117 * s[index - 2] +
                0.2365 * s[index - 1] +
                0.3036 * s[index] +
                0.2365 * s[index + 1] +
                0.1117 * s[index + 2];
            index += w;
        }
    }

    // Gaussian filter with size=5, sigma=sqrt(2) vertical pass:
    for (var x = 0; x < w; ++x) {
        var idx = x + w;
        for (var y = 2; y < h - 2; ++y) {
            idx += w;
            b2[idx] =
                0.1117 * b1[idx - w - w] +
                0.2365 * b1[idx - w] +
                0.3036 * b1[idx] +
                0.2365 * b1[idx + w] +
                0.1117 * b1[idx + w + w];
        }
    }

    // Compute gradient:
    var abs = Math.abs;
    for (var x = 2; x < w - 2; ++x) {
        var index = x + w;
        for (var y = 2; y < h - 2; ++y) {
            index += w;

            d[index] =
                abs(-     b2[index - 1 - w]
                    +     b2[index + 1 - w]
                    - 2 * b2[index - 1]
                    + 2 * b2[index + 1]
                    -     b2[index - 1 + w]
                    +     b2[index + 1 + w]) +

                abs(      b2[index - 1 - w]
                    + 2 * b2[index - w]
                    +     b2[index + 1 - w]
                    -     b2[index - 1 + w]
                    - 2 * b2[index + w]
                    -     b2[index + 1 + w]);
        }
    }
    return d;
};

pupil.sbl = function(s,w,h,kn,d){
    var l = w*h;
    if(!kn){kn = pupil.kernel.k0;}
    var kx = kn.kx;
    var ky = kn.ky;

    if (!d){d = new s.constructor(l);}

    for(var x=1;x<w;x++)
    {
        var i = x + w;
        for(var y=1;y<h;y++)
        {
            i += w;
            var z1 = s[i-w-1],z2 = s[i-w],z3 = s[i-w+1];
            var z4 = s[i-1],z6 = s[i+1];
            var z7 = s[i+w-1],z8 = s[i+w],z9 = s[i+w+1];
            var sx = z1*kx[0]+z2*kx[1]+z3*kx[2]+z7*kx[6]+z8*kx[7]+z9*kx[8];
            var sy = z1*ky[0]+z4*ky[3]+z7*ky[6]+z3*ky[2]+z6*ky[5]+z9*ky[8];
            d[i]=Math.sqrt(sx*sx+sy*sy);
        }
    }
    return d;
};

// push non-zero pixels' coordinates into an array
pupil.pt = function(s,w,h){
    var l = s.length;
    var pt = [];
    for (var i = 0; i < l; i += 1)
    {
        if(s[i]!=0){ pt.push({x:i%w,y:Math.floor(i/w)});}
    }
    return pt;
};




