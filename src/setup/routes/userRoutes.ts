import { Router } from 'express'
import { createPost, loginPost, logoutGet, searchGet } from '../../controllers/UserController'
import { customerTypeRequiredHandler, loggedInRequiredHandler } from '../handlers/userTypeHandler'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/create', createPost)

router.post('/login', loginPost)

router.get('/logout', logoutGet)

router.get('/search', loggedInRequiredHandler, customerTypeRequiredHandler,
  searchGet)

/* eslint-enable @typescript-eslint/no-misused-promises */

export default router
