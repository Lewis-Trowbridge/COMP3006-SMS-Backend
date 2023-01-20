import supertest, { SuperAgentTest } from 'supertest'
import { connect, connection, Types } from 'mongoose'
import mongoUnit from 'mongo-unit'
import bodyParser from 'body-parser'
// Import without using to patch Express
import 'express-async-errors'
import express, { Application, Request, Response } from 'express'
import userRoutes from '../userRoutes'
import { User, UserType } from '../../../models/User'
import session from 'express-session'
import { hash } from 'argon2'
import { exceptionHandler } from '../../../setup/handlers/exceptionHandler'

beforeAll(async () => {
  await mongoUnit.start()
  await connect(mongoUnit.getUrl())
}, 30000)

let testApp: Application
let agent: SuperAgentTest
const fakeUser = new User({
  _id: new Types.ObjectId(),
  password: 'pass',
  type: UserType.Customer,
  username: 'user'
})

beforeEach(async () => {
  testApp = express()
  testApp.use(bodyParser.json({}))
  testApp.use(session({ secret: 'testSecret' }))
  testApp.use('/users', userRoutes)
  testApp.get('/login', (req: Request, res: Response) => {
    req.session.user = fakeUser
    res.sendStatus(200)
  })
  testApp.use(exceptionHandler)
  agent = supertest.agent(testApp)
  await agent.get('/login').send()
}, 10000)

describe('User routes (Integration test)', () => {
  describe('POST /create', () => {
    it('create endpoint returns HTTP 201 on successful create', async () => {
      const request = supertest(testApp)

      const response = await request.post('/users/create')
        .type('form')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ password: 'unhashed', username: 'username' })

      expect(response.statusCode).toBe(201)
      expect(response.body).toEqual({ type: UserType.Customer })
    }, 10000)

    it('create endpoint returns HTTP 304 on duplicate user', async () => {
      const request = supertest(testApp)
      const existingUser = await User.create({ password: 'unhashed', type: UserType.Customer, username: 'user' })

      const response = await request.post('/users/create')
        .type('form')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ password: 'unhashed', username: existingUser.username })

      expect(response.statusCode).toBe(304)
    }, 10000)

    it('returns HTTP 400 when given empty username and password', async () => {
      const request = supertest(testApp)
      const expectedError = {
        errors: [
          {
            location: 'body',
            msg: 'Invalid value',
            param: 'username'
          },
          {
            location: 'body',
            msg: 'Invalid value',
            param: 'password'
          }
        ]
      }
      const response = await request.post('/users/create')
        .type('form')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send()

      expect(response.status).toBe(400)
      expect(response.body).toEqual(expectedError)
    }, 10000)
  })

  describe('POST /login', () => {
    it('returns HTTP 200 and sets session token on successful login', async () => {
      const request = supertest(testApp)
      const plaintextPassword = 'securepassword'
      const existingUser = await User.create({ password: await hash(plaintextPassword), type: UserType.Customer, username: 'user' })
      const response = await request.post('/users/login')
        .type('form')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ password: plaintextPassword, username: existingUser.username })

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({ type: existingUser.type })
      expect(response.headers['set-cookie']).toHaveLength(1)
    }, 10000)

    it('returns HTTP 400 when given empty username and password', async () => {
      const request = supertest(testApp)
      const expectedError = {
        errors: [
          {
            location: 'body',
            msg: 'Invalid value',
            param: 'username'
          },
          {
            location: 'body',
            msg: 'Invalid value',
            param: 'password'
          }
        ]
      }
      const response = await request.post('/users/login')
        .type('form')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send()

      expect(response.status).toBe(400)
      expect(response.body).toEqual(expectedError)
    }, 10000)
  })

  describe('GET /search', () => {
    it('returns HTTP 200 and a list of usernames', async () => {
      const expectedUsername = 'user'
      await User.create({ password: 'password', type: UserType.Customer, username: expectedUsername })

      const response = await agent.get('/users/search')
        .query({ name: expectedUsername })
        .send()

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual([expectedUsername])
    })

    it('returns HTTP 400 when given empty name', async () => {
      const expectedError = {
        errors: [
          {
            location: 'query',
            msg: 'Invalid value',
            param: 'name'
          }
        ]
      }
      const response = await agent.get('/users/search')
        .send()

      expect(response.status).toBe(400)
      expect(response.body).toEqual(expectedError)
    }, 10000)
  })
})

afterEach(async () => {
  await mongoUnit.drop()
  await User.syncIndexes()
})

afterAll(async () => {
  await connection.close()
  await mongoUnit.stop()
})
