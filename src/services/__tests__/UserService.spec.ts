import mocked = jest.mocked
import { hash, verify } from 'argon2'
import { mongoExcludeIdsToObjectOptions } from '../../constants'
import { User, UserType } from '../../models/User'
import UserService from '../UserService'
// Mockingoose does not work with ES6 imports: https://stackoverflow.com/questions/70156753/typeerror-0-mockingoose-default-is-not-a-function-mockingooose
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose')

jest.mock('argon2')

const mockedHash = mocked(hash)
const mockedVerify = mocked(verify)

describe('UserService', () => {
  describe('create', () => {
    it('creates a user with a hashed password', async () => {
      const expectedHashedPassword = 'hashed'
      const expected = new User({
        password: expectedHashedPassword,
        type: UserType.Customer,
        username: 'user'
      })
      mockedHash.mockResolvedValue(expectedHashedPassword)
      mockingoose(User)
      const service = new UserService()

      const actual = await service.create(expected.username, 'unhashed', expected.type)
      expect(actual.toObject(mongoExcludeIdsToObjectOptions))
        .toEqual(expected.toObject(mongoExcludeIdsToObjectOptions))
    })
  })

  describe('verify', () => {
    it('returns user when argon verify returns true', async () => {
      const expectedHashedPassword = 'hashed'
      const expectedUser = new User({
        password: expectedHashedPassword,
        type: UserType.Customer,
        username: 'user'
      })
      mockedVerify.mockResolvedValue(true)
      mockingoose(User).toReturn(expectedUser, 'findOne')
      const service = new UserService()

      const result = await service.verify(expectedUser.username, 'unhashed')
      expect(result).toBe(expectedUser)
    })

    it('returns null when argon verify returns false', async () => {
      const expectedHashedPassword = 'hashed'
      const expectedUser = new User({
        password: expectedHashedPassword,
        type: UserType.Customer,
        username: 'user'
      })
      mockedVerify.mockResolvedValue(false)
      mockingoose(User).toReturn(expectedUser, 'findOne')
      const service = new UserService()

      const result = await service.verify(expectedUser.username, 'unhashed')
      expect(result).toBeNull()
    })

    it('returns false when no user is found', async () => {
      mockingoose(User).toReturn(undefined, 'findOne')
      const service = new UserService()

      const result = await service.verify('username', 'unhashed')
      expect(result).toBeNull()
    })
  })
})
