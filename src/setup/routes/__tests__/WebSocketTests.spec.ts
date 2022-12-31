import mongoUnit from 'mongo-unit'
import { connect, connection, Types } from 'mongoose'
import { SocketServerMock } from 'socket.io-mock-ts'
import { resolveChangesSetupSocket } from '../../../controllers/ShoppingListController'
import { Socket } from 'socket.io'
import { IShoppingListItem } from '../../../models/customer/ShoppingListItem'
import { ShoppingList } from '../../../models/customer/ShoppingList'

let mockServerSocket: SocketServerMock

beforeAll(async () => {
  await mongoUnit.start()
  await connect(mongoUnit.getUrl())
}, 30000)

beforeEach(() => {
  mockServerSocket = new SocketServerMock()
  resolveChangesSetupSocket(mockServerSocket as unknown as Socket)
})

describe('SOCKET resolve changes', () => {
  it('joins a given room', async () => {
    const listId = new Types.ObjectId().toString()
    const acknowledge = new Promise<void>(resolve => {
      mockServerSocket.clientMock.on('acknowledge', () => {
        resolve()
      })
    })
    mockServerSocket.clientMock.emit('joinListRoom', listId)

    await acknowledge
    expect(mockServerSocket.rooms).toContain(listId)
  })

  it('resolves given changes', async () => {
    const listId = new Types.ObjectId().toString()
    mockServerSocket.join(listId)

    const acknowledge = new Promise<void>(resolve => {
      mockServerSocket.clientMock.on('acknowledge', () => {
        resolve()
      })
    })

    // TODO: Add test for other sockets if/when possible
    /* Doesn't apply as when sending to a room through a socket, excludes that socket
    const dataPromise = new Promise<IShoppingListItem[]>(resolve => {
      mockServerSocket.clientMock.on('distributeCanonical', (result: IShoppingListItem[]) => {
        resolve(result)
      })
    }) */

    await ShoppingList.create({ _id: listId, created: new Date(), ownerId: new Types.ObjectId() })
    const newChanges: IShoppingListItem = {
      _id: new Types.ObjectId(),
      quantity: 2,
      text: 'newText'
    }

    mockServerSocket.clientMock.emit('resolveChanges', listId, [newChanges])
    await acknowledge
    const updatedList = await ShoppingList.findById(listId)
    console.log(updatedList, newChanges)
    expect(updatedList?.items.length).toBe(1)
    expect(updatedList?.items[0].toObject()).toEqual(newChanges)
  }, 10000)
})

afterEach(async () => {
  await mongoUnit.drop()
})

afterAll(async () => {
  await connection.close()
  await mongoUnit.stop()
})
