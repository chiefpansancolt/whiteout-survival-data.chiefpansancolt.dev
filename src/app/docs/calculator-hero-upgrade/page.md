---
title: Hero upgrade
nextjs:
  metadata:
    title: whiteout-survival-data - Hero upgrade
    description: Calculate the shards, skill manuals, widgets, and event points to upgrade one hero.
---

Calculates the shards, skill manuals, Widgets, and event points to upgrade one hero through stars, skills, and exclusive weapon levels. {% .lead %}

---

## Signature

```typescript
import { calculateHeroUpgrade } from 'whiteout-survival-data'

calculateHeroUpgrade(goal: HeroUpgradeGoal): HeroUpgradeCalculation
```

---

## Input

### `HeroUpgradeGoal`

The calculator plans one hero at a time. Only `id` is required.

| Field     | Type              | Description                                                                               |
| --------- | ----------------- | ----------------------------------------------------------------------------------------- |
| `id`      | `string`          | Hero `id` from [`heroes()`](/docs/heroes)                                                 |
| `stars`   | `HeroStarsRange`  | `{ current, goal }`, each a star label `{ star, tier }`, such as 3.1 for star 3, tier 1   |
| `skills`  | `HeroSkillGoal[]` | `{ name, current, goal }` for an Exploration or Expedition skill, with levels from 1 to 5 |
| `widgets` | `HeroWidgetRange` | `{ current, goal }`, exclusive weapon levels from 0 to 10                                 |

The star is 0 to 5, the tier is 0 to 5, and 5.0 is the last label.

---

## Result

### `HeroUpgradeCalculation`

| Field               | Type                          | Description                                                                                      |
| ------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------ |
| `stars`             | `HeroUpgradeStars`            | `steps` and `shards` of the star track                                                           |
| `skills`            | `HeroUpgradeSkills`           | `levels` gained and the `manuals` used                                                           |
| `widgets`           | `HeroUpgradeWidgets`          | `levels`, `widgets` used, and `unlockedSkills`, the weapon skills the levels unlock              |
| `resources`         | `UpgradeMaterial[]`           | The general shard item of the rarity and the manuals, as `itemId` amounts                        |
| `eventPoints`       | `HeroUpgradeEventPoints`      | Points in `svs`, `allianceShowdown`, `kingOfIcefield`, and `hallOfChief`                         |
| `unmetRequirements` | `UnmetHeroSkillRequirement[]` | Skill levels that need a higher star than the star goal, as `skill`, `level`, and `starRequired` |

---

## How it works

Each step from one star label to the next costs the shards of that tier in the `shardCosts` of the hero. The costs are the same for every hero. The result counts them as the general shard item of the rarity. The shard of the hero counts the same.

The levels of a skill after `current` up to `goal` cost the Exploration or Expedition Skill Manuals of the rarity of the hero, which is Mythic for Legendary heroes. A skill level can need a star. When the goal has `stars`, the levels with a `starRequired` above the star goal are listed in `unmetRequirements`. Without `stars`, nothing is checked.

Widgets level the exclusive weapon. They cost the Widgets of [`heroWidgets()`](/docs/hero-widgets), from 5 for level 1 up to 50 for level 10, and 275 in all. Only a hero with an `exclusiveWeapon` has them. The result lists the weapon skills that the levels unlock when the weapon skill has an `unlockLevel`.

`eventPoints` scores the shards used to ascend the hero (by rarity) and the Widgets, read from the scoring rows of each event in [`events()`](/docs/events).

---

## Constants

### `HERO_UPGRADE_CALCULATOR`

| Field            | Value | Description                |
| ---------------- | ----- | -------------------------- |
| `maxStar`        | `5`   | Top star                   |
| `maxTier`        | `5`   | Top tier inside a star     |
| `maxWidgetLevel` | `10`  | Top exclusive weapon level |

---

## Errors

| Error        | Thrown when                                                                  |
| ------------ | ---------------------------------------------------------------------------- |
| `Error`      | A hero or a skill is not in the data                                         |
| `Error`      | A skill is named twice                                                       |
| `Error`      | `widgets` is set for a hero with no exclusive weapon                         |
| `RangeError` | A star, tier, or level is out of range, or a goal is below the current value |

---

## Examples

```typescript
import { calculateHeroUpgrade } from 'whiteout-survival-data'

const result = calculateHeroUpgrade({
  id: 'jeronimo',
  stars: { current: { star: 3, tier: 0 }, goal: { star: 3, tier: 2 } },
  skills: [{ name: 'Battle Manifesto', current: 1, goal: 3 }],
  widgets: { current: 0, goal: 3 },
})

result.stars // { steps: 2, shards: 80 }
result.resources
// [
//   { itemId: 'mythic-general-hero-shard', amount: 80 },
//   { itemId: 'mythic-expedition-skill-manual', amount: 40 },
// ]
result.widgets // { levels: 3, widgets: 30, unlockedSkills: [] }
result.eventPoints.svs // 483200
```

A skill level can need a higher star than the star goal:

```typescript
const short = calculateHeroUpgrade({
  id: 'jeronimo',
  stars: { current: { star: 0, tier: 0 }, goal: { star: 1, tier: 0 } },
  skills: [{ name: 'Battle Manifesto', current: 1, goal: 5 }],
})

short.unmetRequirements
// [
//   { skill: 'Battle Manifesto', level: 3, starRequired: 2 },
//   { skill: 'Battle Manifesto', level: 4, starRequired: 3 },
//   { skill: 'Battle Manifesto', level: 5, starRequired: 4 },
// ]
```

---

## Data and assumptions

The package has no Widget item yet, so the Widgets are a plain number and not an `itemId` amount. Power is not included.

---

## Next steps

- See the [calculators overview](/docs/calculators) for the shared conventions
- Browse [Heroes](/docs/heroes) and [Hero widgets](/docs/hero-widgets) for the hero data
- Use [Hero gear](/docs/calculator-hero-gear) to plan the gear of a hero
