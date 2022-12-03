import express from 'express'
import http from 'http'
import SocketIO from 'socket.io'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents } from './customer/socketEvents'

const app: express.Express = express()

const server: http.Server = http.createServer(app)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const io = new SocketIO.Server<ServerToClientEvents, ClientToServerEvents, InterServerEvents>(server)

server.listen(9000)
