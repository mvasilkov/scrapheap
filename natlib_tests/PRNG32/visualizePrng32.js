/* This file is part of natlib.
 * https://github.com/mvasilkov/natlib
 * MIT License | Copyright (c) 2021 Mark Vasilkov
 */
'use strict';
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Mulberry32 } from '../natlib/prng/Mulberry32.js';
import { shuffle } from '../natlib/prng/prng.js';
var prngClassMap = {
    Mulberry32: Mulberry32
};
export function noiseAndDist(prngId, seed, noiseCanvas, distCanvas) {
    var r = new prngClassMap[prngId](seed);
    var d = Array(distCanvas.width).fill(0);
    function getBytes() {
        var n;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 5];
                    n = r.randomUint32();
                    ++d[n % distCanvas.width];
                    return [4 /*yield*/, n & 255];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (n >>> 8) & 255];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (n >>> 16) & 255];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (n >>> 24) & 255];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 0];
                case 5: return [2 /*return*/];
            }
        });
    }
    var bytes = getBytes();
    noiseCanvas.con.clearRect(0, 0, noiseCanvas.width, noiseCanvas.height);
    for (var y = 0; y < noiseCanvas.height; ++y) {
        for (var x = 0; x < noiseCanvas.width; ++x) {
            var b = bytes.next().value;
            noiseCanvas.con.fillStyle = "rgb(" + b + "," + b + "," + b + ")";
            noiseCanvas.con.fillRect(x, y, 1, 1);
        }
    }
    /* More samples for distribution */
    for (var n = 0; n < noiseCanvas.height * noiseCanvas.width; ++n) {
        bytes.next();
    }
    distCanvas.con.clearRect(0, 0, distCanvas.width, distCanvas.height);
    distCanvas.con.fillStyle = 'rgb(255,255,255)';
    for (var x = 0; x < distCanvas.width; ++x) {
        distCanvas.con.fillRect(x, distCanvas.height - d[x], 1, d[x]);
    }
}
export function fisherYates(prngId, seed, shuffleCanvas) {
    var indices = Object.create(null);
    function p(arr, cur) {
        if (arr.length === 0) {
            indices['' + cur] = Object.keys(indices).length;
            return;
        }
        arr.forEach(function (value, index) {
            var before = arr.slice(0, index);
            var after = arr.slice(index + 1);
            p(before.concat(after), cur.concat([value]));
        });
    }
    p([1, 2, 3, 4], []);
    var pcount = Object.keys(indices).length;
    var results = Array(pcount).fill(0);
    var r = new prngClassMap[prngId](seed);
    var width = shuffleCanvas.width / pcount;
    var padding = 1 / (pcount - 1);
    for (var n = 0; n < 0.5 * shuffleCanvas.height * pcount; ++n) {
        ++results[indices['' + shuffle(r, [1, 2, 3, 4])]];
    }
    shuffleCanvas.con.clearRect(0, 0, shuffleCanvas.width, shuffleCanvas.height);
    shuffleCanvas.con.fillStyle = 'rgb(255,255,255)';
    for (var n = 0; n < pcount; ++n) {
        shuffleCanvas.con.fillRect(n * (width + padding), shuffleCanvas.height - results[n], width - 1, results[n]);
    }
}
