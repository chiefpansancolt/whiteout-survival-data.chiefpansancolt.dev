---
title: Research
nextjs:
  metadata:
    title: whiteout-survival-data - Research
    description: Calculate the resources, time, and power to upgrade research lines from a current level to a goal level.
---

Calculates the resources, time, and power for upgrading research lines from a current level to a goal level. {% .lead %}

---

## Signature

```typescript
import { calculateResearch } from 'whiteout-survival-data'

calculateResearch(
  goals?: ResearchGoal[],
  options?: ResearchCalculatorOptions,
): ResearchCalculation
```

---

## Input

### `ResearchGoal`

| Field     | Type     | Description                                                         |
| --------- | -------- | ------------------------------------------------------------------- |
| `id`      | `string` | Research line `id` from [`research()`](/docs/research)              |
| `current` | `number` | Level now, from 0 (not started) to the number of levels of the line |
| `goal`    | `number` | Level to reach, from `current` to the number of levels of the line  |

`goals` has one entry for each research line to upgrade and defaults to `[]`. Each tier of a research line is its own line with its own levels, as in the game.

### `ResearchCalculatorOptions`

| Field                  | Type                     | Description                                                             |
| ---------------------- | ------------------------ | ----------------------------------------------------------------------- |
| `researchSpeedPercent` | `number`                 | Your speed as the game shows it, without the buffs below. Defaults to 0 |
| `stateBuff`            | `boolean`                | Adds 10% research speed                                                 |
| `vicePresident`        | `'regular' \| 'supreme'` | Adds 10% research speed (15% for supreme)                               |

---

## Result

### `ResearchCalculation`

| Field                    | Type                                        | Description                                                                                                  |
| ------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `items`                  | `ResearchItemResult[]`                      | One entry for each goal with `id`, `name`, `category`, `steps`, `resources`, `power`, and `baseSeconds`      |
| `steps`                  | `number`                                    | Number of levels bought                                                                                      |
| `resources`              | `UpgradeMaterial[]`                         | Total amount of each item, as `{ itemId, amount }`                                                           |
| `power`                  | `number`                                    | Power gained                                                                                                 |
| `baseSeconds`            | `number`                                    | The research time of all steps added together, before the speed bonus                                        |
| `researchSpeedPercent`   | `number`                                    | The speed in percent that `seconds` uses, with the buffs added                                               |
| `seconds`                | `number`                                    | The time after the speed bonus, rounded down                                                                 |
| `stepsWithoutTime`       | `number`                                    | The number of steps that have no time in the data. They count as 0 seconds                                   |
| `unmetPrerequisites`     | `UnmetResearchPrerequisite[]`               | Levels that need another research line at a level that the plan does not reach                               |
| `buildingRequirements`   | `{ id, level }[]`                           | The highest building level that the steps need, such as `war-academy` at `FC 5`                              |
| `speedupMinutesNeeded`   | `number`                                    | The `seconds` in minutes, rounded up                                                                         |
| `speedupPointsPerMinute` | `{ svs, allianceShowdown, kingOfIcefield }` | Points for each minute of research speedups                                                                  |
| `eventPoints`            | `ResearchEventPoints`                       | The Fire Crystal Shard points in `svs`, `allianceShowdown`, and `kingOfIcefield`, and the `hallOfChief` list |

### `UnmetResearchPrerequisite`

| Field      | Type            | Description                                                                                               |
| ---------- | --------------- | --------------------------------------------------------------------------------------------------------- |
| `id`       | `string`        | The research line that has the level with the prerequisite                                                |
| `level`    | `number`        | That level                                                                                                |
| `requires` | `{ id, level }` | The research line and level that it needs                                                                 |
| `planned`  | `number`        | The highest of the `current` and `goal` levels given for the required line. 0 when it is not in the goals |

---

## How it works

Only the levels after `current` up to `goal` count, so a goal equal to the current level costs nothing. The calculator adds the cost, power, and time of those levels.

The time is the base time of all levels of all goals added together, divided by 1 plus the research speed, and rounded down. The speed is `researchSpeedPercent` plus `stateBuff` and `vicePresident`.

A level can need another research line at a level. The calculator takes the highest of the `current` and `goal` levels you gave for that line as the planned level, and 0 when the line is not in the goals. When the planned level is below the need, the level goes to `unmetPrerequisites` with the line it requires and the planned level.

For building prerequisites, `buildingRequirements` keeps the highest level for each building, compared by its order in [`buildings()`](/docs/buildings).

### Event points

Speedups are not an input. The result gives `speedupMinutesNeeded` and `speedupPointsPerMinute`, and the interface multiplies the points with the minutes the user spends.

SvS, Alliance Showdown, and King of Icefield score each Fire Crystal Shard used for research. Hall of Chief scores each point of power gained through research. `eventPoints.hallOfChief` lists each multiplier (`pointsPerPower`) with the event days that use it and the points it gives. The point values are read from the scoring rows of [`events()`](/docs/events).

---

## Constants

### `RESEARCH_CALCULATOR`

| Field                       | Value                          | Description                |
| --------------------------- | ------------------------------ | -------------------------- |
| `stateBuffSpeedPercent`     | `10`                           | Speed from `stateBuff`     |
| `vicePresidentSpeedPercent` | `{ regular: 10, supreme: 15 }` | Speed from `vicePresident` |

---

## Errors

| Error        | Thrown when                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| `Error`      | A goal names a research line that does not exist                                                               |
| `RangeError` | A level is not a whole number from 0 to the number of levels of the line, or a goal is below its current level |
| `RangeError` | `researchSpeedPercent` is negative                                                                             |

---

## Examples

```typescript
import { calculateResearch } from 'whiteout-survival-data'

const result = calculateResearch(
  [{ id: 'assaut-techniques-i', current: 0, goal: 3 }],
  {
    researchSpeedPercent: 20,
    stateBuff: true,
  },
)

result.steps // 3
result.resources
// [
//   { itemId: 'meat', amount: 46700 },
//   { itemId: 'wood', amount: 46700 },
//   { itemId: 'coal', amount: 9300 },
//   { itemId: 'iron', amount: 2340 },
//   { itemId: 'steel', amount: 2740 },
// ]
result.power // 12600
result.baseSeconds // 1140
result.researchSpeedPercent // 30
result.seconds // 876
result.speedupMinutesNeeded // 15
result.buildingRequirements // [{ id: 'research-center', level: '7' }]
result.items[0].name // 'Assaut Techniques I'
result.items[0].category // 'Battle'
```

The first level needs `special-defensive-training-i` at level 1, which this plan does not include:

```typescript
result.unmetPrerequisites
// [
//   {
//     id: 'assaut-techniques-i',
//     level: 1,
//     requires: { id: 'special-defensive-training-i', level: 1 },
//     planned: 0,
//   },
// ]
```

Add the line you already own as a goal with `current` and `goal` equal to your level, and the entry goes away. This plan also uses the supreme Vice President buff:

```typescript
const withPrerequisite = calculateResearch(
  [
    { id: 'assaut-techniques-i', current: 0, goal: 3 },
    { id: 'special-defensive-training-i', current: 1, goal: 1 },
  ],
  { vicePresident: 'supreme' },
)

withPrerequisite.unmetPrerequisites // []
withPrerequisite.researchSpeedPercent // 15
withPrerequisite.seconds // 991
```

Hall of Chief points are listed by multiplier:

```typescript
result.eventPoints.hallOfChief[0]
// {
//   pointsPerPower: 45,
//   days: ['Season 1, Stage 1', 'Season 1, Stage 4: Gather Resources', 'Season 2, Stage 4: Charm Upgrade'],
//   points: 567000,
// }
```

---

## Data and assumptions

The lines come from `research()`, which has 290 lines. Levels without a research time in the data count as 0 seconds, and `stepsWithoutTime` tells you how many there are. Prerequisites are only checked against the goals you pass, not against the research you already have, so add the lines you own as goals with `current` and `goal` equal to your level to avoid false entries in `unmetPrerequisites`.

---

## Next steps

- See the [calculators overview](/docs/calculators) for the shared conventions
- Browse [Research](/docs/research) and the [research tree](/docs/research-tree) for the line data
- Use [Buffs](/docs/calculator-buffs) to total the research bonuses of an account
