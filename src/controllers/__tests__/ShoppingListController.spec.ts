import mocked = jest.mocked
import ShoppingListService from '../../services/customer/ShoppingListService'
import { mock } from 'jest-mock-extended'
import { Request, Response } from 'express'
import { newPost } from '../ShoppingListController'
import { HydratedDocument } from 'mongoose'
import { IShoppingList } from '../../models/customer/ShoppingList'

jest.mock('../../services/customer/ShoppingListService')

const mockShoppingListService = mocked(ShoppingListService)

describe('ShoppingListController', () => {
  describe('newPost', () => {
    it('calls shopping list service\'s "new" method', async () => {
      const expectedResponse = mock<HydratedDocument<IShoppingList>>()
      expectedResponse.toObject.mockReturnValue(expectedResponse)
      mockShoppingListService.prototype?.new.mockResolvedValue(expectedResponse)
      const mockRequest = mock<Request>()
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: jest.fn() }) })
      await newPost(mockRequest, mockResponse)
      expect(mockShoppingListService.prototype?.new).toHaveBeenCalledTimes(1)
    })

    it('returns response from ShoppingListService new', async () => {
      const expectedResponse = mock<HydratedDocument<IShoppingList>>()
      expectedResponse.toObject.mockReturnValue(expectedResponse)
      mockShoppingListService.prototype?.new.mockResolvedValue(expectedResponse)
      const mockRequest = mock<Request>()
      const mockJsonFunc = jest.fn()
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: mockJsonFunc }) })

      await newPost(mockRequest, mockResponse)

      expect(mockJsonFunc).toHaveBeenCalledTimes(1)
      expect(mockJsonFunc).toHaveBeenNthCalledWith(1, expectedResponse)
    })
  })
})