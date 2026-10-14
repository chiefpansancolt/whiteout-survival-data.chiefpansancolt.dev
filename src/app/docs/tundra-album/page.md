---
title: Tundra Album
nextjs:
  metadata:
    title: whiteout-survival-data - Tundra Album
    description: Look up the albums of the Tundra Album event, their puzzles, pieces, rewards, and buffs.
---

Look up the albums of the Tundra Album event. An album has 9 puzzles. A puzzle is built from pieces of 1 to 5 stars, gives a reward when it is done, and the album gives a buff when all 9 puzzles are done. 14 albums are included. {% .lead %}

Use it to see what an album holds and what finishing it gives. The event itself is in [Events](/docs/events).

---

## Type

### `TundraAlbum`

| Field               | Type                  | Description                                                          |
| ------------------- | --------------------- | -------------------------------------------------------------------- |
| `id`                | `string`              | Stable identifier, such as `crystalline-mysteries`                   |
| `name`              | `string`              | Display name                                                         |
| `buff`              | `TundraAlbumBuff`     | The buff the album gives when all its puzzles are done               |
| `completionRewards` | `TundraAlbumReward[]` | What the album gives when all its puzzles are done, besides the buff |
| `puzzles`           | `TundraAlbumPuzzle[]` | The 9 puzzles                                                        |

### `TundraAlbumBuff`

| Field     | Type                  | Description                                   |
| --------- | --------------------- | --------------------------------------------- |
| `stat`    | `string`              | Stat name, such as `Troops Attack`            |
| `statKey` | `string`              | Stable key, such as `troops-attack`           |
| `value`   | `string`              | Display string, such as `+2%`                 |
| `amount`  | `number`              | Parsed amount                                 |
| `unit`    | `'percent' \| 'flat'` | Whether `amount` is a percent or a flat value |

### `TundraAlbumPuzzle`

| Field    | Type                 | Description                                                     |
| -------- | -------------------- | --------------------------------------------------------------- |
| `id`     | `string`             | Stable identifier, such as `mining-the-fire`                    |
| `name`   | `string`             | Display name                                                    |
| `img`    | `string?`            | Picture of the puzzle, in `images/tundra-album/`                |
| `reward` | `TundraAlbumReward`  | What the puzzle gives when all its pieces are placed            |
| `pieces` | `TundraAlbumPiece[]` | The pieces, in the order of the album: by stars, from 1 star up |

### `TundraAlbumPiece`

| Field   | Type               | Description                                                                   |
| ------- | ------------------ | ----------------------------------------------------------------------------- |
| `id`    | `string`           | The id of the puzzle and the position of the piece, such as `fiery-crystal-1` |
| `name`  | `string`           | The name of the puzzle, a dash, and the position, such as `Fiery Crystal - 1` |
| `img`   | `string?`          | The tile of the piece as the game shows it, with its stars                    |
| `stars` | `TundraAlbumStars` | `1`, `2`, `3`, `4`, or `5`                                                    |

### `TundraAlbumReward`

| Field    | Type        | Description                                                                  |
| -------- | ----------- | ---------------------------------------------------------------------------- |
| `itemId` | `string?`   | Id of an entry in [Items](/docs/items). Left out when the item is not known  |
| `amount` | `number`    | Amount given                                                                 |
| `size`   | `10 \| 100` | The number on the icon of an Enhancement XP Component. Set only on that item |

### `TundraAlbumPieceRewardTier`

| Field     | Type                  | Description                                                         |
| --------- | --------------------- | ------------------------------------------------------------------- |
| `tier`    | `number`              | The position of the tier, from 1 for the lowest count of pieces     |
| `pieces`  | `number`              | The total of pieces collected, over all albums, that the tier needs |
| `rewards` | `TundraAlbumReward[]` | The two rewards of the tier                                         |

---

## Factory

```typescript
import { tundraAlbum } from 'whiteout-survival-data'

tundraAlbum() // all 14 albums
tundraAlbum(source) // wrap a pre-filtered array
```

`tundraAlbum()` has no filters of its own.

---

## Terminal methods

| Method              | Returns                    | Description                         |
| ------------------- | -------------------------- | ----------------------------------- |
| `.get()`            | `TundraAlbum[]`            | All results                         |
| `.first()`          | `TundraAlbum \| undefined` | First result                        |
| `.find(id)`         | `TundraAlbum \| undefined` | Find by `id`                        |
| `.findByName(name)` | `TundraAlbum \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `TundraAlbum[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                   | Number of results                   |

---

## Functions

| Function                                          | Returns                                 | Description                                               |
| ------------------------------------------------- | --------------------------------------- | --------------------------------------------------------- |
| `tundraAlbum(source?)`                            | `TundraAlbumQuery`                      | The albums. `source` defaults to the data of the package  |
| `tundraPuzzlePieceCounts(puzzle)`                 | `Record<1 \| 2 \| 3 \| 4 \| 5, number>` | The number of pieces of a puzzle at each star level       |
| `tundraAlbumPieceRewards(source?)`                | `TundraAlbumPieceRewardTier[]`          | The 80 piece count tiers, from the lowest count of pieces |
| `tundraAlbumPieceRewardsReached(pieces, source?)` | `TundraAlbumPieceRewardTier[]`          | The tiers that a total of pieces reaches                  |
| `TUNDRA_ALBUM_PUZZLES_PER_ALBUM`                  | `9`                                     | The number of puzzles in an album                         |

---

## Data

| Album                   | Id                        | Buff                          | Pieces | Completion rewards                                            |
| ----------------------- | ------------------------- | ----------------------------- | ------ | ------------------------------------------------------------- |
| Crystalline Mysteries   | `crystalline-mysteries`   | Troops Attack +2%             | 144    | 70 Random Chief Charm Material Chest, 200 Fire Crystal        |
| Daybreak Island         | `daybreak-island`         | Troops Defense +2%            | 135    | 16 Mythic General Decoration Component, 15 8h General Speedup |
| Explore the World       | `explore-the-world`       | Troops Attack +2%             | 126    | 30 8h Troop Training Speedup, 100 Enhancement XP Component    |
| Song of Heroes          | `song-of-heroes`          | Resource Gathering Speed +5%  | 117    | 40 Mythic General Hero Shard, 50 Lucky Hero Gear Chest        |
| Rekindled Flames        | `rekindled-flames`        | Resource Production Speed +5% | 108    | 30 8h General Speedup, 20 Mythic General Hero Shard           |
| Tundra Alliance         | `tundra-alliance`         | Troops Attack +2%             | 141    | 100 Lucky Hero Gear Chest, 40 Essence Stones                  |
| Battlefield Epic        | `battlefield-epic`        | Troops Defense +2%            | 144    | 80 Chief Gear Materials Chest, 100 Design Plans               |
| Spectacular Adventures  | `spectacular-adventures`  | Troops Attack +2%             | 144    | 70 Random Chief Charm Material Chest, 100 Charm Design        |
| Divine Weapons          | `divine-weapons`          | Troops Defense +2%            | 144    | 80 Essence Stones, 1 Custom Mythic Hero Gear Chest            |
| The Labyrinth           | `the-labyrinth`           | Troops Attack +2%             | 144    | 100 Lucky Hero Gear Chest, 200 Fire Crystal                   |
| Nature's Strength       | `natures-strength`        | Troops Defense +2%            | 144    | 80 Essence Stones, 200 Fire Crystal                           |
| Ballad of Wind and Cold | `ballad-of-wind-and-cold` | Troops Defense +2%            | 144    | 80 Chief Gear Materials Chest, 200 Fire Crystal               |
| Infernal Power          | `infernal-power`          | Troops Attack +2%             | 144    | 100 Lucky Hero Gear Chest, 200 Fire Crystal                   |
| Kings of Combat         | `kings-of-combat`         | Troops Defense +2%            | 144    | 40 Mythic General Hero Shard, 200 Fire Crystal                |

The 14 albums hold 1,923 pieces in all.

The piece count tiers are a second reward track. They count the pieces you collect over all albums, in 80 tiers from 25 pieces to 1,920 pieces. Each tier gives two rewards. Tier 1 gives 100 Gems and 2 3h General Speedup.

---

## Examples

```typescript
import {
  items,
  tundraAlbum,
  tundraAlbumPieceRewardsReached,
  tundraPuzzlePieceCounts,
} from 'whiteout-survival-data'

const album = tundraAlbum().find('crystalline-mysteries')
album?.buff
// { stat: 'Troops Attack', statKey: 'troops-attack', value: '+2%', amount: 2, unit: 'percent' }
album?.puzzles.length // 9

// The pieces of a puzzle at each star level
const mining = album?.puzzles.find((puzzle) => puzzle.id === 'mining-the-fire')
tundraPuzzlePieceCounts(mining!) // { '1': 3, '2': 5, '3': 4, '4': 2, '5': 1 }

// The name of a piece
mining?.pieces[14].name // 'Mining the Fire - 15'

// The reward of a puzzle, with the item from items() when it is known
const reward = mining?.reward
reward?.amount // 3
reward?.itemId && items().find(reward.itemId)?.name // 'Essence Stones'

// The piece count tiers that 1,749 collected pieces reach
tundraAlbumPieceRewardsReached(1749).length // 71

tundraAlbum().count() // 14
```

---

## Notes

The item `enhancement-xp-component` covers both the 10 and the 100 component, so a reward of it has a `size`, read from the number on the icon.

A puzzle is a set of pieces. The id of a piece is the id of its puzzle and its position, so `fiery-crystal-1` is the first piece of Fiery Crystal.

---

## Known gaps

{% callout type="warning" title="Albums and images that are not complete" %}
The package holds 14 albums. The other 2 albums of the event, Prerogative of the Flame and Frostdragon Empire, are not in the data yet. The [Events](/docs/events) page lists the buff of each of them. More albums are added later.

Nine albums were not complete when the data was taken: Tundra Alliance (8 of 9 puzzles), Battlefield Epic (6 of 9), Spectacular Adventures (5 of 9), Divine Weapons (8 of 9), The Labyrinth (4 of 9), Nature's Strength (8 of 9), Ballad of Wind and Cold (4 of 9), Infernal Power (3 of 9), and Kings of Combat (0 of 9). A piece that was not owned shows as a grey tile. The `img` of such a piece is that grey tile, as a placeholder until the picture is added, and the star level of the piece is the number of grey stars. Kings of Combat has 115 pieces with a grey tile, Infernal Power 28, The Labyrinth 9, Ballad of Wind and Cold 9, and Nature's Strength 1. The picture of a puzzle that is not complete is blurred, as the game shows it.

Some puzzle rewards are read from icons that a check mark partly covers, so the item is less certain. These are Canyon Clash (2 8h Troop Training Speedup), Hero's Glory (15 Charm Design), Grand Banquet (3 Mythic General Hero Shard), Children of the "New World" (5 Chief Gear Materials Chest), Twisted Obsession (2 Mythic General Hero Shard), Battlefield Epic (3 Mythic General Hero Shard), A "Queen" Arises (2 Mythic General Hero Shard), Wandering Merchant (3 Mythic General Hero Shard), Beast Unleashed (2 Mythic General Hero Shard), The Project (6 Lucky Hero Gear Chest), Underworld Mysteries and Honor and Glory (3 General Speedup of 3 hours), and the 40 Mythic General Hero Shard that Kings of Combat gives on completion.
{% /callout %}

---

## Next steps

- See [Events](/docs/events) for the Tundra Album event
- Browse [Items](/docs/items) to resolve the `itemId` values in rewards
- Try the [Buffs calculator](/docs/calculator-buffs) to add the buff of a complete album to your totals
