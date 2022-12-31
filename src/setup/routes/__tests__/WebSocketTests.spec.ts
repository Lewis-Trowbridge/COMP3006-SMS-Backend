import mongoUnit from 'mongo-unit'
import { connect, connection } from 'mongoose'
import { SocketServerMock } from 'socket.io-mock-ts'
import { resolveChangesSetupSocket } from '../../../controllers/ShoppingListController'
import { Socket } from 'socket.io'

const mockServerSocket = new SocketServerMock()
resolveChangesSetupSocket(mockServerSocket as unknown as Socket)

beforeAll(async () => {
  await mongoUnit.start()
  await connect(mongoUnit.getUrl())
}, 30000)

describe('SOCKET resolve changes', () => {
  it('joins a given room', async () => {
    const acknowledge = new Promise<void>(resolve => {
      mockServerSocket.clientMock.on('acknowledge', () => {
        resolve()
      })
    })
    mockServerSocket.clientMock.emit('joinListRoom', 'list')

    await acknowledge
    expect(mockServerSocket.rooms).toContain('list')
  })
})

afterEach(async () => {
  await mongoUnit.drop()
})

afterAll(async () => {
  await connection.close()
  await mongoUnit.stop()
})
