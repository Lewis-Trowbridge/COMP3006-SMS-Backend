import { IItem, Item } from '../../../models/staff/Item'
import { mock } from 'jest-mock-extended'
import ItemService from '../ItemService'
import { Types } from 'mongoose'

jest.mock('../../../models/staff/Item', () => ({
  Item: { findOne: jest.fn() }
}))

const mockFindOne = Item.findOne as jest.MockedFunction<typeof Item.findOne>

describe('ItemService', () => {
  it('gets an item given an objectID', async () => {
    const expectedItem = mock<IItem>()
    mockFindOne.mockResolvedValue(expectedItem)
    const service: ItemService = new ItemService()
    const actual = await service.get(new Types.ObjectId())
    expect(actual).toEqual(expectedItem)
  })
})
