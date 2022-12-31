import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import http from 'http'
import SocketIO from 'socket.io'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents } from './setup/socketEvents'
import { connect } from 'mongoose'
import { URLS } from './constants'
import itemRoutes from './setup/routes/itemRoutes'
import shoppingListRoutes from './setup/routes/shoppingListRoutes'
import { resolveChangesSetupSocket } from './controllers/ShoppingListController'

const app: express.Express = express()
app.use(cors({
  origin: ['http://localhost:4200', 'https://storage.googleapis.com']
}))
app.use(bodyParser.json({}))
app.use('/items', itemRoutes)
app.use('/lists', shoppingListRoutes)

const server: http.Server = http.createServer(app)

const io = new SocketIO.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>(server)
io.on('connection', socket => {
  resolveChangesSetupSocket(socket)
  socket.emit('acknowledge')
})

const connectionPromise = connect(URLS.MONGO)

export {
  app,
  connectionPromise,
  server,
  io
}
