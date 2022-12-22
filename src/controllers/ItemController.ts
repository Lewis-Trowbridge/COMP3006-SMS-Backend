import ItemService from '../services/staff/ItemService'
import { Request, Response } from 'express'
import { ToObjectOptions } from 'mongoose'

const service = new ItemService()

const transformOptions: ToObjectOptions = {
  transform: (doc, ret) => {
    delete ret._id
  },
  versionKey: false
}

const createPost = async (req: Request, res: Response): Promise<void> => {
  const {
    name,
    position,
    barcode,
    stock
  } = req.body
  const model = await service.create(name, barcode, position, stock)
  res.status(201).json(model.toObject(transformOptions))
}

const findByBarcodeGet = async (req: Request<{}, {}, {}, { barcode: string }>, res: Response): Promise<void> => {
  const { barcode } = req.query
  const model = await service.findByBarcode(barcode)
  if (model != null) {
    res.status(200).json(model.toObject(transformOptions))
  } else {
    res.status(404)
  }
}

export {
  createPost,
  findByBarcodeGet
}
