---
title: Collection reward levels
nextjs:
  metadata:
    title: whiteout-survival-data - Collection reward levels
    description: Look up what each of the 51 collection levels gives and which medallion you hold.
---

Look up the collection levels of the game: what each level gives, and the medallion that you hold at each level. A medallion gives buffs to your troops. {% .lead %}

The collection has 51 levels and 11 medallions. A medallion lasts 5 levels. The first level of each medallion gives the medallion and no reward, and the other levels give rewards. Use it to show what a level gives, which medallion a level reaches, and the buffs that the medallion adds to the [Buffs calculator](/docs/calculator-buffs).

---

## Type

### `CollectionMedallion`

| Field         | Type                        | Description                                                     |
| ------------- | --------------------------- | --------------------------------------------------------------- |
| `id`          | `string`                    | Stable identifier, such as `gold-medallion-1`                   |
| `name`        | `string`                    | Display name, such as `Gold Medallion I`                        |
| `img`         | `string?`                   | Picture of the medallion, in `images/collection-medallions/`    |
| `unlockLevel` | `number`                    | The first collection level that gives the medallion             |
| `buffs`       | `CollectionMedallionBuff[]` | All the buffs you have at this medallion, not only the new ones |

A medallion lists all its buffs. The buffs are the total that you have when you hold it, so the buffs of the medallions before it do not add on top.

### `CollectionMedallionBuff`

| Field     | Type                  | Description                                         |
| --------- | --------------------- | --------------------------------------------------- |
| `stat`    | `string`              | Stat as the game words it, such as `Troops' Attack` |
| `statKey` | `string`              | Stable key                                          |
| `value`   | `string`              | Display string, such as `+2.0%`                     |
| `amount`  | `number`              | Parsed amount. This is the total at the medallion   |
| `unit`    | `'percent' \| 'flat'` | Whether `amount` is a percent or a flat value       |

### `CollectionRewardLevel`

| Field         | Type                 | Description                                                   |
| ------------- | -------------------- | ------------------------------------------------------------- |
| `level`       | `number`             | The collection level, from 1                                  |
| `medallionId` | `string`             | The id of the medallion that you hold at this level           |
| `rewards`     | `CollectionReward[]` | What the level gives. Empty at the first level of a medallion |

### `CollectionReward`

| Field    | Type     | Description                            |
| -------- | -------- | -------------------------------------- |
| `itemId` | `string` | Id of an entry in [Items](/docs/items) |
| `amount` | `number` | Amount given                           |

---

## Functions

| Function                                | Returns                            | Description                                                                   |
| --------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| `collectionMedallions(source?)`         | `CollectionMedallionQuery`         | The medallions, from the lowest. `source` defaults to the data of the package |
| `collectionRewardLevels(source?)`       | `CollectionRewardLevel[]`          | The 51 levels with what each gives, from level 1                              |
| `collectionMedallionAt(level, source?)` | `CollectionMedallion \| undefined` | The medallion that you hold at a level. It gives `undefined` below level 1    |
| `COLLECTION_MAX_LEVEL`                  | `51`                               | The highest collection level                                                  |

---

## Factory

```typescript
import { collectionMedallions } from 'whiteout-survival-data'

collectionMedallions() // all 11 medallions
collectionMedallions(source) // wrap a pre-filtered array
```

`collectionMedallions()` has no filters of its own.

---

## Terminal methods

The medallion query has the shared terminal methods.

| Method              | Returns                            | Description                         |
| ------------------- | ---------------------------------- | ----------------------------------- |
| `.get()`            | `CollectionMedallion[]`            | All results                         |
| `.first()`          | `CollectionMedallion \| undefined` | First result                        |
| `.find(id)`         | `CollectionMedallion \| undefined` | Find by `id`                        |
| `.findByName(name)` | `CollectionMedallion \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `CollectionMedallion[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                           | Number of results                   |

---

## Data

| Medallion           | Levels   | Buffs                                                                                      | Rewards of each level                                                             |
| ------------------- | -------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Bronze Medallion I  | 1 to 5   | Troops' Attack +2.0%                                                                       | 100 Skin Token, 1,000 Gems, 2 Mythic General Hero Shard, 10 Lucky Hero Gear Chest |
| Bronze Medallion II | 6 to 10  | Troops' Attack +2.0%, Troops' Defense +2.0%                                                | 200 Skin Token, 2,000 Gems, 2 Mythic General Hero Shard, 10 Lucky Hero Gear Chest |
| Silver Medallion I  | 11 to 15 | Troops' Attack +2.0%, Troops' Defense +2.0%, Troops' Lethality +2.0%                       | 300 Skin Token, 3,000 Gems, 2 Mythic General Hero Shard, 10 Lucky Hero Gear Chest |
| Silver Medallion II | 16 to 20 | Troops' Attack +2.0%, Troops' Defense +2.0%, Troops' Lethality +2.0%, Troops' Health +2.0% | 300 Skin Token, 3,000 Gems, 2 Mythic General Hero Shard, 10 Lucky Hero Gear Chest |
| Gold Medallion I    | 21 to 25 | Troops' Attack +4.0%, Troops' Defense +2.0%, Troops' Lethality +2.0%, Troops' Health +2.0% | 300 Skin Token, 3,000 Gems, 2 Mythic General Hero Shard, 10 Lucky Hero Gear Chest |
| Gold Medallion II   | 26 to 30 | Troops' Attack +4.0%, Troops' Defense +4.0%, Troops' Lethality +2.0%, Troops' Health +2.0% | 300 Skin Token, 3,000 Gems, 2 Mythic General Hero Shard, 10 Lucky Hero Gear Chest |
| Gold Medallion III  | 31 to 35 | Troops' Attack +4.0%, Troops' Defense +4.0%, Troops' Lethality +4.0%, Troops' Health +2.0% | 300 Skin Token, 3,000 Gems, 2 Mythic General Hero Shard, 10 Lucky Hero Gear Chest |
| Light Medallion I   | 36 to 40 | Troops' Attack +4.0%, Troops' Defense +4.0%, Troops' Lethality +4.0%, Troops' Health +4.0% | 300 Skin Token, 3,000 Gems, 2 Mythic General Hero Shard, 10 Lucky Hero Gear Chest |
| Light Medallion II  | 41 to 45 | Troops' Attack +6.0%, Troops' Defense +4.0%, Troops' Lethality +4.0%, Troops' Health +4.0% | 300 Skin Token, 3,000 Gems, 2 Mythic General Hero Shard, 10 Lucky Hero Gear Chest |
| Light Medallion III | 46 to 50 | Troops' Attack +6.0%, Troops' Defense +6.0%, Troops' Lethality +4.0%, Troops' Health +4.0% | 300 Skin Token, 3,000 Gems, 2 Mythic General Hero Shard, 10 Lucky Hero Gear Chest |
| Light Medallion IV  | 51       | Troops' Attack +6.0%, Troops' Defense +6.0%, Troops' Lethality +6.0%, Troops' Health +4.0% | None                                                                              |

---

## Examples

```typescript
import {
  collectionMedallionAt,
  collectionMedallions,
  collectionRewardLevels,
  items,
} from 'whiteout-survival-data'

// The medallion that you hold at level 23, and its buffs
const medallion = collectionMedallionAt(23)
medallion?.name // 'Gold Medallion I'
medallion?.buffs.map((b) => `${b.stat} ${b.value}`)
// ["Troops' Attack +4.0%", "Troops' Defense +2.0%", "Troops' Lethality +2.0%", "Troops' Health +2.0%"]

// The rewards of a level
const level = collectionRewardLevels().find((l) => l.level === 7)
level?.rewards.map((r) => `${r.amount} ${items().find(r.itemId)?.name}`)
// ['200 Skin Token', '2000 Gems', '2 Mythic General Hero Shard', '10 Lucky Hero Gear Chest']

collectionMedallions().count() // 11
collectionRewardLevels().length // 51
```

---

## Notes

The Collection is a source of the [Buffs calculator](/docs/calculator-buffs). You give your collection level in `collectionLevel`, and the buffs of your medallion count.

---

## Known gaps

{% callout type="warning" title="Levels with no rewards" %}
Level 1 and the first level of each other medallion have no reward. These levels are in the data with an empty list of rewards.
{% /callout %}

---

## Next steps

- See [Items](/docs/items) for the reward items
- Try the [Buffs calculator](/docs/calculator-buffs) to add your medallion to your totals
- Browse [Tundra Album](/docs/tundra-album) for another collection that gives troop buffs
