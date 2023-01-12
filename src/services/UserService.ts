import escapeStringRegexp from '@esm2cjs/escape-string-regexp'
import { hash, verify } from 'argon2'
import { HydratedDocument } from 'mongoose'
import { IUser, User, UserType } from '../models/User'

export default class UserService {
  async create (username: string, password: string, type = UserType.Customer): Promise<HydratedDocument<IUser>> {
    const hashedPassword = await this.hashPassword(password)
    return await User.create({ password: hashedPassword, type, username })
  }

  async verify (username: string, password: string): Promise<HydratedDocument<IUser> | null> {
    const user = await User.findOne({ username })
    if (user != null) {
      if (await verify(user.password, password)) {
        return user
      }
    }
    return null
  }

  async search (query: string): Promise<string[]> {
    const searchRegex = new RegExp(escapeStringRegexp(query) + '*.')
    const foundUsers = await User.find({ username: { $regex: searchRegex } }).limit(5)
    return foundUsers.map(user => user.username)
  }

  private async hashPassword (password: string): Promise<string> {
    return await hash(password)
  }
}
