---
title: President skills
nextjs:
  metadata:
    title: whiteout-survival-data - President skills
    description: Look up the skills of the President with their Authority cost, uses, and effect.
---

Look up the skills of the President of a state. The development skills are global perks: each gives a speed bonus to every Chief in the state for a time. The other skills give the President gems or act on one Chief. {% .lead %}

Use it to show what each skill does, what it costs in Authority, and how often it can be used. The positions the skills belong to are in [Castle appointments](/docs/castle-appointments).

---

## Type

### `PresidentSkill`

| Field                  | Type                   | Description                                                                   |
| ---------------------- | ---------------------- | ----------------------------------------------------------------------------- |
| `id`                   | `string`               | Stable identifier                                                             |
| `name`                 | `string`               | Display name                                                                  |
| `img`                  | `string?`              | Path to the skill icon, relative to `images/`                                 |
| `effect`               | `string`               | What the skill does, in the wording of the game                               |
| `target`               | `PresidentSkillTarget` | `'state'` (every Chief in the state), `'president'`, or `'chief'` (one Chief) |
| `authorityCost`        | `number?`              | Authority the skill costs                                                     |
| `maxUses`              | `number?`              | The number of uses that the game shows, for example "Uses left: 2/2"          |
| `cooldownSeconds`      | `number?`              | Cooldown in seconds. Set on the four development skills                       |
| `bonus`                | `PresidentSkillBonus?` | The speed bonus, on the four development skills                               |
| `supremePresidentOnly` | `boolean?`             | `true` for Supreme President's Will                                           |

### `PresidentSkillBonus`

| Field             | Type                  | Description                                                        |
| ----------------- | --------------------- | ------------------------------------------------------------------ |
| `stat`            | `string`              | Stat name                                                          |
| `statKey`         | `string`              | Stable key, the same as in `research()` and `castleAppointments()` |
| `value`           | `string`              | Display string, such as `30%`                                      |
| `amount`          | `number`              | Parsed amount                                                      |
| `unit`            | `'percent' \| 'flat'` | Whether `amount` is a percent or a flat value                      |
| `durationSeconds` | `number`              | How long the perk lasts, in seconds                                |

---

## Factory

```typescript
import { presidentSkills } from 'whiteout-survival-data'

presidentSkills() // all 9 skills
presidentSkills(source) // wrap a pre-filtered array
```

---

## Filters

| Method     | Signature                                | Description                                                           |
| ---------- | ---------------------------------------- | --------------------------------------------------------------------- |
| `byTarget` | `byTarget(target: PresidentSkillTarget)` | Filter to skills with one `target`: `state`, `president`, or `chief`. |

---

## Terminal methods

| Method              | Returns                       | Description                         |
| ------------------- | ----------------------------- | ----------------------------------- |
| `.get()`            | `PresidentSkill[]`            | All results                         |
| `.first()`          | `PresidentSkill \| undefined` | First result                        |
| `.find(id)`         | `PresidentSkill \| undefined` | Find by `id`                        |
| `.findByName(name)` | `PresidentSkill \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `PresidentSkill[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                      | Number of results                   |

---

## Data

| Skill                    | Target    | Authority | Uses | Effect                                   |
| ------------------------ | --------- | --------- | ---- | ---------------------------------------- |
| Receive Tribute          | president | 27,000    | 3    | 27,000 Authority for 300, 400, 500 Gems  |
| Medical Advancement      | state     | 45,000    | n/s  | Healing speed +50%, 24 hours             |
| Mercantilism             | state     | 45,000    | 2    | Construction speed +10%, 24 hours        |
| Research Advancement     | state     | 45,000    | 2    | Research speed +10%, 24 hours            |
| Mobilize                 | state     | 45,000    | 2    | Training speed +30%, 24 hours            |
| Ceasefire                | chief     | 27,000    | 14   | No attacks by the Chief for 1 hour       |
| Forced Exile             | chief     | 27,000    | 14   | Teleports the city, 10 hour Shield       |
| State Search             | chief     | 18,000    | 56   | Locates the city of a Chief of the state |
| Supreme President's Will | state     | n/s       | n/s  | Supreme President only                   |

`n/s` means that the value is not stated.

The four development skills have a `bonus` and a `cooldownSeconds` of 7 days. The skills that act on a Chief have no `bonus`, because their effect is in the `effect` text. Supreme President's Will has `supremePresidentOnly` set to `true`, and it has no `authorityCost`, `maxUses`, or `bonus`.

---

## Examples

```typescript
import { presidentSkills } from 'whiteout-survival-data'

presidentSkills().count() // 9

const mobilize = presidentSkills().find('mobilize')!
mobilize.bonus?.value // '30%'
mobilize.bonus?.statKey // 'training-speed'
mobilize.bonus!.durationSeconds / 3600 // 24
mobilize.cooldownSeconds! / 86400 // 7
mobilize.authorityCost // 45000

// The global perks: the skills that act on the whole state
presidentSkills()
  .byTarget('state')
  .get()
  .map((skill) => skill.name)
// ['Medical Advancement', 'Mercantilism', 'Research Advancement', 'Mobilize', "Supreme President's Will"]
```

---

## Known gaps

{% callout type="warning" title="Assumptions" %}
Medical Advancement shows a cooldown timer instead of the uses, so it has no `maxUses`. It has the same Authority cost as the other three development skills. The package gives the four development skills a cooldown of seven days.

The package states `maxUses` only. It does not say when the uses renew.

Receive Tribute lists three gem amounts, 300, 400, and 500, and does not say whether they are the amounts of the three uses. The effect keeps the wording of the game.

Authority is earned by the President. The game says: "Whenever Chiefs within the State claim Daily Mission Chests or gather resources, the President gains [Authority]. President Skills expend [Authority]." The amount a Chief earns is not stated.

The skill icons are small, about 60 by 60 pixels, and the Ceasefire, Forced Exile, and State Search icons are about 98 by 98. Supreme President's Will has no `img`.
{% /callout %}

---

## Next steps

- See [Castle appointments](/docs/castle-appointments) for the buffs of each Sunfire Castle position
- Browse [Event buffs](/docs/event-buff) to check where president skills apply
- Try the [Buffs calculator](/docs/calculator-buffs) to add active skills to your totals
