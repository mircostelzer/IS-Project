import { Router } from 'express';
const router = Router();
import { getEmergencies, getEmergencyById, createEmergency, updateEmergency, deleteEmergency } from '../controllers/emergenciesController.js';
import { tokenChecker, verifyRole } from '../authentication/verification.js';

router.get('/', getEmergencies);
router.get('/:id', getEmergencyById);
router.post('/', tokenChecker, verifyRole('operator'), createEmergency);
router.put('/:id', tokenChecker, verifyRole('operator'), updateEmergency);
router.delete('/:id', tokenChecker, verifyRole('operator'), deleteEmergency);

export default router;
