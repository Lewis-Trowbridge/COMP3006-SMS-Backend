import { Item } from '../../../models/staff/Item'
import ItemService from '../ItemService'

// Mockingoose does not work with ES6 imports: https://stackoverflow.com/questions/70156753/typeerror-0-mockingoose-default-is-not-a-function-mockingooose
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose')

describe('ItemService', () => {
  describe('get', () => {
    it('gets an item given an objectID', async () => {
      const expectedItem = new Item()
      mockingoose(Item).toReturn(expectedItem, 'findOne')
      const service: ItemService = new ItemService()
      const actual = await service.get(expectedItem.id)
      expect(actual).toEqual(expectedItem)
    })
  })

  describe('create', () => {
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

  describe('listAll', () => {
    it('gets all items', async () => {
      const mockItem = new Item({
        barcode: 'barcode',
        name: 'item',
        position: 'positon',
        stock: 1
      })
      mockingoose(Item).toReturn([mockItem], 'find')
      const service = new ItemService()

      const actual = await service.listAll()
      expect(actual[0].toObject()).toEqual(mockItem.toObject())
    })
  })

  describe('findByBarcode', () => {
    it('gets an item given a barcode', async () => {
      const expectedBarcode = 'testBarcode'
      const expectedItem = new Item({ barcode: expectedBarcode })
      mockingoose(Item).toReturn(expectedItem, 'findOne')
      const service: ItemService = new ItemService()
      const actual = await service.findByBarcode(expectedBarcode)
      expect(actual).toEqual(expectedItem)
    })
  })

  describe('findByName', () => {
    it('gets an item given a name', async () => {
      const expectedName = 'testName'
      const expectedItem = [new Item({ barcode: expectedName })]
      mockingoose(Item).toReturn(expectedItem, 'find')
      const service: ItemService = new ItemService()
      const actual = await service.findByName(expectedName)
      // Prevent comparison of Mongo internal data
      expect(JSON.stringify(actual)).toEqual(JSON.stringify(expectedItem))
    })
  })
})
