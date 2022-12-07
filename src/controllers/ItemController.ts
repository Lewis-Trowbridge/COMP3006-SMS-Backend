import ItemService from '../services/staff/ItemService'
import { Request, Response } from 'express'

const service = new ItemService()

const createPost = async (req: Request, res: Response): Promise<void> => {
  const {
    name,
    position,
    barcode,
    stock
  } = req.body
  const model = await service.create(name, barcode, position, stock)
  res.status(201).json(model)
}

export {
  createPost
}
