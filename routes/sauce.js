const express = require("express"); // importe le module Express.js et le stocke dans une constante nommée express.
const router = express.Router(); // // module router d'express 

const auth = require("../middleware/auth"); // importe un module contenant un middleware d'authentification et le stocke dans une constante nommée auth.
const multer = require("../middleware/multer-config"); //  importe un module contenant la configuration de Multer ( middleware pour la gestion des fichiers entrants dans les requêtes HTTP) et le stocke dans une constante nommée multer.
const sauceCtrl = require("../controllers/sauce"); // importe un module contenant les contrôleurs pour les opérations liées aux sauces et le stocke dans une constante nommée sauceCtrl.

// définit une route pour gérer les requêtes HTTP GET à l'endpoint "/" en utilisant le middleware d'authentification auth et le contrôleur getAllSauce du module sauceCtrl.
router.get("/", auth, sauceCtrl.getAllSauce); 
// définit une route pour gérer les requêtes HTTP POST à l'endpoint "/" en utilisant le middleware d'authentification auth, le middleware Multer multer et le contrôleur createSauce du module sauceCtrl.
router.post("/", auth, multer, sauceCtrl.createSauce);
// définit une route pour gérer les requêtes HTTP GET à l'endpoint "/:id" en utilisant le middleware d'authentification auth et le contrôleur getOneSauce du module sauceCtrl.
router.get("/:id", auth, sauceCtrl.getOneSauce);
// définit une route pour gérer les requêtes HTTP POST à l'endpoint "/:id/like" en utilisant le middleware d'authentification auth et le contrôleur likeAndDislike du module sauceCtrl.
router.post("/:id/like", auth, sauceCtrl.likeAndDislike);
// définit une route pour gérer les requêtes HTTP PUT à l'endpoint "/:id" en utilisant le middleware d'authentification auth, le middleware Multer multer et le contrôleur modifySauce du module sauceCtrl.
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
// définit une route pour gérer les requêtes HTTP DELETE à l'endpoint "/:id" en utilisant le middleware d'authentification auth et le contrôleur deleteSauce du module sauceCtrl.
router.delete("/:id", auth, sauceCtrl.deleteSauce);

module.exports = router; // exporte l'objet router pour être utilisé par d'autres modules san l'app
