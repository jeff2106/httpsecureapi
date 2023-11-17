# `Httpsecureapi`

Un module Node.js pour effectuer des requêtes HTTP sécurisées avec chiffrement des données.

## Installation

```bash
npm install httpsecureapi
```
## Utilisation

## Importation du module
```bash
const Httpsecureapi = require('httpsecureapi');
```
## Création d'une instance
```bash
const apiUrl = 'https://api.example.com';
const encryptionKey = 'your-secret-key';
const headerConfig = {
    'Authorization': 'Bearer _____,
    'Content-Type': 'application/json'
    // les autres que vous voulez
}
const http = new Httpsecureapi(apiUrl, headerConfig, encryptionKey);
```
## Effectuer une requête GET
```bash
const url = '/users';
http.get(url)
  .then(response => console.log(response))
  .catch(error => console.error(error));
```
## Effectuer une requête POST
```bash
const url = '/users';
const data = { username: 'john_doe', password: 'secure_password' };
http.post(url, { body: data })
  .then(response => console.log(response))
  .catch(error => console.error(error));

```
## Effectuer une requête PUT
```bash
const url = '/users/123';
const data = { username: 'updated_user' };
http.put(url, { body: data })
  .then(response => console.log(response))
  .catch(error => console.error(error));

```
## Effectuer une requête DELETE
```bash
const url = '/users/123';
http.delete(url)
  .then(response => console.log(response))
  .catch(error => console.error(error));
```
## Options de configuration

- `apiUrl`: URL de base de l'API.
- `headers`: En-têtes personnalisés pour chaque requête.
- `encryptionKey`: Clé de chiffrement pour sécuriser les données.

## Fonctions

- `get(url, options)`: Effectue une requête GET.
- `post(url, options)`: Effectue une requête POST.
- `put(url, options)`: Effectue une requête PUT.
- `delete(url, options)`: Effectue une requête DELETE.

## Mode Encrypted 🚨
Pour utiliser le mode encrypté, assurez-vous que le serveur auquel vous faites des requêtes a préalablement renvoyé les données sous forme encryptée, suivant le même format que celui utilisé par ce module. Le chiffrement actuellement utilisé est l'algorithme AES-256-CBC avec une clé de chiffrement fournie lors de la création de l'instance Httpsecureapi. Veillez à utiliser la même clé de chiffrement des deux côtés pour garantir la compatibilité du chiffrement et du déchiffrement des données.

## Pour plus d'informations je vous laisse mon gmail 
```jeanphilippesara225@gmail.com``` <br/> <br/>
Merci d'utiliser mon module 😉
## Licence

Ce module est distribué sous la licence MIT. Voir le fichier `LICENSE` pour plus de détails.
