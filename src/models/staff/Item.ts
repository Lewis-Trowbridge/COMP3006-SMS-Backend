import { Schema, model } from 'mongoose'

interface IItem {
  name: string
  barcode_number: string
  stock: number
  position: string
}

const ItemSchema = new Schema<IItem>({
  barcode_number: { required: true, type: String },
  name: { required: true, type: String },
  position: { required: true, type: String },
  stock: { required: true, type: Number }
})

const Item = model('items', ItemSchema)

export {
  Item,
  IItem
}
