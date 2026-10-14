---
title: Hero gear enhancement
nextjs:
  metadata:
    title: whiteout-survival-data - Hero gear enhancement
    description: Query the 100-level Hero Gear enhancement table with cost and cumulative power.
---

The base 100-level enhancement table that every piece of Hero Gear climbs. Read the cost and cumulative power of an enhancement level. {% .lead %}

---

## Types

### `HeroGearEnhancementLevel`

| Field   | Type             | Description                                |
| ------- | ---------------- | ------------------------------------------ |
| `id`    | `string`         | Stable identifier, such as `level-1`       |
| `name`  | `string`         | Display name, such as `Level 1`            |
| `level` | `number`         | Enhancement level from 1 to 100            |
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
import { heroGearEnhancement } from 'whiteout-survival-data'

heroGearEnhancement() // all 100 levels
heroGearEnhancement(source) // wrap a pre-filtered array
```

---

## Filters

| Method    | Signature                | Description                           |
| --------- | ------------------------ | ------------------------------------- |
| `byLevel` | `byLevel(level: number)` | The row for enhancement level `level` |

---

## Terminal methods

| Method              | Returns                                 | Description                         |
| ------------------- | --------------------------------------- | ----------------------------------- |
| `.get()`            | `HeroGearEnhancementLevel[]`            | All results                         |
| `.first()`          | `HeroGearEnhancementLevel \| undefined` | First result                        |
| `.find(id)`         | `HeroGearEnhancementLevel \| undefined` | Find by `id`                        |
| `.findByName(name)` | `HeroGearEnhancementLevel \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `HeroGearEnhancementLevel[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                                | Number of results                   |

---

## Examples

```typescript
import { heroGearEnhancement } from 'whiteout-survival-data'

const levelOne = heroGearEnhancement().find('level-1')
levelOne?.cost // [{ itemId: 'enhancement-xp-component', amount: 10 }]

const levelHundred = heroGearEnhancement().byLevel(100).first()
levelHundred?.power // 1086700
```

---

## Notes

The table has 100 rows, one for each level from 1 to 100. Every level costs Enhancement XP Component (`enhancement-xp-component` in [Items](/docs/items)).

Hero Gear has shared upgrade progressions and not a catalog of named pieces. The exclusive piece of a Legendary hero is stored as `Hero.exclusiveWeapon` in [Heroes](/docs/heroes).

`power` is cumulative from enhancement level 1 through empowerment level 100. Empowerment power continues from the power of level 100. See [Hero gear empowerment](/docs/hero-gear-empowerment).

The per piece stats of each level are in [Hero gear stats](/docs/hero-gear-stats).

---

## Next steps

- See [Hero gear empowerment](/docs/hero-gear-empowerment) for the levels after enhancement level 100
- See [Hero gear stats](/docs/hero-gear-stats) for the stats of each level
- Use the [Hero gear calculator](/docs/calculator-hero-gear) to total an upgrade path
