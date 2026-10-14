---
title: Chief Gear
nextjs:
  metadata:
    title: whiteout-survival-data - Chief Gear
    description: Calculate the materials, gear score, power, and event points to upgrade Chief Gear.
---

Calculates the materials, gear score, power, and event points for upgrading Chief Gear pieces from a start level to an end level. {% .lead %}

---

## Signature

```typescript
import { calculateChiefGear } from 'whiteout-survival-data'

calculateChiefGear(ranges?: UpgradeRange[]): UpgradeResult
```

---

## Input

| Field    | Type             | Description                                                                     |
| -------- | ---------------- | ------------------------------------------------------------------------------- |
| `ranges` | `UpgradeRange[]` | One range for each gear piece to upgrade. Defaults to `[]`, which costs nothing |

### `UpgradeRange`

| Field  | Type             | Description                                                                                                                      |
| ------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `from` | `string \| null` | Level `id` from [`chiefGear()`](/docs/chief-gear). `null` for a piece that has no level yet, so the first level counts as a step |
| `to`   | `string`         | Level `id` to reach                                                                                                              |

Level ids look like `common-star-0` or `rare-star-3`. A range with the same `from` and `to` costs nothing.

---

## Result

### `UpgradeResult`

| Field         | Type                 | Description                                                                                                                     |
| ------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `steps`       | `number`             | Number of levels bought, counting every stage inside a star                                                                     |
| `materials`   | `UpgradeMaterial[]`  | Total amount of each item, as `{ itemId, amount }`, added over all ranges                                                       |
| `score`       | `number`             | Gear score gained                                                                                                               |
| `power`       | `number`             | Power gained. For each range, the `powerTotal` of the last level minus the `powerTotal` of the first level (0 for `from: null`) |
| `eventPoints` | `UpgradeEventPoints` | Points in `svs`, `allianceShowdown`, `kingOfIcefield`, and `hallOfChief`                                                        |

---

## How it works

The levels of `chiefGear()` form one ordered list. For a range, the calculator buys every level after `from` up to and including `to`. It adds the materials and the score of those levels, and the power gain is the difference of the cumulative `powerTotal` values. Ranges are added together, so two pieces cost the sum of their ranges.

Event points are the score times the points that the "Raise Chief Gear max score" row pays in each event. The calculator reads that row from the `scoring` lists of `svs-state-of-power`, `alliance-showdown`, `king-of-icefield`, and `hall-of-chief` in [`events()`](/docs/events), so no point value is copied into code. In the first example, a score of 10,500 is worth 36 points per score in SvS, which gives 378,000.

---

## Constants

This calculator exports no constants.

---

## Errors

| Error        | Thrown when                                |
| ------------ | ------------------------------------------ |
| `Error`      | A range names a level that does not exist  |
| `RangeError` | A range goes down, with `to` before `from` |

---

## Examples

```typescript
import { calculateChiefGear } from 'whiteout-survival-data'

const result = calculateChiefGear([
  { from: null, to: 'common-star-1' },
  { from: 'common-star-1', to: 'rare-star-1' },
])

result.steps // 4
result.materials
// [{ itemId: 'hardened-alloy', amount: 22000 }, { itemId: 'polishing-solution', amount: 220 }]
result.score // 10500
result.power // 510000
result.eventPoints.svs // 378000
result.eventPoints.allianceShowdown // 231000
result.eventPoints.kingOfIcefield // 378000
result.eventPoints.hallOfChief // 5250000
```

An empty list costs nothing:

```typescript
calculateChiefGear().steps // 0
```

---

## Data and assumptions

The levels come from `chiefGear()`, which has 150 levels from `common-star-0` to `legendary-t6-star-3-stage-0`. The score and power are the stored values of the data. Only the pieces and levels in `chiefGear()` can be calculated. The calculator does not know which piece a range belongs to, so a caller keeps track of that.

---

## Next steps

- See the [calculators overview](/docs/calculators) for the shared conventions
- Browse [Chief Gear](/docs/chief-gear) for the level data
- Use [Chief Charm](/docs/calculator-chief-charm) for the same calculation on charms
