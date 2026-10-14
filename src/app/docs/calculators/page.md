---
title: Calculators
nextjs:
  metadata:
    title: whiteout-survival-data - Calculators
    description: Plain functions that turn the package data into resources, time, power, and event points.
---

The calculators take a plan, such as the levels you have and the levels you want, and return the resources, time, power, or event points that the plan needs. Every number comes from the package data, so a data fix changes a result without a code change. {% .lead %}

---

## Quick start

```typescript
import { calculatePets } from 'whiteout-survival-data'

calculatePets([{ id: 'cave-hyena', current: 1, goal: 25 }]).resources
// [{ itemId: 'pet-food', amount: 7145 }, { itemId: 'taming-manual', amount: 45 }]
```

---

## Shared conventions

A calculator is a plain function. It takes a goal object and returns a result object. It keeps no state, so the same input always gives the same result.

Goals use `{ id, current, goal }` or a `from` and `to` pair. The `id` is the id of an entry in the matching module, such as `pets()` or `buildings()`. The result counts the steps after `current` up to and including `goal`.

Event points come from the scoring rows of [`events()`](/docs/events). The calculators read the point value of a row at run time and do not copy it into code. Resources in a result are `{ itemId, amount }` pairs, and the `itemId` is an id from [`items()`](/docs/items).

Every calculator is exported from the package root:

```typescript
import { calculateTroops, TROOP_CALCULATOR } from 'whiteout-survival-data'
```

---

## Calculators

| Function                      | Page                                                    | What it calculates                                                         |
| ----------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| `calculateSvs()`              | [State of Power](/docs/calculator-svs)                  | State of Power points for each day and phase, with Valeria's bonus.        |
| `calculateBuffs()`            | [Buffs](/docs/calculator-buffs)                         | Speed boosts and other buffs added up by stat, with every source listed.   |
| `calculateBeasts()`           | [Beasts](/docs/calculator-beasts)                       | Beasts or Polar Terrors that stamina pays for, with Gina and event points. |
| `calculateAllianceShowdown()` | [Alliance Showdown](/docs/calculator-alliance-showdown) | Alliance Showdown personal points for each day, with Baldur's bonus.       |
| `calculateKingOfIcefield()`   | [King of Icefield](/docs/calculator-king-of-icefield)   | King of Icefield points for each day.                                      |
| `calculateHallOfChief()`      | [Hall of Chief](/docs/calculator-hall-of-chief)         | Hall of Chief points for each stage.                                       |
| `calculateChiefGear()`        | [Chief Gear](/docs/calculator-chief-gear)               | Materials, gear score, power, and event points to upgrade Chief Gear.      |
| `calculateChiefCharm()`       | [Chief Charm](/docs/calculator-chief-charm)             | Materials, charm score, power, and event points to upgrade Chief Charms.   |
| `calculateTroops()`           | [Troops](/docs/calculator-troops)                       | Troops trained or promoted by each camp, with resources and time.          |
| `calculateResearch()`         | [Research](/docs/calculator-research)                   | Resources, time, and power to upgrade research lines to a goal level.      |
| `calculatePets()`             | [Pets](/docs/calculator-pets)                           | Pet food, advancement items, and stat gains to level pets.                 |
| `calculateExperts()`          | [Experts](/docs/calculator-experts)                     | Books of Knowledge and expert sigils to level experts and their skills.    |
| `calculateBuildings()`        | [Buildings](/docs/calculator-buildings)                 | Resources, build time, power, and event points to upgrade buildings.       |
| `calculateHeroGear()`         | [Hero gear](/docs/calculator-hero-gear)                 | Resources, power, stats, and event points to level one hero gear piece.    |
| `calculateHeroUpgrade()`      | [Hero upgrade](/docs/calculator-hero-upgrade)           | Shards, skill manuals, and widgets to upgrade one hero.                    |

---

## Goal shapes

| Shape                                   | Used by                                                            | Meaning                                                                              |
| --------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `{ id, current, goal }`                 | Pets, Experts, Research, Buildings                                 | Levels of one entry. Buildings use level labels such as `"30"` or `"FC 3"` for both. |
| `{ from, to }`                          | Chief Gear, Chief Charm                                            | Level `id` values of one piece. `from: null` means the piece has no level yet.       |
| `Record<dayId, Record<action, number>>` | State of Power, Alliance Showdown, King of Icefield, Hall of Chief | Times each scoring action was done on each day or stage.                             |
| One config object                       | Troops, Beasts, Hero gear, Hero upgrade, Buffs                     | A profile or plan with named fields. Each page lists them.                           |

Chief Gear and Chief Charm take a list of ranges, one for each piece. The calculator does not know which piece a range belongs to, so a caller keeps track of that.

---

## Shared result types

### `UpgradeResult`

Returned by `calculateChiefGear()` and `calculateChiefCharm()`.

| Field         | Type                 | Description                                                              |
| ------------- | -------------------- | ------------------------------------------------------------------------ |
| `steps`       | `number`             | Number of levels bought, counting every stage in a level                 |
| `materials`   | `UpgradeMaterial[]`  | Total amount of each item, as `{ itemId, amount }`                       |
| `score`       | `number`             | Score gained                                                             |
| `power`       | `number`             | Power gained                                                             |
| `eventPoints` | `UpgradeEventPoints` | Points in `svs`, `allianceShowdown`, `kingOfIcefield`, and `hallOfChief` |

### `EventScoreCalculation`

Returned by the four event calculators. State of Power and Alliance Showdown add fields to it.

| Field   | Type              | Description                                            |
| ------- | ----------------- | ------------------------------------------------------ |
| `days`  | `EventScoreDay[]` | One entry for every event day or stage, in event order |
| `event` | `EventScore`      | `base`, `bonus`, and `total` over all days             |

Each `EventScoreDay` has `day`, `name`, `lines`, `base`, `bonus`, and `total`. A line has `action`, `points`, `count`, and `subtotal`.

---

## Errors

| Error        | Thrown when                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------- |
| `Error`      | An id, name, level label, day, or action is not in the data.                                      |
| `RangeError` | A level is out of range, a goal is below the current value, or a number is negative or not valid. |

Each page lists the errors of its calculator.

---

## Constants

A calculator exports the constants that an app needs to show the same choices and limits.

| Constant                                                                                                                                       | Page                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `SVS_BATTLE_DAY_ID`                                                                                                                            | [State of Power](/docs/calculator-svs)                  |
| `BUFF_GROUPS`, `buffGroupOf()`, `BUFF_VIP_MAX_LEVEL`, and the other `BUFF_` constants                                                          | [Buffs](/docs/calculator-buffs)                         |
| `BEAST_CALCULATOR`                                                                                                                             | [Beasts](/docs/calculator-beasts)                       |
| `ALLIANCE_SHOWDOWN_TRUCK_ACTION`                                                                                                               | [Alliance Showdown](/docs/calculator-alliance-showdown) |
| `TROOP_CALCULATOR`, `campFireCrystalLevel()`                                                                                                   | [Troops](/docs/calculator-troops)                       |
| `RESEARCH_CALCULATOR`                                                                                                                          | [Research](/docs/calculator-research)                   |
| `PET_ADVANCEMENT_INTERVAL`                                                                                                                     | [Pets](/docs/calculator-pets)                           |
| `EXPERT_MAX_LEVEL`, `EXPERT_SKILL_EXP_PER_LEARNING_MINUTE`, `EXPERT_LEARNING_QUEUE_OPTIONS`                                                    | [Experts](/docs/calculator-experts)                     |
| `HERO_GEAR_MAX_ENHANCEMENT_LEVEL`, `HERO_GEAR_MAX_EMPOWERMENT_LEVEL`, `HERO_GEAR_ENHANCEMENT_REQUIREMENT`, `HERO_GEAR_EMPOWERMENT_REQUIREMENT` | [Hero gear](/docs/calculator-hero-gear)                 |
| `HERO_UPGRADE_CALCULATOR`                                                                                                                      | [Hero upgrade](/docs/calculator-hero-upgrade)           |

---

## Speedup points

Speedups are not an input. Where a calculator scores speedups, the result gives the minutes of speedups that the plan needs and the points for each minute. The interface multiplies the points with the minutes the user spends. The Troops, Research, Experts, and Buildings pages show the fields.

---

## Next steps

- Read the [core concepts](/docs/core-concepts) page for how the modules and the query builder work
- Browse [Events](/docs/events) for the scoring rows that the event calculators read
- Start with [Pets](/docs/calculator-pets) for the smallest goal object
