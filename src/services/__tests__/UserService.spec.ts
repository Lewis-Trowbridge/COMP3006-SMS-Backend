import { hash } from 'argon2'
import { mongoExcludeIdsToObjectOptions } from '../../constants'
import { User, UserType } from '../../models/User'
import UserService from '../UserService'
// Mockingoose does not work with ES6 imports: https://stackoverflow.com/questions/70156753/typeerror-0-mockingoose-default-is-not-a-function-mockingooose
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose')

jest.mock('argon2')

const mockedHash = jest.mocked(hash)

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
})
