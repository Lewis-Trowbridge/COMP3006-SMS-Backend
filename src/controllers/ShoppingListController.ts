/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from 'express'
import ShoppingListService from '../services/customer/ShoppingListService'
import { mongoExcludeVersionToObjectOptions } from '../constants'
import { Socket } from 'socket.io'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents } from '../setup/socketEvents'
import { Api404Error } from '../setup/exceptions'

const service = new ShoppingListService()

const newPost = async (req: Request, res: Response): Promise<void> => {
  const result = await service.new(req.session.user!._id.toString())
  res.status(201).json(result.toObject(mongoExcludeVersionToObjectOptions))
}

const getListGet = async (req: Request<{}, {}, {}, { listId: string }>, res: Response): Promise<void> => {
  const { listId } = req.query
  await service.userHasPermissionOnList(req.session.user!, listId)
  const result = await service.get(listId)
  if (result == null) {
    throw new Api404Error()
  } else {
    res.status(200).json(result.toObject(mongoExcludeVersionToObjectOptions))
  }
}

const listAllGet = async (req: Request, res: Response): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const results = await service.listAll(req.session.user!._id.toString())
  res.status(200).json(results.map(result => result.toObject(mongoExcludeVersionToObjectOptions)))
}

const addEditorPatch = async (req: Request, res: Response): Promise<void> => {
  const {
    userId,
    listId
  } = req.body
  await service.userHasPermissionOnList(req.session.user!, listId)
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
