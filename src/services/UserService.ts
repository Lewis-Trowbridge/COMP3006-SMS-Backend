import { hash } from 'argon2'
import { HydratedDocument } from 'mongoose'
import { IUser, User, UserType } from '../models/User'

export default class UserService {
  async create (username: string, password: string, type = UserType.Customer): Promise<HydratedDocument<IUser>> {
    const hashedPassword = await this.hashPassword(password)
    return await User.create({ password: hashedPassword, type, username })
  }

  private async hashPassword (password: string): Promise<string> {
    return await hash(password)
  }
}
