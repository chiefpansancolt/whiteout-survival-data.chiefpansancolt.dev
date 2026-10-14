---
title: Hero gear empowerment
nextjs:
  metadata:
    title: whiteout-survival-data - Hero gear empowerment
    description: Query the 100-level Hero Gear empowerment table with cost and cumulative power.
---

The 100-level empowerment table that follows enhancement level 100. Read the cost and cumulative power of an empowerment level. {% .lead %}

---

## Types

### `HeroGearEmpowermentLevel`

| Field   | Type             | Description                                |
| ------- | ---------------- | ------------------------------------------ |
| `id`    | `string`         | Stable identifier, such as `level-1`       |
| `name`  | `string`         | Display name, such as `Level 1`            |
| `level` | `number`         | Empowerment level from 1 to 100            |
| `cost`  | `HeroGearCost[]` | Items needed to reach the level            |
| `power` | `number`         | Cumulative power once the level is reached |

### `HeroGearCost`

| Field    | Type     | Description                |
| -------- | -------- | -------------------------- |
| `itemId` | `string` | Id in [Items](/docs/items) |
| `amount` | `number` | Amount needed              |

---

## Factory

```typescript
import { heroGearEmpowerment } from 'whiteout-survival-data'

heroGearEmpowerment() // all 100 levels
heroGearEmpowerment(source) // wrap a pre-filtered array
```

---

## Filters

| Method    | Signature                | Description                           |
| --------- | ------------------------ | ------------------------------------- |
| `byLevel` | `byLevel(level: number)` | The row for empowerment level `level` |

---

## Terminal methods

| Method              | Returns                                 | Description                         |
| ------------------- | --------------------------------------- | ----------------------------------- |
| `.get()`            | `HeroGearEmpowermentLevel[]`            | All results                         |
| `.first()`          | `HeroGearEmpowermentLevel \| undefined` | First result                        |
| `.find(id)`         | `HeroGearEmpowermentLevel \| undefined` | Find by `id`                        |
| `.findByName(name)` | `HeroGearEmpowermentLevel \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `HeroGearEmpowermentLevel[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                                | Number of results                   |

---

## Examples

```typescript
import { heroGearEmpowerment } from 'whiteout-survival-data'

const levelTwenty = heroGearEmpowerment().byLevel(20).first()
levelTwenty?.cost
// [{ itemId: 'custom-mythic-hero-gear-chest', amount: 3 }, { itemId: 'mithril', amount: 10 }]

const last = heroGearEmpowerment().find('level-100')
last?.power // 4216700
```

---

## Costs

The table has 100 rows, one for each level from 1 to 100. Level 1 costs 2 Custom Mythic Hero Gear Chests. Levels 20, 40, 60, 80, and 100 cost Custom Mythic Hero Gear Chests and Mithril. Every other level costs Enhancement XP Component.

| Level | Chests | Mithril |
| ----- | ------ | ------- |
| 20    | 3      | 10      |
| 40    | 5      | 20      |
| 60    | 5      | 30      |
| 80    | 10     | 40      |
| 100   | 10     | 50      |

The cost items match [Items](/docs/items).

---

## Notes

An empowered piece has reached enhancement level 100. The `power` values are cumulative from enhancement level 1 through empowerment level 100, so they continue from the power of enhancement level 100. See [Hero gear enhancement](/docs/hero-gear-enhancement).

The milestone bonuses at levels 20, 40, 60, 80, and 100 are in [Hero gear stats](/docs/hero-gear-stats).

---

## Next steps

- See [Hero gear enhancement](/docs/hero-gear-enhancement) for levels 1 to 100 of the same piece
- See [Hero gear mastery forging](/docs/hero-gear-mastery-forging) for the forging that empowerment requires
- Use the [Hero gear calculator](/docs/calculator-hero-gear) to total an upgrade path
