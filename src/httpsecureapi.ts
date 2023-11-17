import https from 'https';
import http from 'http';
import crypto from 'crypto';

interface RequestOptions extends http.RequestOptions {
    body?: any;
}

class Httpsecureapi {
    private _baseUrl: string;
    private _headers: Record<string, string>;
    private _encryptionKey: string;

    constructor(baseUrl: string, headers: Record<string, string> = {}, encryptionKey: string) {
        this._baseUrl = baseUrl;
        this._headers = headers;
        this._encryptionKey = encryptionKey;
    }

    async get(url: string, options: RequestOptions = {}) {
        return this.request('GET', url, options);
    }

    async post(url: string, options: RequestOptions = {}) {
        return this.request('POST', url, options);
    }

    async put(url: string, options: RequestOptions = {}) {
        return this.request('PUT', url, options);
    }

    async delete(url: string, options: RequestOptions = {}) {
        return this.request('DELETE', url, options);
    }

    private async request(method: string, url: string, options: RequestOptions = {}) {
        const mergedHeaders = {
            ...this._headers,
            ...options.headers,
        };

        const mergedOptions: RequestOptions = {
            ...options,
            method,
            headers: mergedHeaders,
        };

        const protocol = this._baseUrl.startsWith('https') ? https : http;

        try {
            if (mergedOptions.body && typeof mergedOptions.body === 'object') {
                const encryptedBody = this.encryptData(JSON.stringify(mergedOptions.body));
                mergedOptions.headers['Content-Length'] = Buffer.byteLength(encryptedBody).toString();
                mergedOptions.body = encryptedBody;
            }

            return new Promise<any>((resolve, reject) => {
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
                error,
            };
        }
    }

    private encryptData(data: string): string {
        const cipher = crypto.createCipheriv('aes-256-cbc', this._encryptionKey, Buffer.alloc(16, 0));
        let encryptedData = cipher.update(data, 'utf-8', 'hex');
        encryptedData += cipher.final('hex');
        return encryptedData;
    }

    private decryptData(data: string): any {
        const decipher = crypto.createDecipheriv('aes-256-cbc', this._encryptionKey, Buffer.alloc(16, 0));
        let decryptedData = decipher.update(data, 'hex', 'utf-8');
        decryptedData += decipher.final('utf-8');
        return JSON.parse(decryptedData);
    }

    private isEncrypted(data: string): boolean {
        // Vérifier si les données commencent par le préfixe d'encodage
        return data.startsWith('ENC:');
    }
}

export default Httpsecureapi;
