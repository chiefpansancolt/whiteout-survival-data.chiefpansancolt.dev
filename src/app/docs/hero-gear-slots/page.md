---
title: Hero gear slots
nextjs:
  metadata:
    title: whiteout-survival-data - Hero gear slots
    description: Query the four Hero Gear equip slots with an icon for each troop type.
---

The four equip slots of Hero Gear, with an icon for each: Goggles, Gloves, Belt, and Boots. List the slots and show their icons. A hero has one piece of gear in each slot. {% .lead %}

---

## Type

### `HeroGearSlotEntry`

| Field    | Type                        | Description                                                |
| -------- | --------------------------- | ---------------------------------------------------------- |
| `id`     | `HeroGearSlot`              | `'goggles'`, `'gloves'`, `'belt'`, or `'boots'`            |
| `name`   | `string`                    | Display name                                               |
| `images` | `Record<TroopType, string>` | Icon of the piece for `infantry`, `lancer`, and `marksman` |

---

## Factory

```typescript
import { heroGearSlots } from 'whiteout-survival-data'

heroGearSlots() // all 4 slots, in the order of the game
heroGearSlots(source) // wrap a pre-filtered array
```

---

## Terminal methods

`heroGearSlots()` has no filters of its own.

| Method              | Returns                          | Description                         |
| ------------------- | -------------------------------- | ----------------------------------- |
| `.get()`            | `HeroGearSlotEntry[]`            | All results                         |
| `.first()`          | `HeroGearSlotEntry \| undefined` | First result                        |
| `.find(id)`         | `HeroGearSlotEntry \| undefined` | Find by `id`                        |
| `.findByName(name)` | `HeroGearSlotEntry \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `HeroGearSlotEntry[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                         | Number of results                   |

---

## Examples

```typescript
import { heroGearSlots, heroGearStats } from 'whiteout-survival-data'

heroGearSlots().count() // 4
heroGearSlots()
  .get()
  .map((slot) => slot.name) // ['Goggles', 'Gloves', 'Belt', 'Boots']

const belt = heroGearSlots().find('belt')
belt?.images.lancer // '/images/hero-gear/belt-lancer.png'

// The stats of one slot for a troop type
const stats = heroGearStats().bySlot('belt').byTroopType('lancer').first()
stats?.combatStat // 'Defense'
stats?.percentStat // 'Health'
```

---

## Notes

The `id` of a slot is the `slot` of [Hero gear stats](/docs/hero-gear-stats), which has the stats of each slot for the three troop types. A slot and a troop type give the `id` of an entry there, such as `belt-lancer`, so every entry of `heroGearStats()` has an icon.

The 12 icons are named like `belt-lancer.png`. Each icon is a 276 by 276 pixel PNG of one tile with its troop badge in the corner. The badge tells the types apart: a shield is Infantry, a spear is Lancer, and a crossbow is Marksman.

---

## Next steps

- See [Hero gear stats](/docs/hero-gear-stats) for the stats of each slot
- See [Hero gear enhancement](/docs/hero-gear-enhancement) for the upgrade costs of a piece
- Read the [image assets](/docs/images) guide for how icon paths work
