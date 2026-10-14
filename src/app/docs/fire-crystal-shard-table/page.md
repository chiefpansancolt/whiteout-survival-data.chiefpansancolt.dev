---
title: Fire Crystal Shard table
nextjs:
  metadata:
    title: whiteout-survival-data - Fire Crystal Shard table
    description: Build a table of the Fire Crystal Shards and Refined Fire Crystals that T11 and T12 troop research costs.
---

A table of the Fire Crystal Shards and Refined Fire Crystals that the T11 and T12 troop research costs. There is one column for each troop type, tier, and resource. The rows split the cost into the Unlock and the extras. {% .lead %}

The costs come from the research costs in [Research](/docs/research).

---

## Types

### `FireCrystalShardTable`

| Field     | Type                            | Description                                        |
| --------- | ------------------------------- | -------------------------------------------------- |
| `columns` | `FireCrystalShardTableColumn[]` | One column for each troop type, tier, and resource |
| `rows`    | `FireCrystalShardTableRow[]`    | The rows, in the order listed below                |

### `FireCrystalShardTableColumn`

| Field       | Type                       | Description                                             |
| ----------- | -------------------------- | ------------------------------------------------------- |
| `troopType` | `ChiefGearTroopType`       | `'Infantry'`, `'Lancer'`, or `'Marksman'`               |
| `tier`      | `FireCrystalShardTier`     | `'T11'` or `'T12'`                                      |
| `category`  | `string`                   | Research category, such as `"T11 Infantry"`             |
| `resource`  | `FireCrystalShardResource` | `'fireCrystalShards'` or `'refinedFireCrystals'`        |
| `item`      | `Item`                     | The resource's entry in [Items](/docs/items), with icon |

### `FireCrystalShardTableRow`

| Field   | Type                      | Description                                                       |
| ------- | ------------------------- | ----------------------------------------------------------------- |
| `id`    | `string`                  | `unlock`, `tier-N`, `extras`, or `total`                          |
| `name`  | `string`                  | Display name, such as `Unlock` or `Tier 6`                        |
| `kind`  | `FireCrystalShardRowKind` | `'unlock'`, `'extras'`, `'extrasTotal'`, or `'total'`             |
| `cells` | `(number \| null)[]`      | One value for each column, in order. `null` when there is no cost |

---

## Function

```typescript
import { fireCrystalShardTable } from 'whiteout-survival-data'

fireCrystalShardTable() // T11 and T12, all research nodes
fireCrystalShardTable(source, tiers) // custom research nodes and tiers
```

| Function                                 | Returns                 | Description                                                                                                 |
| ---------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| `fireCrystalShardTable(source?, tiers?)` | `FireCrystalShardTable` | The table. `source` defaults to all research nodes from `research()`. `tiers` defaults to `['T11', 'T12']`. |

---

## Columns

Each troop type has a Fire Crystal Shards column for T11 and for T12, and a Refined Fire Crystals column for T12. T11 costs no Refined Fire Crystals, so it has no such column. That gives 9 columns.

## Rows

| Row                        | Meaning                                                         |
| -------------------------- | --------------------------------------------------------------- |
| `unlock` (`unlock`)        | The sum of the research that unlocks the troop                  |
| `tier-2` and up (`extras`) | The cost of the research after the Unlock in that research tier |
| `extras` (`extrasTotal`)   | The sum of the extras rows                                      |
| `total` (`total`)          | The Unlock plus the extras                                      |

A cell is `null` when the column has no cost for the row, and a null cell counts as 0 in the sums.

---

## Tiers

Pass `['T11']`, `['T12']`, or `['T11', 'T12']` as the second argument to keep only those tiers. The columns, the extras rows, and the totals then hold only those tiers. The extras rows list only the research tiers that cost something in the shown columns, so T11 alone has Tier 6 and Tier 7. The order of the array does not matter.

`fireCrystalShardTable()` throws `RangeError` when the array holds no tier.

---

## Examples

```typescript
import { fireCrystalShardTable } from 'whiteout-survival-data'

const table = fireCrystalShardTable()

table.columns.map((c) => `${c.category} ${c.item.name}`).slice(0, 3)
// ['T11 Infantry Fire Crystal Shard', 'T12 Infantry Fire Crystal Shard', 'T12 Infantry Refined Fire Crystal']

const unlock = table.rows.find((row) => row.id === 'unlock')
unlock?.cells.slice(0, 3) // [13421, 3080, 440]

const total = table.rows.find((row) => row.id === 'total')
total?.cells.slice(0, 3) // [27314, 68544, 3977]

// Only T11
const t11 = fireCrystalShardTable(undefined, ['T11'])
t11.columns.length // 3
t11.rows.map((row) => row.id) // ['unlock', 'tier-6', 'tier-7', 'extras', 'total']
```

---

## Notes

The Unlock row sums research tiers 1 to 5 for T11, which ends with the Helios node that unlocks the troop. For T12 it sums tier 1, the five Exalted items that the Exalted capstone requires. The capstone has no known cost and adds 0.

The extras are the later tiers: 6 and 7 for T11, and 2 to 8 for T12. A tier row is `null` in a column where the tier belongs to the Unlock or does not exist.

{% callout title="Known gap" type="warning" %}
The T12 Exalted capstone has no known cost, so it adds 0 to the T12 Unlock row.
{% /callout %}

---

## Next steps

- See [Research](/docs/research) for the research nodes behind the table
- See the [Fire Crystal table](/docs/fire-crystal-table) for the building upgrade equivalent
- Look up the resource icons in [Items](/docs/items)
