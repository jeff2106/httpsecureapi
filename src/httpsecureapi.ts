const https = require('https');
const http = require('http');
const crypto = require('crypto');

class Httpsecureapi {
    constructor(baseUrl, headers = {}, encryptionKey) {
        this._baseUrl = baseUrl;
        this._headers = headers;
        this._encryptionKey = encryptionKey;
    }

    async get(url, options = {}) {
        return this.request('GET', url, options);
    }

    async post(url, options = {}) {
        return this.request('POST', url, options);
    }

    async put(url, options = {}) {
        return this.request('PUT', url, options);
    }

    async delete(url, options = {}) {
        return this.request('DELETE', url, options);
    }

    async request(method, url, options = {}) {
        const mergedHeaders = {
            ...this._headers,
            ...options.headers,
        };

        const mergedOptions = {
            ...options,
            method,
            headers: mergedHeaders,
        };

        const protocol = this._baseUrl.startsWith('https') ? https : http;

        try {
            if (mergedOptions.body && typeof mergedOptions.body === 'object') {
                const encryptedBody = this.encryptData(JSON.stringify(mergedOptions.body));
                mergedOptions.headers['Content-Length'] = Buffer.byteLength(encryptedBody);
                mergedOptions.body = encryptedBody;
            }

            return new Promise((resolve, reject) => {
                const req = protocol.request(`${this._baseUrl}${url}`, mergedOptions, (res) => {
                    let data = '';

                    res.on('data', (chunk) => {
                        data += chunk;
                    });

                    res.on('end', () => {
                        try {
                            // Vérifier si les données sont chiffrées avant de tenter de les décrypter
                            const decryptedData = this.isEncrypted(data) ? this.decryptData(data) : JSON.parse(data);
                            resolve(decryptedData);
                        } catch (error) {
                            reject(error);
                        }
                    });
                });

                req.on('error', (error) => {
                    reject(error);
                });

                if (mergedOptions.body) {
                    req.write(mergedOptions.body);
                }

                req.end();
            });
        } catch (error) {
            return {
                error
            };
        }
    }

    encryptData(data) {
        const cipher = crypto.createCipheriv('aes-256-cbc', this._encryptionKey);
        let encryptedData = cipher.update(data, 'utf-8', 'hex');
        encryptedData += cipher.final('hex');
        return encryptedData;
    }

    decryptData(data) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', this._encryptionKey, Buffer.alloc(16, 0));
        let decryptedData = decipher.update(data, 'hex', 'utf-8');
        decryptedData += decipher.final('utf-8');
        return JSON.parse(decryptedData);
    }

    isEncrypted(data) {
        // Vérifier si les données commencent par le préfixe d'encodage
        return data.startsWith('ENC:');
    }
}

module.exports = Httpsecureapi;
