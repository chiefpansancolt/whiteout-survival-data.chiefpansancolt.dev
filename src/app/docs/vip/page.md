---
title: VIP
nextjs:
  metadata:
    title: whiteout-survival-data - VIP
    description: Look up the VIP 1 to 12 progression with the XP each level costs and the bonuses it unlocks.
---

Look up the VIP 1 to 12 progression: the XP each level costs and the bonuses it unlocks. Use it to see what a VIP level gives or which level a total XP amount reaches. {% .lead %}

---

## Type

### `VipLevel`

| Field        | Type         | Description                                                                |
| ------------ | ------------ | -------------------------------------------------------------------------- |
| `id`         | `string`     | Stable identifier, such as `vip-9`                                         |
| `name`       | `string`     | Display name, such as `VIP 9`                                              |
| `level`      | `number`     | VIP level from 1 to 12                                                     |
| `xpRequired` | `number`     | XP to go from the previous level to this one. It is `0` for VIP 1          |
| `bonuses`    | `VipBonus[]` | Total bonuses active at this level, not the change from the previous level |

### `VipBonus`

| Field     | Type                  | Description                                      |
| --------- | --------------------- | ------------------------------------------------ |
| `stat`    | `string`              | Stat name, such as `Resource Production Speed`   |
| `statKey` | `string`              | Stable key, such as `resource-production-speed`  |
| `value`   | `string`              | Display string, such as `+16%`, `+1`, or `+1.1M` |
| `amount`  | `number`              | Parsed amount, such as `16`, `1`, or `1100000`   |
| `unit`    | `'percent' \| 'flat'` | Whether `amount` is a percent or a flat value    |

The `K` and `M` capacity suffixes are expanded to the full number in `amount`. Use `amount` and `unit` to add up or compare bonuses, and `value` to display them.

---

## Factory

```typescript
import { vip } from 'whiteout-survival-data'

vip() // all 12 levels
vip(source) // wrap a pre-filtered array
```

---

## Filters

| Method    | Signature                | Description                                                                                                  |
| --------- | ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `byLevel` | `byLevel(level: number)` | Filter to the given VIP level.                                                                               |
| `atXp`    | `atXp(totalXp: number)`  | Keep the highest level that the total XP reaches, or no level. It adds up `xpRequired` from the first level. |

```typescript
import { vip } from 'whiteout-survival-data'

vip().byLevel(9).first()?.name // 'VIP 9'
vip().atXp(1_000_000).first()?.name // 'VIP 9'
```

---

## Terminal methods

| Method              | Returns                 | Description                         |
| ------------------- | ----------------------- | ----------------------------------- |
| `.get()`            | `VipLevel[]`            | All results                         |
| `.first()`          | `VipLevel \| undefined` | First result                        |
| `.find(id)`         | `VipLevel \| undefined` | Find by `id`                        |
| `.findByName(name)` | `VipLevel \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `VipLevel[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                | Number of results                   |

---

## Examples

```typescript
import { vip } from 'whiteout-survival-data'

// One level and its bonuses
const vip9 = vip().byLevel(9).first()
vip9?.bonuses.map((b) => `${b.stat} ${b.value}`)
// ['Troops Defense +10%', 'March Queue +1', 'Troop Formation +2',
//  'Construction Speed +20%', 'Resource Production Speed +18%', 'Storehouse Capacity +800K']

// The level reached with 1,000,000 total XP
vip().atXp(1_000_000).first()?.name // 'VIP 9'

// Total XP to reach VIP 12 from the start
const totalXp = vip()
  .get()
  .reduce((sum, level) => sum + level.xpRequired, 0)
totalXp // 4800000
```

---

## Notes

`xpRequired` is not a running total. VIP 1 is stored as `0`. The sum of all `xpRequired` values is 4,800,000, the XP needed to reach VIP 12 from the start.

Bonuses accumulate. Resource Production Speed appears at every level with a higher value. Storehouse Capacity, March Queue, and Troop Formation also grow this way. The combat bonuses start at VIP 9 with Troops Defense. Troops Attack, Health, and Lethality join at VIP 10, 11, and 12.

---

## Next steps

- Try the [Buffs calculator](/docs/calculator-buffs) to add the bonuses of your VIP level to your totals
- See [Daily missions](/docs/daily-missions) for daily rewards
- Read the [query builder](/docs/query-builder) guide for more filter patterns
