import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import SocketIO from 'socket.io'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents } from './customer/socketEvents'
import { connect } from 'mongoose'
import { URLS } from './constants'
import itemRoutes from './setup/routes/itemRoutes'

const app: express.Express = express()
app.use(bodyParser.json({}))
app.use('/items', itemRoutes)

const server: http.Server = http.createServer(app)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const io = new SocketIO.Server<ServerToClientEvents, ClientToServerEvents, InterServerEvents>(server)

const connectionPromise = connect(URLS.MONGO)

export {
  app,
  connectionPromise,
  server,
  io
}
