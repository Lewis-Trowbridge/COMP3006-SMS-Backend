// Mockingoose does not work with ES6 imports: https://stackoverflow.com/questions/70156753/typeerror-0-mockingoose-default-is-not-a-function-mockingooose
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { ShoppingList } from '../../../models/customer/ShoppingList'
import ShoppingListService from '../ShoppingListService'
import { mongoExcludeIdsToObjectOptions } from '../../../constants'
// Mockingoose does not work with ES6 imports: https://stackoverflow.com/questions/70156753/typeerror-0-mockingoose-default-is-not-a-function-mockingooose
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose')

const currentTime = new Date(2023, 1, 1)

beforeAll(() => {
  jest.useFakeTimers()
  jest.setSystemTime(currentTime)
})

describe('ShoppingListService', () => {
  describe('new', () => {
    it('returns a new shopping list belonging to the currently logged in user', async () => {
      const testUserId = 'user'
      const expected = new ShoppingList({
        created: currentTime,
        editors: [],
        items: [],
        ownerId: testUserId
      })
      mockingoose(ShoppingList)
      const service = new ShoppingListService()
      const actual = await service.new()
      expect(actual.toObject(mongoExcludeIdsToObjectOptions))
        .toEqual(expected.toObject(mongoExcludeIdsToObjectOptions))
    })
  })
})

afterAll(() => {
  jest.useRealTimers()
})
