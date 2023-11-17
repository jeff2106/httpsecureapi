"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __importStar(require("crypto"));
class Httpsecureapi {
    constructor(baseUrl, headers = {}, encryptionKey) {
        this._baseUrl = baseUrl;
        this._headers = headers;
        this._encryptionKey = encryptionKey;
    }
    get(url, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', url, options);
        });
    }
    post(url, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', url, options);
        });
    }
    put(url, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', url, options);
        });
    }
    delete(url, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', url, options);
        });
    }
    request(method, url, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const mergedHeaders = Object.assign(Object.assign({}, this._headers), options.headers);
            const mergedOptions = Object.assign(Object.assign({}, options), { method, headers: mergedHeaders });
            try {
                // Encryptage des données
                if (mergedOptions.body && typeof mergedOptions.body === 'object') {
                    const encryptedBody = this.encryptData(JSON.stringify(mergedOptions.body));
                    mergedOptions.body = encryptedBody;
                }
                const response = yield fetch(`${this._baseUrl}${url}`, mergedOptions);
                // Décryptage des données
                const data = yield response.json();
                const decryptedData = this.decryptData(data);
                return decryptedData;
            }
            catch (error) {
                return {
                    error
                };
            }
        });
    }
    encryptData(data) {
        // Utiliser une bibliothèque de chiffrement comme 'crypto' pour encrypter les données avec la clé secrète
        // Ceci est un exemple basique et vous devriez utiliser une bibliothèque de chiffrement bien établie dans un projet réel
        const cipher = crypto.createCipher('aes-256-cbc', this._encryptionKey);
        let encryptedData = cipher.update(data, 'utf-8', 'hex');
        encryptedData += cipher.final('hex');
        return encryptedData;
    }
    decryptData(data) {
        // Utiliser une bibliothèque de chiffrement comme 'crypto' pour décrypter les données avec la clé secrète
        // Ceci est un exemple basique et vous devriez utiliser une bibliothèque de chiffrement bien établie dans un projet réel
        const decipher = crypto.createDecipher('aes-256-cbc', this._encryptionKey);
        let decryptedData = decipher.update(data, 'hex', 'utf-8');
        decryptedData += decipher.final('utf-8');
        return JSON.parse(decryptedData);
    }
}
exports.default = Httpsecureapi;
