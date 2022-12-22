import { Router } from 'express'
import { createPost } from '../../controllers/ItemController'
import { body } from 'express-validator'
import validateRequest from './validateRequest'

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/create', body('stock').isInt({ min: 0 }), validateRequest, createPost)

export default router
