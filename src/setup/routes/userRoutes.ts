import { Router } from 'express'
import { createPost, loginPost } from '../../controllers/UserController'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/create', createPost)

router.post('/login', loginPost)

/* eslint-enable @typescript-eslint/no-misused-promises */

export default router
