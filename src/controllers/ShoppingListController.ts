import { Request, Response } from 'express'
import ShoppingListService from '../services/customer/ShoppingListService'
import { mongoExcludeIdsToObjectOptions } from '../constants'

const service = new ShoppingListService()

const newPost = async (req: Request, res: Response): Promise<void> => {
  const result = await service.new()
  res.status(201).json(result.toObject(mongoExcludeIdsToObjectOptions))
}

const addEditorPatch = async (req: Request, res: Response): Promise<void> => {
  const {
    userId,
    listId
  } = req.body
  await service.addEditor(userId, listId)
  res.status(204)
}

export {
  addEditorPatch,
  newPost
}
