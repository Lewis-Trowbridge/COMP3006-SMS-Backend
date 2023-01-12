// Import without using to patch Express
import 'express-async-errors'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import http from 'http'
import SocketIO from 'socket.io'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents } from './setup/socketEvents'
import { connect } from 'mongoose'
import { sessionSecret, URLS } from './constants'
import itemRoutes from './setup/routes/itemRoutes'
import shoppingListRoutes from './setup/routes/shoppingListRoutes'
import userRoutes from './setup/routes/userRoutes'
import { resolveChangesSetupSocket } from './controllers/ShoppingListController'
import { IUser } from './models/User'
import session from 'express-session'
import connectMongo from 'connect-mongodb-session'

const MongoStore = connectMongo(session)

if (sessionSecret === undefined) {
  throw new Error('SessionSecret environment variable not set.')
}

const mongoStore = new MongoStore({
  collection: 'sessions',
  uri: URLS.MONGO
})

const app: express.Express = express()
app.use(cors({
  origin: URLS.ALLOWED_ORIGIN
}))
app.use(bodyParser.json({}))
app.use(session({
  cookie: {
    // Set age to 1 hour
    maxAge: 1000 * 60 * 60
  },
  resave: true,
  saveUninitialized: true,
  secret: sessionSecret,
  store: mongoStore

}))
app.use('/items', itemRoutes)
app.use('/lists', shoppingListRoutes)
app.use('/users', userRoutes)

declare module 'express-session' {
  interface SessionData {
    user: IUser
  }
}

const server: http.Server = http.createServer(app)

const io = new SocketIO.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>(server, {
  cors: {
    // Despite information online, Socket.io CORS does not appear to work with multiple origins
    origin: URLS.ALLOWED_ORIGIN
  }
})
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
