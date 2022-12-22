import { HydratedDocument } from 'mongoose'
import { IItem, Item } from '../../models/staff/Item'
import escapeStringRegexp from 'escape-string-regexp'

export default class ItemService {
  async get (id: string): Promise<HydratedDocument<IItem> | null> {
    return await Item.findById(id)
  }

  async create (name: string,
    barcode: string,
    position: string,
    stock: number): Promise<HydratedDocument<IItem>> {
    return await Item.create({ barcode, name, position, stock })
  }

  async findByBarcode (barcode: string): Promise<HydratedDocument<IItem> | null> {
    return await Item.findOne({ barcode })
  }

  async findByName (name: string): Promise<Array<HydratedDocument<IItem>> | null> {
    const searchRegex = new RegExp(escapeStringRegexp(name) + '*.')
    return await Item.find({ name: { $regex: searchRegex } }).limit(5)
  }
}
