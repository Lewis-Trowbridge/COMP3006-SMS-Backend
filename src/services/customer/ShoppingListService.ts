import { HydratedDocument, Types } from 'mongoose'
import { IShoppingList, ShoppingList } from '../../models/customer/ShoppingList'
import { Api304Error, Api404Error } from '../../setup/exceptions'
import { IShoppingListItem } from '../../models/customer/ShoppingListItem'
import { User } from '../../models/User'

export default class ShoppingListService {
  async new (ownerId: string): Promise<HydratedDocument<IShoppingList>> {
    return await ShoppingList.create({ ownerId })
  }

  async get (listId: string): Promise<HydratedDocument<IShoppingList> | null> {
    return await ShoppingList.findById(listId)
  }

  async listAll (ownerId: string): Promise<Array<HydratedDocument<IShoppingList>>> {
    return await ShoppingList.find({ ownerId })
  }

  async addEditor (userId: string, listId: Types.ObjectId): Promise<void> {
    const list = await ShoppingList.findById(listId)
    const userToAdd = await User.findById(userId)
    if (list == null) {
      throw new Api404Error('List not found.')
    }
    if (userToAdd == null) {
      throw new Api404Error('User not found.')
    }
    if (list.editors.includes(userToAdd.id) || list.ownerId.toString() === userToAdd.id) {
      throw new Api304Error('User already has permission to edit this list.')
    }
    list.editors.push(userToAdd.id)
    await list.save()
  }

  async resolveChanges (listId: string, changes: IShoppingListItem[]): Promise<HydratedDocument<IShoppingList> | null> {
    const list = await ShoppingList.findById(listId)
    if (list == null) {
      return null
    }
    for (const change of changes) {
      if (change._id.toString() === '') {
        change._id = new Types.ObjectId()
      }
      const item = list.items.find(item => item._id.toString() === change._id.toString())
      if (item === undefined) {
        list.items.push(change)
      } else {
        item.text = change.text
        item.quantity = change.quantity
      }
    }
    await list.save()
    return await ShoppingList.findById(listId)
  }
}
