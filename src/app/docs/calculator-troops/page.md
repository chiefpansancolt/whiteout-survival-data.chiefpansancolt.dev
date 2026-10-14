---
title: Troops
nextjs:
  metadata:
    title: whiteout-survival-data - Troops
    description: Calculate the troops that the infantry, lancer, and marksman camps train or promote, with resources and time.
---

Calculates the troops that the infantry, lancer, and marksman camps train or promote, with the resources, the time, the power, and the event points. {% .lead %}

---

## Signature

```typescript
import { calculateTroops } from 'whiteout-survival-data'

calculateTroops(input: TroopCalculatorInput): TroopCalculation
```

---

## Input

### `TroopCalculatorInput`

| Field                  | Type                                 | Description                                                                       |
| ---------------------- | ------------------------------------ | --------------------------------------------------------------------------------- |
| `camps`                | `Record<TroopType, TroopCampConfig>` | A config for each of `infantry`, `lancer`, and `marksman`. All three are required |
| `researchCapacity`     | `number`                             | Training capacity from research. Defaults to 0                                    |
| `ministerOfEducation`  | `'regular' \| 'supreme'`             | Adds 200 capacity (300 for supreme) and 50% training speed (75% for supreme)      |
| `capacityBoost`        | `boolean`                            | Multiplies the total capacity by 3                                                |
| `trainingSpeedPercent` | `number`                             | Your speed as the game shows it, without the buffs below. Defaults to 0           |
| `vicePresident`        | `'regular' \| 'supreme'`             | Adds 10% training speed (15% for supreme)                                         |
| `mobilize`             | `boolean`                            | Adds 30% training speed                                                           |
| `advancedTraining`     | `boolean`                            | Adds 20% training speed                                                           |
| `costReductionPercent` | `Partial<Record<TroopType, number>>` | Percent off the resource cost for each troop type, 0 to 75. Defaults to 0         |

### `TroopCampConfig`

| Field   | Type         | Description                                                                                   |
| ------- | ------------ | --------------------------------------------------------------------------------------------- |
| `level` | `string`     | A level `label` from [`buildings()`](/docs/buildings) for that camp, such as `30` or `FC 3-2` |
| `runs`  | `TroopRun[]` | Optional. A camp with no runs only adds its level to the shared capacity                      |

### `TroopRun`

| Field     | Type                                                                      | Description                                       |
| --------- | ------------------------------------------------------------------------- | ------------------------------------------------- |
| `action`  | `{ mode: 'training', tier }` or `{ mode: 'promotion', fromTier, toTier }` | What the camp does. Tiers are 1 to 12             |
| `count`   | `number \| 'max'`                                                         | Troops in each batch, or `'max'` for the capacity |
| `batches` | `number`                                                                  | Number of batches. Defaults to 1                  |

A camp can train and promote, so it can have several runs, each with its own count and batches.

---

## Result

### `TroopCalculation`

| Field                    | Type                                        | Description                                                                                                  |
| ------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `capacity`               | `number`                                    | The most troops a camp can queue in one batch. All three camps share it                                      |
| `camps`                  | `Record<TroopType, TroopCampResult>`        | For each type, `runs` (`troopsPerBatch`, `batches`, `seconds`, in input order) and the `seconds` of the camp |
| `tiers`                  | `TroopTierRow[]`                            | One row for each tier 1 to 12 with the change in troops of each type and `total`                             |
| `totals`                 | `Omit<TroopTierRow, 'tier'>`                | The change in troops for each type and in all, summed over the tiers                                         |
| `fireCrystalLevels`      | `Record<TroopType, number>`                 | The Fire Crystal level of each camp, read from its `level`. Tiers 10 and 11 use it for power                 |
| `tierPower`              | `TroopTierRow[]`                            | One row for each tier 1 to 12 with the power that the change in troops adds, by type, and `total`            |
| `totalPower`             | `Omit<TroopTierRow, 'tier'>`                | The power that the change in troops adds for each type and in all, summed over the tiers                     |
| `trainingSpeedPercent`   | `number`                                    | The speed in percent that the times use, with the buffs added                                                |
| `resources`              | `UpgradeMaterial[]`                         | Meat, wood, coal, and iron as `{ itemId, amount }`, rounded to whole numbers                                 |
| `totalSeconds`           | `number`                                    | The seconds of the three camps added together. This is the speedup time you need                             |
| `longestCampSeconds`     | `number`                                    | The seconds of the camp that takes the longest, since the camps train at the same time                       |
| `speedupMinutesNeeded`   | `number`                                    | The `totalSeconds` in minutes, rounded up                                                                    |
| `speedupPointsPerMinute` | `{ svs, allianceShowdown, kingOfIcefield }` | Points for each minute of training speedups                                                                  |
| `eventPoints`            | `TroopEventPoints`                          | Training points in `svs`, `allianceShowdown`, `kingOfIcefield`, and `hallOfChief`                            |

---

## How it works

All three camps share one capacity: the capacity of the three camp levels added together, plus `researchCapacity` and the `ministerOfEducation` capacity, times 3 with `capacityBoost`. The boost applies after the bonuses are added.

Training adds troops at its tier. Promotion takes them from `fromTier` and adds them to `toTier`, so a promotion adds none to the total. A run changes the tiers by `count` times `batches`.

The cost of a run is the cost of one troop from [`troops()`](/docs/troops) times the troops, less `costReductionPercent` for that troop type. A promotion adds up the steps from tier to tier. A step costs the difference of the two training costs, or the `promotionCost` of the tier when the data has one (tier 12). The seconds of a promotion step are the difference of the two training times.

The seconds of a batch are the training time of one troop times the troops, divided by 1 plus the training speed, rounded down. The speed is `trainingSpeedPercent` plus the buffs. A run multiplies the batch seconds by its batches, and a camp adds up its runs. The resources are rounded once per resource at the end, not per run.

### Power

The power of a tier row is the change in troops times the power of one troop, from `troopPower()`. Training adds power at its tier. A promotion takes the power of the lower tier away and adds the power of the higher tier, so `tierPower` can be negative at the lower tier, like `tiers`.

Tiers 10 and 11 change with the Fire Crystal level. The calculator reads the level from the `level` of the camp: `FC 3` and its steps `FC 3-1` to `FC 3-4` are level 3, and every level before `FC 1` is level 0, the base power. Every other tier has the same power at any level. The power does not use any bonus, such as the stat bonuses of research or gear.

### Event points

Speedups are not an input. The result gives `speedupMinutesNeeded` and `speedupPointsPerMinute`, and the interface multiplies the points with the minutes the user spends.

`eventPoints` scores the "Train 1 Lv. N troop" rows of [`events()`](/docs/events) for the troops trained in training runs, at the tier of each run. A promotion gives no points here. The "Raise 1 Power by training or promoting troops" rows of Hall of Chief, Power Up, and Tundra Games are not scored, so `totalPower` is not turned into event points. A tier that an event has no row for gives 0, such as tier 12 in King of Icefield and tiers 11 and 12 in Hall of Chief. `hallOfChief` is the points for one season, because stage 3 of both seasons gives the same points.

---

## Constants

### `TROOP_CALCULATOR`

Use it so an app can offer the same choices.

| Field                          | Value                                                                                      | Description                              |
| ------------------------------ | ------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `troopTypes`                   | `['infantry', 'lancer', 'marksman']`                                                       | The three camps                          |
| `minTier`                      | `1`                                                                                        | Lowest tier                              |
| `maxTier`                      | `12`                                                                                       | Highest tier, read from the troop data   |
| `capacityBoostMultiplier`      | `3`                                                                                        | Multiplier for `capacityBoost`           |
| `ministerOfEducation`          | `{ capacity: { regular: 200, supreme: 300 }, speedPercent: { regular: 50, supreme: 75 } }` | Minister of Education capacity and speed |
| `vicePresidentSpeedPercent`    | `{ regular: 10, supreme: 15 }`                                                             | Vice President training speed            |
| `mobilizeSpeedPercent`         | `30`                                                                                       | Speed from `mobilize`                    |
| `advancedTrainingSpeedPercent` | `20`                                                                                       | Speed from `advancedTraining`            |
| `maxCostReductionPercent`      | `75`                                                                                       | Highest `costReductionPercent`           |

### `campFireCrystalLevel()`

```typescript
campFireCrystalLevel(level: string): number
```

Returns the Fire Crystal level of one camp label, the same way the calculator reads it. `campFireCrystalLevel('FC 3-2')` is `3`, and `campFireCrystalLevel('30')` is `0`.

---

## Errors

| Error        | Thrown when                                                                            |
| ------------ | -------------------------------------------------------------------------------------- |
| `Error`      | A camp `level` does not exist for that camp                                            |
| `RangeError` | A count is not a whole number of 0 or more, or is above the capacity                   |
| `RangeError` | `batches` is not a whole number of 1 or more                                           |
| `RangeError` | A tier is not a whole number from 1 to 12, or a promotion does not go to a higher tier |
| `RangeError` | `trainingSpeedPercent` is negative, or a cost reduction is not from 0 to 75            |

---

## Examples

Train two full batches of tier 10 infantry:

```typescript
import { calculateTroops } from 'whiteout-survival-data'

const result = calculateTroops({
  camps: {
    infantry: {
      level: '30',
      runs: [
        { action: { mode: 'training', tier: 10 }, count: 'max', batches: 2 },
      ],
    },
    lancer: { level: '30' },
    marksman: { level: '30' },
  },
})

result.capacity // 627
result.totals // { infantry: 1254, lancer: 0, marksman: 0, total: 1254 }
result.resources
// [
//   { itemId: 'meat', amount: 3496152 },
//   { itemId: 'wood', amount: 2622114 },
//   { itemId: 'coal', amount: 611952 },
//   { itemId: 'iron', amount: 127908 },
// ]
result.totalSeconds // 190608
result.speedupMinutesNeeded // 3177
result.speedupPointsPerMinute // { svs: 30, allianceShowdown: 18, kingOfIcefield: 30 }
result.totalPower // { infantry: 82764, lancer: 0, marksman: 0, total: 82764 }
result.eventPoints.svs // 75240
```

Promote 100 troops from tier 9 to tier 10 with speed buffs and a cost reduction:

```typescript
const promotion = calculateTroops({
  camps: {
    infantry: {
      level: 'FC 3',
      runs: [
        { action: { mode: 'promotion', fromTier: 9, toTier: 10 }, count: 100 },
      ],
    },
    lancer: { level: '30' },
    marksman: { level: '30' },
  },
  mobilize: true,
  trainingSpeedPercent: 100,
  costReductionPercent: { infantry: 10 },
})

promotion.capacity // 702
promotion.trainingSpeedPercent // 130
promotion.fireCrystalLevels // { infantry: 3, lancer: 0, marksman: 0 }
promotion.tiers.filter((row) => row.total !== 0)
// [
//   { tier: 9, infantry: -100, lancer: 0, marksman: 0, total: -100 },
//   { tier: 10, infantry: 100, lancer: 0, marksman: 0, total: 100 },
// ]
promotion.totalSeconds // 913
promotion.totalPower.total // 3300
promotion.eventPoints.svs // 0
```

---

## Data and assumptions

Camp capacity comes from `trainingCapacity` of the camp levels in `buildings()`. Costs and training times come from `troops()`. The buff values come from the game and live in `TROOP_CALCULATOR`. The calculator does not check that the research capacity or the training speed match your account. Pass the values the game shows.

---

## Next steps

- See the [calculators overview](/docs/calculators) for the shared conventions
- Browse [Troops](/docs/troops) for the cost and time data
- Use [Buildings](/docs/calculator-buildings) to plan the camp levels
