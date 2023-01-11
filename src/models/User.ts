import { model, Schema, Types } from 'mongoose'

enum UserType {
  Customer,
  Staff
}

interface IUser {
  _id: Types.ObjectId
  username: string
  password: string
  type: UserType
}

const UserSchema = new Schema<IUser>({
  password: { required: true, type: String },
  type: { enum: UserType, required: true, type: Number },
  username: { required: true, type: String, unique: true }
})

const User = model<IUser>('users', UserSchema)

export {
  User,
  IUser,
  UserType
}
