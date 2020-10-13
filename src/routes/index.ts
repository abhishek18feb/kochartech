import { Router } from 'express'
import { genReport } from '../controllers/reports';
 
const router: Router = Router()



router.get('/gen-reports/:type', genReport);

export default router
