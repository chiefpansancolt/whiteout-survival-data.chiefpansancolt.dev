---
title: Daily missions
nextjs:
  metadata:
    title: whiteout-survival-data - Daily missions
    description: Look up the 21 in-game daily missions, their activeness, rewards, and the activity bar levels.
---

Look up the in-game Daily Missions: the task of each mission, the activeness and the resources that it gives, and the reward levels of the activity bar at the top of the screen. 21 missions are included. {% .lead %}

Use it to show what a mission asks for and what it gives, and to add up the activeness of a day. A routine of daily habits is in [Dailies](/docs/dailies).

Every mission has level 1. Level 2 is in for 16 missions and level 3 for 5. A level changes the task and what it gives.

---

## Type

### `DailyMission`

| Field    | Type                  | Description                                                           |
| -------- | --------------------- | --------------------------------------------------------------------- |
| `id`     | `string`              | Stable identifier, such as `train-infantry`                           |
| `name`   | `string`              | The task of level 1 as the game words it, such as `Train 10 Infantry` |
| `levels` | `DailyMissionLevel[]` | The levels of the mission, from level 1                               |

### `DailyMissionLevel`

| Field     | Type                   | Description                                             |
| --------- | ---------------------- | ------------------------------------------------------- |
| `level`   | `number`               | The level of the mission, from 1                        |
| `task`    | `string`               | The task as the game words it, without the progress     |
| `target`  | `number`               | The amount to reach, such as 10 for `Train 10 Infantry` |
| `rewards` | `DailyMissionReward[]` | The rewards of the level. The activeness comes first    |

### `DailyMissionReward`

| Field    | Type     | Description                                                                     |
| -------- | -------- | ------------------------------------------------------------------------------- |
| `itemId` | `string` | Id of an entry in [Items](/docs/items). The activeness is the item `activeness` |
| `amount` | `number` | Amount given                                                                    |

### `DailyMissionRewardLevel`

| Field        | Type                   | Description                                          |
| ------------ | ---------------------- | ---------------------------------------------------- |
| `activeness` | `number`               | The activeness that the level needs                  |
| `rewards`    | `DailyMissionReward[]` | What the level gives when your activeness reaches it |

---

## Factory

```typescript
import { dailyMissions } from 'whiteout-survival-data'

dailyMissions() // all 21 missions
dailyMissions(source) // wrap a pre-filtered array
```

`dailyMissions()` has no filters of its own.

---

## Terminal methods

| Method              | Returns                     | Description                         |
| ------------------- | --------------------------- | ----------------------------------- |
| `.get()`            | `DailyMission[]`            | All results                         |
| `.first()`          | `DailyMission \| undefined` | First result                        |
| `.find(id)`         | `DailyMission \| undefined` | Find by `id`                        |
| `.findByName(name)` | `DailyMission \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `DailyMission[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                    | Number of results                   |

---

## Functions

| Function                                        | Returns                     | Description                                                               |
| ----------------------------------------------- | --------------------------- | ------------------------------------------------------------------------- |
| `dailyMissions(source?)`                        | `DailyMissionQuery`         | The missions. `source` defaults to the data of the package                |
| `dailyMissionRewardLevels(source?)`             | `DailyMissionRewardLevel[]` | The 7 reward levels of the activity bar, from the lowest activeness       |
| `dailyMissionActiveness(level)`                 | `number`                    | The activeness that a level of a mission gives                            |
| `dailyMissionActivenessThrough(mission, level)` | `number`                    | The activeness of a mission that is done up to a level. The levels add up |
| `DAILY_MISSION_ACTIVENESS_ITEM_ID`              | `'activeness'`              | The id of the activeness item                                             |

---

## Data

The total activeness of a day decides which reward levels of the activity bar you get. The missions of level 1 give 210 activeness in all. The reward levels need 40, 80, 120, 160, 215, 270, and 325 activeness.

The levels of a mission add up. A mission that is done at level 2 gives the activeness of level 1 and of level 2, so Take part in Alliance Help gives 5 + 10 = 15 Activeness at level 2, and 5 + 10 + 15 = 30 at level 3.

### Level 1

| Mission                                                     | Target | Activeness | Other rewards                  |
| ----------------------------------------------------------- | ------ | ---------- | ------------------------------ |
| Take part in Alliance Help 1 time(s)                        | 1      | 5          | 4,000 Meat                     |
| Make 5 Alliance Contribution(s)                             | 5      | 5          | 4,000 Wood                     |
| Recruit 1 Hero(es)                                          | 1      | 10         | 800 Coal, 200 Iron             |
| Train 10 Infantry                                           | 10     | 10         | 4,000 Meat, 4,000 Wood         |
| Train 10 Lancers                                            | 10     | 10         | 4,000 Meat, 4,000 Wood         |
| Train 10 Marksmen                                           | 10     | 10         | 4,000 Meat, 4,000 Wood         |
| Carry out 1 Intel Mission(s)                                | 1      | 10         | 800 Coal, 200 Iron             |
| Claim 1 Online Reward(s)                                    | 1      | 5          | 800 Coal, 200 Iron             |
| Heal 10 injured soldiers                                    | 10     | 10         | 4,000 Meat, 200 Iron           |
| Gather 50,000 Meat                                          | 50,000 | 5          | 4,000 Meat                     |
| Gather 50,000 Wood                                          | 50,000 | 5          | 4,000 Wood                     |
| Gather 10,000 Coal                                          | 10,000 | 5          | 800 Coal                       |
| Gather 3,000 Iron                                           | 3,000  | 5          | 200 Iron                       |
| Upgrade 1 building(s)                                       | 1      | 30         | 800 Coal, 200 Iron             |
| Research 1 technology(ies)                                  | 1      | 30         | 800 Coal, 200 Iron             |
| Gather 1 time(s)                                            | 1      | 5          | 4,000 Meat, 4,000 Wood         |
| Defeat Polar Terror 1 time(s)                               | 1      | 10         | 800 Coal                       |
| Fight in 1 Arena Challenge(s)                               | 1      | 10         | 4,000 Wood, 200 Iron           |
| Complete 1 challenges in The Labyrinth                      | 1      | 15         | 800 Coal, 200 Iron             |
| Dispatch Pets to hunt for treasure 1 times in Pet Adventure | 1      | 5          | 4,000 Meat, 4,000 Wood         |
| Log in                                                      | 1      | 10         | 4,000 Meat, 800 Coal, 200 Iron |

### Level 2 and level 3

| Mission                                                     | Level | Task                                                        | Target  | Activeness | Other rewards          |
| ----------------------------------------------------------- | ----- | ----------------------------------------------------------- | ------- | ---------- | ---------------------- |
| Take part in Alliance Help 1 time(s)                        | 2     | Take part in Alliance Help 10 time(s)                       | 10      | 10         | 4,000 Meat             |
| Take part in Alliance Help 1 time(s)                        | 3     | Take part in Alliance Help 20 time(s)                       | 20      | 15         | 4,000 Meat             |
| Make 5 Alliance Contribution(s)                             | 2     | Make 20 Alliance Contribution(s)                            | 20      | 10         | 4,000 Wood             |
| Make 5 Alliance Contribution(s)                             | 3     | Make 40 Alliance Contribution(s)                            | 40      | 15         | 4,000 Wood             |
| Recruit 1 Hero(es)                                          | 2     | Recruit 3 Hero(es)                                          | 3       | 15         | 800 Coal, 200 Iron     |
| Train 10 Infantry                                           | 2     | Train 30 Infantry                                           | 30      | 10         | 4,000 Meat, 4,000 Wood |
| Train 10 Lancers                                            | 2     | Train 30 Lancers                                            | 30      | 10         | 4,000 Meat, 4,000 Wood |
| Train 10 Marksmen                                           | 2     | Train 30 Marksmen                                           | 30      | 10         | 4,000 Meat, 4,000 Wood |
| Carry out 1 Intel Mission(s)                                | 2     | Carry out 5 Intel Mission(s)                                | 5       | 15         | 800 Coal, 200 Iron     |
| Carry out 1 Intel Mission(s)                                | 3     | Carry out 10 Intel Mission(s)                               | 10      | 30         | 800 Coal, 200 Iron     |
| Claim 1 Online Reward(s)                                    | 2     | Claim 5 Online Reward(s)                                    | 5       | 10         | 800 Coal, 200 Iron     |
| Gather 50,000 Meat                                          | 2     | Gather 250,000 Meat                                         | 250,000 | 5          | 4,000 Meat             |
| Gather 50,000 Wood                                          | 2     | Gather 250,000 Wood                                         | 250,000 | 5          | 4,000 Wood             |
| Gather 10,000 Coal                                          | 2     | Gather 50,000 Coal                                          | 50,000  | 5          | 800 Coal               |
| Gather 3,000 Iron                                           | 2     | Gather 15,000 Iron                                          | 15,000  | 5          | 200 Iron               |
| Gather 1 time(s)                                            | 2     | Gather 2 time(s)                                            | 2       | 5          | 4,000 Meat, 4,000 Wood |
| Gather 1 time(s)                                            | 3     | Gather 4 time(s)                                            | 4       | 15         | 4,000 Meat, 4,000 Wood |
| Defeat Polar Terror 1 time(s)                               | 2     | Defeat Polar Terror 2 time(s)                               | 2       | 10         | 800 Coal               |
| Defeat Polar Terror 1 time(s)                               | 3     | Defeat Polar Terror 3 time(s)                               | 3       | 10         | 800 Coal               |
| Fight in 1 Arena Challenge(s)                               | 2     | Fight in 4 Arena Challenge(s)                               | 4       | 25         | 4,000 Wood, 200 Iron   |
| Dispatch Pets to hunt for treasure 1 times in Pet Adventure | 2     | Dispatch Pets to hunt for treasure 4 times in Pet Adventure | 4       | 10         | 4,000 Meat, 4,000 Wood |

### Activity bar reward levels

| Activeness | Rewards                                                                                                                                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 40         | 175 Gems, 2 5m Troop Healing Speedup, 10 Alliance XP, 10 Authority                                                                                                                                          |
| 80         | 13 5m Construction Speedup, 13 5m Research Speedup, 2 5m Troop Healing Speedup, 20 Alliance XP, 10 Authority                                                                                                |
| 120        | 660 10k Meat, 13 5m Troop Training Speedup, 2 5m Troop Healing Speedup, 30 Alliance XP, 10 Authority                                                                                                        |
| 160        | 15,000 Hero XP, 660 10k Wood, 3 5m Troop Healing Speedup, 40 Alliance XP, 10 Authority                                                                                                                      |
| 215        | 1 Platinum Key, 1,320 1k Coal, 3 5m Troop Healing Speedup, 60 Alliance XP, 10 Authority                                                                                                                     |
| 270        | 5 Fire Crystal, 3 Mythic Exploration Skill Manual, 330 1k Iron, 5 5m Troop Healing Speedup, 80 Alliance XP, 10 Authority, 100 Activity Triumph Points                                                       |
| 325        | 1 Mythic General Scene Fragment Pack, 30 Skin Token, 5 Fire Crystal, 80 Mystery Badge, 3 Mythic Expedition Skill Manual, 8 5m Troop Healing Speedup, 115 Authority, 500 Activity Triumph Points, 1 Gold key |

The names are the item names from [Items](/docs/items). The resource packs, such as 10k Meat, are items with an amount of packs, as the game shows them.

---

## Examples

```typescript
import {
  dailyMissionActiveness,
  dailyMissionActivenessThrough,
  dailyMissionRewardLevels,
  dailyMissions,
  items,
} from 'whiteout-survival-data'

const training = dailyMissions().find('train-infantry')
training?.name // 'Train 10 Infantry'

// The first level of a mission: the target and the rewards
const level = training?.levels[0]
level?.target // 10
level && dailyMissionActiveness(level) // 10
level?.rewards.map((r) => `${r.amount} ${items().find(r.itemId)?.name}`)
// ['10 Activeness', '4000 Meat', '4000 Wood']

// The levels add up: Alliance Help done at level 2 gives level 1 and level 2
const help = dailyMissions().find('alliance-help')
help && dailyMissionActivenessThrough(help, 2) // 15

// The reward levels of the activity bar
dailyMissionRewardLevels().map((l) => l.activeness) // [40, 80, 120, 160, 215, 270, 325]

dailyMissions().count() // 21
```

---

## Known gaps

{% callout type="warning" title="Data that is not complete" %}
The other levels of the missions are not in the data yet. Level 2 is known for 16 of the 21 missions, and level 3 for 5.

The daily reset time of the missions is not in the data.

The wording of the tasks is the wording of the game, including "time(s)" and "Hero(es)". The `Log in` mission is done when you log in.
{% /callout %}

---

## Next steps

- See [Dailies](/docs/dailies) for a routine of daily steps that are habits and not missions
- Browse [Items](/docs/items) to resolve the `itemId` values in rewards
- Read [VIP](/docs/vip) for another source of daily rewards
