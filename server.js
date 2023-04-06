const http = require("http"); // création de la constante http qui auras pour valeur "require("http")" module Node.js
const app = require("./app"); // Importation du module app pour etre utilisé dans cette page de code


// Cette fonction est une sécurité pour s'assurer que le port fourni est Number
const normalizePort = (val) => {  // Définition de la fonction qui pour entrée prend (val)
  const port = parseInt(val, 10);   // const port va stocker le résultat de la fonction parseInt() qui convertit la valeur d'entrée (val) en un entier de base 10

  if (isNaN(port)) { // Si la constante port est Not-a-Number (NaN) c'est que parseInt a échoué
    return val; // donc retourne (val) d'entrée sans modification
  }
  if (port >= 0) { // Si la constante port est un nombre entier égal ou supérieur à 0, Cela signifie que la valeur d'entrée val était un nombre entier valide pour un port.
    return port; // la fonction retourne la valeur de port.
  }
  return false; // Si aucune des conditions précédentes n'est remplie, la fonction retourne false. Cela peut arriver si la valeur d'entrée val est un nombre négatif.
};

const port = normalizePort(process.env.PORT || "3000"); // Définis le port sur lequel l'application doit écouter en utilisant la variable d'environnement PORT ou la valeur par défaut "3000"
app.set("port", port); // configure app.js pour qu'elle écoute sur le port spécifié par la constante port.

// la fonction errorHandler gère les erreurs liées à la tentative d'écoute sur un port ou un canal par le serveur, et affiche des messages d'erreur appropriés en fonction du type d'erreur rencontré.
const errorHandler = (error) => {
  if (error.syscall !== "listen") { // Si l'erreur n'est pas liée à la fonction listen (c'est-à-dire qu'elle provient d'une autre partie du code), l'erreur est propagée (lancée) sans traitement supplémentaire.
    throw error;
  }
  const address = server.address(); // Récupère l'adresse du serveur (IP et port) et la stocke dans la constante address.
  const bind = typeof address === "string" ? "pipe " + address : "port: " + port; // décrit le type de connexion utilisée par le serveur + stock dans bind
  switch (error.code) { // Méthode switch pour évaluer les differentes erreures de code
    case "EACCES": // Si code erreur EACCES alors on suit les instrcutions suivantes
      console.error(bind + " requires elevated privileges."); // Un message d'erreur est affiché dans la console avec valeur de la const bind + reste du message
      process.exit(1); // le processus est terminé avec un code de sortie 1
      break; 
    case "EADDRINUSE": // Si code erreur EADDRINUSE alors on suit les instrcutions suivantes
      console.error(bind + " is already in use."); // Un message d'erreur est affiché dans la console avec valeur de la const bind + reste du message
      process.exit(1); // le processus est terminé avec un code de sortie 1
      break;
    default: // Si le code d'erreur ne correspond à aucun des cas précédents, l'erreur est propagée (lancée) sans traitement supplémentaire.
      throw error;
  }
};

const server = http.createServer(app); // crée un serveur HTTP en utilisant l'application app pour gérer les requêtes et les réponses HTTP

// La méthode .on de l'objet server est utilisée pour attacher un gestionnaire d'événements à un événement spécifique.
server.on("error", errorHandler); // Dans ce cas, l'événement est "error", qui est émis lorsque le serveur rencontre une erreur. La fonction errorHandler est passée comme argument et sera appelée chaque fois que l'événement "error" est émis.


server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// démarre le serveur HTTP sur le port spécifié et permet aux clients de se connecter à votre application.
server.listen(port); // La méthode listen est appelée sur l'objet server avec l'argument port, qui est la constante définie précédemment en utilisant la fonction normalizePort. Cette méthode indique au serveur de commencer à écouter les requêtes entrantes sur le port spécifié.
