---
title: Hero gear
nextjs:
  metadata:
    title: whiteout-survival-data - Hero gear
    description: Calculate the resources, power, stats, and event points to level one hero gear piece.
---

Calculates the resources, power, stats, and event points to level one hero gear piece through mastery forging, enhancement, and empowerment. {% .lead %}

---

## Signature

```typescript
import { calculateHeroGear } from 'whiteout-survival-data'

calculateHeroGear(goal?: HeroGearGoal): HeroGearCalculation
```

---

## Input

### `HeroGearGoal`

The calculator plans one piece at a time. Every field is optional. A track that is left out adds nothing.

| Field            | Type                  | Description                                                                                                                                   |
| ---------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `masteryForging` | `{ current, goal }`   | Row `id` values from [`heroGearMasteryForging()`](/docs/hero-gear-mastery-forging). `current` is `null` for a piece with no mastery forging   |
| `enhancement`    | `{ current, goal }`   | Levels 0 to 100, from [`heroGearEnhancement()`](/docs/hero-gear-enhancement)                                                                  |
| `empowerment`    | `{ current, goal }`   | Levels 0 to 100, from [`heroGearEmpowerment()`](/docs/hero-gear-empowerment). Starts after enhancement level 100                              |
| `piece`          | `{ slot, troopType }` | Adds the stats gain to the result. The slot is `goggles`, `gloves`, `belt`, or `boots`. The troop type is `infantry`, `lancer`, or `marksman` |

---

## Result

### `HeroGearCalculation`

| Field                       | Type                           | Description                                                                                                                              |
| --------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `masteryForging`            | `HeroGearMasteryForgingResult` | `steps`, `resources`, and `statsUpPercent` of the track                                                                                  |
| `enhancement`               | `HeroGearLevelResult`          | `steps`, `resources`, and `power` of the track                                                                                           |
| `empowerment`               | `HeroGearLevelResult`          | `steps`, `resources`, and `power` of the track                                                                                           |
| `resources`                 | `UpgradeMaterial[]`            | Essence Stones, Custom Mythic Hero Gear Chests, Enhancement XP Components, and Mithril as `itemId` amounts, for all tracks               |
| `power`                     | `number`                       | Power gained from enhancement and empowerment                                                                                            |
| `currentPower`, `goalPower` | `number`                       | Power of the piece before and after the plan. Level 0 has no power                                                                       |
| `eventPoints`               | `HeroGearEventPoints`          | Points in `svs`, `allianceShowdown`, and `kingOfIcefield`                                                                                |
| `unmetRequirements`         | `HeroGearRequirement[]`        | Requirements that the plan does not meet: tracks that need enhancement level 100, and empowerment that needs mastery forging at level 10 |
| `stats`                     | `HeroGearStatsResult \| null`  | Stats of the piece, or `null` when the goal has no `piece`                                                                               |

### `HeroGearStatsResult`

| Field             | Type                      | Description                                                                              |
| ----------------- | ------------------------- | ---------------------------------------------------------------------------------------- |
| `combatStatName`  | `'Attack' \| 'Defense'`   | Attack for Goggles and Boots, Defense for Gloves and Belt                                |
| `percentStatName` | `'Lethality' \| 'Health'` | Lethality for Goggles and Boots, Health for Gloves and Belt                              |
| `current`         | `HeroGearStatValues`      | Stats before the plan                                                                    |
| `goal`            | `HeroGearStatValues`      | Stats after the plan                                                                     |
| `gain`            | `HeroGearStatValues`      | `goal` minus `current`                                                                   |
| `milestones`      | `HeroGearMilestone[]`     | The Mithril bonuses that the plan unlocks, at empowerment levels 20, 40, 60, 80, and 100 |

Each `HeroGearStatValues` block has `combatStat`, flat `health`, and `percentStat`.

---

## How it works

The steps of a track are the rows after the current one up to and including the goal.

Mastery forging costs Essence Stones, with Custom Mythic Hero Gear Chests at the higher rows. Enhancement costs Enhancement XP Components. After enhancement level 100 the piece is empowered. Empowerment level 1 costs Mythic chests. Levels 20, 40, 60, 80, and 100 (the step from 19 to 20, 39 to 40, and so on) also cost Mithril. The empowerment power continues from the power of enhancement level 100.

`eventPoints` scores the Essence Stones and the Mithril, read from the scoring rows of each event in [`events()`](/docs/events).

### Requirements

Mastery forging past `level-10-stage-0` and empowerment need enhancement at level 100. Empowerment also needs mastery forging at Level 10, the row `level-10-stage-0`. The calculator does not throw for these rules. It lists the unmet ones in `unmetRequirements`.

An entry with an `enhancementLevel` is the enhancement rule, and it appears when the goal has an `enhancement` range that ends below 100. An entry with a `masteryForgingRowId` is the mastery forging rule for empowerment, and it appears when the goal has an `empowerment` goal above 0 and a `masteryForging` range that ends below `level-10-stage-0`. A goal with no `enhancement` range, or no `masteryForging` range, is not checked for that rule, because the calculator does not know that state of the piece.

### Stats

When the goal names a `piece`, `stats` holds the stats before the plan (`current`), after the plan (`goal`), and the `gain`. The values come from [`heroGearStats()`](/docs/hero-gear-stats), multiplied by the mastery forging (1 plus the `statsUpPercent` of the row) and rounded down. Level 0 has no stats. A track that is not in the goal counts as level 0 with no mastery forging. Give `enhancement: { current: 100, goal: 100 }` to get the stats of a mastery forging only plan.

---

## Constants

| Constant                            | Value                                                                | Description                                                            |
| ----------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `HERO_GEAR_MAX_ENHANCEMENT_LEVEL`   | `100`                                                                | Top enhancement level                                                  |
| `HERO_GEAR_MAX_EMPOWERMENT_LEVEL`   | `100`                                                                | Top empowerment level                                                  |
| `HERO_GEAR_ENHANCEMENT_REQUIREMENT` | `{ afterRowId: 'level-10-stage-0', enhancementLevel: 100 }`          | Mastery forging past the row `afterRowId` needs this enhancement level |
| `HERO_GEAR_EMPOWERMENT_REQUIREMENT` | `{ enhancementLevel: 100, masteryForgingRowId: 'level-10-stage-0' }` | Empowerment needs this enhancement level and this mastery forging row  |

---

## Errors

| Error        | Thrown when                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| `Error`      | A mastery forging row is not in `heroGearMasteryForging()`                                                    |
| `RangeError` | An enhancement or empowerment level is not a whole number from 0 to 100, or a goal is below the current state |

---

## Examples

```typescript
import { calculateHeroGear } from 'whiteout-survival-data'

const result = calculateHeroGear({
  piece: { slot: 'goggles', troopType: 'infantry' },
  masteryForging: { current: null, goal: 'level-3' },
  enhancement: { current: 0, goal: 100 },
  empowerment: { current: 0, goal: 20 },
})

result.resources
// [
//   { itemId: 'essence-stones', amount: 60 },
//   { itemId: 'enhancement-xp-component', amount: 125970 },
//   { itemId: 'custom-mythic-hero-gear-chest', amount: 5 },
//   { itemId: 'mithril', amount: 10 },
// ]
result.power // 1712700
result.eventPoints // { svs: 1680000, allianceShowdown: 787500, kingOfIcefield: 640000 }
result.stats?.goal // { combatStat: 538, health: 5265, percentStat: 78 }
result.stats?.milestones // [{ empowermentLevel: 20, event: 'Expedition', stat: 'Infantry Attack +20%' }]
```

Mastery forging stops at level 3 here, so empowerment is missing its mastery forging requirement:

```typescript
result.unmetRequirements
// [{ track: 'empowerment', masteryForgingRowId: 'level-10-stage-0' }]
```

Leave out the tracks that do not change. This plan stops enhancement at level 50, so empowerment also lists the enhancement rule:

```typescript
const partial = calculateHeroGear({
  masteryForging: { current: null, goal: 'level-3' },
  enhancement: { current: 0, goal: 50 },
  empowerment: { current: 0, goal: 5 },
})

partial.unmetRequirements
// [
//   { track: 'empowerment', enhancementLevel: 100 },
//   { track: 'empowerment', masteryForgingRowId: 'level-10-stage-0' },
// ]
partial.stats // null
```

---

## Data and assumptions

Empowerment needs a Mythic piece at Enhancement Level 100 and Mastery Level 10. Mastery Level 10 is the row `level-10-stage-0`, which has a `statsUpPercent` of 100. The server must also be old enough for the ascension, and the gear must be Mythic. The calculator checks neither of these. The enhancement requirement comes from in-game play. Empowerment is Ascended +1 to +100 on a single 0 to 200 enhancement scale.

The `power` values are cumulative from enhancement level 1 through empowerment level 100.

Widgets are not part of this calculator. [Hero upgrade](/docs/calculator-hero-upgrade) plans the Widgets for the exclusive weapon of a hero.

---

## Next steps

- See the [calculators overview](/docs/calculators) for the shared conventions
- Browse [Hero gear slots](/docs/hero-gear-slots) for the slot data
- Use [Hero upgrade](/docs/calculator-hero-upgrade) to plan stars, skills, and widgets
