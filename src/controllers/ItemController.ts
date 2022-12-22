import ItemService from '../services/staff/ItemService'
import { Request, Response } from 'express'

const service = new ItemService()

const createPost = async (req: Request, res: Response): Promise<Response> => {
  const {
    name,
    position,
    barcode,
    stock
  } = req.body
  const model = await service.create(name, barcode, position, stock)
  return res.status(201).json(model.toObject({
    transform: (doc, ret) => {
      delete ret._id
    },
    versionKey: false
  }))
}

export {
  createPost
}
