/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from 'express'
import ShoppingListService from '../services/customer/ShoppingListService'
import { mongoExcludeVersionToObjectOptions } from '../constants'
import { Socket } from 'socket.io'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents } from '../setup/socketEvents'
import { IUser } from '../models/User'
import { Types } from 'mongoose'

interface IShoppingListReduced {
  _id: string
  editors: Types.ObjectId[]
  ownerId: string
  created: Date
  updated: Date
}

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
    res.sendStatus(404)
  } else {
    res.status(200).json(result.toObject(mongoExcludeVersionToObjectOptions))
  }
}

const listAllGet = async (req: Request, res: Response): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const results = await service.listAll(req.session.user!._id.toString())
  const resultsWithOwnerInfo = results.map(async (result) => await result.populate<{ ownerId: IUser }>('ownerId'))
  const reducedResults = await Promise.all(resultsWithOwnerInfo.map(async (result) => {
    const resultObject = (await result).toObject(mongoExcludeVersionToObjectOptions)
    const reduced: IShoppingListReduced = {
      _id: resultObject._id.toString(),
      created: resultObject.created,
      editors: resultObject.editors,
      // TODO: Hack to get populated data
      ownerId: (resultObject.ownerId as unknown as IUser).username,
      updated: resultObject.updated
    }
    return reduced
  }))
  res.status(200).json(reducedResults)
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
