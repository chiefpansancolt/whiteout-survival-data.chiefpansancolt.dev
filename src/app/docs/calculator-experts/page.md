---
title: Experts
nextjs:
  metadata:
    title: whiteout-survival-data - Experts
    description: Calculate the Books of Knowledge, expert sigils, skill EXP, and affinity points to level experts and their skills.
---

Calculates the Books of Knowledge, expert sigils, skill EXP, and affinity points to level experts and their skills. {% .lead %}

---

## Signature

```typescript
import { calculateExperts } from 'whiteout-survival-data'

calculateExperts(goals?: ExpertGoal[]): ExpertCalculation
```

---

## Input

### `ExpertGoal`

`goals` has one entry for each expert and defaults to an empty list.

| Field    | Type                | Description                                                             |
| -------- | ------------------- | ----------------------------------------------------------------------- |
| `id`     | `string`            | Expert `id` from [`experts()`](/docs/experts)                           |
| `level`  | `object`            | Optional affinity level range. Leave it out to skip the affinity levels |
| `skills` | `ExpertSkillGoal[]` | Optional. Leave it out to skip the skills                               |

### `level`

| Field             | Type      | Description                                                                              |
| ----------------- | --------- | ---------------------------------------------------------------------------------------- |
| `current`         | `number`  | Affinity level now, from 1 to `EXPERT_MAX_LEVEL` (100)                                   |
| `goal`            | `number`  | Affinity level to reach                                                                  |
| `currentAdvanced` | `boolean` | Optional. True when the expert is already advanced at `current`                          |
| `goalAdvanced`    | `boolean` | Optional. True to pay for the advancement at `goal` too. Both flags are false by default |

### `ExpertSkillGoal`

| Field     | Type     | Description                                           |
| --------- | -------- | ----------------------------------------------------- |
| `name`    | `string` | The skill name from `experts()`                       |
| `current` | `number` | Skill level now, from 1 to the max level of the skill |
| `goal`    | `number` | Skill level to reach                                  |

---

## Result

### `ExpertCalculation`

The result has one entry in `items` for each expert, and the same fields summed over all experts.

| Field                    | Type                        | Description                                                                            |
| ------------------------ | --------------------------- | -------------------------------------------------------------------------------------- |
| `items`                  | `ExpertItemResult[]`        | One entry for each expert                                                              |
| `books`                  | `number`                    | Books of Knowledge for the skill levels                                                |
| `sigils`                 | `number`                    | Expert sigils for the advancements                                                     |
| `exp`                    | `number`                    | Skill EXP for the skill levels                                                         |
| `learningMinutes`        | `number`                    | The `exp` divided by 60, rounded up: the minutes of learning time that the skills need |
| `affinity`               | `number`                    | Affinity points for the affinity levels                                                |
| `levels`                 | `number`                    | Affinity levels gained                                                                 |
| `advancements`           | `number`                    | Advancements paid for                                                                  |
| `skillLevels`            | `number`                    | Skill levels gained, for all skills                                                    |
| `speedupPointsPerMinute` | `{ svs, allianceShowdown }` | Points for each minute of speedups to learn expert skills                              |
| `eventPoints`            | `ExpertEventPoints`         | Points for the `books` and `sigils` in `svs` and `allianceShowdown`                    |

Each item also has the expert `id` and `name`. The total `learningMinutes` is rounded up once from the total EXP, so it can be one minute below the sum of the experts.

---

## How it works

A skill level costs books and skill EXP. Only the levels after `current` up to `goal` count.

An expert advances at every affinity level that has an `advancementCost` (10, 20, and so on up to 100) and needs the sigils to go past that level. A range that starts at or passes such a level pays for the advancement. A goal at such a level pays only when `goalAdvanced` is true. Use it for the final advancement at level 100. An expert that is already advanced at its current level (`currentAdvanced`) does not pay again. The affinity points are the sum of the affinity needed for each level gained.

### Event points

SvS and Alliance Showdown score each Book of Knowledge and each expert sigil, read from the scoring rows of [`events()`](/docs/events). King of Icefield and Hall of Chief have no such row. The `learningMinutes` of the result are the minutes that the user needs in Learning or General Speedups. The interface multiplies `speedupPointsPerMinute` with the minutes the user spends.

### Learning time

One minute of learning time gives 60 Skill EXP, so one EXP is one second. A skill level that costs 43,200 EXP takes 720 minutes, or 12 hours of learning.

A Learning Speedup takes its minutes off the learning time, so a minute of Learning Speedup is worth 60 EXP. According to the package owner, a General Speedup counts toward skill learning at the same rate. The calculator does not take an inventory of speedups, so `learningMinutes` is the number to compare with the minutes that the user holds.

The talent of an expert costs nothing, because it levels with the relationship, so it is not in the result.

---

## Constants

| Constant                               | Value             | Description                                                |
| -------------------------------------- | ----------------- | ---------------------------------------------------------- |
| `EXPERT_MAX_LEVEL`                     | `100`             | Top affinity level                                         |
| `EXPERT_SKILL_EXP_PER_LEARNING_MINUTE` | `60`              | Skill EXP that one minute of learning gives                |
| `EXPERT_LEARNING_QUEUE_OPTIONS`        | list of 6 options | The sessions that an expert skill can learn, one at a time |

Each option in `EXPERT_LEARNING_QUEUE_OPTIONS` has a `label`, its `minutes`, and the `exp` that it earns, which is the minutes times 60. The list is the package owner's, from the game.

| Option | Minutes | EXP     |
| ------ | ------- | ------- |
| 10 min | 10      | 600     |
| 2h     | 120     | 7,200   |
| 10h    | 600     | 36,000  |
| 24h    | 1,440   | 86,400  |
| 3d     | 4,320   | 259,200 |
| 5d     | 7,200   | 432,000 |

---

## Errors

| Error        | Thrown when                                                                  |
| ------------ | ---------------------------------------------------------------------------- |
| `Error`      | An expert `id` or a skill `name` is not in `experts()`                       |
| `RangeError` | A level is not a whole number in range, or a goal is below the current level |
| `RangeError` | An advanced flag is set on a level with no advancement cost                  |

---

## Examples

```typescript
import { calculateExperts } from 'whiteout-survival-data'

const result = calculateExperts([
  {
    id: 'cyrille',
    level: { current: 1, goal: 20 },
    skills: [{ name: 'Entrapment', current: 1, goal: 5 }],
  },
])

result.books // 700
result.sigils // 5
result.exp // 36000
result.learningMinutes // 600
result.affinity // 6560
result.levels // 19
result.advancements // 1
result.eventPoints // { svs: 72000, allianceShowdown: 43200 }
result.speedupPointsPerMinute // { svs: 30, allianceShowdown: 18 }
```

Go from level 10 to level 30 when the expert already advanced at level 10:

```typescript
const advanced = calculateExperts([
  { id: 'cyrille', level: { current: 10, goal: 30, currentAdvanced: true } },
])

advanced.levels // 20
advanced.advancements // 1
advanced.sigils // 10
advanced.affinity // 10610
```

---

## Data and assumptions

The numbers come from the data behind `experts()`. One minute of learning is 60 EXP.

---

## Next steps

- See the [calculators overview](/docs/calculators) for the shared conventions
- Browse [Experts](/docs/experts) for the skill and affinity data
- Use [Buffs](/docs/calculator-buffs) to total the expert bonuses of an account
