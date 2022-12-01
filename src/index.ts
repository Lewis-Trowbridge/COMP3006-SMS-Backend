import express from 'express'
import http from 'http'

const app: express.Express = express()

const server: http.Server = http.createServer(app)

server.listen(9000)