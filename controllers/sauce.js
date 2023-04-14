const Sauce = require("../models/Sauce"); // importe le modèle Sauce défini dans le fichier ../models/Sauce.js
const fs = require("fs"); // importe le module fs (File System) de Node.js

// Crée un nouvel objet "sauce" et l'enregistre dans une base de données.
exports.createSauce = (req, res, next) => {
  // extrait la propriété 'sauce' du corps de la requête ( req.body) et l'analyse en tant que JSON pour créer un nouveau fichier sauceObject.
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id; // suppr de l'id et user id en dessous
  delete sauceObject._userId; // pour ne pas enregistrer les données de l'utilisateur
  console.log(sauceObject);
  const sauce = new Sauce({ 
    ...sauceObject, 
    userId: req.auth.userId,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [], 
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save() // enregistre la sauce dans la base de données
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" }); // si ok alors message validation
    })
    .catch((error) => {
      res.status(400).json({ error }); // sinon bad message
    });
};

// Récupération d'une seule sauce spécifique
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ // recherche dans base de donée une sauce grace a son id
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce); // réussite
    })
    .catch((error) => {
      res.status(404).json({ // échec
        error: error,
      });
    });
};

// Mettre a jour une sauce (la modification) 
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file // création de l'objet
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId; // ID user est supprimé de l'objet sauce
  Sauce.findOne({ _id: req.params.id }) // recherche de la sauce avec .findOne
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) { // je compare userId de la sauce et de l'auth pour verifier si l'utilisateur est autorisé
        res.status(401).json({ message: "Not authorized" }); // user non autorisé 
      } else {
        Sauce.updateOne( // mise a jour de la sauce
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" })) // la sauce a été modifié
          .catch((error) => res.status(401).json({ error })); // modification a échoué
      }
    })
    .catch((error) => {
      res.status(400).json({ error }); // erreur de la fonction
    });
};

// suppression d'une sauce de la base de données
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // recherche de la sauce avec .findOne
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) { // je compare userId de la sauce et de l'auth pour verifier si l'utilisateur est autorisé
        res.status(401).json({ message: "Not authorized" }); // user non autorisé
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => { // suppression de l'images de la base de donnée
          Sauce.deleteOne({ _id: req.params.id }) // .deleteOne supprime la sauce a l'aide de son ID
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" }); // cela a fonctionné 
            })
            .catch((error) => res.status(401).json({ error })); // echec de la suppréssion
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error }); // erreur des l'etape 1
    });
};

// Visibilité de toutes les sauce partagées
exports.getAllSauce = (req, res, next) => {
  Sauce.find() // recherche des sauces dans base de donné
    .then((sauce) => {
      res.status(200).json(sauce); // succée
    })
    .catch((error) => {
      res.status(400).json({ // echec 
        error: error,
      });
    });
};

// like et dislike une sauce 
exports.likeAndDislike = (req, res, next) => {
  const { like } = req.body;
  const userId = req.auth.userId;
  if (![1, 0, -1].includes(like)) { // si different de 1 like / 0 rien / -1 dislike 
    return res 
      .status(403) // code erreur
      .send({ message: "Like/Dislike: Quantité invalide !" }); // message d'erreur
  }
  let likeString = like.toString();
  Sauce.findOne({ _id: req.params.id }) 
    .then((sauce) => {
      if ((sauce.usersLiked.includes(userId) && like === 1 ) || (sauce.usersDisliked.includes(userId)) && like === -1) { // vérification si l'utilisateur et deja dans le tableau des userslikd ou disliked
        return res.status(403).send({ message: "Action déjà effectuée par l'utilisateur !" });
      }
      switch (likeString) { // méthode switch
        // Si la valeur est de 1 donc un like
        case "1": {
          Sauce.updateOne( // mise a jour de la sauce
            {
              _id: req.params.id, // id de la sauce
            },
            {
              $inc: { likes: 1 }, // ajout du like
              $push: { usersLiked: userId }, // push de l'id user dans le tableau des users qui ont like
            }
          )
            .then((sauce) => res.status(200).json({ message: "Like ajouté !" })) // le like a fonctionné
            .catch((error) => res.status(400).json({ error })); // le like à échoué
          break;
        }
        // si la valeur est de -1 donc dislike
        case "-1": {
          Sauce.updateOne( // mise a jour de la sauce
            {
              _id: req.params.id, // id de la sauce
            },
            {
              $inc: { dislikes: 1 }, // ajout dislike
              $push: { usersDisliked: userId }, // push de l'id user dans le tableau des users qui ont dislike
            }
          )
            .then((sauce) => res.status(200).json({ message: "Dislike ajouté !" })) // dislike a fonctionné
            .catch((error) => res.status(400).json({ error })); // dislike a échoué
          break;
        }
        // valeur de 0 pas de like ni de dislike
        default: {
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne( // mise a jour de la sauce
              {
                _id: req.params.id,
              },
              {
                $pull: { usersLiked: userId },
                $inc: { likes: -1 },
              }
            )
              .then((sauce) => {
                res.status(200).json({ message: "Like supprimé !" });
              })
              .catch((error) => res.status(400).json({ error }));
          }
          else if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              {
                _id: req.params.id,
              },
              {
                $pull: { usersDisliked: userId },
                $inc: { dislikes: -1 },
              }
            )
              .then((sauce) => {
                res.status(200).json({ message: "Dislike supprimé !" });
              })
              .catch((error) => res.status(400).json({ error }));
          }
        }
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

