import { IShoppingListItem, ShoppingListItemSchema } from './ShoppingListItem'
import { model, Model, Schema, Types } from 'mongoose'

interface IShoppingList {
  ownerId: string
  editors: string[]
  created: Date
  updated: Date | null
  items: IShoppingListItem[]
}

const ShoppingListSchema = new Schema<IShoppingList>({
  created: { required: true, type: Date },
  editors: { default: [], required: true, type: [String] },
  items: { default: [], required: true, type: [ShoppingListItemSchema] },
  ownerId: { required: true, type: String },
  updated: { required: false, type: Date }
})

interface ShoppingListSubdocumentOverride {
  items: Types.DocumentArray<IShoppingListItem>
}
type ShoppingListModelType = Model<IShoppingList, {}, ShoppingListSubdocumentOverride>

const ShoppingList = model<IShoppingList, ShoppingListModelType>('shopping-lists', ShoppingListSchema)

export {
  ShoppingList,
  IShoppingList
}
