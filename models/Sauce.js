const mongoose = require("mongoose"); // importe le module mongoose pour utilisation ici meme

// définit un nouveau schéma Mongoose appelé sauceSchema. schema a respect pour les post et autres
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true }, // L'identifiant doit être une chaîne de caractères + obligatoire pour chaque sauce.
  name: { type: String, required: true }, // idem
  manufacturer: { type: String, required: true }, // idem
  description: { type: String, required: true }, // idem
  mainPepper: { type: String, required: true }, // idem
  imageUrl: { type: String, required: true }, // idem
  heat: { type: Number, required: true }, // Le niveau de piquant doit être un nombre + Obligatoire
  likes: { type: Number, default: 0 }, // Le nombre de "j'aime" doit être un nombre + par default 0
	dislikes: { type: Number, default: 0 }, // idem likes
	usersLiked: { type: [String] }, // doit etre une chaine de caractere + permet de garder une trace des utilisateurs qui ont aimé la sauce et d'empêcher un utilisateur d'aimer la sauce plusieurs fois.
	usersDisliked: { type: [String] }, // idem usersLiked
});

module.exports = mongoose.model("Sauce", sauceSchema); // exporte un modèle Mongoose basé sur le schéma sauceSchema défini précédemment.
