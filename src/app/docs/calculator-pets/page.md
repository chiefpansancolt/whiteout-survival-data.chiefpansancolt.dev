---
title: Pets
nextjs:
  metadata:
    title: whiteout-survival-data - Pets
    description: Calculate the pet food, advancement items, stat gains, and event points to level pets.
---

Calculates the pet food, advancement items, stat gains, and event points to level pets from a current level to a goal level. {% .lead %}

---

## Signature

```typescript
import { calculatePets } from 'whiteout-survival-data'

calculatePets(goals?: PetGoal[]): PetCalculation
```

---

## Input

### `PetGoal`

`goals` has one entry for each pet and defaults to an empty list.

| Field             | Type      | Description                                                                              |
| ----------------- | --------- | ---------------------------------------------------------------------------------------- |
| `id`              | `string`  | Pet `id` from [`pets()`](/docs/pets)                                                     |
| `current`         | `number`  | Level of the pet now, from 1 to the max level of the pet                                 |
| `goal`            | `number`  | Level to reach, from `current` to the max level of the pet                               |
| `currentAdvanced` | `boolean` | Optional. True when the pet is already advanced at `current`                             |
| `goalAdvanced`    | `boolean` | Optional. True to pay for the advancement at `goal` too. Both flags are false by default |

An advanced flag is valid only on a level that is a multiple of `PET_ADVANCEMENT_INTERVAL` (10).

---

## Result

### `PetCalculation`

The result has one entry in `items` for each goal, and the same fields summed over all goals.

| Field              | Type                | Description                                                                   |
| ------------------ | ------------------- | ----------------------------------------------------------------------------- |
| `items`            | `PetItemResult[]`   | One entry for each goal                                                       |
| `levels`           | `number`            | Levels gained                                                                 |
| `advancements`     | `number`            | Advancements paid for                                                         |
| `resources`        | `UpgradeMaterial[]` | `itemId` and `amount` pairs: pet food and the advancement items               |
| `troopAttack`      | `number`            | Gain in Troop Attack in percent, rounded to 2 decimals                        |
| `troopDefense`     | `number`            | Gain in Troop Defense in percent, rounded to 2 decimals                       |
| `power`            | `number`            | Gain in troops power                                                          |
| `advancementScore` | `number`            | Pet advancement score of the advancements paid for                            |
| `eventPoints`      | `PetEventPoints`    | Event points of the score for `svs`, `allianceShowdown`, and `kingOfIcefield` |

Each item also has the pet `id` and `name`.

---

## How it works

Each level after `current` up to `goal` costs the pet food of that level. A pet advances at every level that is a multiple of 10 and needs the advancement to go past that level. A range that starts at or passes such a level pays for the advancement items of that level. A goal that is a multiple of 10 pays for its advancement only when `goalAdvanced` is true. Use it for the final advancement at the max level. A pet that is already advanced at its current level (`currentAdvanced`) does not pay for that advancement again.

The stat gains are the difference between the stats of the two states. An advanced state uses the advanced (refined) values of the level. Each advancement paid for adds its `advancementScore`.

The event points are the score times the points of the "Pet advancement score increases by 1" row in the scoring rows of [`events()`](/docs/events). The rows pay 50 in SvS, 30 in Alliance Showdown, and 50 in King of Icefield for each point of score.

---

## Constants

| Constant                   | Value | Description                                                                     |
| -------------------------- | ----- | ------------------------------------------------------------------------------- |
| `PET_ADVANCEMENT_INTERVAL` | `10`  | The level step between advancements. Use it to show the same advancement levels |

---

## Errors

| Error        | Thrown when                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| `Error`      | A pet `id` is not in `pets()`                                                                          |
| `RangeError` | A level is not a whole number from 1 to the max level of the pet, or a goal is below the current level |
| `RangeError` | An advanced flag is set on a level that is not a multiple of 10                                        |

---

## Examples

```typescript
import { calculatePets } from 'whiteout-survival-data'

const result = calculatePets([{ id: 'cave-hyena', current: 1, goal: 25 }])

result.resources
// [{ itemId: 'pet-food', amount: 7145 }, { itemId: 'taming-manual', amount: 45 }]
result.advancements // 2 (at levels 10 and 20)
result.troopAttack // 2.05
result.power // 147600
result.advancementScore // 1500
result.eventPoints.svs // 75000
```

Pay for the advancement at the goal level too:

```typescript
const advanced = calculatePets([
  { id: 'cave-hyena', current: 1, goal: 10, goalAdvanced: true },
])

advanced.resources
// [{ itemId: 'pet-food', amount: 1715 }, { itemId: 'taming-manual', amount: 15 }]
advanced.advancements // 1
advanced.troopAttack // 0.87
```

Without `goalAdvanced`, a goal of 10 buys the levels but not the advancement:

```typescript
calculatePets([{ id: 'cave-hyena', current: 1, goal: 10 }]).advancements // 0
```

---

## Data and assumptions

The numbers come from the data behind `pets()` and from the scoring rows of `events()`. Pets have no training time in the data, so the result has no time.

---

## Next steps

- See the [calculators overview](/docs/calculators) for the shared conventions
- Browse [Pets](/docs/pets) for the level data
- Use [Buffs](/docs/calculator-buffs) to total the pet bonuses of an account
