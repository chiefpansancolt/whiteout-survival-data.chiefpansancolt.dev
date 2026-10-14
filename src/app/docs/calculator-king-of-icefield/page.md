---
title: King of Icefield
nextjs:
  metadata:
    title: whiteout-survival-data - King of Icefield
    description: Calculate King of Icefield points for each day from the scoring actions that were done.
---

Calculates King of Icefield points for each day from how many times each scoring action was done. {% .lead %}

---

## Signature

```typescript
import { calculateKingOfIcefield } from 'whiteout-survival-data'

calculateKingOfIcefield(usage?: EventUsage): EventScoreCalculation
```

---

## Input

| Field   | Type                                    | Description                                                                                  |
| ------- | --------------------------------------- | -------------------------------------------------------------------------------------------- |
| `usage` | `Record<dayId, Record<action, number>>` | Times each action was done. Days and actions that are left out count as 0. Defaults to `{}`. |

Day ids are `1` to `7`. Action text must match the `scoring` rows of the `king-of-icefield` event in [`events()`](/docs/events).

---

## Result

### `EventScoreCalculation`

| Field   | Type              | Description                                                                               |
| ------- | ----------------- | ----------------------------------------------------------------------------------------- |
| `days`  | `EventScoreDay[]` | One entry for every event day, in event order, with `lines`, `base`, `bonus`, and `total` |
| `event` | `EventScore`      | `base`, `bonus`, and `total` over all days                                                |

---

## How it works

For every day, the calculator multiplies the points of each scoring row by its count and adds the rows. The points come from `events()`, so a data fix changes the result. No expert changes these points, so `bonus` is always 0.

---

## Constants

This calculator exports no constants.

---

## Errors

| Error        | Thrown when                                                   |
| ------------ | ------------------------------------------------------------- |
| `Error`      | `usage` names a day or an action that the event does not have |
| `RangeError` | A count is negative or not a finite number                    |

---

## Examples

```typescript
import { calculateKingOfIcefield } from 'whiteout-survival-data'

const result = calculateKingOfIcefield({
  '1': { 'Use 1 Fire Crystal to upgrade buildings': 10 },
})

result.event // { base: 20000, bonus: 0, total: 20000 }
result.days[0].name // 'City Construction'
result.days[0].total // 20000
```

---

## Data and assumptions

The points come from the `king-of-icefield` event, which has 7 days. The result has the same shape as the other event calculators so that one display can show all of them.

---

## Next steps

- See the [calculators overview](/docs/calculators) for the shared conventions
- Browse [Events](/docs/events) for the scoring rows
- Use [Hall of Chief](/docs/calculator-hall-of-chief) for the event that scores by stage
