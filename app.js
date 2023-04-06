const express = require("express"); // importe le module Express.js (framework) et le stocke dans la constante express pour être utilisée dans le code suivant.
const bodyParser = require("body-parser"); // importe le module body-parser et le stocke dans la constante bodyParser pour être utilisée dans le code suivant.
const mongoose = require("mongoose"); // importe le module mongoose et le stocke dans la constante mongoose pour être utilisée dans le code suivant.
const path = require("path"); // importe le module path (module intégré de Node.js) et le stocke dans la constante path pour être utilisée dans le code suivant.
const app = express(); // crée une nouvelle instance d'une application Express et la stocke dans la constante app pour être utilisée dans le code suivant.

const sauceRoutes = require("./routes/sauce"); // importe les routes définies dans le fichier ./routes/sauce et les stocke dans la constante sauceRoutes pour être utilisées dans le code suivant.
const userRoutes = require("./routes/user"); // importe les routes définies dans le fichier ./routes/user et les stocke dans la constante userRoutes pour être utilisées dans le code suivant.

// établit une connexion à une base de données MongoDB en utilisant le module mongoose 
mongoose
  .connect(
    "mongodb+srv://mauryalexandref:11OUxNq5uCKiUqLk@cluster0.ycwsj02.mongodb.net/hotTakes?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !")) 
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// ajoute un middleware Express pour configurer les en-têtes CORS, permettant ainsi à des futures sauces d'être partagées entre différents domaines.
app.use((req, res, next) => { // La méthode use de l'objet app est appelée avec une fonction qui prend trois arguments 
  res.setHeader("Access-Control-Allow-Origin", "*"); // Autorise l'accès aux ressources de l'API à partir de n'importe quel domaine.
  res.setHeader( // Autorise les en-têtes spécifiés à être inclus dans les requêtes CORS.
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader( // Autorise les méthodes HTTP spécifiées pour les requêtes CORS.
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next(); // La fonction next est appelée pour passer l'exécution au prochain middleware ou routeur dans la chaîne d'exécution.
});

app.use(bodyParser.json());
app.use(express.json());

app.use("/api/sauces/", sauceRoutes); // attache les routes définies dans la const sauceRoutes à app.js
app.use("/api/auth/", userRoutes); // attache les routes définies dans la const userRoutes à app.js
app.use("/images", express.static(path.join(__dirname, "images"))); // middleware qui s'occupe des images du CORS a partir du dossier images

module.exports = app; // exporte l'instance de l'application Express (app) pour qu'elle puisse être utilisée dans d'autres modules du backend
