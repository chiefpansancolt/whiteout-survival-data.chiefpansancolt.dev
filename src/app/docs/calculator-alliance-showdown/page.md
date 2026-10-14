---
title: Alliance Showdown
nextjs:
  metadata:
    title: whiteout-survival-data - Alliance Showdown
    description: Calculate Alliance Showdown personal points for each day, with Baldur's Dawn Hymn bonus.
---

Calculates Alliance Showdown personal points for each day from how many times each scoring action was done. It can add Baldur's Dawn Hymn bonus. {% .lead %}

---

## Signature

```typescript
import { calculateAllianceShowdown } from 'whiteout-survival-data'

calculateAllianceShowdown(
  usage?: EventUsage,
  options?: AllianceShowdownCalculatorOptions,
): AllianceShowdownCalculation
```

---

## Input

| Field                   | Type                                    | Description                                                                                  |
| ----------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------- |
| `usage`                 | `Record<dayId, Record<action, number>>` | Times each action was done. Days and actions that are left out count as 0. Defaults to `{}`. |
| `options.dawnHymnLevel` | `number`                                | Level 1 to 10 of Baldur's Dawn Hymn skill. Leave out for no bonus.                           |

Day ids are `1` to `5` and `6-7`. Action text must match the `scoring` rows of the `alliance-showdown` event in [`events()`](/docs/events).

---

## Result

### `AllianceShowdownCalculation`

| Field                  | Type              | Description                                                                               |
| ---------------------- | ----------------- | ----------------------------------------------------------------------------------------- |
| `dawnHymnBonusPercent` | `number`          | The bonus in percent. 0 when `dawnHymnLevel` is left out                                  |
| `days`                 | `EventScoreDay[]` | One entry for every event day, in event order, with `lines`, `base`, `bonus`, and `total` |
| `event`                | `EventScore`      | `base`, `bonus`, and `total` over all days                                                |

---

## How it works

For every day, the calculator multiplies the points of each scoring row by its count. The points come from `events()`. The base of a day is the sum of its rows.

Baldur's Dawn Hymn skill adds its percent to every action except the Tundra Trade Route truck actions (escort and raid). The percent comes from the "Point Boost (%)" progression of the skill in [`experts()`](/docs/experts), and the bonus is 5% for each level. The bonus of a day is the percent of the points of the covered actions, rounded to a whole number.

Every day also has the action "Obtain 500 top-up points through payments (top-up, pack purchase, etc.)", worth 3,000 points. It counts as a covered action, so the Dawn Hymn percent applies to it.

---

## Constants

| Constant                         | Value                       | Description                                                                             |
| -------------------------------- | --------------------------- | --------------------------------------------------------------------------------------- |
| `ALLIANCE_SHOWDOWN_TRUCK_ACTION` | `/^(Escort\|Raid) 1 truck/` | Matches the truck actions that the bonus skips. Use it to mark those actions in an app. |

---

## Errors

| Error        | Thrown when                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------- |
| `Error`      | `usage` names a day or an action that the event does not have                                     |
| `RangeError` | `dawnHymnLevel` is not a whole number from 1 to 10, or a count is negative or not a finite number |

---

## Examples

```typescript
import { calculateAllianceShowdown } from 'whiteout-survival-data'

const result = calculateAllianceShowdown(
  {
    '1': {
      'Escort 1 truck of any grade': 2,
      'Use 1 Fire Crystal to upgrade buildings': 5,
    },
  },
  { dawnHymnLevel: 3 },
)

result.dawnHymnBonusPercent // 15
result.event // { base: 26250, bonus: 938, total: 27188 }
```

The truck points are not boosted. Only the 6,250 points of the Fire Crystal action count toward the bonus, and 15% of 6,250 is 937.5, which rounds to 938:

```typescript
result.days[0].lines.filter((line) => line.count > 0)
// [
//   { action: 'Escort 1 truck of any grade', points: 10000, count: 2, subtotal: 20000 },
//   { action: 'Use 1 Fire Crystal to upgrade buildings', points: 1250, count: 5, subtotal: 6250 },
// ]
```

---

## Data and assumptions

The points come from the `alliance-showdown` event, which has 6 day entries (days 1 to 5 and `6-7`). The calculator counts personal points only. No other expert bonus is included.

---

## Next steps

- See the [calculators overview](/docs/calculators) for the shared conventions
- Browse [Events](/docs/events) for the scoring rows
- Use [King of Icefield](/docs/calculator-king-of-icefield) for the event with the same result shape
