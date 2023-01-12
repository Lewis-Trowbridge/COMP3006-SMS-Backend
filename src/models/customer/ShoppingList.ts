import { IShoppingListItem, ShoppingListItemSchema } from './ShoppingListItem'
import { model, Model, Schema, Types } from 'mongoose'
import { IUser } from '../User'

interface IShoppingList {
  ownerId: IUser['_id']
  editors: Array<IUser['_id']>
  created: Date
  updated: Date
  items: IShoppingListItem[]
}

const ShoppingListSchema = new Schema<IShoppingList>({
  editors: [{ ref: 'users', required: true, type: Schema.Types.ObjectId }],
  items: { default: [], required: true, type: [ShoppingListItemSchema] },
  ownerId: { ref: 'users', required: true, type: Schema.Types.ObjectId }
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

// Workaround for Mongoose in Typescript: https://mongoosejs.com/docs/typescript/subdocuments.html
interface ShoppingListSubdocumentOverride {
  items: Types.DocumentArray<IShoppingListItem>
}
type ShoppingListModelType = Model<IShoppingList, {}, ShoppingListSubdocumentOverride>

const ShoppingList = model<IShoppingList, ShoppingListModelType>('shopping-lists', ShoppingListSchema)

export {
  ShoppingList,
  IShoppingList
}
