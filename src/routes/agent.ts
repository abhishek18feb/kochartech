import { Router } from 'express'
import { getAgents } from '../controllers/agents';
 
const router: Router = Router()

router.get('/agents', getAgents)

export default router
