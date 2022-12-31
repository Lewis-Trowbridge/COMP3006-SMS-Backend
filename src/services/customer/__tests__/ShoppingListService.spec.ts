// Mockingoose does not work with ES6 imports: https://stackoverflow.com/questions/70156753/typeerror-0-mockingoose-default-is-not-a-function-mockingooose
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { IShoppingList, ShoppingList } from '../../../models/customer/ShoppingList'
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

  describe('listAll', () => {
    it('returns all lists belonging to the user', async () => {
      const testUserId = 'user'
      const expected = await ShoppingList.create({
        created: currentTime,
        ownerId: testUserId
      })
      mockingoose(ShoppingList).toReturn([expected], 'find')
      const service = new ShoppingListService()
      const actual = await service.listAll()
      expect(actual.length).toBe(1)
      expect(actual[0].toObject())
        .toEqual(expected.toObject())
    })

    it('returns an empty list when no lists belong to the user', async () => {
      // const testUserId = 'user'
      mockingoose(ShoppingList).toReturn([], 'find')
      const service = new ShoppingListService()
      const actual = await service.listAll()
      expect(actual.length).toBe(0)
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
    it('updates a single item', async () => {
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
      mockingoose(ShoppingList).toReturn(fakeItem, 'findOne')
      const newChanges: IShoppingListItem = {
        _id: oldItem._id,
        quantity: 2,
        text: 'newText'
      }

      const service = new ShoppingListService()
      await service.resolveChanges(oldItem._id.toString(), [newChanges])

      expect(fakeItem.items[0].toObject()).toEqual(newChanges)
    })

    it('updates multiple items', async () => {
      const oldItem: IShoppingListItem = {
        _id: new Types.ObjectId(),
        quantity: 1,
        text: 'oldText'
      }
      const oldItem2: IShoppingListItem = { ...oldItem, _id: new Types.ObjectId() }
      const fakeItem = await ShoppingList.create({
        created: new Date(),
        items: [oldItem, oldItem2],
        ownerId: new Types.ObjectId().toString()
      })
      mockingoose(ShoppingList).toReturn(fakeItem, 'findOne')
      const newChanges: IShoppingListItem = {
        _id: oldItem._id,
        quantity: 2,
        text: 'newText'
      }
      const newChanges2: IShoppingListItem = {
        ...newChanges,
        _id: oldItem2._id
      }

      const service = new ShoppingListService()
      await service.resolveChanges(oldItem._id.toString(), [newChanges, newChanges2])

      expect(fakeItem.items[0].toObject()).toEqual(newChanges)
      expect(fakeItem.items[1].toObject()).toEqual(newChanges2)
    })

    it('adds new items', async () => {
      const fakeItem = await ShoppingList.create({
        created: new Date(),
        ownerId: new Types.ObjectId().toString()
      })
      mockingoose(ShoppingList).toReturn(fakeItem, 'findOne')
      const newChanges: IShoppingListItem = {
        _id: new Types.ObjectId(),
        quantity: 2,
        text: 'newText'
      }

      const service = new ShoppingListService()
      await service.resolveChanges(fakeItem._id.toString(), [newChanges])

      expect(fakeItem.items[0].toObject()).toEqual(newChanges)
    })

    it('adds new items and updates existing items at the same time', async () => {
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
      mockingoose(ShoppingList).toReturn(fakeItem, 'findOne')
      const existingChanges: IShoppingListItem = {
        _id: oldItem._id,
        quantity: 2,
        text: 'newText'
      }
      const newChanges: IShoppingListItem = {
        _id: new Types.ObjectId(),
        quantity: 2,
        text: 'newText'
      }

      const service = new ShoppingListService()
      await service.resolveChanges(fakeItem._id.toString(), [newChanges, existingChanges])

      expect(fakeItem.items[0].toObject()).toEqual(existingChanges)
      expect(fakeItem.items[1].toObject()).toEqual(newChanges)
    })
  })
})

afterAll(() => {
  jest.useRealTimers()
})
