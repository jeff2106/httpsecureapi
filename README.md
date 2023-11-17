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
const headers = {}
const http = new Httpsecureapi(apiUrl, headers, encryptionKey);
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

# Intercepteur
- <b>Intercepteur de requête (request)</b>
- <b> Intercepteur de réponse (response)</b>
- <b>Intercepteur d'erreur (error)</b>


```bash
const http = new Httpsecureapi(apiUrl, customHeaders, encryptionKey);

//Ajouter un en-tête d'autorisation à toutes les requêtes

http.addInterceptor({
    request: (config) => {
        config.headers['Authorization'] = 'Bearer your-access-token';
        return config;
    },
});

// Manipuler les données de la réponse
http.addInterceptor({
    response: (response) => {
        // Convertir le format de la date
        if (response.data.date) {
            response.data.date = new Date(response.data.date);
        }
        return response;
    },
});

// Gérer les erreurs de requête
http.addInterceptor({
    error: (error) => {
        // Gérer les erreurs spécifiques
        if (error.status === 401) {
            console.error('Erreur d\'authentification. Veuillez vous reconnecter.');
        }
        throw error; // Renvoyer l'erreur après traitement
    },
});
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

## Utilisation du chiffrement des données

Le module Httpsecureapi utilise le chiffrement pour sécuriser les données envoyées dans les requêtes. Voici comment cela fonctionne :

- <b>Chiffrement des données sortantes (Requêtes POST) :</b> Lorsque vous effectuez une requête POST avec des données dans le corps (options.body), ces données sont automatiquement chiffrées avant d'être envoyées au serveur si l'en-tête encryptionKey est fourni. Dans le cas contraire, les données sont envoyées telles quelles pour une utilisation normale.
- <b>Déchiffrement des données entrantes (Réponses du serveur) :</b> Lorsqu'une réponse est reçue du serveur, le module vérifie si les données sont chiffrées. Si elles le sont, elles sont automatiquement déchiffrées avant d'être retournées.
Remarque : Le serveur doit être configuré pour envoyer les données dans le format chiffré pris en charge par Httpsecureapi. Assurez-vous que le serveur comprend le mode de chiffrement utilisé par le module.

## Configuration des en-têtes personnalisés

Vous pouvez également configurer des en-têtes personnalisés pour chaque requête en passant un objet headers lors de la création de l'instance Httpsecureapi. Par exemple :
```bash
const apiUrl = 'https://api.example.com';
const encryptionKey = 'your-secret-key';
const customHeaders = {
    'Authorization': 'Bearer your-access-token',
    'Content-Type': 'application/json'
};

const http = new Httpsecureapi(apiUrl, customHeaders, encryptionKey);
```
## Mode Encrypted 🚨
Pour utiliser le mode encrypté, assurez-vous que le serveur auquel vous faites des requêtes a préalablement renvoyé les données sous forme encryptée, suivant le même format que celui utilisé par ce module. Le chiffrement actuellement utilisé est l'algorithme AES-256-CBC avec une clé de chiffrement fournie lors de la création de l'instance Httpsecureapi. Veillez à utiliser la même clé de chiffrement des deux côtés pour garantir la compatibilité du chiffrement et du déchiffrement des données.

## Pour plus d'informations je vous laisse mon gmail 
```jeanphilippesara225@gmail.com``` <br/> <br/>
Merci d'utiliser mon module 😉
## Licence

Ce module est distribué sous la licence MIT. Voir le fichier `LICENSE` pour plus de détails.
