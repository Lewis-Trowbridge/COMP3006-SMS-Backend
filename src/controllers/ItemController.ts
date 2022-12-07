import { Router } from 'express'
import ItemService from '../services/staff/ItemService'

const router = Router()
const service = new ItemService()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/create', async (req, res) => {
  const {
    name,
    position,
    barcode,
    stock
  } = req.body
  const model = await service.create(name, barcode, position, stock)
  res.status(201).json(model)
})

export default router
