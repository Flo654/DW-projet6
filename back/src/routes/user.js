// routes user

import express from "express";
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.createUser);
router.post('/login', userCtrl.readUser);

export default router;