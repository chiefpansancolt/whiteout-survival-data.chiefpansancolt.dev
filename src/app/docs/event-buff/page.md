---
title: Event buffs
nextjs:
  metadata:
    title: whiteout-survival-data - Event buffs
    description: Check which buff sources apply in each of 14 game modes.
---

See which buff sources apply in each of 14 game modes. Use it to check whether a buff, such as pet skills or the facility buff, counts in a mode like Bear Hunt or Canyon Clash. {% .lead %}

The 14 modes are Bear Hunt, Crazy Joe, Alliance Championship, Foundry Battle, Canyon Clash, Fortress Battle, Facility, Castle Battle, Tundra Trade Route, Frostfire Mine, Frostdragon Tyrant, Tundra Arms League, Icefire Warhymn League, and Winter Siege. Some of them also exist as [Events](/docs/events), which link here through `eventBuffId`.

---

## Type

### `EventBuff`

| Field                     | Type                | Description                                            |
| ------------------------- | ------------------- | ------------------------------------------------------ |
| `id`                      | `string`            | Stable identifier                                      |
| `name`                    | `string`            | Name of the game mode                                  |
| `cityBonusWarsBuffs`      | `BuffApplicability` | City bonus and wars buffs                              |
| `deploymentCapacity`      | `BuffApplicability` | Deployment capacity                                    |
| `petSkills`               | `BuffApplicability` | Pet skills                                             |
| `daybreakIsland`          | `BuffApplicability` | Daybreak Island buffs                                  |
| `presidentSkills`         | `BuffApplicability` | President skills                                       |
| `ministerBuff`            | `BuffApplicability` | Minister buff                                          |
| `territoryBonuses`        | `BuffApplicability` | Territory bonuses                                      |
| `facilityBuff`            | `BuffApplicability` | Facility buff                                          |
| `marchAccelerator`        | `BuffApplicability` | March Accelerator                                      |
| `frostdragonTyrantTitles` | `BuffApplicability` | Frostdragon Tyrant titles                              |
| `frostSphereDomainBonus`  | `BuffApplicability` | Frost Sphere domain bonus                              |
| `petSkillsAutoApplied`    | `boolean`           | `true` where pet skills take effect without activation |
| `notes`                   | `string?`           | Footnote for the mode. Absent when there is no caveat  |

`BuffApplicability` is `'yes' | 'no' | 'partial'`. The value `'partial'` marks a buff that applies only in part, such as March Accelerator, which is not applicable for a rally.

---

## Factory

```typescript
import { eventBuff } from 'whiteout-survival-data'

eventBuff() // all 14 modes
eventBuff(source) // wrap a pre-filtered array
```

---

## Filters

| Method       | Signature                                                               | Description                                                                                             |
| ------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `appliesFor` | `appliesFor(buffSource: BuffSource, applicability?: BuffApplicability)` | Filter to modes where one buff source has the given applicability. `applicability` defaults to `'yes'`. |

`buffSource` is one of the 11 buff fields of an entry, from `cityBonusWarsBuffs` to `frostSphereDomainBonus`.

```typescript
import { eventBuff } from 'whiteout-survival-data'

// Modes where facility buffs fully apply
eventBuff().appliesFor('facilityBuff').get()

// Modes where March Accelerator applies only in part
eventBuff().appliesFor('marchAccelerator', 'partial').get()
// Bear Hunt, Fortress Battle, Facility, Castle Battle
```

---

## Terminal methods

| Method              | Returns                  | Description                         |
| ------------------- | ------------------------ | ----------------------------------- |
| `.get()`            | `EventBuff[]`            | All results                         |
| `.first()`          | `EventBuff \| undefined` | First result                        |
| `.find(id)`         | `EventBuff \| undefined` | Find by `id`                        |
| `.findByName(name)` | `EventBuff \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `EventBuff[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                 | Number of results                   |

---

## Examples

```typescript
import { eventBuff } from 'whiteout-survival-data'

// One mode, with its footnote
const bearHunt = eventBuff().findByName('Bear Hunt')
bearHunt?.petSkills // 'yes'
bearHunt?.notes
// 'Health and Defense buffs/debuffs has little impact on damage. March Accelerator is not applicable for rally.'

// Modes where pet skills take effect without activation
eventBuff()
  .get()
  .filter((mode) => mode.petSkillsAutoApplied)
  .map((mode) => mode.name)
// ['Alliance Championship', 'Icefire Warhymn League', 'Winter Siege']
```

---

## Notes

Pet skills, Daybreak Island, and the facility buff are never marked `'no'` in any mode. This includes the two PvP league modes, Icefire Warhymn League and Winter Siege, which deny almost every other source.

This module is not nested under the alliance pages, because most of the buff sources (pet skills, president skills, Frostdragon Tyrant, Frost Sphere) belong to other systems.

---

## Next steps

- See [Events](/docs/events) for the event pages that link to a mode through `eventBuffId`
- Browse [Pets](/docs/pets) and [President skills](/docs/president-skills) for two of the buff sources
- Try the [Buffs calculator](/docs/calculator-buffs) to add up your buffs
