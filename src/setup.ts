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
import session, { CookieOptions } from 'express-session'
import connectMongo from 'connect-mongodb-session'
import { exceptionHandler } from './setup/handlers/exceptionHandler'

// Add user info to Typescript config for session
declare module 'express-session' {
  interface SessionData {
    user: IUser
  }
}

// Setup mongo store library with session library
const MongoStore = connectMongo(session)

if (sessionSecret === undefined) {
  throw new Error('SessionSecret environment variable not set.')
}

console.log('NODE_ENV:', process.env.NODE_ENV)

const cookieOptions: CookieOptions = {
  // Set age to 1 hour
  maxAge: 1000 * 60 * 60,
  sameSite: 'none',
  secure: process.env.NODE_ENV === 'production'
}

const mongoStore = new MongoStore({
  collection: 'sessions',
  uri: URLS.MONGO
})

const app: express.Express = express()
app.use(cors({
  credentials: true,
  origin: URLS.ALLOWED_ORIGIN
}))
app.use(bodyParser.json({}))
app.use(session({
  cookie: cookieOptions,
  proxy: process.env.NODE_ENV === 'production',
  resave: true,
  saveUninitialized: true,
  secret: sessionSecret,
  store: mongoStore

}))
app.use('/items', itemRoutes)
app.use('/lists', shoppingListRoutes)
app.use('/users', userRoutes)
app.use(exceptionHandler)

const server: http.Server = http.createServer(app)

const io = new SocketIO.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>(server, {
  cors: {
    credentials: true,
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
