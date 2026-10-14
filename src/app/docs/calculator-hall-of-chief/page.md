---
title: Hall of Chief
nextjs:
  metadata:
    title: whiteout-survival-data - Hall of Chief
    description: Calculate Hall of Chief points for each stage from the scoring actions that were done.
---

Calculates Hall of Chief points for each stage from how many times each scoring action was done. {% .lead %}

---

## Signature

```typescript
import { calculateHallOfChief } from 'whiteout-survival-data'

calculateHallOfChief(usage?: EventUsage): EventScoreCalculation
```

---

## Input

| Field   | Type                                      | Description                                                                                    |
| ------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `usage` | `Record<stageId, Record<action, number>>` | Times each action was done. Stages and actions that are left out count as 0. Defaults to `{}`. |

Stage ids look like `s1-1` (season 1, stage 1). There are 13: `s1-1` to `s1-6` and `s2-1` to `s2-7`. Action text must match the `scoring` rows of the `hall-of-chief` event in [`events()`](/docs/events).

---

## Result

### `EventScoreCalculation`

| Field   | Type              | Description                                                      |
| ------- | ----------------- | ---------------------------------------------------------------- |
| `days`  | `EventScoreDay[]` | One entry for every stage, in event order. `day` is the stage id |
| `event` | `EventScore`      | `base`, `bonus`, and `total` over all stages                     |

Each entry of `days` has `day`, `name`, `lines`, `base`, `bonus`, and `total`. The field keeps the name `days` so that it matches the other event calculators.

---

## How it works

For every stage, the calculator multiplies the points of each scoring row by its count and adds the rows. The points come from `events()`. No expert changes these points, so `bonus` is always 0.

The event ranks every stage on its own. Read the total of one stage in `days` and do not rely on `event`, which is only the sum of all stages.

---

## Constants

This calculator exports no constants.

---

## Errors

| Error        | Thrown when                                                     |
| ------------ | --------------------------------------------------------------- |
| `Error`      | `usage` names a stage or an action that the event does not have |
| `RangeError` | A count is negative or not a finite number                      |

---

## Examples

```typescript
import { calculateHallOfChief } from 'whiteout-survival-data'

const result = calculateHallOfChief({
  's1-1': { 'Raise 1 Power through Construction': 1000 },
})

result.days[0].day // 's1-1'
result.days[0].name // 'Season 1, Stage 1'
result.days[0].total // 45000
result.event.total // 45000
```

---

## Data and assumptions

The stages have no names in the game, so the data names them by season and stage, for example `Season 1, Stage 2: Hero Development` for `s1-2`.

---

## Next steps

- See the [calculators overview](/docs/calculators) for the shared conventions
- Browse [Events](/docs/events) for the scoring rows
- The [Chief Gear](/docs/calculator-chief-gear), [Troops](/docs/calculator-troops), and [Buildings](/docs/calculator-buildings) calculators return Hall of Chief points for their plans
