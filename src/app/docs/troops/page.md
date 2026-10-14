---
title: Troops
nextjs:
  metadata:
    title: whiteout-survival-data - Troops
    description: Query the cost, training time, power, and unlock requirements of every troop tier.
---

The cost, training time, power, and unlock requirements of every tier for the three troop types: Infantry, Lancer, and Marksman. {% .lead %}

The module has 3 entries, each with tiers 1 to 12. The [Troops calculator](/docs/calculator-troops) reads this table.

---

## Types

### `TroopData`

| Field   | Type                                   | Description       |
| ------- | -------------------------------------- | ----------------- |
| `id`    | `'infantry' \| 'lancer' \| 'marksman'` | Stable identifier |
| `name`  | `string`                               | Display name      |
| `tiers` | `TroopTier[]`                          | Tiers 1 to 12     |

### `TroopTier`

| Field                 | Type                       | Description                                                            |
| --------------------- | -------------------------- | ---------------------------------------------------------------------- |
| `tier`                | `number`                   | Tier number, 1 to 12                                                   |
| `power`               | `number?`                  | Power of one troop at Fire Crystal level 0                             |
| `fireCrystalPower`    | `TroopFireCrystalPower[]?` | Power at Fire Crystal levels 1 to 10. Tiers 10 and 11 only             |
| `unlockCampLevel`     | `number?`                  | Camp level of the troop type that unlocks the tier. Tiers 1 to 10 only |
| `unlockRequirements`  | `ResearchRequirement[]?`   | Building and research requirements. Tiers 11 and 12 only               |
| `cost`                | `TroopMaterial[]`          | Meat, wood, coal, and iron for one troop                               |
| `trainingTimeSeconds` | `number`                   | Seconds to train one troop with no training speed bonus                |
| `promotionCost`       | `TroopMaterial[]?`         | Resources to promote one troop from tier 11 to tier 12. Tier 12 only   |

### `TroopMaterial`

| Field    | Type     | Description          |
| -------- | -------- | -------------------- |
| `itemId` | `string` | An id from `items()` |
| `amount` | `number` | Amount needed        |

### `TroopFireCrystalPower`

| Field   | Type     | Description                 |
| ------- | -------- | --------------------------- |
| `level` | `number` | Fire Crystal level, 1 to 10 |
| `power` | `number` | Power of one troop          |

---

## Factory

```typescript
import { troops } from 'whiteout-survival-data'

troops() // all 3 troop types
troops(source) // wrap a pre-filtered array
```

---

## Filters and sorts

`troops()` has no filters or sorts of its own.

---

## Helpers

| Function                                     | Returns                  | Description                                                                                            |
| -------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------ |
| `troopPower(troop, tier, fireCrystalLevel?)` | `number \| undefined`    | Power of one troop of a tier at a Fire Crystal level. Level `0`, the default, is the base power        |
| `highestTierAtCampLevel(troop, campLevel)`   | `TroopTier \| undefined` | Highest tier that the camp of the troop type can train at a camp level. `undefined` below camp level 1 |

A tier that does not change with the Fire Crystal level returns its base power at any level. `troopPower` returns `undefined` for an unknown tier, or for a level above 10 on tier 10 or 11.

`highestTierAtCampLevel` never returns tier 11 or 12, because those tiers do not depend on the camp level.

---

## Terminal methods

| Method              | Returns                  | Description                         |
| ------------------- | ------------------------ | ----------------------------------- |
| `.get()`            | `TroopData[]`            | All results                         |
| `.first()`          | `TroopData \| undefined` | First result                        |
| `.find(id)`         | `TroopData \| undefined` | Find by `id`                        |
| `.findByName(name)` | `TroopData \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `TroopData[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                 | Number of results                   |

---

## Examples

```typescript
import {
  highestTierAtCampLevel,
  troopPower,
  troops,
} from 'whiteout-survival-data'

const infantry = troops().find('infantry')
infantry?.tiers.length // 12

const tier12 = infantry?.tiers.find((tier) => tier.tier === 12)
tier12?.trainingTimeSeconds // 215
tier12?.promotionCost?.map((material) => material.amount) // [3476, 2613, 604, 120]
tier12?.power // 178

if (infantry) {
  // Power of one troop at Fire Crystal level 10, for tier 11
  troopPower(infantry, 11, 10) // 148
  troopPower(infantry, 11) // 80, the base power

  // The highest tier that camp level 19 can train
  highestTierAtCampLevel(infantry, 19)?.tier // 7

  // What tier 11 needs
  infantry.tiers[10].unlockRequirements
  // [
  //   { type: 'building', id: 'war-academy', level: 'FC 1' },
  //   { type: 'research', id: 'helios-infantry', level: 1 },
  // ]
}
```

---

## Notes

The three types have the same power at each tier.

| Tier  | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  | 12  |
| ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Power | 3   | 4   | 6   | 9   | 13  | 20  | 28  | 38  | 50  | 66  | 80  | 178 |

Tiers 1 to 10 have `unlockCampLevel`: 1, 4, 7, 11, 13, 16, 19, 22, 26, and 30. The camp levels are the same for the Infantry, Lancer, and Marksman camps.

Tiers 11 and 12 have `unlockRequirements` instead, in the same shape as the requirements of [Research](/docs/research). Tier 11 needs the War Academy at `FC 1` and the Helios research of the type. Tier 12 needs the War Academy at `FC 10` and the Exalted research of the type. The `id` of a research requirement is the capstone node: `helios-infantry` and `exalted-infantry`, and the same for the other two types.

The training time of a tier is the same for all three types, and the costs differ. `promotionCost` is stored because it is not the difference of the two training costs.

Tiers 10 and 11 have `fireCrystalPower`. Tier 12 does not change with the Fire Crystal level and has no table. The three types have the same values.

| Tier | FC 0 | FC 1 | FC 2 | FC 3 | FC 4 | FC 5 | FC 6 | FC 7 | FC 8 | FC 9 | FC 10 |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ----- |
| 10   | 66   | 71   | 76   | 83   | 88   | 94   | 99   | 104  | 110  | 115  | 121   |
| 11   | 80   | 86   | 92   | 100  | 106  | 114  | 120  | 126  | 135  | 141  | 148   |

{% callout type="warning" title="Known gaps and derived values" %}
It is not known whether tiers 11 and 12 also need a camp level.

The tier 12 costs are partly derived. The Marksman promotion cost was measured in the game, and the Infantry and Lancer promotion costs were scaled from it.
{% /callout %}

---

## Next steps

- Plan training with the [Troops calculator](/docs/calculator-troops)
- See [Research](/docs/research) for the Helios and Exalted research that gates tiers 11 and 12
- See [Buildings](/docs/buildings) for the War Academy levels
