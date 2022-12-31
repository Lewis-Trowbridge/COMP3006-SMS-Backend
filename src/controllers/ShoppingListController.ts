import { Request, Response } from 'express'
import ShoppingListService from '../services/customer/ShoppingListService'
import { mongoExcludeIdsToObjectOptions } from '../constants'
import { Socket } from 'socket.io'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents } from '../setup/socketEvents'

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
  res.status(204).send()
}

const resolveChangesSetupSocket = (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents>): void => {
  socket.on('joinListRoom', async (listId) => {
    await socket.join(listId)
    socket.emit('acknowledge')
  })
  socket.on('resolveChanges', async (listId, changes) => {
    if (socket.rooms.has(listId)) {
      const updatedList = await service.resolveChanges(listId, changes)
      socket.to(listId).emit('distributeCanonical', updatedList.items)
    }
  })
}

export {
  addEditorPatch,
  newPost,
  resolveChangesSetupSocket
}
