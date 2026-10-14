---
title: Buildings
nextjs:
  metadata:
    title: whiteout-survival-data - Buildings
    description: Calculate the resources, build time, power, and event points to upgrade buildings, with their prerequisites.
---

Calculates the resources, build time, power, and event points to upgrade buildings, including the buildings that the upgrades need first. {% .lead %}

---

## Signature

```typescript
import { calculateBuildings } from 'whiteout-survival-data'

calculateBuildings(
  goals?: BuildingGoal[],
  options?: BuildingCalculatorOptions,
): BuildingCalculation
```

---

## Input

### `BuildingGoal`

`goals` defaults to an empty list.

| Field     | Type             | Description                                                                        |
| --------- | ---------------- | ---------------------------------------------------------------------------------- |
| `id`      | `string`         | Building `id` from [`buildings()`](/docs/buildings). Each building can appear once |
| `current` | `string \| null` | Level `label` now. Use `null` for a building that is not built                     |
| `goal`    | `string`         | Level `label` to reach, such as `"30"`, `"30-1"`, or `"FC 3"`                      |

### `BuildingCalculatorOptions`

| Field                      | Type                             | Description                                                                                             |
| -------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `buildingLevels`           | `Record<string, string \| null>` | Buildings you already have, as `id` to level `label`. A building that is not listed counts as not built |
| `constructionSpeedPercent` | `number`                         | Total construction speed bonus in percent. Defaults to 0                                                |

---

## Result

### `BuildingCalculation`

| Field                      | Type                          | Description                                                                                              |
| -------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| `steps`                    | `BuildingStep[]`              | Each level built, with `buildingId`, `name`, `level`, `prerequisite`, `cost`, `power`, and `baseSeconds` |
| `resources`                | `UpgradeMaterial[]`           | Wood, Coal, Iron, Meat, Fire Crystals, and Refined Fire Crystals as `itemId` amounts                     |
| `power`                    | `number`                      | Power gained. Each step adds its power minus the power of the level before it                            |
| `baseSeconds`              | `number`                      | Build time before the speed bonus                                                                        |
| `constructionSpeedPercent` | `number`                      | The speed bonus that `seconds` uses                                                                      |
| `seconds`                  | `number`                      | Build time after the bonus, rounded down                                                                 |
| `speedupMinutesNeeded`     | `number`                      | Minutes of speedups that cover `seconds`, rounded up                                                     |
| `speedupPointsPerMinute`   | `{ svs, kingOfIcefield }`     | Points for each speedup minute                                                                           |
| `eventPoints`              | `BuildingEventPoints`         | `svs` and `kingOfIcefield` points, and the `hallOfChief` list                                            |
| `unmetPrerequisites`       | `UnmetBuildingPrerequisite[]` | Prerequisites on a building that is not in `buildings()`, as `building` and `level`                      |

---

## How it works

Each goal adds the levels after `current` up to `goal`. A level can need other buildings at a level. The calculator adds the steps of those buildings first when they are below that level, so the totals are the true cost. A step that comes from a prerequisite has `prerequisite` set to true.

The speed bonuses add up. A bonus of 50% turns 10 hours into 6 hours 40 minutes.

### Event points

Speedups are not an input. The result gives `speedupMinutesNeeded` and `speedupPointsPerMinute`, and the interface multiplies the points with the minutes the user spends.

SvS and King of Icefield score each Fire Crystal and each Refined Fire Crystal, read from the scoring rows of [`events()`](/docs/events). Hall of Chief scores each point of power gained. `eventPoints.hallOfChief` lists each multiplier (`pointsPerPower`) with the event days that use it and the points it gives.

---

## Constants

This calculator exports no constants.

---

## Errors

| Error        | Thrown when                                                                                               |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| `Error`      | A building `id` is not in `buildings()`                                                                   |
| `Error`      | Two goals name the same building                                                                          |
| `Error`      | A building has a cost that is not a resource, such as the Blueprint cost of the Daybreak Island buildings |
| `RangeError` | A level `label` does not exist for the building, or a goal is below the current level                     |
| `RangeError` | `constructionSpeedPercent` is negative or not a finite number                                             |

---

## Examples

Upgrade the Furnace from level 4 to level 6 with a 50% construction speed bonus:

```typescript
import { calculateBuildings } from 'whiteout-survival-data'

const result = calculateBuildings(
  [{ id: 'furnace', current: '4', goal: '6' }],
  {
    buildingLevels: { furnace: '4' },
    constructionSpeedPercent: 50,
  },
)

result.steps.map((step) => [step.buildingId, step.level, step.prerequisite])
// [
//   ['furnace', '5', false],
//   ['iron-mine', '1', true],
//   ['iron-mine', '2', true],
//   ['iron-mine', '3', true],
//   ['iron-mine', '4', true],
//   ['iron-mine', '5', true],
//   ['furnace', '6', false],
// ]
result.resources
// [
//   { itemId: 'wood', amount: 29225 },
//   { itemId: 'coal', amount: 5770 },
//   { itemId: 'iron', amount: 960 },
// ]
result.power // 13810
result.baseSeconds // 2518
result.seconds // 1678
result.speedupMinutesNeeded // 28
result.unmetPrerequisites
// [{ building: 'Hero Hall', level: '1' }, { building: 'Shelter 3', level: '3' }]
```

Build a new building with `current: null`. The Furnace to level 2 also builds a Sawmill first:

```typescript
const fresh = calculateBuildings([{ id: 'furnace', current: null, goal: '2' }])

fresh.steps.map((step) => [step.buildingId, step.level, step.prerequisite])
// [['furnace', '1', false], ['sawmill', '1', true], ['furnace', '2', false]]
fresh.resources // [{ itemId: 'wood', amount: 2210 }]
```

---

## Data and assumptions

A prerequisite on a building that is not in the data (the Hero Hall and the numbered Shelters on some Furnace levels) adds no steps and appears in `unmetPrerequisites`. Only buildings with resource costs can be calculated. The Daybreak Island buildings have costs such as Blueprints, so they throw `Error`.

---

## Next steps

- See the [calculators overview](/docs/calculators) for the shared conventions
- Browse [Buildings](/docs/buildings) for the level data
- Use [Troops](/docs/calculator-troops) to plan the camps once they are built
