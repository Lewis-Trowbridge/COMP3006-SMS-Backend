import { Router } from 'express'
import { createPost } from '../../controllers/ItemController'
import { body } from 'express-validator'

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/create', body('stock').isInt({ min: 0 }), createPost)

export default router
