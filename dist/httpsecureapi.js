"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = __importDefault(require("https"));
var http_1 = __importDefault(require("http"));
var crypto_1 = __importDefault(require("crypto"));
var Httpsecureapi = /** @class */ (function () {
    function Httpsecureapi(baseUrl, headers, encryptionKey) {
        if (headers === void 0) { headers = {}; }
        this._baseUrl = baseUrl;
        this._headers = headers;
        this._encryptionKey = encryptionKey;
    }
    Httpsecureapi.prototype.get = function (url, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('GET', url, options)];
            });
        });
    };
    Httpsecureapi.prototype.post = function (url, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('POST', url, options)];
            });
        });
    };
    Httpsecureapi.prototype.put = function (url, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('PUT', url, options)];
            });
        });
    };
    Httpsecureapi.prototype.delete = function (url, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('DELETE', url, options)];
            });
        });
    };
    Httpsecureapi.prototype.request = function (method, url, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var mergedHeaders, mergedOptions, protocol, encryptedBody;
            var _this = this;
            return __generator(this, function (_a) {
                mergedHeaders = __assign(__assign({}, this._headers), options.headers);
                mergedOptions = __assign(__assign({}, options), { method: method, headers: mergedHeaders });
                protocol = this._baseUrl.startsWith('https') ? https_1.default : http_1.default;
                try {
                    if (mergedOptions.body && typeof mergedOptions.body === 'object') {
                        encryptedBody = this.encryptData(JSON.stringify(mergedOptions.body));
                        mergedOptions.headers['Content-Length'] = Buffer.byteLength(encryptedBody).toString();
                        mergedOptions.body = encryptedBody;
                    }
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var req = protocol.request("".concat(_this._baseUrl).concat(url), mergedOptions, function (res) {
                                var data = '';
                                res.on('data', function (chunk) {
                                    data += chunk;
                                });
                                res.on('end', function () {
                                    try {
                                        // Vérifier si les données sont chiffrées avant de tenter de les décrypter
                                        var decryptedData = _this.isEncrypted(data) ? _this.decryptData(data) : JSON.parse(data);
                                        resolve(decryptedData);
                                    }
                                    catch (error) {
                                        reject(error);
                                    }
                                });
                            });
                            req.on('error', function (error) {
                                reject(error);
                            });
                            if (mergedOptions.body) {
                                req.write(mergedOptions.body);
                            }
                            req.end();
                        })];
                }
                catch (error) {
                    return [2 /*return*/, {
                            error: error,
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    Httpsecureapi.prototype.encryptData = function (data) {
        var cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(this._encryptionKey), Buffer.alloc(16, 0));
        var encryptedData = cipher.update(data, 'utf-8', 'hex');
        encryptedData += cipher.final('hex');
        return encryptedData;
    };
    Httpsecureapi.prototype.decryptData = function (data) {
        var decipher = crypto_1.default.createDecipheriv('aes-256-cbc', this._encryptionKey, Buffer.alloc(16, 0));
        var decryptedData = decipher.update(data, 'hex', 'utf-8');
        decryptedData += decipher.final('utf-8');
        return JSON.parse(decryptedData);
    };
    Httpsecureapi.prototype.isEncrypted = function (data) {
        // Vérifier si les données commencent par le préfixe d'encodage
        return data.startsWith('ENC:');
    };
    return Httpsecureapi;
}());
exports.default = Httpsecureapi;
