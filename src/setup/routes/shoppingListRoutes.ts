import { Router } from 'express'
import { addEditorPatch, getListGet, listAllGet, newPost } from '../../controllers/ShoppingListController'
import { query, body } from 'express-validator'
import validateRequest from './validateRequest'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/create', newPost)

router.get('/get', query('listId').isLength({ min: 1 }).trim(),
  getListGet)

router.get('/list-all', listAllGet)

router.patch('/add-editor', body(['userId', 'listId']).isLength({ min: 1 }).trim(),
  validateRequest, addEditorPatch)

/* eslint-enable @typescript-eslint/no-misused-promises */

export default router
