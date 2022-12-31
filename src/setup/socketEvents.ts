import { IShoppingListItem } from '../models/customer/ShoppingListItem'

export interface ClientToServerEvents {
  joinListRoom: (listId: string) => void
  resolveChanges: (listId: string, changes: IShoppingListItem[]) => Promise<void>
}

export interface ServerToClientEvents {
  distributeCanonical: (changes: IShoppingListItem[]) => void
  acknowledge: () => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InterServerEvents {

}
