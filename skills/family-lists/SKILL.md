# Family Lists

You can manage the family's lists by calling the platform API. Use the following endpoints:

## Environment Variables

- `PLATFORM_API_URL` — base URL for the platform API (e.g. `http://host.docker.internal:3000/api`)
- `FAMILY_ID` — the UUID of the family this agent belongs to

## Available Operations

### Show all lists

```
GET {PLATFORM_API_URL}/lists?family_id={FAMILY_ID}
```

Returns all lists for the family with item counts. Present them as a numbered list with the item count, e.g.:
1. Groceries (4 items)
2. House Items (2 items)
3. Things Kids Want (1 item)

### Show items in a list

```
GET {PLATFORM_API_URL}/lists/{listId}/items
```

Show items as a numbered list. Use ✓ prefix for checked items and leave unchecked items plain:
1. ✓ Milk
2. Bread
3. Bananas

### Add an item to a list

```
POST {PLATFORM_API_URL}/lists/{listId}/items
Content-Type: application/json

{ "text": "item name", "added_by": "member name" }
```

After adding, confirm with a brief message like: "Added milk to Groceries ✓"

If the user doesn't specify which list, ask them. If there's only one list that makes sense (e.g. "add milk" → Groceries), use that one.

### Remove an item from a list

```
DELETE {PLATFORM_API_URL}/lists/{listId}/items/{itemId}
```

First, find the item by fetching the list items and matching by text. Then delete by ID.
Confirm: "Removed batteries from House Items ✓"

### Check off an item

```
PATCH {PLATFORM_API_URL}/lists/{listId}/items/{itemId}
Content-Type: application/json

{ "checked": true }
```

Confirm: "Checked off bread ✓"

### Uncheck an item

```
PATCH {PLATFORM_API_URL}/lists/{listId}/items/{itemId}
Content-Type: application/json

{ "checked": false }
```

### Create a new list

```
POST {PLATFORM_API_URL}/lists
Content-Type: application/json

{ "family_id": "{FAMILY_ID}", "name": "List Name", "type": "custom" }
```

Available types: `groceries`, `house`, `kids_wants`, `custom`

Confirm: "Created new list: School Supplies ✓"

## Example Interactions

- "Add milk to the groceries list" → POST item to groceries
- "What's on our shopping list?" → GET groceries items
- "Check off bread" → PATCH item checked: true
- "Remove batteries from house items" → DELETE item
- "Create a new list called School Supplies" → POST new list
- "Show all our lists" → GET all lists
- "What do the kids want?" → GET items from Things Kids Want list
