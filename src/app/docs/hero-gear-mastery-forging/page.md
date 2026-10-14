---
title: Hero gear mastery forging
nextjs:
  metadata:
    title: whiteout-survival-data - Hero gear mastery forging
    description: Query the Mastery Forging table for Gold quality Hero Gear with cost and stats bonus.
---

The Mastery Forging table, a system exclusive to Gold quality Hero Gear. Read the cost and the stats bonus of a mastery forging row. {% .lead %}

---

## Types

### `HeroGearMasteryForgingLevel`

| Field            | Type             | Description                                  |
| ---------------- | ---------------- | -------------------------------------------- |
| `id`             | `string`         | Stable identifier, such as `level-4-stage-2` |
| `name`           | `string`         | Display name, such as `Level 4 Stage 2`      |
| `level`          | `number`         | Mastery level from 1 to 20                   |
| `stage`          | `number`         | Stage inside the level, 0 to 4               |
| `cost`           | `HeroGearCost[]` | Items needed for the row                     |
| `statsUpPercent` | `number`         | Bonus to the stats of the piece, in percent  |

### `HeroGearCost`

| Field    | Type     | Description                |
| -------- | -------- | -------------------------- |
| `itemId` | `string` | Id in [Items](/docs/items) |
| `amount` | `number` | Amount needed              |

---

## Factory

```typescript
import { heroGearMasteryForging } from 'whiteout-survival-data'

heroGearMasteryForging() // all 84 rows
heroGearMasteryForging(source) // wrap a pre-filtered array
```

---

## Filters

| Method    | Signature                | Description                              |
| --------- | ------------------------ | ---------------------------------------- |
| `byLevel` | `byLevel(level: number)` | Every stage row of mastery level `level` |

---

## Terminal methods

| Method              | Returns                                    | Description                         |
| ------------------- | ------------------------------------------ | ----------------------------------- |
| `.get()`            | `HeroGearMasteryForgingLevel[]`            | All results                         |
| `.first()`          | `HeroGearMasteryForgingLevel \| undefined` | First result                        |
| `.find(id)`         | `HeroGearMasteryForgingLevel \| undefined` | Find by `id`                        |
| `.findByName(name)` | `HeroGearMasteryForgingLevel \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `HeroGearMasteryForgingLevel[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                                   | Number of results                   |

---

## Examples

```typescript
import { heroGearMasteryForging } from 'whiteout-survival-data'

// Every stage row of mastery level 4
const levelFour = heroGearMasteryForging().byLevel(4).get()
levelFour.map((row) => row.id) // level-4-stage-0 to level-4-stage-4

const last = heroGearMasteryForging().find('level-20-stage-0')
last?.statsUpPercent // 200
last?.cost
// [{ itemId: 'essence-stones', amount: 40 }, { itemId: 'custom-mythic-hero-gear-chest', amount: 2 }]
```

---

## Data shape

The table has 84 rows. Levels 1 to 3 and level 20 have one row each (stage 0). Levels 4 to 19 have 5 rows each (stages 0 to 4). The bonus rises from 10 at level 1 to 200 at level 20.

Every row costs Essence Stones. Custom Mythic Hero Gear Chests are added from `level-11-stage-0`. Six rows of levels 11 to 13 have no chest cost: stages 1, 2, and 4 of level 11, stages 1 and 3 of level 12, and stage 1 of level 13. Every row of levels 14 to 20 has a chest cost.

---

## Notes

Mastery forging past `level-10-stage-0` needs the piece at enhancement level 100. Empowerment needs the piece at mastery forging `level-10-stage-0`, the Level 10 row (+100%).

[Hero gear stats](/docs/hero-gear-stats) values are multiplied by 1 plus the `statsUpPercent` of the row to get the stats of a forged piece.

---

## Next steps

- See [Hero gear stats](/docs/hero-gear-stats) for the stats that forging multiplies
- See [Hero gear empowerment](/docs/hero-gear-empowerment) for the levels that follow forging
- Use the [Hero gear calculator](/docs/calculator-hero-gear) to total an upgrade path
