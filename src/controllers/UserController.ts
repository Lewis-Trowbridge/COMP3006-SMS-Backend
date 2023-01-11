import { Request, Response } from 'express'
import { UserType } from '../models/User'
import UserService from '../services/UserService'

const service = new UserService()

const createPost = async (req: Request, res: Response): Promise<void> => {
  const {
    username,
    password
  } = req.body
  await service.create(username, password, UserType.Customer)
  res.sendStatus(201)
}

export {
  createPost
}
