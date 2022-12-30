import ItemService from '../services/staff/ItemService'
import { Request, Response } from 'express'
import { mongoExcludeIdsToObjectOptions } from '../constants'

const service = new ItemService()

const createPost = async (req: Request, res: Response): Promise<void> => {
  const {
    name,
    position,
    barcode,
    stock
  } = req.body
  const model = await service.create(name, barcode, position, stock)
  res.status(201).json(model.toObject(mongoExcludeIdsToObjectOptions))
}

const findByBarcodeGet = async (req: Request<{}, {}, {}, { barcode: string }>, res: Response): Promise<void> => {
  const { barcode } = req.query
  const model = await service.findByBarcode(barcode)
  if (model != null) {
    res.status(200).json(model.toObject(mongoExcludeIdsToObjectOptions))
  } else {
    res.status(404)
  }
}

const findByNameGet = async (req: Request<{}, {}, {}, { name: string }>, res: Response): Promise<void> => {
  const { name } = req.query
  const models = await service.findByName(name)
  const results = models != null ? models.map(model => model.toObject(mongoExcludeIdsToObjectOptions)) : []
  res.status(200).json({ results })
}

export {
  createPost,
  findByBarcodeGet,
  findByNameGet
}
