import { Router } from 'express'
import { addEditorPatch, getListGet, listAllGet, newPost } from '../../controllers/ShoppingListController'
import { query, body } from 'express-validator'
import validateRequest from '../handlers/validateRequest'
import { customerTypeRequiredHandler, loggedInRequiredHandler } from '../handlers/userTypeHandler'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/create',
  loggedInRequiredHandler, customerTypeRequiredHandler,
  newPost)

router.get('/get', query('listId').isLength({ min: 1 }).trim(), validateRequest,
  loggedInRequiredHandler, customerTypeRequiredHandler,
  getListGet)

router.get('/list-all', loggedInRequiredHandler, customerTypeRequiredHandler,
  listAllGet)

router.patch('/add-editor', body(['userId', 'listId']).isLength({ min: 1 }).trim(), validateRequest,
  loggedInRequiredHandler, customerTypeRequiredHandler,
  addEditorPatch)

/* eslint-enable @typescript-eslint/no-misused-promises */

export default router
