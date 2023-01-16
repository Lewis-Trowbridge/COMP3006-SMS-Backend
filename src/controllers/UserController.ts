import { Request, Response } from 'express'
import { Api304Error, Api401Error } from '../setup/exceptions'
import { UserType } from '../models/User'
import UserService from '../services/UserService'

const service = new UserService()

const createPost = async (req: Request, res: Response): Promise<void> => {
  const {
    username,
    password
  } = req.body
  try {
    const user = await service.create(username, password, UserType.Customer)
    req.session.user = user
    res.status(201).json({ type: user.type })
  } catch {
    throw new Api304Error()
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
    res.status(200).json({ type: verified.type })
  } else {
    throw new Api401Error()
  }
}

const logoutGet = async (req: Request, res: Response): Promise<void> => {
  req.session.user = undefined
  res.sendStatus(204)
}

const searchGet = async (req: Request<{}, {}, {}, { name: string }>, res: Response): Promise<void> => {
  const result = await service.search(req.query.name)
  res.status(200).json(result)
}

export {
  createPost,
  loginPost,
  logoutGet,
  searchGet
}
