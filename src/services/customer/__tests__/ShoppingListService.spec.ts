// Mockingoose does not work with ES6 imports: https://stackoverflow.com/questions/70156753/typeerror-0-mockingoose-default-is-not-a-function-mockingooose
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { ShoppingList } from '../../../models/customer/ShoppingList'
import ShoppingListService from '../ShoppingListService'
import { mongoExcludeIdsToObjectOptions } from '../../../constants'
import { Types } from 'mongoose'
import { Api304Error, Api404Error } from '../../../setup/exceptions'
import { IShoppingListItem } from '../../../models/customer/ShoppingListItem'
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

  describe('addEditor', () => {
    it('adds a new user to a given list', async () => {
      const ownerId = 'user'
      const testUserId = 'anotherUser'
      const fakeList = new ShoppingList({ created: new Date(), ownerId })
      mockingoose(ShoppingList).toReturn(fakeList, 'findOne')
      const service = new ShoppingListService()

      await service.addEditor(testUserId, fakeList.id)

      expect(fakeList.editors).toContain(testUserId)
    })

    it('throws a 404 error when the list is not found', async () => {
      mockingoose(ShoppingList).toReturn(null, 'findOne')
      const service = new ShoppingListService()
      await expect(async () => await service.addEditor('', new Types.ObjectId()))
        .rejects.toThrow(new Api404Error('List not found.'))
    })

    it('throws a 304 error when the list already has a given user', async () => {
      const ownerId = 'user'
      const testUserId = 'anotherUser'
      const fakeList = new ShoppingList({ created: new Date(), editors: [testUserId], ownerId })
      mockingoose(ShoppingList).toReturn(fakeList, 'findOne')
      const service = new ShoppingListService()
      await expect(async () => await service.addEditor(testUserId, fakeList.id))
        .rejects.toThrow(new Api304Error('User already has permission to edit this list.'))
    })

    it('throws a 304 error when the list belongs to the given user', async () => {
      const ownerId = 'user'
      const fakeList = new ShoppingList({ created: new Date(), ownerId })
      mockingoose(ShoppingList).toReturn(fakeList, 'findOne')
      const service = new ShoppingListService()
      await expect(async () => await service.addEditor(ownerId, fakeList.id))
        .rejects.toThrow(new Api304Error('User already has permission to edit this list.'))
    })
  })
  describe('resolveChanges', () => {
    it('sends an update query for a single item', async () => {
      const oldItem: IShoppingListItem = {
        _id: new Types.ObjectId(),
        quantity: 1,
        text: 'oldText'
      }
      const fakeItem = await ShoppingList.create({
        created: new Date(),
        items: [oldItem],
        ownerId: new Types.ObjectId().toString()
      })
      const mockUpdate = jest.fn()
      mockingoose(ShoppingList).toReturn(fakeItem, 'findOne')
        .toReturn(mockUpdate, 'updateOne')
      const newChanges: IShoppingListItem = {
        _id: oldItem._id,
        quantity: 2,
        text: 'newText'
      }
      const expectedQuery = {
        'items.$.quantity': newChanges.quantity,
        'items.$.text': newChanges.text
      }

      const service = new ShoppingListService()
      await service.resolveChanges(oldItem._id.toString(), [newChanges])

      await ShoppingList.findById(oldItem._id)

      expect(mockUpdate).toHaveBeenCalledTimes(1)
      const updateQuery = mockUpdate.mock.lastCall[0].getUpdate()
      expect(updateQuery.$set).toEqual(expectedQuery)
    })
  })
})

afterAll(() => {
  jest.useRealTimers()
})
