import { HydratedDocument } from 'mongoose'
import { IItem, Item } from '../../models/staff/Item'

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
}
