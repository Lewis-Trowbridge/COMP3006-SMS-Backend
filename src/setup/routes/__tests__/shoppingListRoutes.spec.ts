import mongoUnit from 'mongo-unit'
import { connect, connection } from 'mongoose'
import express from 'express'
import bodyParser from 'body-parser'
import shoppingListRoutes from '../shoppingListRoutes'
import supertest from 'supertest'
import { ShoppingList } from '../../../models/customer/ShoppingList'

const currentTime = new Date(2022, 1, 1)

beforeAll(async () => {
  // Breaks jest function timeouts if nextTick is mocked
  jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] })
    .setSystemTime(currentTime)
  await mongoUnit.start()
  await connect(mongoUnit.getUrl())
}, 30000)

const testApp = express()
testApp.use(bodyParser.json({}))
testApp.use('/lists', shoppingListRoutes)

describe('Shopping list routes (integration tests)', () => {
  describe('POST /new', () => {
    it('returns HTTP 201 and a new shopping list owned by the current user', async () => {
      const mockUserId = 'user'
      const request = supertest(testApp)
      const expectedObject = {
        _id: expect.any(String),
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

  describe('GET /get', () => {
    it('returns HTTP 200 and a given shopping list', async () => {
      const mockUserId = 'user'
      const request = supertest(testApp)
      const item = await ShoppingList.create({
        created: currentTime,
        ownerId: mockUserId
      })
      const expectedObject = {
        _id: item._id.toString(),
        created: currentTime.toISOString(),
        editors: [],
        items: [],
        ownerId: mockUserId
      }
      const response = await request.get('/lists/get')
        .query({ listId: item.id })
        .send()

      expect(response.status).toBe(200)
      expect(response.body).toEqual(expectedObject)
    }, 10000)
  })

  describe('GET /list-all', () => {
    it('returns HTTP 200 and a shopping lists owned by the current user', async () => {
      const mockUserId = 'user'
      const request = supertest(testApp)
      const item = await ShoppingList.create({
        created: currentTime,
        ownerId: mockUserId
      })
      const expectedObject = {
        _id: item._id.toString(),
        created: currentTime.toISOString(),
        editors: [],
        items: [],
        ownerId: mockUserId
      }
      const response = await request.get('/lists/list-all')
        .send()

      expect(response.status).toBe(200)
      expect(response.body).toContainEqual(expectedObject)
    }, 10000)
  })

  describe('PATCH /add-editor', () => {
    it('Returns HTTP 204 and adds a given user to a given list', async () => {
      const request = supertest(testApp)
      const mockOwnerId = 'owner'
      const mockEditorId = 'editor'
      const testList = await ShoppingList.create({ created: currentTime, ownerId: mockOwnerId })
      const expectedObject = {
        listId: testList.id.toString(),
        userId: mockEditorId
      }

      const response = await request.patch('/lists/add-editor')
        .type('form')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(expectedObject)

      const updatedList = await ShoppingList.findById(expectedObject.listId)

      expect(response.status).toBe(204)
      expect(updatedList?.editors).toContain(mockEditorId)
    }, 10000)

    it('returns HTTP 400 and error when given missing ids', async () => {
      const request = supertest(testApp)
      const expectedError = {
        errors: [
          {
            location: 'body',
            msg: 'Invalid value',
            param: 'userId'
          },
          {
            location: 'body',
            msg: 'Invalid value',
            param: 'listId'
          }
        ]
      }

      const response = await request.patch('/lists/add-editor')
        .send()

      expect(response.status).toBe(400)
      expect(response.body).toEqual(expectedError)
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
