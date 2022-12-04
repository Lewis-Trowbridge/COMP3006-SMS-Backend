import { Types } from 'mongoose'
import { IItem, Item } from '../../models/staff/Item'

export default class ItemService {
  async get (id: Types.ObjectId): Promise<IItem | null> {
    return await Item.findOne({ _id: id })
  }
}
