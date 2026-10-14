---
title: Items
nextjs:
  metadata:
    title: whiteout-survival-data - Items
    description: Look up the 331 functional items of the game by id, category, and chest loot table.
---

Look up the 331 functional items of the game: resources, currencies, chests, buffs, speedups, and more. Other modules use item ids for their rewards and costs, and this module resolves them. {% .lead %}

Cosmetic skins are not here. They are in [Skins](/docs/skins).

---

## Type

### `Item`

| Field         | Type                | Description                                                                                    |
| ------------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| `id`          | `string`            | Unique slug. Several names repeat across categories, so the id is not made from the name alone |
| `name`        | `string`            | Display name                                                                                   |
| `img`         | `string`            | Path to the item icon, relative to `images/`. Empty for items with no icon yet                 |
| `category`    | `ItemCategory`      | One of 12 categories                                                                           |
| `speedup`     | `ItemSpeedup?`      | Set on the 25 speedup items                                                                    |
| `description` | `string?`           | What the item does                                                                             |
| `sources`     | `string[]`          | Where the item comes from, such as shops, events, and activities. Can be empty                 |
| `rewardRates` | `ItemRewardRate[]?` | Loot table. Only chests carry it, and only 12 of the 60 chests do                              |

### `ItemSpeedup`

| Field     | Type          | Description                                                                          |
| --------- | ------------- | ------------------------------------------------------------------------------------ |
| `type`    | `SpeedupType` | `'general'`, `'construction'`, `'troop'`, `'research'`, `'learning'`, or `'healing'` |
| `minutes` | `number`      | Length of the speedup in minutes. `speedup-general-1h` is 60                         |

### `ItemRewardRate`

| Field                | Type     | Description                      |
| -------------------- | -------- | -------------------------------- |
| `reward`             | `string` | Name of the reward               |
| `amount`             | `number` | Amount given                     |
| `probabilityPercent` | `number` | Chance of the reward, in percent |

### Categories

| Category       | Items |
| -------------- | ----- |
| Chest          | 60    |
| Event          | 58    |
| Others         | 48    |
| Furniture      | 45    |
| Buff           | 31    |
| Speedups       | 25    |
| Hero Items     | 23    |
| Experts        | 17    |
| Gear Materials | 10    |
| Pet            | 6     |
| Fire Crystal   | 4     |
| Teleporter     | 4     |

---

## Factory

```typescript
import { items } from 'whiteout-survival-data'

items() // all 331 items
items(source) // wrap a pre-filtered array
```

---

## Filters

| Method       | Signature                            | Description                      |
| ------------ | ------------------------------------ | -------------------------------- |
| `byCategory` | `byCategory(category: ItemCategory)` | Filter to items in one category. |

```typescript
import { items } from 'whiteout-survival-data'

items().byCategory('Chest').count() // 60
```

---

## Terminal methods

| Method              | Returns             | Description                         |
| ------------------- | ------------------- | ----------------------------------- |
| `.get()`            | `Item[]`            | All results                         |
| `.first()`          | `Item \| undefined` | First result                        |
| `.find(id)`         | `Item \| undefined` | Find by `id`                        |
| `.findByName(name)` | `Item \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `Item[]`            | Case-insensitive partial name match |
| `.count()`          | `number`            | Number of results                   |

---

## Examples

```typescript
import { items } from 'whiteout-survival-data'

// Look up an item by id
const chest = items().find('arena-star-chest')
chest?.name // 'Arena Star Chest'
chest?.category // 'Chest'

// The first rows of a chest loot table
chest?.rewardRates?.slice(0, 2)
// [
//   { reward: 'Mythic General Hero Shards', amount: 1, probabilityPercent: 4 },
//   { reward: 'Essence Stones', amount: 1, probabilityPercent: 6 },
// ]

// Search by name
items().search('arena').length // 2

// All research speedups
items()
  .get()
  .filter((item) => item.speedup?.type === 'research')
  .map((item) => item.id)
// ['speedup-research-1m', 'speedup-research-5m', 'speedup-research-1h', 'speedup-research-3h']
```

---

## Notes

Birthday Card entries are skipped, because they are a yearly login gift with no gameplay data.

Five items fit more than one category, all of them involving Chest. Seeker's Chest fits both `Chest` and `Experts`. `Chest` wins in every case because it is the more specific category.

The 25 speedup items cover the lengths that exist in the game. General and troop have 1m, 5m, 1h, 3h, and 8h items. Construction, research, and learning have 1m, 5m, 1h, and 3h items. Healing has 1m, 5m, and 1h items. The game has no other lengths, so there are no items for them.

The Wish Sigil is the currency of the Wish Shop. It is in `Others`, with the other standing currencies, because the game gives it as a daily reward. Its sources are the Wish Station and the Development Index Daily Reward.

### Furniture

The 45 furniture items are the pieces that the nine entertainment buildings need, plus a Blueprint for each building. The Farm, the Climbing Gym, and the Yoga Studio each have their own Blueprint item (`farm-blueprint`, `climbing-gym-blueprint`, and `yoga-studio-blueprint`). The other six buildings share one Blueprint, `furniture-blueprint`. A piece that several buildings use is one item, such as the Counter and the Table & Chair Set. Its price can differ by building, so `pricePerItem` stays on the cost of the building and not on the item.

---

## Known gaps

{% callout type="warning" title="Items without icons or sources" %}
The 17 furniture items of the Farm, the Climbing Gym, and the Yoga Studio have an icon. The other 28 furniture items have none yet, so their `img` is an empty string.

Only chests carry `rewardRates`, and only 12 of the 60 chests have it. The other chests describe their rewards in prose only.

The game wording of the Gareth sigil was not found. It uses the same description and sources as the other nine named expert sigils, and its icon is softer than the others.
{% /callout %}

---

## Next steps

- See [Skins](/docs/skins) for the cosmetic half of the item catalog
- Browse [Events](/docs/events) and [Daily missions](/docs/daily-missions) for rewards that use item ids
- Read the [Image assets](/docs/images) guide for how `img` paths resolve
