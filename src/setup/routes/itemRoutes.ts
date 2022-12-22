import { Router } from 'express'
import { createPost } from '../../controllers/ItemController'
import { body } from 'express-validator'
import validateRequest from './validateRequest'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/create', body(['name', 'barcode', 'position']).isLength({ min: 1 }).trim(),
  body('stock').isInt({ min: 0 }), validateRequest, createPost)
/* eslint-enable @typescript-eslint/no-misused-promises */

export default router
