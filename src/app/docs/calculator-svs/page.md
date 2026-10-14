---
title: State of Power
nextjs:
  metadata:
    title: whiteout-survival-data - State of Power
    description: Calculate State of Power points for each day and phase, with Valeria's Well Prepared bonus.
---

Calculates State of Power (SvS) points for each day and phase from how many times each scoring action was done. It can add Valeria's Well Prepared bonus. {% .lead %}

---

## Signature

```typescript
import { calculateSvs } from 'whiteout-survival-data'

calculateSvs(usage?: SvsUsage, options?: SvsCalculatorOptions): SvsCalculation
```

---

## Input

| Field                  | Type                                    | Description                                                                                  |
| ---------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------- |
| `usage`                | `Record<dayId, Record<action, number>>` | Times each action was done. Days and actions that are left out count as 0. Defaults to `{}`. |
| `options.valeriaLevel` | `number`                                | Level 1 to 10 of Valeria's Well Prepared skill. Leave out for no bonus.                      |

Day ids are `1` to `5` and `Battle`. Action text must match the `scoring` rows of the `svs-state-of-power` event in [`events()`](/docs/events).

---

## Result

### `SvsCalculation`

| Field                 | Type             | Description                                             |
| --------------------- | ---------------- | ------------------------------------------------------- |
| `valeriaBonusPercent` | `number`         | The bonus in percent. 0 when `valeriaLevel` is left out |
| `days`                | `SvsDayResult[]` | One entry for every event day, in event order           |
| `preparation`         | `EventScore`     | `base`, `bonus`, and `total` added over days 1 to 5     |
| `battle`              | `EventScore`     | `base`, `bonus`, and `total` of the Battle Phase        |
| `event`               | `EventScore`     | `base`, `bonus`, and `total` over all days              |

### `SvsDayResult`

| Field   | Type                        | Description                                                      |
| ------- | --------------------------- | ---------------------------------------------------------------- |
| `day`   | `string`                    | Day id                                                           |
| `name`  | `string`                    | Day name                                                         |
| `phase` | `'preparation' \| 'battle'` | Phase of the day                                                 |
| `lines` | `EventScoreLine[]`          | `action`, `points`, `count`, and `subtotal` for each scoring row |
| `base`  | `number`                    | Sum of the lines                                                 |
| `bonus` | `number`                    | Valeria's bonus for the day                                      |
| `total` | `number`                    | `base` plus `bonus`                                              |

---

## How it works

For every day of the event, the calculator multiplies the points of each scoring row by its count. The points come from `events()`, not from code, so a data fix changes the result. The base of a day is the sum of its rows.

Valeria's Well Prepared skill adds its percent to the points of days 1 to 5 and never to the Battle Phase. The percent comes from the "Preparation Phase Point gains (%)" progression of the skill in [`experts()`](/docs/experts), and the bonus is 2% for each level. The bonus of a day is the percent of that day's base, rounded to a whole number. The same action on two days is counted separately, because each day has its own rows.

---

## Constants

| Constant            | Value      | Description                                                                                               |
| ------------------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| `SVS_BATTLE_DAY_ID` | `'Battle'` | The id of the day that Valeria's bonus skips. Use it to tell the Battle Phase from the Preparation Phase. |

---

## Errors

| Error        | Thrown when                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------ |
| `Error`      | `usage` names a day or an action that the event does not have                                    |
| `RangeError` | `valeriaLevel` is not a whole number from 1 to 10, or a count is negative or not a finite number |

---

## Examples

```typescript
import { calculateSvs } from 'whiteout-survival-data'

const result = calculateSvs(
  {
    '4': { 'Use 1 Mithril': 3 },
    Battle: { 'Kill 1 Lv. 11 enemy Troop.': 200 },
  },
  { valeriaLevel: 10 },
)

result.valeriaBonusPercent // 20
result.preparation // { base: 432000, bonus: 86400, total: 518400 }
result.battle // { base: 3000, bonus: 0, total: 3000 }
result.event.total // 521400
```

Read one day from `days`:

```typescript
const day4 = result.days.find((day) => day.day === '4')!

day4.name // 'Hero Development'
day4.phase // 'preparation'
day4.lines.filter((line) => line.count > 0)
// [{ action: 'Use 1 Mithril', points: 144000, count: 3, subtotal: 432000 }]
```

With no arguments, every total is 0:

```typescript
calculateSvs().event // { base: 0, bonus: 0, total: 0 }
```

---

## Data and assumptions

The points come from the `svs-state-of-power` event. The calculator reads the percent of each level from the Valeria data, so it holds no copy of the 2% steps. No other expert bonus is included.

---

## Next steps

- See the [calculators overview](/docs/calculators) for the shared conventions
- Browse [Events](/docs/events) for the scoring rows
- Use [Beasts](/docs/calculator-beasts) to plan the hunts that State of Power scores
