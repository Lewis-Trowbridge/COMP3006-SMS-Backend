import { Router } from 'express'
import { createPost } from '../../controllers/ItemController'

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/create', createPost)

export default router
