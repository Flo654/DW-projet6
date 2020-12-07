import express from "express";
import auth from "../middleware/auth";

const sauceCtrl = require('../controllers/sauce');
const multerStorage = require('../middleware/multer-config'); 
const router = express.Router(); 

router.post('/',  auth, multerStorage, sauceCtrl.createSauce);
router.put('/:id', auth, multerStorage, sauceCtrl.updateSauce);
router.get('/', auth, sauceCtrl.readAllSauces);
router.get('/:id',auth, sauceCtrl.readOneSauce);
router.delete('/:id',auth, multerStorage, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeOrDislikeSauce);


module.exports = router;

