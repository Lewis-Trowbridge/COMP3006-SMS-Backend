import mongoUnit from 'mongo-unit'
import { connect, connection } from 'mongoose'
import express from 'express'
import bodyParser from 'body-parser'
import shoppingListRoutes from '../shoppingListRoutes'
import supertest from 'supertest'

const currentTime = new Date(2022, 1, 1)

beforeAll(async () => {
  jest.useFakeTimers({ doNotFake: ['nextTick'] })
  jest.setSystemTime(currentTime)
  await mongoUnit.start()
  await connect(mongoUnit.getUrl())
}, 30000)

const testApp = express()
testApp.use(bodyParser.json({}))
testApp.use('/lists', shoppingListRoutes)

describe('Shopping list routes (integration tests)', () => {
  describe('POST /new', () => {
    it('retrieves a new shopping list owned by the current user', async () => {
      const mockUserId = 'user'
      const request = supertest(testApp)
      const expectedObject = {
        created: currentTime.toISOString(),
        editors: [],
        items: [],
        ownerId: mockUserId
      }
      const response = await request.post('/lists/create')
        .send()

      expect(response.status).toBe(201)
      expect(response.body).toEqual(expectedObject)
    }, 10000)
  })
})

afterEach(async () => {
  await mongoUnit.drop()
})

afterAll(async () => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
  await connection.close()
  await mongoUnit.stop()
})
