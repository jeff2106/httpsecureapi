const crypto = require('crypto');
const Httpsecureapi = require('./dist/httpsecureapi');
const encryptionKey = crypto.randomBytes(32).toString('hex');
const apiUrl = 'https://jsonplaceholder.typicode.com';


const http = new Httpsecureapi(apiUrl, {}, encryptionKey);

// Exemple d'utilisation
http.get('/todos/1')
    .then(data => console.log('Data from API:', data))
    .catch(error => console.error('Error:', error));
