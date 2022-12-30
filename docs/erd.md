```mermaid
erDiagram

User }|--o{ ShoppingList : "writes to"

ShoppingList {
    string creatorId
    datetime created
}

ShoppingList ||--o{ ListItem : "contains"

ListItem {
    string text
    int quantity
}

```