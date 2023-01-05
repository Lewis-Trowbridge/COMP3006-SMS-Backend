import { Request, Response } from 'express'
import ShoppingListService from '../services/customer/ShoppingListService'
import { mongoExcludeVersionToObjectOptions } from '../constants'
import { Socket } from 'socket.io'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents } from '../setup/socketEvents'

const service = new ShoppingListService()

const newPost = async (req: Request, res: Response): Promise<void> => {
  const result = await service.new()
  res.status(201).json(result.toObject(mongoExcludeVersionToObjectOptions))
}

const getListGet = async (req: Request<{}, {}, {}, { listId: string }>, res: Response): Promise<void> => {
  const { listId } = req.query
  const result = await service.get(listId)
  if (result == null) {
    res.sendStatus(404)
  } else {
    res.status(200).json(result.toObject(mongoExcludeVersionToObjectOptions))
  }
}

const listAllGet = async (req: Request, res: Response): Promise<void> => {
  const results = await service.listAll()
  res.status(200).json(results.map(result => result.toObject(mongoExcludeVersionToObjectOptions)))
}

const addEditorPatch = async (req: Request, res: Response): Promise<void> => {
  const {
    userId,
    listId
  } = req.body
  await service.addEditor(userId, listId)
  res.status(204).send()
}

const resolveChangesSetupSocket = (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents>): void => {
  socket.on('joinListRoom', async (listId) => {
    await socket.join(listId)
    socket.emit('acknowledge')
  })
  socket.on('resolveChanges', async (listId, changes) => {
    const updatedList = await service.resolveChanges(listId, changes)
    socket.to(listId).emit('distributeCanonical', updatedList?.items ?? [])
    socket.emit('acknowledge')
  })
}

export {
  getListGet,
  addEditorPatch,
  listAllGet,
  newPost,
  resolveChangesSetupSocket
}
