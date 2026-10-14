---
title: Chief Charm
nextjs:
  metadata:
    title: whiteout-survival-data - Chief Charm
    description: Query the three Chief Charm slots and the shared upgrade table.
---

The three Chief Charm slots and the shared upgrade table that every charm progresses through. {% .lead %}

Use it to look up the materials, stat gain, power, and score of each charm upgrade step. The table has the same shape as the [Chief Gear](/docs/chief-gear) table, without deployment capacity.

---

## Types

### `ChiefCharmSlot`

| Field       | Type                 | Description                                        |
| ----------- | -------------------- | -------------------------------------------------- |
| `id`        | `string`             | Stable identifier                                  |
| `name`      | `string`             | Display name                                       |
| `troopType` | `ChiefGearTroopType` | `Lancer`, `Infantry`, or `Marksman`                |
| `images`    | `string[]`           | 18 icons. The icon of level `n` is `images[n - 1]` |

### `ChiefCharmLevel`

| Field              | Type                   | Description                                   |
| ------------------ | ---------------------- | --------------------------------------------- |
| `id`               | `string`               | Stable identifier, such as `level-11-stage-1` |
| `order`            | `number`               | Position in the table, from 1                 |
| `name`             | `string`               | Display name, such as `Level 11 Stage 1`      |
| `level`            | `number`               | Charm level, 1 to 18                          |
| `stage`            | `number`               | Stage within the level                        |
| `materials`        | `ChiefCharmMaterial[]` | Item ids from `items()` and the amount needed |
| `statTotalPercent` | `number`               | Total stat bonus at this step                 |
| `powerTotal`       | `number`               | Total power at this step                      |
| `score`            | `number`               | Charm score that the step to this entry adds  |

### `ChiefCharmMaterial`

| Field    | Type     | Description          |
| -------- | -------- | -------------------- |
| `itemId` | `string` | An id from `items()` |
| `amount` | `number` | Amount needed        |

The materials are Charm Guide, Charm Design, and Charm Secrets.

---

## Factories

```typescript
import { chiefCharmSlots, chiefCharm } from 'whiteout-survival-data'

chiefCharmSlots() // all 3 slots (Infantry, Lancer, Marksman)
chiefCharm() // all 75 upgrade steps

chiefCharm(source) // wrap a pre-filtered array
```

---

## Filters

| Method                                | Signature                                    | Description                                         |
| ------------------------------------- | -------------------------------------------- | --------------------------------------------------- |
| `chiefCharmSlots().byTroopType(type)` | `byTroopType(troopType: ChiefGearTroopType)` | Slots that buff `Lancer`, `Infantry`, or `Marksman` |
| `chiefCharm().byLevel(level)`         | `byLevel(level: number)`                     | Steps of one charm level                            |

---

## Helpers

| Function                       | Returns  | Description                                 |
| ------------------------------ | -------- | ------------------------------------------- |
| `chiefCharmImage(slot, level)` | `string` | The icon of a slot for a level from 1 to 18 |

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

`T` is `ChiefCharmSlot` for `chiefCharmSlots()` and `ChiefCharmLevel` for `chiefCharm()`.

---

## Examples

```typescript
import {
  chiefCharm,
  chiefCharmImage,
  chiefCharmSlots,
} from 'whiteout-survival-data'

// Every step of charm level 11
chiefCharm().byLevel(11).count() // 5

// Materials for one step. Charm Secrets first appears at level 11 stage 1
chiefCharm()
  .find('level-11-stage-1')
  ?.materials.map((m) => m.itemId)
// ['charm-guide', 'charm-design', 'charm-secrets']

// The charm that buffs Marksman, and its icon at level 18
const marksman = chiefCharmSlots().byTroopType('Marksman').first()
if (marksman) chiefCharmImage(marksman, 18) // '/images/chief-charm/Marksman-18.png'
```

---

## Notes

Charm Secrets appears only from level 11 stage 1. The table lists exactly the materials of each step, so a step does not always have three.

A charm changes its look at each of its 18 levels. For that reason `images` is a plain array and not a map by rarity, as it is for Chief Gear.

The score is what events count. A whole level scores 625, 1,250, 3,125, 8,750, 11,250, 12,500, 12,500, 13,000, 14,000, 15,000, 16,000, 17,000, 18,000, 19,000, 20,000, 21,000, 22,500, and 24,300 for levels 1 to 18. The score does not depend on power. The steps that lead up to a level carry its score, so the rows `level-4-stage-1`, `level-4-stage-2`, `level-4-stage-3`, and `level-5-stage-0` together score 11,250, the whole score of level 5.

{% callout type="warning" title="The score split is not confirmed" %}
A level with several steps splits its score evenly over them, with the remainder on the first steps. The game does not confirm this split.
{% /callout %}

---

## Next steps

- Convert materials with the [Chief Charm converter](/docs/chief-charm-converter)
- See [Chief Gear](/docs/chief-gear) for the matching gear table
- Plan upgrades with the [Chief Charm calculator](/docs/calculator-chief-charm)
- Look up material icons in [Items](/docs/items)
