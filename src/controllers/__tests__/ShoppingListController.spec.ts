import mocked = jest.mocked
import ShoppingListService from '../../services/customer/ShoppingListService'
import { mock } from 'jest-mock-extended'
import { Request, Response } from 'express'
import { addEditorPatch, getListGet, listAllGet, newPost } from '../ShoppingListController'
import { HydratedDocument, Types } from 'mongoose'
import { IShoppingList } from '../../models/customer/ShoppingList'
import { IUser } from 'src/models/User'
import { Api404Error } from '../../setup/exceptions'

jest.mock('../../services/customer/ShoppingListService')

const mockShoppingListService = mocked(ShoppingListService)

describe('ShoppingListController', () => {
  describe('newPost', () => {
    it('calls shopping list service\'s "new" method with session user id', async () => {
      const expectedResponse = mock<HydratedDocument<IShoppingList>>()
      expectedResponse.toObject.mockReturnValue(expectedResponse)
      mockShoppingListService.prototype?.new.mockResolvedValue(expectedResponse)
      const mockUserId = new Types.ObjectId()
      const mockRequest = mock<Request>({ session: { user: mock<IUser>({ _id: mockUserId }) } })
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: jest.fn() }) })
      await newPost(mockRequest, mockResponse)
      expect(mockShoppingListService.prototype?.new).toHaveBeenCalledTimes(1)
      expect(mockShoppingListService.prototype.new).toHaveBeenNthCalledWith(1, mockUserId.toString())
    })

    it('returns response from ShoppingListService new', async () => {
      const expectedResponse = mock<HydratedDocument<IShoppingList>>()
      expectedResponse.toObject.mockReturnValue(expectedResponse)
      mockShoppingListService.prototype?.new.mockResolvedValue(expectedResponse)
      const mockUserId = new Types.ObjectId()
      const mockRequest = mock<Request>({ session: { user: mock<IUser>({ _id: mockUserId }) } })
      const mockJsonFunc = jest.fn().mockReturnValue({ send: jest.fn() })
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: mockJsonFunc }) })

      await newPost(mockRequest, mockResponse)

      expect(mockJsonFunc).toHaveBeenCalledTimes(1)
      expect(mockJsonFunc).toHaveBeenNthCalledWith(1, expectedResponse)
    })
  })

  describe('getListGet', () => {
    it('calls shopping list service\'s "get" method', async () => {
      const expectedResponse = mock<HydratedDocument<IShoppingList>>()
      expectedResponse.toObject.mockReturnValue(expectedResponse)
      mockShoppingListService.prototype?.get.mockResolvedValue(expectedResponse)
      const mockListId = 'list'
      const mockRequest = mock<Request<{}, {}, {}, { listId: string }>>({ query: { listId: mockListId } })
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: jest.fn() }) })
      await getListGet(mockRequest, mockResponse)
      expect(mockShoppingListService.prototype?.get).toHaveBeenCalledTimes(1)
      expect(mockShoppingListService.prototype.get).toHaveBeenNthCalledWith(1, mockListId)
    })

    it('returns response from ShoppingListService get', async () => {
      const expectedResponse = mock<HydratedDocument<IShoppingList>>()
      expectedResponse.toObject.mockReturnValue(expectedResponse)
      mockShoppingListService.prototype?.get.mockResolvedValue(expectedResponse)
      const mockListId = 'list'
      const mockRequest = mock<Request<{}, {}, {}, { listId: string }>>({ query: { listId: mockListId } })
      const mockJsonFunc = jest.fn().mockReturnValue({ send: jest.fn() })
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: mockJsonFunc }) })

      await getListGet(mockRequest, mockResponse)

      expect(mockJsonFunc).toHaveBeenCalledTimes(1)
      expect(mockJsonFunc).toHaveBeenNthCalledWith(1, expectedResponse)
    })

    it('throws exception if null returns from ShoppingListService get', async () => {
      const expectedResponse = null
      mockShoppingListService.prototype?.get.mockResolvedValue(expectedResponse)
      const mockListId = 'list'
      const mockRequest = mock<Request<{}, {}, {}, { listId: string }>>({ query: { listId: mockListId } })
      const mockResponse = mock<Response>()

      await expect(async () => await getListGet(mockRequest, mockResponse)).rejects.toThrowError(new Api404Error())
    })
  })

  describe('listAllGet', () => {
    it('calls shopping list service\'s "listAll" method', async () => {
      const expectedResponse = mock<HydratedDocument<IShoppingList>>()
      expectedResponse.toObject.mockReturnValue(expectedResponse)
      mockShoppingListService.prototype?.listAll.mockResolvedValue([expectedResponse])
      const mockUserId = new Types.ObjectId()
      const mockRequest = mock<Request>({ session: { user: mock<IUser>({ _id: mockUserId }) } })
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: jest.fn() }) })
      await listAllGet(mockRequest, mockResponse)
      expect(mockShoppingListService.prototype?.listAll).toHaveBeenCalledTimes(1)
    })

    it('returns response from ShoppingListService listAll', async () => {
      const expectedResponse = mock<HydratedDocument<IShoppingList>>()
      expectedResponse.toObject.mockReturnValue(expectedResponse)
      mockShoppingListService.prototype?.listAll.mockResolvedValue([expectedResponse])
      const mockUserId = new Types.ObjectId()
      const mockRequest = mock<Request>({ session: { user: mock<IUser>({ _id: mockUserId }) } })
      const mockJsonFunc = jest.fn()
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: mockJsonFunc }) })

      await listAllGet(mockRequest, mockResponse)

      expect(mockJsonFunc).toHaveBeenCalledTimes(1)
      expect(mockJsonFunc).toHaveBeenNthCalledWith(1, [expectedResponse])
    })
  })

  describe('addEditorPatch', () => {
    it('calls shopping list service\'s "addEditor" method with given values', async () => {
      const expectedBody = {
        listId: new Types.ObjectId(),
        userId: 'user'
      }
      const mockRequest = mock<Request>({
        body: expectedBody
      })
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ send: jest.fn() }) })
      await addEditorPatch(mockRequest, mockResponse)
      expect(mockShoppingListService.prototype?.addEditor).toHaveBeenCalledTimes(1)
      expect(mockShoppingListService.prototype?.addEditor).toHaveBeenNthCalledWith(1, expectedBody.userId, expectedBody.listId)
    })

    it('returns 204 when addition is successful', async () => {
      const expectedBody = {
        listId: new Types.ObjectId(),
        userId: 'user'
      }
      const mockRequest = mock<Request>({
        body: expectedBody
      })
      const mockStatusFunc = jest.fn().mockReturnValue({ send: jest.fn() })
      const mockResponse = mock<Response>({ status: mockStatusFunc })

      await addEditorPatch(mockRequest, mockResponse)

      expect(mockStatusFunc).toHaveBeenCalledTimes(1)
      expect(mockStatusFunc).toHaveBeenNthCalledWith(1, 204)
    })
  })
})
