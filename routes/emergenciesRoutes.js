const express = require('express');
const router = express.Router();
const { getEmergencies, getEmergencyById, createEmergency, updateEmergency, deleteEmergency } = require('../controllers/emergenciesController');

router.get('/', getEmergencies);
router.get('/:id', getEmergencyById);
router.post('/', createEmergency);
router.put('/:id', updateEmergency);
router.delete('/:id', deleteEmergency);

module.exports = router;
