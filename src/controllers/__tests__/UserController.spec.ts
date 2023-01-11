import { mock } from 'jest-mock-extended'
import { HydratedDocument } from 'mongoose'
import { IUser, UserType } from '../../models/User'
import UserService from '../../services/UserService'
import { createPost } from '../UserController'
import { Request, Response } from 'express'
import mocked = jest.mocked

jest.mock('../../services/UserService')

const mockUserService = mocked(UserService)

describe('UserController', () => {
  describe('create', () => {
    it('calls user service\'s "create" method', async () => {
      const expectedResponse = mock<HydratedDocument<IUser>>()
      expectedResponse.toObject.mockReturnValue(expectedResponse)
      mockUserService.prototype.create.mockResolvedValue(expectedResponse)
      const expectedUser = { password: 'password', username: 'username' }
      const mockRequest = mock<Request>({ body: expectedUser })
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: jest.fn() }) })
      await createPost(mockRequest, mockResponse)
      expect(mockUserService.prototype.create).toHaveBeenCalledTimes(1)
      expect(mockUserService.prototype.create).toHaveBeenNthCalledWith(1, expectedUser.username, expectedUser.password, UserType.Customer)
    })

    it('returns response from user service\'s "create" method', async () => {
      const expectedResponse = mock<HydratedDocument<IUser>>()
      expectedResponse.toObject.mockReturnValue(expectedResponse)
      mockUserService.prototype.create.mockResolvedValue(expectedResponse)
      const expectedUser = { password: 'password', username: 'username' }
      const mockRequest = mock<Request>({ body: expectedUser })
      const mockJsonFunc = jest.fn().mockReturnValue({ send: jest.fn() })
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: mockJsonFunc }) })
      await createPost(mockRequest, mockResponse)
      expect(mockJsonFunc).toHaveBeenCalledTimes(1)
      expect(mockJsonFunc).toHaveBeenNthCalledWith(1, expectedResponse)
    })
  })
})
