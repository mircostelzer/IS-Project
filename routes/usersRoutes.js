const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, deleteUser } = require('../controllers/usersController');
const { tokenChecker, verifyRole} = require('../authentication/verification');

router.get('/', tokenChecker, verifyRole('operator'), getUsers);
router.get('/:id', tokenChecker, verifyRole('operator'), getUserById);
router.post('/', createUser);
router.delete('/:id', tokenChecker, verifyRole('operator'), deleteUser);

module.exports = router;
