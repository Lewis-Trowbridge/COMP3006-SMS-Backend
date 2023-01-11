import { Router } from 'express'
import { createPost } from '../../controllers/UserController'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/create', createPost)

/* eslint-enable @typescript-eslint/no-misused-promises */

export default router
