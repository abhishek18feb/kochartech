import { Router } from 'express'
import { getTodos, addTodo, updateTodo, deleteTodo } from '../controllers/todos';
import { addReport, addFeedback, genReport } from '../controllers/reports';
 
const router: Router = Router()

router.get('/todos', getTodos)

router.post('/add-todo', addTodo)

router.put('/edit-todo/:id', updateTodo)

router.delete('/delete-todo/:id', deleteTodo)

router.post('/add-report', addReport);

router.post('/add-feedback', addFeedback);

router.get('/gen-reports/:type', genReport);

export default router
