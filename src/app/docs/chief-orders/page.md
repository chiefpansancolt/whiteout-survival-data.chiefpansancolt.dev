---
title: Chief Orders
nextjs:
  metadata:
    title: whiteout-survival-data - Chief Orders
    description: Look up the orders of the Chief's House with their cost, cooldown, and effect.
---

Look up the orders of the Chief's House. Each order costs Contentment and has a cooldown. Use it to show what an order does, what it costs, and when it can be used again. {% .lead %}

There are six orders at the start. From Fire Crystal level 1, three of them are replaced by new orders, so the data holds nine orders and `atFireCrystalLevel()` returns the ones in effect.

---

## Type

### `ChiefOrder`

| Field                    | Type                  | Description                                                 |
| ------------------------ | --------------------- | ----------------------------------------------------------- |
| `id`                     | `string`              | Stable identifier                                           |
| `name`                   | `string`              | Display name                                                |
| `img`                    | `string?`             | Path to the order icon, relative to `images/`               |
| `effect`                 | `string`              | What the order does, in the wording of the game             |
| `contentmentCost`        | `number`              | Contentment the order costs                                 |
| `cooldownSeconds`        | `number`              | Seconds before the order can be used again                  |
| `bonus`                  | `ChiefOrderBonus?`    | Set when the effect is a percent over a window of real time |
| `rewards`                | `ChiefOrderReward[]?` | Possible rewards, on Dawn Alliance Commendation             |
| `replaces`               | `string?`             | The `id` of the order this one replaces                     |
| `unlockFireCrystalLevel` | `number?`             | The Fire Crystal level at which the order takes effect      |
| `note`                   | `string?`             | Extra detail                                                |

### `ChiefOrderBonus`

| Field           | Type                  | Description                                   |
| --------------- | --------------------- | --------------------------------------------- |
| `stat`          | `string`              | Stat name                                     |
| `statKey`       | `string`              | Stable key to add the bonus to calculations   |
| `value`         | `string`              | Display string, such as `20%`                 |
| `amount`        | `number`              | Parsed amount                                 |
| `unit`          | `'percent' \| 'flat'` | Whether `amount` is a percent or a flat value |
| `windowSeconds` | `number`              | How long the bonus lasts, in seconds          |

### `ChiefOrderReward`

| Field      | Type     | Description                            |
| ---------- | -------- | -------------------------------------- |
| `itemId`   | `string` | Id of an entry in [Items](/docs/items) |
| `quantity` | `number` | Amount given                           |
| `chance`   | `number` | Chance of the reward, in percent       |

---

## Factory

```typescript
import { chiefOrders } from 'whiteout-survival-data'

chiefOrders() // all 9 orders
chiefOrders(source) // wrap a pre-filtered array
```

---

## Filters

| Method               | Signature                           | Description                                                                                                 |
| -------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `atFireCrystalLevel` | `atFireCrystalLevel(level: number)` | The orders in effect at a Fire Crystal level. Level 0 is before the first upgrade, and it returns 6 orders. |

An order with `unlockFireCrystalLevel` is in effect from that level, and it takes the place of the order in its `replaces` field.

---

## Terminal methods

| Method              | Returns                   | Description                         |
| ------------------- | ------------------------- | ----------------------------------- |
| `.get()`            | `ChiefOrder[]`            | All results                         |
| `.first()`          | `ChiefOrder \| undefined` | First result                        |
| `.find(id)`         | `ChiefOrder \| undefined` | Find by `id`                        |
| `.findByName(name)` | `ChiefOrder \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `ChiefOrder[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                  | Number of results                   |

---

## Helper functions

| Function                           | Returns | Description                                                                                   |
| ---------------------------------- | ------- | --------------------------------------------------------------------------------------------- |
| `chiefOrderReadyAt(order, usedAt)` | `Date`  | The time at which the cooldown of the order ends. The cooldown starts when the order is used. |

---

## Data

| Order               | Contentment cost | Cooldown |
| ------------------- | ---------------- | -------- |
| Double Time         | 800,000          | 23 hours |
| Rush Job            | 150,000          | 24 hours |
| Productivity Day    | 50,000           | 12 hours |
| Urgent Mobilization | 50,000           | 8 hours  |
| Festivities         | 50,000           | 24 hours |
| Comprehensive Care  | 150,000          | 4 hours  |

Double Time and Advanced Training have a `bonus`, because their effect is a percent over a window of real time. Double Time reduces the time of construction and upgrades that start in the next five minutes by 20%. Advanced Training raises troop training speed by 20% for two hours. Use the `statKey` to add a bonus to calculations. The other effects are in the `effect` text only.

### Orders of the Fire Crystal Age

At Fire Crystal level 1, each of these orders takes the place of one of the first six.

| Order                      | Replaces            | Contentment cost | Cooldown |
| -------------------------- | ------------------- | ---------------- | -------- |
| Dawn Alliance Commendation | Festivities         | 800,000          | 2 days   |
| Crunch Time                | Urgent Mobilization | 100,000          | 12 hours |
| Advanced Training          | Productivity Day    | 150,000          | 2 days   |

Dawn Alliance Commendation gives one random reward from the Dawn Alliance vault. Its `rewards` list has ten entries, and each has a `chance` of 10 percent: Fire Crystal (5x and 10x), Essence Stones (3x), Lucky Hero Gear Chest (3), Design Plans (3x and 8x), Charm Design (3x and 8x), and Charm Guide (3x and 8x). Crunch Time gives +100% resource output for 24 hours of Survivor Time, like Productivity Day, so it has no `bonus`.

---

## Examples

```typescript
import { chiefOrderReadyAt, chiefOrders } from 'whiteout-survival-data'

chiefOrders().count() // 9
chiefOrders().atFireCrystalLevel(0).count() // 6
chiefOrders()
  .atFireCrystalLevel(1)
  .get()
  .map((order) => order.name)
// ['Double Time', 'Rush Job', 'Comprehensive Care', 'Dawn Alliance Commendation', 'Crunch Time', 'Advanced Training']

const doubleTime = chiefOrders().find('double-time')!
doubleTime.contentmentCost // 800000
doubleTime.cooldownSeconds / 3600 // 23
doubleTime.bonus?.amount // 20

// When the order can be used again
const usedAt = new Date('2026-10-12T10:00:00Z')
chiefOrderReadyAt(doubleTime, usedAt).toISOString() // '2026-10-13T09:00:00.000Z'
```

---

## Known gaps

{% callout type="warning" title="Assumptions" %}
The three orders of the Fire Crystal Age come from the package owner, who read them in the game. They have no `img`. The six first orders have an icon.

The Chief's House opens at Furnace level 6 and no order has a different level. The `chiefs-house` facility has `unlockFurnaceLevel` 6 for this reason.

The cooldowns are lengths of time. The package has no daily reset time, so use `chiefOrderReadyAt` with the time the order was used.

Survivor Time is in the wording of the game. The package does not say how it relates to real time.
{% /callout %}

---

## Next steps

- See [Facilities](/docs/facilities) for the Chief's House
- Browse [Items](/docs/items) for the reward items of Dawn Alliance Commendation
- Try the [Buffs calculator](/docs/calculator-buffs) to add active orders to your totals
