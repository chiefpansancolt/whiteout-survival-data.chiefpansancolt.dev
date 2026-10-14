---
title: Fire Crystal table
nextjs:
  metadata:
    title: whiteout-survival-data - Fire Crystal table
    description: Build a table of the Fire Crystals and Refined Fire Crystals each building needs for FC 1 to FC 10.
---

A table of the Fire Crystals and Refined Fire Crystals that each building needs to reach each Fire Crystal level, FC 1 to FC 10. The module builds the columns, one row for each building, and a total for each column. {% .lead %}

`fireCrystalLevels()` holds the ten FC 1 to FC 10 badge icons used as column headers. The costs come from the level costs in [Buildings](/docs/buildings).

---

## Types

### `FireCrystalTable`

| Field     | Type                       | Description                                        |
| --------- | -------------------------- | -------------------------------------------------- |
| `columns` | `FireCrystalTableColumn[]` | One column for each level and resource             |
| `rows`    | `FireCrystalTableRow[]`    | One row for each building with a Fire Crystal cost |
| `totals`  | `number[]`                 | The sum of each column, in the order of `columns`  |

### `FireCrystalTableColumn`

| Field      | Type                  | Description                                             |
| ---------- | --------------------- | ------------------------------------------------------- |
| `level`    | `FireCrystalLevel`    | The level badge                                         |
| `resource` | `FireCrystalResource` | `'fireCrystals'` or `'refinedFireCrystals'`             |
| `item`     | `Item`                | The resource's entry in [Items](/docs/items), with icon |

### `FireCrystalTableRow`

| Field        | Type                 | Description                                                       |
| ------------ | -------------------- | ----------------------------------------------------------------- |
| `buildingId` | `string`             | `id` of the building                                              |
| `name`       | `string`             | Building name                                                     |
| `img`        | `string?`            | Path to the building's icon                                       |
| `cells`      | `(number \| null)[]` | One value for each column, in order. `null` when there is no cost |

### `FireCrystalLevel`

| Field   | Type     | Description                       |
| ------- | -------- | --------------------------------- |
| `id`    | `string` | Stable identifier, such as `fc-5` |
| `name`  | `string` | Display name, such as `FC 5`      |
| `level` | `number` | Level from 1 to 10                |
| `img`   | `string` | Path to the badge icon            |

### `FireCrystalLevelRange`

| Field  | Type     | Description                  |
| ------ | -------- | ---------------------------- |
| `from` | `number` | First level to keep, 1 to 10 |
| `to`   | `number` | Last level to keep, 1 to 10  |

---

## Functions

```typescript
import { fireCrystalLevels, fireCrystalTable } from 'whiteout-survival-data'

fireCrystalTable() // all levels, all buildings
fireCrystalTable(source, range) // custom buildings and an optional level range
fireCrystalLevels() // the ten level badges
```

| Function                            | Returns                 | Description                                                                             |
| ----------------------------------- | ----------------------- | --------------------------------------------------------------------------------------- |
| `fireCrystalTable(source?, range?)` | `FireCrystalTable`      | The table. `source` defaults to all buildings. `range` keeps the levels `from` to `to`. |
| `fireCrystalLevels()`               | `FireCrystalLevelQuery` | The ten level badges. It has the shared query methods.                                  |

---

## Terminal methods

`fireCrystalLevels()` has no filters of its own.

| Method              | Returns                         | Description                         |
| ------------------- | ------------------------------- | ----------------------------------- |
| `.get()`            | `FireCrystalLevel[]`            | All results                         |
| `.first()`          | `FireCrystalLevel \| undefined` | First result                        |
| `.find(id)`         | `FireCrystalLevel \| undefined` | Find by `id`                        |
| `.findByName(name)` | `FireCrystalLevel \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `FireCrystalLevel[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                        | Number of results                   |

---

## Ranges

Pass `{ from, to }` as the second argument to keep only the levels from `from` to `to`. Use `{ from: 1, to: 5 }` and `{ from: 6, to: 10 }` for two tables. `columns`, every row, and `totals` hold only those levels, and a Refined Fire Crystals column appears only for a level that costs any.

Every range has the same rows, so tables of one split line up. `fireCrystalTable()` throws `RangeError` when `from` or `to` is not a level from 1 to 10, or when `from` is above `to`.

---

## Examples

```typescript
import { fireCrystalLevels, fireCrystalTable } from 'whiteout-survival-data'

const table = fireCrystalTable()

// Column headers: one badge per level, then one resource icon per column
table.columns.map((c) => `${c.level.name} ${c.item.name}`)
// ['FC 1 Fire Crystal', 'FC 2 Fire Crystal', ..., 'FC 6 Fire Crystal', 'FC 6 Refined Fire Crystal', ...]

// A cell lines up with the column of the same index
const furnace = table.rows.find((row) => row.buildingId === 'furnace')
furnace?.cells.slice(0, 5) // [660, 790, 1190, 1400, 1675]

// Total of each column across the buildings
table.totals[0] // 1970

// Only FC 6 to FC 10
const late = fireCrystalTable(undefined, { from: 6, to: 10 })
late.columns.length // 10
late.totals[0] // 3105

fireCrystalLevels().find('fc-5')?.img // '/images/fire-crystal/fc-5.png'
```

---

## Notes

There is a Fire Crystals column for every level. A Refined Fire Crystals column follows it for each level where some building pays Refined Fire Crystals, which is FC 6 to FC 10. That gives 15 columns.

A cell is `null` when the building has no cost for the level, and a null cell counts as 0 in `totals`. A row exists only for a building with a Fire Crystal cost, so the table has 8 rows: Furnace, Embassy, Command Center, the three Camps, War Academy, and Infirmary.

The cost of a level is the sum of the five upgrades that end at its base row. FC 1 adds up `30-1` to `30-4` and `FC 1`. FC 2 adds up `FC 1-1` to `FC 1-4` and `FC 2`. FC 6 adds up `FC 5-1` to `FC 5-4` and `FC 6`. FC 10 has no sub-levels, so it adds up `FC 9-1` to `FC 9-4` and `FC 10`.

War Academy has no `30-1` to `30-4` levels, and its `FC 1` row has no cost, so its FC 1 cell is `null`.

---

## Next steps

- See [Buildings](/docs/buildings) for the level costs behind the table
- See the [Fire Crystal Shard table](/docs/fire-crystal-shard-table) for the troop research equivalent
- Look up the resource icons in [Items](/docs/items)
