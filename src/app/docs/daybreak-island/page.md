---
title: Daybreak Island
nextjs:
  metadata:
    title: whiteout-survival-data - Daybreak Island
    description: Query the Lumber Camp and Tree of Life upgrade tables and every Daybreak Island decoration.
---

The Daybreak Island upgrade tables and decorations. Look up the Lumber Camp and Tree of Life levels, and the cost, Prosperity, and buff of each decoration. {% .lead %}

Three factories are exported from this module: `lumberCamp()` (10 levels), `treeOfLife()` (10 levels), and `decoration()` (103 decorations in 8 categories).

---

## Types

### `LumberCampLevel`

| Field                     | Type     | Description                |
| ------------------------- | -------- | -------------------------- |
| `id`                      | `string` | Stable identifier          |
| `name`                    | `string` | Display name               |
| `level`                   | `number` | Lumber Camp level          |
| `workers`                 | `number` | Workers at this level      |
| `ratePerSecond`           | `number` | Production rate per second |
| `treeOfLifeLevelRequired` | `number` | Tree of Life level needed  |
| `lifeEssenceRequired`     | `number` | Life Essence required      |

### `TreeOfLifeLevel`

| Field                 | Type             | Description                    |
| --------------------- | ---------------- | ------------------------------ |
| `id`                  | `string`         | Stable identifier              |
| `name`                | `string`         | Display name                   |
| `level`               | `number`         | Tree of Life level             |
| `prosperityRequired`  | `number`         | Prosperity needed              |
| `lifeEssenceRequired` | `number`         | Life Essence needed            |
| `lifeEssencePerHour`  | `number`         | Life Essence produced per hour |
| `buff`                | `TreeOfLifeBuff` | The buff this level gives      |

### `TreeOfLifeBuff` and `DecorationBuff`

Both buff types have the same shape.

| Field    | Type                  | Description                                                   |
| -------- | --------------------- | ------------------------------------------------------------- |
| `stat`   | `string`              | Stat name for display, such as `"Troops Deployment Capacity"` |
| `value`  | `string`              | Value for display, such as `"+1K"`                            |
| `amount` | `number`              | Parsed value, such as `1000`, so buffs can be added up        |
| `unit`   | `'percent' \| 'flat'` | Unit of `amount`                                              |

### `Decoration`

| Field                  | Type                 | Description                                                                                        |
| ---------------------- | -------------------- | -------------------------------------------------------------------------------------------------- |
| `id`                   | `string`             | Stable identifier                                                                                  |
| `name`                 | `string`             | Display name                                                                                       |
| `img`                  | `string?`            | Path to the icon. Set only on decorations that have a picture                                      |
| `category`             | `DecorationCategory` | `'Basic'`, `'Vegetation'`, `'Common'`, `'Uncommon'`, `'Rare'`, `'Epic'`, `'Mythic'`, or `'Unique'` |
| `cost`                 | `DecorationCost[]?`  | Item cost. Basic and Vegetation only                                                               |
| `lifeEssenceCost`      | `number?`            | Life Essence needed to unlock                                                                      |
| `limit`                | `number?`            | How many can be placed                                                                             |
| `prosperityAtMaxLevel` | `number?`            | Common and Uncommon only. These cannot be upgraded, so the value is fixed                          |
| `levels`               | `DecorationLevel[]?` | Rare, Epic, Mythic, and Unique only                                                                |
| `limited`              | `boolean?`           | Set to `true` on limited Epic and Mythic decorations. Omitted otherwise                            |

### `DecorationCost`

| Field    | Type     | Description                                |
| -------- | -------- | ------------------------------------------ |
| `itemId` | `string` | Id in [Items](/docs/items), such as `meat` |
| `amount` | `number` | Amount needed                              |

### `DecorationLevel`

| Field        | Type             | Description                           |
| ------------ | ---------------- | ------------------------------------- |
| `level`      | `number`         | Decoration level                      |
| `cost`       | `number`         | The number needed to reach this level |
| `prosperity` | `number`         | Prosperity at this level              |
| `buff`       | `DecorationBuff` | The buff at this level                |

---

## Factories

```typescript
import { decoration, lumberCamp, treeOfLife } from 'whiteout-survival-data'

lumberCamp() // all 10 Lumber Camp levels
treeOfLife() // all 10 Tree of Life levels
decoration() // all 103 decorations
```

Each factory also accepts a pre-filtered array, for example `decoration(source)`.

### Decorations by category

| Category   | Count | Fields                                                          |
| ---------- | ----- | --------------------------------------------------------------- |
| Basic      | 9     | `cost` (Gems, Wood, or Meat as an `items()` id) and `limit`     |
| Vegetation | 5     | Same as Basic                                                   |
| Common     | 10    | `prosperityAtMaxLevel`, `limit`, `lifeEssenceCost` (1,000)      |
| Uncommon   | 6     | `prosperityAtMaxLevel`, `limit`, `lifeEssenceCost` (2,000)      |
| Rare       | 12    | `levels`, `limit`, `lifeEssenceCost` (3,000)                    |
| Epic       | 11    | `levels`, `limit`, `lifeEssenceCost` (5,000), 4 are `limited`   |
| Mythic     | 48    | `levels`, `limit`, `lifeEssenceCost` (10,000), 42 are `limited` |
| Unique     | 2     | `levels` and `limit`. No standard rarity progression            |

---

## Filters

Only `decoration()` has a filter. `lumberCamp()` and `treeOfLife()` have the terminal methods only.

| Method       | Signature                                  | Description                             |
| ------------ | ------------------------------------------ | --------------------------------------- |
| `byCategory` | `byCategory(category: DecorationCategory)` | Decorations of one `DecorationCategory` |

---

## Terminal methods

All three queries share these methods. `T` is `LumberCampLevel`, `TreeOfLifeLevel`, or `Decoration`.

| Method              | Returns          | Description                         |
| ------------------- | ---------------- | ----------------------------------- |
| `.get()`            | `T[]`            | All results                         |
| `.first()`          | `T \| undefined` | First result                        |
| `.find(id)`         | `T \| undefined` | Find by `id`                        |
| `.findByName(name)` | `T \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `T[]`            | Case-insensitive partial name match |
| `.count()`          | `number`         | Number of results                   |

---

## Constants

| Constant                               | Value                                                 | Description                                    |
| -------------------------------------- | ----------------------------------------------------- | ---------------------------------------------- |
| `DAYBREAK_ISLAND_UNLOCK_FURNACE_LEVEL` | `19`                                                  | Furnace level at which Daybreak Island unlocks |
| `DAYBREAK_ISLAND_TIMBERMILL`           | `{ lifeEssencePerHourPerWorker: 40, capacity: 2000 }` | The Timbermill that replaces the Lumber Camps  |

---

## Examples

```typescript
import {
  DAYBREAK_ISLAND_TIMBERMILL,
  DAYBREAK_ISLAND_UNLOCK_FURNACE_LEVEL,
  decoration,
  lumberCamp,
  treeOfLife,
} from 'whiteout-survival-data'

// Tree of Life level 8 and its buff
const level8 = treeOfLife().find('tree-of-life-level-8')
level8?.buff.stat // 'Troops Deployment Capacity'
level8?.buff.value // '+3K'

// Lumber Camp levels that need Tree of Life level 5 or higher
lumberCamp()
  .get()
  .filter((l) => l.treeOfLifeLevelRequired >= 5)

// Mythic decorations that are not limited
decoration()
  .byCategory('Mythic')
  .get()
  .filter((d) => !d.limited) // 6 decorations

// One decoration with its levels
decoration().find('starry-lighthouse')?.levels?.length // 10

DAYBREAK_ISLAND_UNLOCK_FURNACE_LEVEL // 19
DAYBREAK_ISLAND_TIMBERMILL // { lifeEssencePerHourPerWorker: 40, capacity: 2000 }
```

---

## Notes

Daybreak Island unlocks at Furnace level 19. The player builds the Dock, and the island is discovered after about 3 days in real time.

Two identical Lumber Camps clear the starting forest of the island. Each cleared tree can drop Life Essence, Hero Shards, or gear. After the forest is clear, a Timbermill takes over Life Essence production. It has no levels and no table, so its two flat facts are in `DAYBREAK_ISLAND_TIMBERMILL`.

The Lumber Camps then become normal decorations. All workers of the Lumber Camps go to work in the Timbermill, so the two camps at level 4 or higher, with 2 workers each, give 4 workers. That is 160 Life Essence an hour, and 12.5 hours to fill the 2,000 capacity. The number of workers is derived from the Lumber Camp data.

The Tree of Life `buff` alternates between "Healing Speed +30%" on odd levels and a growing combat or capacity stat on even levels. The pattern breaks at levels 9 and 10, so each `buff` is stored per level and is not computed.

Names and buff text keep the game wording.

### Life Essence cost

The `lifeEssenceCost` of a decoration is set once for its whole rarity: 1,000 for Common, 2,000 for Uncommon, 3,000 for Rare, 5,000 for Epic, and 10,000 for Mythic. Snow Castle (Mythic) is an exception at 12,000.

### Limited decorations

Limited is not a rarity. It is the `limited` flag on a decoration that is otherwise a normal Epic (maximum level 5) or Mythic (maximum level 10). It marks decorations that come from a shop rotation, an event pack, or a ranking reward and not from the Life Essence upgrade path. The flag is omitted, not `false`, on all other decorations. Limited decorations have no `lifeEssenceCost`.

### Unique decorations

The two Unique decorations do not follow a standard rarity progression, so `limited` does not apply to them.

Starry Lighthouse unlocks at Tree of Life level 10 with a 50,000 Life Essence blueprint, and it upgrades to level 10. Its level `cost` counts General Accessory Construction Contracts (0 to 180), not Life Essence. Its `buff` combines two stats, `"Troops' Lethality, Troops' Health"`, at +1% per level. Its `prosperity` rises 2,000 per level to 20,000 at level 10.

Harbor of Hope comes from the Silverfrost Shop on a recurring but irregular basis. That is closer to the standing availability of Starry Lighthouse than to a limited-time Epic or Mythic, so it is `Unique` and not `limited: true`.

### Renamed ids

Two misspelled decoration names are corrected: `hero-s-sanctun` is named "Hero’s Sanctum" and `floating-markert` is named "Floating Market". Their ids keep the old spelling so that no reference breaks. As a result `decoration().find('heros-sanctum')` returns nothing, and `decoration().find('hero-s-sanctun')` has the full level data.

{% callout title="Known gaps" type="warning" %}
Some limited decorations have a confirmed `cost` and `prosperity` for each level but no buff data yet. Those levels carry a blank buff (`stat: ''`, `value: '+0'`, `amount: 0`, `unit: 'flat'`) and are not left out. The per-level buffs of Cannon are not documented, so its levels carry blank buffs.

`img` is set only on decorations that have a picture so far.
{% /callout %}

---

## Next steps

- See [Items](/docs/items) for the ids used in decoration `cost`
- See [Facilities](/docs/facilities) and [Buildings](/docs/buildings) for the city side of the game
- Read the [query builder](/docs/query-builder) guide for more filter patterns
