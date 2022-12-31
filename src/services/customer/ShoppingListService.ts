import { HydratedDocument, Types } from 'mongoose'
import { IShoppingList, ShoppingList } from '../../models/customer/ShoppingList'
import { Api304Error, Api404Error } from '../../setup/exceptions'

export default class ShoppingListService {
  async new (): Promise<HydratedDocument<IShoppingList>> {
    // TODO: Replace with session value when implemented
    const userId = 'user'
    return await ShoppingList.create({ created: new Date(), ownerId: userId })
  }

  async addEditor (userId: string, listId: Types.ObjectId): Promise<void> {
    const list = await ShoppingList.findById(listId)
    if (list == null) {
      throw new Api404Error('List not found.')
    }
    if (list.editors.includes(userId) || list.ownerId === userId) {
      throw new Api304Error('User already has permission to edit this list.')
    }
    list.editors.push(userId)
    list.updated = new Date()
    await list.save()
  }
}
