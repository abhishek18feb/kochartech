import { Router } from 'express'
import { addReport, addFeedback, genReport } from '../controllers/reports';
 
const router: Router = Router()


router.post('/add-report', addReport);

router.post('/add-feedback', addFeedback);

router.get('/gen-reports/:type', genReport);

export default router
