import { Router } from 'express'
import { createPost, loginPost, searchGet } from '../../controllers/UserController'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/create', createPost)

router.post('/login', loginPost)

router.get('/search', searchGet)

/* eslint-enable @typescript-eslint/no-misused-promises */

export default router
