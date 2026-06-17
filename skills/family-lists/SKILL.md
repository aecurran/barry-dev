# Family Lists

You manage the family's lists using a local SQLite database at `/agent/data/family.db`. This database belongs to this family only — all data stays inside this container.

## Database Access

Use the `sqlite3` command-line tool to query and modify the database:

```bash
sqlite3 /agent/data/family.db "<SQL>"
```

## Available Operations

### Show all lists

```sql
SELECT l.id, l.name, l.type, COUNT(li.id) as item_count
FROM lists l
LEFT JOIN list_items li ON l.id = li.list_id
GROUP BY l.id
ORDER BY l.created_at;
```

Present as a numbered list:
1. Groceries (4 items)
2. House Items (2 items)
3. Things Kids Want (1 item)

### Show items in a list

```sql
SELECT id, text, added_by, checked, checked_at, checked_by, created_at
FROM list_items
WHERE list_id = '<list_id>'
ORDER BY created_at;
```

Show items as a numbered list. Use ✓ prefix for checked items:
1. ✓ Milk (checked by Amy)
2. Bread
3. Bananas

### Add an item to a list

```sql
INSERT INTO list_items (list_id, text, added_by)
VALUES ('<list_id>', '<item text>', '<member name>');
```

Confirm: "Added milk to Groceries ✓"

If the user doesn't specify which list, ask them. If there's only one list that makes sense (e.g. "add milk" → Groceries), use that one.

### Remove an item from a list

First find the item:
```sql
SELECT id, text FROM list_items WHERE list_id = '<list_id>' AND text LIKE '%<search>%';
```

Then delete:
```sql
DELETE FROM list_items WHERE id = '<item_id>';
```

Confirm: "Removed batteries from House Items ✓"

### Check off an item

```sql
UPDATE list_items
SET checked = 1, checked_at = datetime('now'), checked_by = '<member name>'
WHERE id = '<item_id>';
```

Confirm: "Checked off bread ✓"

### Uncheck an item

```sql
UPDATE list_items
SET checked = 0, checked_at = NULL, checked_by = NULL
WHERE id = '<item_id>';
```

### Create a new list

```sql
INSERT INTO lists (name, type) VALUES ('<list name>', '<type>');
```

Available types: `groceries`, `house`, `kids_wants`, `custom`

Confirm: "Created new list: School Supplies ✓"

### Clear checked items from a list

```sql
DELETE FROM list_items WHERE list_id = '<list_id>' AND checked = 1;
```

Useful after a shopping trip: "Clear the checked items from Groceries"

## Example Interactions

- "Add milk to the groceries list" → INSERT into list_items
- "What's on our shopping list?" → SELECT from list_items where list is Groceries
- "Check off bread" → UPDATE checked = 1
- "Remove batteries from house items" → DELETE item
- "Create a new list called School Supplies" → INSERT into lists
- "Show all our lists" → SELECT from lists with item counts
- "What do the kids want?" → SELECT items from Things Kids Want
- "Clear the checked items from groceries" → DELETE checked items
- "Who added the bananas?" → SELECT added_by from list_items
- "What did we check off today?" → SELECT where checked_at is today
