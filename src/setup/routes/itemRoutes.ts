import { Router } from 'express'
import { createPost, findByBarcodeGet, findByNameGet, listAllGet } from '../../controllers/ItemController'
import { body, query } from 'express-validator'
import validateRequest from './validateRequest'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/create',
  body(['name', 'barcode', 'position']).isLength({ min: 1 }).trim(),
  body('stock').isInt({ min: 0 }), validateRequest, createPost)

router.get('/list-all', listAllGet)

router.get('/find-barcode',
  query('barcode').isLength({ min: 1 }).trim(),
  validateRequest, findByBarcodeGet)

router.get('/find-name',
  query('name').isLength({ min: 1 }).trim(),
  validateRequest, findByNameGet)
/* eslint-enable @typescript-eslint/no-misused-promises */

export default router
