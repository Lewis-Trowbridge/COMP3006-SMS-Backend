import ItemService from '../services/staff/ItemService'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'

const service = new ItemService()

const createPost = async (req: Request, res: Response): Promise<Response> => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

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
