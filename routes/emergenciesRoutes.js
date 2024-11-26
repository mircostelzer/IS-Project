const express = require('express');
const router = express.Router();
const { getEmergencies, getEmergencyById, createEmergency, updateEmergency, deleteEmergency } = require('../controllers/emergenciesController');
const { tokenChecker, verifyRole } = require('../authentication/verification');

router.get('/', getEmergencies);
router.get('/:id', getEmergencyById);
router.post('/', tokenChecker, verifyRole('operator'), createEmergency);
router.put('/:id', tokenChecker, verifyRole('operator'), updateEmergency);
router.delete('/:id', tokenChecker, verifyRole('operator'), deleteEmergency);

module.exports = router;
