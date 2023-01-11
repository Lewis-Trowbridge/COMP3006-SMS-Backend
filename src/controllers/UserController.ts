import { Request, Response } from 'express'
import { UserType } from '../models/User'
import UserService from '../services/UserService'

const service = new UserService()

const createPost = async (req: Request, res: Response): Promise<void> => {
  const {
    username,
    password
  } = req.body
  try {
    await service.create(username, password, UserType.Customer)
    res.sendStatus(201)
  } catch {
    res.sendStatus(304)
  }
}

const loginPost = async (req: Request, res: Response): Promise<void> => {
  const {
    username,
    password
  } = req.body
  const verified = await service.verify(username, password)
  if (verified != null) {
    req.session.user = verified
    res.sendStatus(200)
  } else {
    res.sendStatus(401)
  }
}

export {
  createPost,
  loginPost
}
