import { mock } from 'jest-mock-extended'
import { HydratedDocument } from 'mongoose'
import { IUser, UserType } from '../../models/User'
import UserService from '../../services/UserService'
import { createPost, loginPost, logoutGet, searchGet } from '../UserController'
import { Request, Response } from 'express'
import mocked = jest.mocked
import { Api304Error, Api401Error } from '../../setup/exceptions'

jest.mock('../../services/UserService')

const mockUserService = mocked(UserService)

describe('UserController', () => {
  describe('create', () => {
    it('calls user service\'s "create" method', async () => {
      const expectedResponse = mock<HydratedDocument<IUser>>()
      mockUserService.prototype.create.mockResolvedValue(expectedResponse)
      const expectedUser = { password: 'password', username: 'username' }
      const mockRequest = mock<Request>({ body: expectedUser })
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: jest.fn() }) })

      await createPost(mockRequest, mockResponse)

      expect(mockUserService.prototype.create).toHaveBeenCalledTimes(1)
      expect(mockUserService.prototype.create).toHaveBeenNthCalledWith(1, expectedUser.username, expectedUser.password, UserType.Customer)
    })

    it('returns HTTP 201 with user type and stores user in session when user service\'s "create" method does not throw', async () => {
      const expectedResponse = mock<HydratedDocument<IUser>>({ type: UserType.Customer })
      mockUserService.prototype.create.mockResolvedValue(expectedResponse)
      const expectedUser = { password: 'password', username: 'username' }
      const mockRequest = mock<Request>({ body: expectedUser })
      const mockJsonFunc = jest.fn()
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: mockJsonFunc }) })

      await createPost(mockRequest, mockResponse)

      expect(mockJsonFunc).toHaveBeenCalledTimes(1)
      expect(mockJsonFunc).toHaveBeenNthCalledWith(1, { type: expectedResponse.type })
      expect(mockRequest.session.user).toEqual(expectedResponse)
    })

    it('throws Api304Error when user service\'s "create" method throws', async () => {
      mockUserService.prototype.create.mockRejectedValue(new Error())
      const expectedUser = { password: 'password', username: 'username' }
      const mockRequest = mock<Request>({ body: expectedUser })
      const mockResponse = mock<Response>()

      await expect(async () => await createPost(mockRequest, mockResponse)).rejects.toThrowError(new Api304Error())
    })
  })

  describe('loginPost', () => {
    it('returns type and stores user data in session when verify returns data', async () => {
      const expectedType = UserType.Customer
      const expectedResponse = mock<HydratedDocument<IUser>>({ type: expectedType })
      mockUserService.prototype.verify.mockResolvedValue(expectedResponse)
      const expectedUser = { password: 'password', username: 'username' }
      const mockRequest = mock<Request>({ body: { password: expectedUser.password, username: expectedUser.username } })
      const mockJsonFunc = jest.fn()
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: mockJsonFunc }) })

      await loginPost(mockRequest, mockResponse)

      expect(mockJsonFunc).toHaveBeenCalledTimes(1)
      expect(mockJsonFunc).toHaveBeenNthCalledWith(1, { type: expectedType })
      expect(mockRequest.session.user).toEqual(expectedResponse)
    })

    it('throws Api401Error and does not store user data in session when verify returns null', async () => {
      mockUserService.prototype.verify.mockResolvedValue(null)
      const expectedUser = { password: 'password', username: 'username' }
      const mockRequest = mock<Request>({ body: { password: expectedUser.password, username: expectedUser.username } })
      const mockResponse = mock<Response>()

      await expect(async () => await loginPost(mockRequest, mockResponse)).rejects.toThrowError(new Api401Error())
      expect(mockRequest.session.user).toBeUndefined()
    })
  })

  describe('logoutGet', () => {
    it('sets the session user value to undefined', async () => {
      const mockUser = mock<IUser>()
      const mockRequest = mock<Request>({ session: { user: mockUser } })
      const mockSendStatusFunc = jest.fn()
      const mockResponse = mock<Response>({ sendStatus: mockSendStatusFunc })

      await logoutGet(mockRequest, mockResponse)

      expect(mockRequest.session.user).toBeUndefined()
      expect(mockSendStatusFunc).toHaveBeenNthCalledWith(1, 204)
    })
  })

  describe('searchGet', () => {
    it('returns HTTP 200 and list of usernames returned from service', async () => {
      const expectedResponse = ['user']
      mockUserService.prototype.search.mockResolvedValue(expectedResponse)
      const mockRequest = mock<Request<{}, {}, {}, { name: string }>>({ query: { name: expectedResponse[0] } })
      const mockJsonFunc = jest.fn()
      const mockResponse = mock<Response>({ status: jest.fn().mockReturnValue({ json: mockJsonFunc }) })

      await searchGet(mockRequest, mockResponse)

      expect(mockJsonFunc).toHaveBeenCalledTimes(1)
      expect(mockJsonFunc).toHaveBeenNthCalledWith(1, expectedResponse)
    })
  })
})
