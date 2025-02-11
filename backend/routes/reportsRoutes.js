import { Router } from 'express';
const router = Router();
import { getReports, getReportById, getReportsByUser, createReport, updateReport, deleteReport } from '../controllers/reportsController.js';
import { tokenChecker, verifyRole } from '../authentication/verification.js';

router.get('/', tokenChecker, verifyRole('operator'), getReports);
router.get('/myReports', tokenChecker, verifyRole('citizen'), getReportsByUser);
router.get('/:id', tokenChecker, verifyRole('operator'), getReportById);
router.post('/', tokenChecker, verifyRole('citizen'), createReport);
router.put('/:id', tokenChecker, verifyRole('operator'), updateReport);
router.delete('/:id', tokenChecker, verifyRole('operator'), deleteReport);

export default router;
