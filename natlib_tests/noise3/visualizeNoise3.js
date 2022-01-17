/* This file is part of natlib.
 * https://github.com/mvasilkov/natlib
 * MIT License | Copyright (c) 2021 Mark Vasilkov
 */
'use strict';
import { Mulberry32 } from '../natlib/prng/Mulberry32.js';
import { buildPermutationTable } from '../natlib/noise/noise.js';
import { PerlinNoise } from '../natlib/noise/PerlinNoise.js';
var prngClassMap = {
    Mulberry32: Mulberry32
};
var noiseClassMap = {
    PerlinNoise: PerlinNoise
};
export function visualizeNoise3(noiseId, scale, prngId, seed, canvas) {
    var r = new prngClassMap[prngId](seed);
    var p = buildPermutationTable(r);
    var n = new noiseClassMap[noiseId](p);
    for (var y = 0; y < canvas.height; ++y) {
        for (var x = 0; x < canvas.width; ++x) {
            var b = 127.5 * (n.noise3(x / scale, y / scale, 0) + 1);
            canvas.con.fillStyle = "rgb(" + b + "," + b + "," + b + ")";
            canvas.con.fillRect(x, y, 1, 1);
        }
    }
}
