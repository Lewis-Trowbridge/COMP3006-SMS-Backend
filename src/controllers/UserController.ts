import { Request, Response } from 'express'
import { mongoExcludeVersionToObjectOptions } from '../constants'
import { UserType } from '../models/User'
import UserService from '../services/UserService'

const service = new UserService()

const createPost = async (req: Request, res: Response): Promise<void> => {
  const {
    username,
    password
  } = req.body
  const user = await service.create(username, password, UserType.Customer)
  res.status(201).json(user.toObject(mongoExcludeVersionToObjectOptions))
}

export {
  createPost
}
