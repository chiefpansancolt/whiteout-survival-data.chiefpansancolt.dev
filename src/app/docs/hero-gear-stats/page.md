---
title: Hero gear stats
nextjs:
  metadata:
    title: whiteout-survival-data - Hero gear stats
    description: Query the per-level stats of one Hero Gear piece for each slot and troop type, with empowerment milestones.
---

The per level stats of one piece of Hero Gear for each slot and troop type. Read the stats of a piece at an enhancement or empowerment level, and the empowerment milestone bonuses. {% .lead %}

---

## Types

### `HeroGearStats`

| Field         | Type                      | Description                                                      |
| ------------- | ------------------------- | ---------------------------------------------------------------- |
| `id`          | `string`                  | Stable identifier, such as `goggles-infantry`                    |
| `name`        | `string`                  | Display name                                                     |
| `slot`        | `HeroGearSlot`            | `'goggles'`, `'gloves'`, `'belt'`, or `'boots'`                  |
| `troopType`   | `TroopType`               | `'infantry'`, `'lancer'`, or `'marksman'`                        |
| `combatStat`  | `'Attack' \| 'Defense'`   | `Attack` for Goggles and Boots, `Defense` for Gloves and Belt    |
| `percentStat` | `'Lethality' \| 'Health'` | `Lethality` for Goggles and Boots, `Health` for Gloves and Belt  |
| `milestones`  | `HeroGearMilestone[]`     | 5 bonuses unlocked at empowerment levels 20, 40, 60, 80, and 100 |
| `levels`      | `HeroGearStatLevel[]`     | 200 rows of stats                                                |

### `HeroGearStatLevel`

| Field         | Type     | Description                                                                               |
| ------------- | -------- | ----------------------------------------------------------------------------------------- |
| `level`       | `number` | Levels 1 to 100 are enhancement levels. Levels 101 to 200 are empowerment levels 1 to 100 |
| `combatStat`  | `number` | Flat Attack or Defense, as set by the slot                                                |
| `health`      | `number` | Flat health                                                                               |
| `percentStat` | `number` | Lethality or Health percent, as set by the slot                                           |

### `HeroGearMilestone`

| Field              | Type                            | Description                              |
| ------------------ | ------------------------------- | ---------------------------------------- |
| `empowermentLevel` | `number`                        | Empowerment level that unlocks the bonus |
| `event`            | `'Expedition' \| 'Exploration'` | Where the bonus applies                  |
| `stat`             | `string`                        | Bonus text, such as `Lancer Attack +20%` |

---

## Factory

```typescript
import { heroGearStats } from 'whiteout-survival-data'

heroGearStats() // all 12 entries
heroGearStats(source) // wrap a pre-filtered array
```

There is one entry for each of the 4 slots and 3 troop types.

---

## Filters

| Method        | Signature                           | Description                                     |
| ------------- | ----------------------------------- | ----------------------------------------------- |
| `bySlot`      | `bySlot(slot: HeroGearSlot)`        | Stats of one slot: goggles, gloves, belt, boots |
| `byTroopType` | `byTroopType(troopType: TroopType)` | Stats for one troop type                        |

---

## Terminal methods

| Method              | Returns                      | Description                         |
| ------------------- | ---------------------------- | ----------------------------------- |
| `.get()`            | `HeroGearStats[]`            | All results                         |
| `.first()`          | `HeroGearStats \| undefined` | First result                        |
| `.find(id)`         | `HeroGearStats \| undefined` | Find by `id`                        |
| `.findByName(name)` | `HeroGearStats \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `HeroGearStats[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                     | Number of results                   |

---

## Examples

```typescript
import { heroGearStats } from 'whiteout-survival-data'

const goggles = heroGearStats().bySlot('goggles').byTroopType('lancer').first()!
goggles.combatStat // 'Attack'
goggles.percentStat // 'Lethality'
goggles.levels[99] // { level: 100, combatStat: 450, health: 2250, percentStat: 50 }

goggles.milestones[0]
// { empowermentLevel: 20, event: 'Expedition', stat: 'Lancer Attack +20%' }

heroGearStats().byTroopType('infantry').count() // 4
```

---

## Notes

Level 1 gives 26 Attack, 256 HP, and 3.8 percent for the Infantry goggles. Level 200 gives 690, 6,750, and 100.

The values are for one piece, and they are the stats before mastery forging. A forged piece multiplies them by 1 plus the `statsUpPercent` of its [mastery forging](/docs/hero-gear-mastery-forging) row and rounds down. Level 0 has no stats.

The slots and their icons are in [Hero gear slots](/docs/hero-gear-slots). The power per level is in [Hero gear enhancement](/docs/hero-gear-enhancement) and [Hero gear empowerment](/docs/hero-gear-empowerment).

---

## Next steps

- See [Hero gear slots](/docs/hero-gear-slots) for the slot icons
- See [Hero gear mastery forging](/docs/hero-gear-mastery-forging) for the multiplier on these stats
- Use the [Hero gear calculator](/docs/calculator-hero-gear) to total an upgrade path
