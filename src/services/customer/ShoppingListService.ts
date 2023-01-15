import { HydratedDocument, Types } from 'mongoose'
import { IShoppingList, ShoppingList } from '../../models/customer/ShoppingList'
import { Api304Error, Api403Error, Api404Error } from '../../setup/exceptions'
import { IShoppingListItem } from '../../models/customer/ShoppingListItem'
import { IUser, User } from '../../models/User'

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

  async addEditor (username: string, listId: Types.ObjectId): Promise<void> {
    const list = await ShoppingList.findById(listId)
    const userToAdd = await User.findOne({ username })
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
    for (const item of list.items) {
      // If the item's list ID does not appear in the changes
      if (!(changes.some(change => change._id.toString() === item._id.toString()))) {
        list.items.remove(item)
      }
    }
    for (const change of changes) {
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

  async userHasPermissionOnList (user: IUser, listId: string): Promise<void> {
    const list = await ShoppingList.findById(listId)
    // If user is not the owner or is not an editor of the list
    if (!(list?.ownerId.toString() === user._id.toString() || ((list?.editors.map(id => id.toString()).includes(user._id.toString())) ?? false))) {
      throw new Api403Error('User does not have permission to use this list.')
    }
  }
}
