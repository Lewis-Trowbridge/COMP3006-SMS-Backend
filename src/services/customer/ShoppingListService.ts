import { HydratedDocument } from 'mongoose'
import { IShoppingList, ShoppingList } from '../../models/customer/ShoppingList'

export default class ShoppingListService {
  async new (): Promise<HydratedDocument<IShoppingList>> {
    // TODO: Replace with session value when implemented
    const userId = 'user'
    return await ShoppingList.create({ created: new Date(), ownerId: userId })
  }
}
