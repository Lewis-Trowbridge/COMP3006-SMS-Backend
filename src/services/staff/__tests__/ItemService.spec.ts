import { Item } from '../../../models/staff/Item'
import ItemService from '../ItemService'

// Mockingoose does not work with ES6 imports: https://stackoverflow.com/questions/70156753/typeerror-0-mockingoose-default-is-not-a-function-mockingooose
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose')

describe('ItemService', () => {
  it('gets an item given an objectID', async () => {
    const expectedItem = new Item()
    mockingoose(Item).toReturn(expectedItem, 'findOne')
    const service: ItemService = new ItemService()
    const actual = await service.get(expectedItem.id)
    expect(actual).toEqual(expectedItem)
  })

  it('creates and saves an item', async () => {
    const expectedName = 'name'
    const expectedPosition = 'position'
    const expectedBarcode = 'barcode'
    const expectedStock = 0

    mockingoose(Item)

    const service = new ItemService()

    const actual = await service.create(expectedName, expectedBarcode, expectedPosition, expectedStock)

    expect(actual.name).toEqual(expectedName)
    expect(actual.position).toEqual(expectedPosition)
    expect(actual.barcode).toEqual(expectedBarcode)
    expect(actual.stock).toEqual(expectedStock)
  })
})
