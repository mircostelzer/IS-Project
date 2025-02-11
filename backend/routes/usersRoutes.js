import { Router } from 'express';
const router = Router();
import { getUsers, getUserById, createUser, updatePassword, deleteUser } from '../controllers/usersController.js';
import { tokenChecker, verifyRole } from '../authentication/verification.js';

router.get('/', tokenChecker, verifyRole('operator'), getUsers);
router.get('/:id', tokenChecker, verifyRole('operator'), getUserById);
router.post('/', createUser);
router.put('/:userId/password', tokenChecker, updatePassword);
router.delete('/:id', tokenChecker, verifyRole('operator'), deleteUser);

export default router;
