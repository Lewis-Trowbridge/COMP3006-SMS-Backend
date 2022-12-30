import { Schema } from 'mongoose'

interface IShoppingListItem {
  text: string
  quantity: number
}

const ShoppingListItemSchema = new Schema<IShoppingListItem>({
  quantity: { default: 0, required: true, type: Number },
  text: { default: '', required: true, type: String }
})

export {
  IShoppingListItem,
  ShoppingListItemSchema
}
