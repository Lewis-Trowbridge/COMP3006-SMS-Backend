import { Router } from 'express'
import { createPost, findByBarcodeGet, findByNameGet, listAllGet } from '../../controllers/ItemController'
import { body, query } from 'express-validator'
import validateRequest from '../handlers/validateRequest'
import { loggedInRequiredHandler, staffTypeRequiredHandler } from '../handlers/userTypeHandler'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/create',
  body(['name', 'barcode', 'position']).isLength({ min: 1 }).trim(), body('stock').isInt({ min: 0 }), validateRequest,
  loggedInRequiredHandler, staffTypeRequiredHandler,
  createPost)

router.get('/list-all',
  loggedInRequiredHandler, staffTypeRequiredHandler,
  listAllGet)

router.get('/find-barcode',
  query('barcode').isLength({ min: 1 }).trim(), validateRequest,
  loggedInRequiredHandler, staffTypeRequiredHandler,
  findByBarcodeGet)

router.get('/find-name',
  query('name').isLength({ min: 1 }).trim(), validateRequest,
  loggedInRequiredHandler,
  findByNameGet)
/* eslint-enable @typescript-eslint/no-misused-promises */

export default router
