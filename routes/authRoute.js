const express = require("express");
const { createUser } = require("../controllers/userCtrl");

const router = express.Router();

router.post('/register', createUser);
module.exports = router;