import * as crypto from 'crypto';

interface MergedOptions extends RequestInit {
    method: string;
    headers: any;
    body?: any;
}

class Httpsecureapi {
    private _baseUrl: string;
    private _headers: Record<string, string>;
    private _encryptionKey: string; // Clé secrète pour l'encryptage des données

    constructor(baseUrl: string, headers: Record<string, string> = {}, encryptionKey: string) {
        this._baseUrl = baseUrl;
        this._headers = headers;
        this._encryptionKey = encryptionKey;
    }

    async get(url: string, options: Record<string, any> = {}) {
        return this.request('GET', url, options);
    }

    async post(url: string, options: Record<string, any> = {}) {
        return this.request('POST', url, options);
    }

    async put(url: string, options: Record<string, any> = {}) {
        return this.request('PUT', url, options);
    }

    async delete(url: string, options: Record<string, any> = {}) {
        return this.request('DELETE', url, options);
    }

    private async request(method: string, url: string, options: Record<string, any> = {}) {
        const mergedHeaders = {
            ...this._headers,
            ...options.headers,
        };

        const mergedOptions: MergedOptions = {
            ...options,
            method,
            headers: mergedHeaders,
        };

        try {
            // Encryptage des données
            if (mergedOptions.body && typeof mergedOptions.body === 'object') {
                const encryptedBody = this.encryptData(JSON.stringify(mergedOptions.body));
                mergedOptions.body = encryptedBody;
            }

            const response = await fetch(`${this._baseUrl}${url}`, mergedOptions);

            // Décryptage des données
            const data = await response.json();
            const decryptedData = this.decryptData(data);
            return decryptedData;
        } catch (error) {
            return {
                error
            };
        }
    }

    private encryptData(data: string): string {
        // Utiliser une bibliothèque de chiffrement comme 'crypto' pour encrypter les données avec la clé secrète
        // Ceci est un exemple basique et vous devriez utiliser une bibliothèque de chiffrement bien établie dans un projet réel
        const cipher = crypto.createCipher('aes-256-cbc', this._encryptionKey);
        let encryptedData = cipher.update(data, 'utf-8', 'hex');
        encryptedData += cipher.final('hex');
        return encryptedData;
    }

    private decryptData(data: string): any {
        // Utiliser une bibliothèque de chiffrement comme 'crypto' pour décrypter les données avec la clé secrète
        // Ceci est un exemple basique et vous devriez utiliser une bibliothèque de chiffrement bien établie dans un projet réel
        const decipher = crypto.createDecipher('aes-256-cbc', this._encryptionKey);
        let decryptedData = decipher.update(data, 'hex', 'utf-8');
        decryptedData += decipher.final('utf-8');
        return JSON.parse(decryptedData);
    }
}

module.exports = Httpsecureapi;
