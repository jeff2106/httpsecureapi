const https = require('https');
const http = require('http');
const crypto = require('crypto');

class Httpsecureapi {
    constructor(baseUrl, headers = {}, encryptionKey) {
        this._baseUrl = baseUrl;
        this._headers = headers;
        this._encryptionKey = encryptionKey;
        this._interceptors = {
            request: [],
            response: [],
            error: [],
        };
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

        // Apply request interceptors
        await this.applyInterceptors('request', mergedOptions);

        const protocol = this._baseUrl.startsWith('https') ? https : http;

        try {
            if (mergedOptions.body && typeof mergedOptions.body === 'object') {
                if (this._encryptionKey) {
                    // Chiffrer les données uniquement si une clé de chiffrement est fournie
                    const encryptedBody = this.encryptData(JSON.stringify(mergedOptions.body));
                    mergedOptions.headers['Content-Length'] = Buffer.byteLength(encryptedBody);
                    mergedOptions.body = encryptedBody;
                } else {
                    // Laisser les données comme elles sont si aucune clé de chiffrement n'est fournie
                    mergedOptions.body = JSON.stringify(mergedOptions.body);
                }
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
                            const response = { data: decryptedData, headers: res.headers };
                            // Apply response interceptors
                            this.applyInterceptors('response', response).then(resolve).catch(reject);
                        } catch (error) {
                            reject(error);
                        }
                    });
                });

                req.on('error', (error) => {
                    // Apply error interceptors
                    this.applyInterceptors('error', error).then(reject).catch(reject);
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

    addInterceptor(interceptor) {
        // Add an interceptor for a specific event (request, response, error)
        // Example: { request: (config) => { /* modify request config */ return config; }, response: (response) => { /* modify response */ return response; }, error: (error) => { /* handle error */ throw error; } }
        this._interceptors.request.push(interceptor.request);
        this._interceptors.response.push(interceptor.response);
        this._interceptors.error.push(interceptor.error);
    }

    async applyInterceptors(event, data) {
        // Apply all interceptors for a specific event
        const interceptors = this._interceptors[event];
        for (const interceptor of interceptors) {
            try {
                data = await interceptor(data);
            } catch (error) {
                throw error;
            }
        }
        return data;
    }
}

module.exports = Httpsecureapi;
