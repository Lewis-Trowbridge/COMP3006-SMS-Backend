import { Schema, Types } from 'mongoose'

interface IShoppingListItem {
  _id: Types.ObjectId
  text: string
  quantity: number
}

const EmptyAllowedString = Schema.Types.String
EmptyAllowedString.checkRequired(v => typeof v === 'string')

const ShoppingListItemSchema = new Schema<IShoppingListItem>({
  quantity: { default: 0, required: true, type: Number },
  text: { default: '', required: true, type: EmptyAllowedString }
})

export {
  IShoppingListItem,
  ShoppingListItemSchema
}
