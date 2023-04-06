const multer = require("multer"); // importe le module multer pour etre utilisé ici

// défini les formats ou type de fichier d'images standartisé du web
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// constante qui spécifie le répertoire de destination + nom du ficher pour les img téléchargés
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); // return vers le dossier du fichier d'images
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); // méthode split pour suppr les espace et les remplacer par des _
    // Par exemple, si un utilisateur télécharge une image nommée my image.png, la fonction filename renommera le fichier en my_image_1617773865459.png (si la date actuelle est le 7 avril 2021 à 13h24 et 25 secondes).
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// exporte une instance multer configurée avec l'instance de stockage storage définie précédemment, et limitée à un seul fichier. L'objet multer est appelé avec la méthode .single() pour spécifier qu'une seule image sera téléchargée à la fois.
module.exports = multer({ storage: storage }).single("image");