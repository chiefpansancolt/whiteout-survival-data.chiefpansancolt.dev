---
title: Experts
nextjs:
  metadata:
    title: whiteout-survival-data - Experts
    description: Query the 10 Dawn Academy Experts with skills, talent, affinity levels, and the relationship statuses.
---

The 10 Dawn Academy Experts, recruited during Tundra Trek, with their skills, talent, and affinity table. Read expert skill levels, costs, power, and affinity rewards. {% .lead %}

This module has three factories: `experts()`, `expertRelationships()` for the 11 relationship statuses an expert goes through, and `unreleasedExperts()` for an expert that is announced and not yet released.

---

## Types

### `Expert`

| Field               | Type                       | Description                                                                              |
| ------------------- | -------------------------- | ---------------------------------------------------------------------------------------- |
| `id`                | `string`                   | Stable identifier                                                                        |
| `name`              | `string`                   | Display name                                                                             |
| `img`               | `string`                   | Path to the portrait                                                                     |
| `title`             | `string`                   | Narrative epithet, for example "Elite Politician"                                        |
| `specialty`         | `string`                   | Mechanical category, for example "City Economy"                                          |
| `generation`        | `number`                   | Generation 1, 2, or 3                                                                    |
| `unlockRequirement` | `ExpertUnlockRequirement?` | `daysRequired`, the days since server start at which the expert unlocks. Gareth has none |
| `baseBonuses`       | `ExpertStatBonus[]`        | One or two stat bonuses, at the value reached at affinity level 100                      |
| `skills`            | `ExpertSkill[]`            | Always 4 skills                                                                          |
| `talent`            | `ExpertTalent`             | One talent. Same shape as a skill                                                        |
| `affinityLevels`    | `ExpertAffinityLevel[]`    | 100 rows, one for each affinity level                                                    |

### `ExpertStatBonus`

| Field     | Type                  | Description                                |
| --------- | --------------------- | ------------------------------------------ |
| `stat`    | `string`              | Stat name, such as `Troops Lethality`      |
| `statKey` | `string`              | Key shared with research and other modules |
| `value`   | `number`              | Value for display                          |
| `amount`  | `number`              | Numeric value                              |
| `unit`    | `'percent' \| 'flat'` | Unit of `amount`                           |

### `ExpertSkill`

`ExpertTalent` is the same type.

| Field              | Type                       | Description                                               |
| ------------------ | -------------------------- | --------------------------------------------------------- |
| `name`             | `string`                   | Skill name                                                |
| `img`              | `string`                   | Path to the skill icon                                    |
| `description`      | `string`                   | Description text                                          |
| `maxLevel`         | `number`                   | Highest level                                             |
| `progressions`     | `ExpertProgression[]`      | Named values that scale per level, as `{ label, values }` |
| `costs`            | `ExpertLevelCost[]`        | EXP and books for each level, as `{ level, exp, books }`  |
| `milestoneRewards` | `ExpertMilestoneReward[]?` | Fixed item bundles unlocked at set levels                 |
| `lootTable`        | `ExpertLootTableEntry[]?`  | Random reward chest, as `{ reward, probabilityPercent }`  |

### `ExpertAffinityLevel`

| Field                           | Type      | Description                                                      |
| ------------------------------- | --------- | ---------------------------------------------------------------- |
| `level`                         | `number`  | Affinity level from 1 to 100                                     |
| `affinityRequired`              | `number`  | Affinity needed                                                  |
| `statBonus`                     | `number`  | Resulting stat bonus                                             |
| `advancementCost`               | `number?` | Sigil cost of the milestone. Set at levels divisible by 10       |
| `levelPower`                    | `number?` | Level part of the power the Experts screen shows                 |
| `affinityPower`                 | `number?` | Affinity part of the power, before the advancement of this level |
| `affinityPowerAfterAdvancement` | `number?` | Set only with `advancementCost`                                  |

### `ExpertRelationship`

| Field   | Type     | Description                                                                      |
| ------- | -------- | -------------------------------------------------------------------------------- |
| `id`    | `string` | Stable identifier                                                                |
| `name`  | `string` | Status name, such as `Casual 1`                                                  |
| `img`   | `string` | Path to the status icon                                                          |
| `level` | `number` | Affinity level at which the status starts. It lasts until the next status starts |

### `UnreleasedExpert`

| Field               | Type                                | Description                                                       |
| ------------------- | ----------------------------------- | ----------------------------------------------------------------- |
| `id`                | `string`                            | Stable identifier                                                 |
| `name`              | `string`                            | Display name                                                      |
| `img`               | `string`                            | Path to the portrait                                              |
| `unreleased`        | `true`                              | Marks the entry as unreleased                                     |
| `unlockRequirement` | `UnreleasedExpertUnlockRequirement` | `heroGeneration`, the generation of heroes that must unlock first |

---

## Factories

```typescript
import {
  expertRelationships,
  experts,
  unreleasedExperts,
} from 'whiteout-survival-data'

experts() // all 10 released experts
expertRelationships() // all 11 relationship statuses
unreleasedExperts() // announced experts that are not released yet
```

Each factory also accepts a pre-filtered array, for example `experts(source)`.

---

## Filters

| Method            | Signature                          | Returns                           | Description                                                                                     |
| ----------------- | ---------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------- |
| `byGeneration`    | `byGeneration(generation: number)` | `ExpertQuery`                     | Experts of generation `n` (1, 2, or 3). On `experts()`.                                         |
| `atAffinityLevel` | `atAffinityLevel(level: number)`   | `ExpertRelationship \| undefined` | The status that applies at affinity level `n`. `undefined` below 1. On `expertRelationships()`. |

`atAffinityLevel` returns one entry and not a query, so it ends the chain. `unreleasedExperts()` has no filters.

---

## Terminal methods

All three queries share these methods. `T` is `Expert`, `ExpertRelationship`, or `UnreleasedExpert`.

| Method              | Returns          | Description                         |
| ------------------- | ---------------- | ----------------------------------- |
| `.get()`            | `T[]`            | All results                         |
| `.first()`          | `T \| undefined` | First result                        |
| `.find(id)`         | `T \| undefined` | Find by `id`                        |
| `.findByName(name)` | `T \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `T[]`            | Case-insensitive partial name match |
| `.count()`          | `number`         | Number of results                   |

---

## Examples

```typescript
import {
  expertRelationships,
  experts,
  unreleasedExperts,
} from 'whiteout-survival-data'

// Names of the generation 1 experts
experts()
  .byGeneration(1)
  .get()
  .map((e) => e.name) // ['Cyrille', 'Agnes', 'Holger', 'Romulus']

// The talent and the sigil cost of the first advancement for one expert
const gareth = experts().findByName('Gareth')
gareth?.talent.name // 'Rallying Cry'
gareth?.affinityLevels[9].advancementCost // 30

// The relationship status at affinity level 45
expertRelationships().atAffinityLevel(45)?.name // 'Casual 1'

// An announced expert that is not released
const justus = unreleasedExperts().find('justus')
justus?.name // 'Justus'
justus?.unlockRequirement // { heroGeneration: 6 }
```

---

## Notes

### Data shape

There are 10 experts across 3 generations (4, 4, and 2).

The `generation` and the unlock day do not line up for two experts. Romulus is generation 1 and unlocks on day 160, after the other generation 1 experts on day 120. Kathy is generation 3 and unlocks on day 230, together with Ronne of generation 2. The data keeps both as they are.

A skill or talent covers three mechanics. Most have `progressions`, which are named values that scale per level, and a `costs` table of EXP and books per level. Agnes's talent has two independent progressions, `Chest Gain` and `Daily Cap`. Baldur and Valeria have `milestoneRewards`, a flat base value where leveling unlocks a fixed bundle of items at set levels. Agnes, Holger, and Baldur have a `lootTable`, a random reward chest. A loot table can sit on a skill or on the talent.

### Power

Every skill and talent has a `Power` progression, the power each level adds. Max power for an expert is the skills and talent at max level, plus the level 100 `levelPower`, plus the level 100 `affinityPowerAfterAdvancement`.

An `affinityLevels` row has `advancementCost` at levels divisible by 10. Summing the column gives the "Total Sigils" figure (Agnes: 5 + 10 + ... + 50 = 275), so the module stores no separate recruitment cost.

Each row also has `levelPower` and `affinityPower`, the two power parts the Experts screen shows. All 10 experts have these values on all 100 levels. They follow one rule. Affinity power is the expert's gain times the advancement stage (levels 1 to 10 are stage 1, levels 11 to 20 are stage 2, and so on). `affinityPowerAfterAdvancement` uses the next stage. Level power is the gain divided by 8, times the level plus 12. The gains are:

| Expert           | Gain    |
| ---------------- | ------- |
| Gareth           | 216,000 |
| Romulus, Valeria | 144,000 |
| Fabian, Kathy    | 108,000 |
| Holger, Ronne    | 86,400  |
| Baldur           | 57,600  |
| Agnes, Cyrille   | 43,200  |

### Relationships

Each status lasts until the next one starts.

| Status               | Starts at affinity level |
| -------------------- | ------------------------ |
| Stranger             | 1                        |
| Acquaintance 1, 2, 3 | 10, 20, 30               |
| Casual 1, 2, 3       | 40, 50, 60               |
| Close 1, 2, 3        | 70, 80, 90               |
| Intimate             | 100                      |

### Unreleased experts

`unreleasedExperts()` returns the announced experts that are not yet released, and `experts()` leaves them out. So `experts()` only has experts with skills, a talent, and affinity levels. An unreleased expert has an `id`, a `name`, an `img`, the `unreleased` flag, and `unlockRequirement`, which holds `heroGeneration`, the generation of heroes that must unlock first.

The data has one, Justus, who unlocks after the generation 6 heroes. On the [server timeline](/docs/server-timeline), the generation 6 heroes unlock on day 360.

An unreleased expert has no skills, talent, bonuses, or affinity levels, and the [Experts calculator](/docs/calculator-experts) does not accept its `id`. When the game releases the expert with its values, the entry moves to `experts()`.

{% callout title="Known gaps" type="warning" %}
Levels that were not read in the game are filled from the power rule above.

Justus has no skill names or values yet. His `unlockRequirement` has no day, only the hero generation.

The Close 3 and Intimate relationship icons were captured while locked. The lock was painted out, so a seam can show on them.
{% /callout %}

---

## Next steps

- Use the [Experts calculator](/docs/calculator-experts) to plan expert upgrades
- See [Heroes](/docs/heroes) and [Pets](/docs/pets), which use the same image layout
- Check unlock days on the [server timeline](/docs/server-timeline)
- See [Facilities](/docs/facilities) for the Dawn Academy
