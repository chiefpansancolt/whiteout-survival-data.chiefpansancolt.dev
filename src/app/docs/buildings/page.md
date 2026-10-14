---
title: Buildings
nextjs:
  metadata:
    title: whiteout-survival-data - Buildings
    description: Query all 27 city buildings with their level-by-level costs, build times, power, prerequisites, and bonuses.
---

All 27 city buildings with their full level-by-level upgrade progression. Read the cost, build time, power, prerequisites, and building-specific bonuses of any level. {% .lead %}

Buildings that cannot be upgraded, such as the Hero Hall, are in [Facilities](/docs/facilities).

---

## Types

### `Building`

| Field            | Type               | Description                                            |
| ---------------- | ------------------ | ------------------------------------------------------ |
| `id`             | `string`           | Stable identifier                                      |
| `name`           | `string`           | Display name                                           |
| `category`       | `BuildingCategory` | `'Military'`, `'Inner City'`, or `'Entertainment'`     |
| `img`            | `string?`          | Path to the building's icon                            |
| `fireCrystalImg` | `string?`          | Path to the Fire Crystal icon, if the building has one |
| `description`    | `string?`          | What the building does                                 |
| `maxLevelLabel`  | `string`           | Label of the last level, such as `"FC 10"`             |
| `levels`         | `BuildingLevel[]`  | Every level, in order                                  |

### `BuildingLevel`

| Field                       | Type                          | Description                                                                       |
| --------------------------- | ----------------------------- | --------------------------------------------------------------------------------- |
| `id`                        | `string`                      | Stable identifier                                                                 |
| `label`                     | `string`                      | Level label, such as `"30"`, `"30-1"`, `"FC 1"`, or `"FC 1-1"`                    |
| `order`                     | `number`                      | Position of the level in the progression                                          |
| `tier`                      | `'standard' \| 'fireCrystal'` | Whether this is a standard or a Fire Crystal level                                |
| `fcStage`                   | `number?`                     | Fire Crystal stage. `0` for the `30-1` to `30-4` levels. Fire Crystal levels only |
| `fcSubLevel`                | `number?`                     | Sub-level inside a stage. Omitted on a stage base row                             |
| `prerequisites`             | `BuildingRequirement[]?`      | Buildings and levels required first                                               |
| `cost`                      | `Resource[]`                  | Resources needed to build the level                                               |
| `buildTimeSeconds`          | `number`                      | Build time in seconds                                                             |
| `power`                     | `number`                      | Power of the level                                                                |
| `developmentIndex`          | `number`                      | Score the level adds toward the SvS Wish Station event                            |
| `rallyCapacity`             | `number?`                     | Rally troop capacity                                                              |
| `marchCapacity`             | `number?`                     | March troop capacity                                                              |
| `trainingCapacity`          | `number?`                     | Troops trained at once                                                            |
| `trainingSpeedBonusPercent` | `number?`                     | Set on every standard level, then only on Fire Crystal stage base rows            |
| `researchSpeedBonusPercent` | `number?`                     | Research speed bonus                                                              |
| `infirmaryCapacity`         | `number?`                     | Set on every standard level, then only on Fire Crystal stage base rows            |
| `allyAssists`               | `number?`                     | Alliance assists                                                                  |
| `allyHelpTimeSeconds`       | `number?`                     | Alliance help time in seconds                                                     |
| `reinforceCapacity`         | `number?`                     | Reinforcement capacity                                                            |
| `storehouseCapacity`        | `number?`                     | Protected resource capacity                                                       |
| `barricadeDurability`       | `number?`                     | City defense durability                                                           |
| `troopDeploymentCapacity`   | `number?`                     | Troop deployment capacity                                                         |

A bonus field is present only on the buildings that have that stat.

### `BuildingRequirement`

| Field      | Type               | Description                              |
| ---------- | ------------------ | ---------------------------------------- |
| `building` | `string`           | Name of the required building            |
| `level`    | `number \| string` | Required level, such as `10` or `"FC 2"` |

### `Resource`

| Field          | Type      | Description                                                     |
| -------------- | --------- | --------------------------------------------------------------- |
| `name`         | `string`  | Resource or furniture name                                      |
| `count`        | `number`  | Amount needed                                                   |
| `itemId`       | `string?` | Matching id in [Items](/docs/items)                             |
| `pricePerItem` | `number?` | Price of one furniture piece. Entertainment building costs only |

Wood, Coal, Iron, Meat, Fire Crystals, and Refined Fire Crystals resolve to the items `wood`, `coal`, `iron`, `meat`, `fire-crystal`, and `refined-fire-crystal`. Furniture costs resolve to a `Furniture` item.

---

## Factory

```typescript
import { buildings } from 'whiteout-survival-data'

buildings() // all 27 buildings
buildings(source) // wrap a pre-filtered array
```

---

## Filters

| Method       | Signature                                | Description                                                             |
| ------------ | ---------------------------------------- | ----------------------------------------------------------------------- |
| `byCategory` | `byCategory(category: BuildingCategory)` | Buildings in `Military` (11), `Inner City` (7), or `Entertainment` (9). |

---

## Terminal methods

| Method              | Returns                 | Description                         |
| ------------------- | ----------------------- | ----------------------------------- |
| `.get()`            | `Building[]`            | All results                         |
| `.first()`          | `Building \| undefined` | First result                        |
| `.find(id)`         | `Building \| undefined` | Find by `id`                        |
| `.findByName(name)` | `Building \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `Building[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                | Number of results                   |

---

## Examples

```typescript
import { buildings } from 'whiteout-survival-data'

const furnace = buildings().find('furnace')
furnace?.maxLevelLabel // "FC 10"
furnace?.levels.length // 80

// The 11 military buildings
buildings().byCategory('Military').get()

// Training capacity of an Infantry Camp at FC 1
const camp = buildings().findByName('Infantry Camp')
camp?.levels.find((level) => level.label === 'FC 1')?.trainingCapacity // 234

// Ally assists at Embassy level 1
buildings().find('embassy')?.levels[0].allyAssists // 1
```

---

## Notes

### Level shape

Most buildings have 80 levels. These are standard levels 1 to 30, then 50 Fire Crystal entries: `30-1` to `30-4`, then `FC 1` to `FC 9` (each a base row plus four sub-levels `FC N-1` to `FC N-4`), and `FC 10` alone as the max level. Fire Crystal levels add Fire Crystals to the cost from `FC 1` and Refined Fire Crystals from `FC 5-1`. Furnace, Embassy, Command Center, the three Camps, and Infirmary have this shape.

Other buildings have a different length.

| Buildings                                   | Levels | Notes                                                                  |
| ------------------------------------------- | ------ | ---------------------------------------------------------------------- |
| Research Center, Storehouse                 | 30     | No Fire Crystal tier. `fireCrystalImg` is omitted.                     |
| Barricade                                   | 10     | Last numeric level is the max level.                                   |
| War Academy                                 | 46     | Starts at `FC 1` with no cost. No standard tier.                       |
| Hunter's Hut, Sawmill, Coal Mine, Iron Mine | 31     | Levels 1 to 30, then one bonus `FC 1` level with no Fire Crystal cost. |
| Clinic, Cookhouse, Shelter                  | 11     | Levels 1 to 10, then one bonus `FC 1` level.                           |
| The nine Entertainment buildings            | 1      | A single level. `maxLevelLabel` is `"1"`.                              |

### Derived Fire Crystal prerequisites

Each Fire Crystal level needs the previous level of the same building, so the package derives `prerequisites` for that range. The entry names the building itself.

- A tier base row (`FC N`) requires the last sub-level of the previous tier (`FC (N-1)-4`).
- The first sub-level (`FC N-1`) requires the base row of the same tier (`FC N`).
- Each later sub-level (`FC N-2` to `FC N-4`) requires the one before it.
- The pre-Fire-Crystal stage (`30-1` to `30-4`) chains from standard level 30.
- `FC 1-1` is the exception. It requires standard level 30 directly, because there is no tier 0 base.

Command Center Fire Crystal levels also have a cross-building gate on Furnace and Embassy. The three Camps and Infirmary have a Furnace-only gate.

### Entertainment buildings

The nine Entertainment buildings have no upgrade path. A Furnace Fire Crystal level gates each one (FC 3, FC 4, or FC 5, depending on the building). Their `cost` entries are furniture pieces and carry a `pricePerItem`. Every level has `troopDeploymentCapacity`. None has a published portrait, so `img` is omitted on these nine, which is why `Building.img` is optional.

### Development index

Every level has a `developmentIndex`. It is the score the level adds toward the SvS Wish Station event.

### Shelter

Shelter is one entry, even though a player can build up to eight. The Furnace `prerequisites` text refers to numbered instances (`"Shelter 1"`, `"Shelter 3"`) as plain strings that are not linked to this entry.

---

## Next steps

- See [Facilities](/docs/facilities) for the buildings that have no levels
- Browse the [Fire Crystal table](/docs/fire-crystal-table) for the Fire Crystal cost of each tier
- Use the [Buildings calculator](/docs/calculator-buildings) to total an upgrade path
- Look up the resource and furniture ids in [Items](/docs/items)
