---
title: Chief Gear
nextjs:
  metadata:
    title: whiteout-survival-data - Chief Gear
    description: Query the six Chief Gear slots, the shared upgrade table, and the set bonuses.
---

The six Chief Gear slots, the shared upgrade table that every piece progresses through, and the set bonus of each tier. {% .lead %}

Every equipped piece uses the same table, so a `ChiefGearLevel` is an upgrade step and not a named item. Use it to look up the materials, stat gain, power, and score of each step. This page covers `chiefGearSlots()`, `chiefGear()`, `chiefGearSetBonuses()`, and `chiefGearSetBonus()`. To turn one gear material into another, see [Chief Gear converter](/docs/chief-gear-converter). To plan a full upgrade, see the [Chief Gear calculator](/docs/calculator-chief-gear).

---

## Types

### `ChiefGearSlot`

| Field       | Type                              | Description                                                               |
| ----------- | --------------------------------- | ------------------------------------------------------------------------- |
| `id`        | `string`                          | Stable identifier, such as `cap`                                          |
| `name`      | `string`                          | Display name                                                              |
| `troopType` | `ChiefGearTroopType`              | `Lancer`, `Infantry`, or `Marksman`                                       |
| `images`    | `Record<ChiefGearRarity, string>` | One icon for each rarity: `Common`, `Rare`, `Epic`, `Mythic`, `Legendary` |

### `ChiefGearLevel`

| Field                      | Type                  | Description                                                                                      |
| -------------------------- | --------------------- | ------------------------------------------------------------------------------------------------ |
| `id`                       | `string`              | Stable identifier, such as `common-star-0`                                                       |
| `order`                    | `number`              | Position in the table, from 1                                                                    |
| `name`                     | `string`              | Display name, such as `Common Star 0`                                                            |
| `tier`                     | `string`              | Tier label, such as `Epic` or `LegendaryT3`                                                      |
| `tierId`                   | `string`              | The tier in kebab case, such as `epic-t1`. It is the `id` of the tier in `chiefGearSetBonuses()` |
| `stars`                    | `number`              | Star position in the tier. Restarts in each tier                                                 |
| `stage`                    | `number`              | Stage position in the tier. Restarts in each tier                                                |
| `materials`                | `ChiefGearMaterial[]` | Item ids from `items()` and the amount needed for the step                                       |
| `troopsDeploymentCapacity` | `number?`             | Deployment capacity gained. Absent for the first 26 rows                                         |
| `statTotalPercent`         | `number`              | Total stat bonus at this step                                                                    |
| `powerTotal`               | `number`              | Total power at this step                                                                         |
| `score`                    | `number`              | Gear score that the step to this row adds                                                        |

The 14 tiers are `Common`, `Rare`, `Epic`, `EpicT1`, `Mythic`, `MythicT1`, `MythicT2`, `Legendary`, and `LegendaryT1` to `LegendaryT6`.

### `ChiefGearMaterial`

| Field    | Type     | Description          |
| -------- | -------- | -------------------- |
| `itemId` | `string` | An id from `items()` |
| `amount` | `number` | Amount needed        |

The materials are Hardened Alloy, Polishing Solution, Design Plans, and Lunar Amber.

### `ChiefGearSetBonusTier`

| Field     | Type     | Description                                    |
| --------- | -------- | ---------------------------------------------- |
| `id`      | `string` | The tier in kebab case. Matches `level.tierId` |
| `name`    | `string` | Display name, such as `Mythic T1`              |
| `percent` | `number` | Set bonus percent for the tier                 |

### `ChiefGearSetBonus`

| Field     | Type                    | Description                                                    |
| --------- | ----------------------- | -------------------------------------------------------------- |
| `pieces`  | `3 \| 6`                | Pieces the bonus needs                                         |
| `stat`    | `'Defense' \| 'Attack'` | Stat the bonus raises                                          |
| `percent` | `number`                | Bonus percent. `0` when the bonus is not active                |
| `tierId`  | `string?`               | Tier that gives the bonus. Absent when the bonus is not active |

`chiefGearSetBonus()` returns `ChiefGearSetBonuses`, an object with a `threePiece` and a `sixPiece` field of this type.

---

## Factories

```typescript
import {
  chiefGearSlots,
  chiefGear,
  chiefGearSetBonuses,
} from 'whiteout-survival-data'

chiefGearSlots() // all 6 slots
chiefGear() // all 150 upgrade steps
chiefGearSetBonuses() // all 14 tier set bonuses

chiefGearSlots(source) // wrap a pre-filtered array
```

`chiefGearSlots()` holds Cap, Watch, Coat, Pants, Ring, and Weapon. Cap and Watch buff Lancer, Coat and Pants buff Infantry, and Ring and Weapon buff Marksman.

---

## Filters

| Method                               | Signature                                    | Description                                         |
| ------------------------------------ | -------------------------------------------- | --------------------------------------------------- |
| `chiefGearSlots().byTroopType(type)` | `byTroopType(troopType: ChiefGearTroopType)` | Slots that buff `Lancer`, `Infantry`, or `Marksman` |
| `chiefGear().byTier(tier)`           | `byTier(tier: string)`                       | Rows with exactly this tier label                   |

`byTier('Epic')` does not match `EpicT1`.

`chiefGearSetBonuses()` has the terminal methods only.

---

## Helpers

| Function                      | Returns               | Description                                                          |
| ----------------------------- | --------------------- | -------------------------------------------------------------------- |
| `chiefGearRarity(tier)`       | `ChiefGearRarity`     | Removes the `T` suffix from a tier label and returns the base rarity |
| `chiefGearImage(slot, level)` | `string`              | The slot icon that matches the base rarity of a level                |
| `chiefGearSetBonus(levelIds)` | `ChiefGearSetBonuses` | The 3 piece and 6 piece set bonuses of the pieces a chief wears      |

`chiefGearSetBonus(levelIds)` takes the ids of the `chiefGear()` levels of the pieces worn, at most 6. It throws `Error` for an unknown level id and `RangeError` when more than 6 ids are given.

The constant `CHIEF_GEAR_SET_BONUS` holds the two rules: 3 pieces for `Defense`, 6 pieces for `Attack`, on `infantry`, `lancer`, and `marksman`.

---

## Terminal methods

| Method              | Returns          | Description                         |
| ------------------- | ---------------- | ----------------------------------- |
| `.get()`            | `T[]`            | All results                         |
| `.first()`          | `T \| undefined` | First result                        |
| `.find(id)`         | `T \| undefined` | Find by `id`                        |
| `.findByName(name)` | `T \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `T[]`            | Case-insensitive partial name match |
| `.count()`          | `number`         | Number of results                   |

`T` is `ChiefGearSlot` for `chiefGearSlots()`, `ChiefGearLevel` for `chiefGear()`, and `ChiefGearSetBonusTier` for `chiefGearSetBonuses()`.

---

## Examples

```typescript
import {
  chiefGear,
  chiefGearImage,
  chiefGearSetBonus,
  chiefGearSetBonuses,
  chiefGearSlots,
} from 'whiteout-survival-data'

// Slots that buff Infantry
chiefGearSlots().byTroopType('Infantry').get() // Coat, Pants

// Every row of the Epic tier
chiefGear().byTier('Epic').count() // 4

// Materials for one upgrade step
chiefGear().find('common-star-0')?.materials
// [{ itemId: 'hardened-alloy', amount: 1500 }, { itemId: 'polishing-solution', amount: 15 }]

// Icon of a slot at the rarity of a level
const cap = chiefGearSlots().find('cap')
const level = chiefGear().find('epic-t1-star-0')
if (cap && level) chiefGearImage(cap, level) // '/images/chief-gear/Cap-Epic.png'

// Set bonus of one tier
chiefGearSetBonuses().find('mythic-t1') // { id: 'mythic-t1', name: 'Mythic T1', percent: 8 }

// Set bonuses of the six pieces a chief wears
const sets = chiefGearSetBonus([
  'mythic-t1-star-0',
  'mythic-t1-star-1',
  'mythic-t1-star-2',
  'epic-star-0',
  'epic-star-0',
  'epic-star-0',
])
sets.threePiece // { pieces: 3, stat: 'Defense', percent: 8, tierId: 'mythic-t1' }
sets.sixPiece // { pieces: 6, stat: 'Attack', percent: 0 }
```

---

## Notes

`troopsDeploymentCapacity` starts at Mythic T2 star 3 stage 1, so the first 26 rows leave it unset.

A piece changes its look at the 5 rarity points only, not at each of the 150 rows. Every sub-tier uses the icon of its base rarity. The star and stage counters are a UI overlay and not separate images.

The score is what events count. A whole level scores 1,125 and 1,875 for the two Common levels, 3,000 to 5,440 for Rare, 3,230 to 4,085 for Epic, 6,250 for every Mythic level, and 9,560 for Legendary up to T3. From Legendary T4 it is 15,560, 15,400, or 15,390. The steps that lead to a level split its score evenly. The score does not depend on power.

### Set bonus

A chief that wears 3 pieces of the same quality gets a Defense bonus for Infantry, Lancer, and Marksman. A chief that wears all 6 pieces of the same quality also gets an Attack bonus for all three. Each tier has one value, and the 3 piece bonus and the 6 piece bonus have the same value.

| Tier         | Percent |
| ------------ | ------- |
| Common       | 5       |
| Rare         | 5.5     |
| Epic         | 6       |
| Epic T1      | 6.5     |
| Mythic       | 7       |
| Mythic T1    | 8       |
| Mythic T2    | 9       |
| Legendary    | 10      |
| Legendary T1 | 12      |
| Legendary T2 | 14      |
| Legendary T3 | 16      |
| Legendary T4 | 18      |
| Legendary T5 | 20      |
| Legendary T6 | 22      |

{% callout type="warning" title="Some set bonus values are assumptions" %}
The values of Mythic T1 (8), Mythic T2 (9), Legendary T1 (12), and Legendary T2 (14) were read in the game. The other values are assumptions. The step is 1 from Mythic T1 to Mythic T2 and 2 from Legendary T1 to Legendary T2, and the other values continue that rise. Check them in the game before you rely on them.

The calculation rules are also assumptions. Pieces count by the tier of their level, so two levels of one tier match. The 3 piece bonus uses the highest tier that has at least 3 pieces. The 6 piece bonus needs all 6 pieces in one tier. A higher tier does not count toward a lower one.
{% /callout %}

---

## Next steps

- Convert materials with the [Chief Gear converter](/docs/chief-gear-converter)
- See [Chief Charm](/docs/chief-charm) for the matching charm table
- Plan upgrades with the [Chief Gear calculator](/docs/calculator-chief-gear)
- Look up material icons in [Items](/docs/items)
