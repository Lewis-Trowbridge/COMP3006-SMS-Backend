import { Router } from 'express'
import { addEditorPatch, newPost } from '../../controllers/ShoppingListController'
import { body } from 'express-validator'
import validateRequest from './validateRequest'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/create', newPost)

router.post('/add-editor', body(['userId', 'listId']).isLength({ min: 1 }).trim(),
  validateRequest, addEditorPatch)

/* eslint-enable @typescript-eslint/no-misused-promises */

export default router
