const express = require("express");
const { createUser, login, getAllUsers, getUser, deleteUser, updateUser } = require("../controllers/userCtrl");

const router = express.Router();

router.post('/register', createUser);
router.post('/login', login);
router.get('/allUsers', getAllUsers);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);
router.patch('/:id', updateUser);

module.exports = router;