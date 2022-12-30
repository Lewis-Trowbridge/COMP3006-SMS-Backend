import { Router } from 'express'
import { newPost } from '../../controllers/ShoppingListController'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/create', newPost)

/* eslint-enable @typescript-eslint/no-misused-promises */

export default router
