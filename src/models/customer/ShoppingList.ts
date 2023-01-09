import { IShoppingListItem, ShoppingListItemSchema } from './ShoppingListItem'
import { model, Model, Schema, Types } from 'mongoose'

interface IShoppingList {
  ownerId: string
  editors: string[]
  created: Date
  updated: Date
  items: IShoppingListItem[]
}

const ShoppingListSchema = new Schema<IShoppingList>({
  editors: { default: [], required: true, type: [String] },
  items: { default: [], required: true, type: [ShoppingListItemSchema] },
  ownerId: { required: true, type: String }
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
