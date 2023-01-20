import { Router } from 'express'
import { body, query } from 'express-validator'
import { createPost, loginPost, logoutGet, searchGet } from '../../controllers/UserController'
import { customerTypeRequiredHandler, loggedInRequiredHandler } from '../handlers/userTypeHandler'
import validateRequest from '../handlers/validateRequest'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/create',
  body(['username', 'password']).isLength({ min: 1 }), validateRequest,
  createPost)

router.post('/login',
  body(['username', 'password']).isLength({ min: 1 }), validateRequest,
  loginPost)

router.get('/logout', logoutGet)

router.get('/search',
  query('name').isLength({ min: 1 }), validateRequest,
  loggedInRequiredHandler, customerTypeRequiredHandler,
  searchGet)

/* eslint-enable @typescript-eslint/no-misused-promises */

export default router
