---
title: Events
nextjs:
  metadata:
    title: whiteout-survival-data - Events
    description: Look up game events with their schedule, requirements, rewards, rankings, and tips.
---

Look up how each game event works and what it gives. 65 events are included: 12 alliance, 36 solo, 12 rookie, and 5 holiday. {% .lead %}

Every event has an `id`, a `name`, an `img`, a `category`, and a `description`. All other fields are optional, because events differ a lot in shape.

---

## Type

### `GameEvent`

| Field                    | Type                         | Description                                                                                      |
| ------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------ |
| `id`                     | `string`                     | Stable identifier                                                                                |
| `name`                   | `string`                     | Display name                                                                                     |
| `img`                    | `string`                     | Path to the event icon, relative to `images/`                                                    |
| `category`               | `EventCategory`              | `'solo'`, `'alliance'`, `'rookie'`, or `'holiday'`                                               |
| `description`            | `string`                     | What the event is                                                                                |
| `resultShape`            | `GameEventResultShape?`      | The form of result the event takes. Not set on the four Core events                              |
| `scoreUnit`              | `string?`                    | What `scoreTotal` counts, on events whose targets are not points                                 |
| `frequency`              | `string?`                    | How often the event runs, as free text                                                           |
| `duration`               | `string?`                    | How long the event runs, as free text                                                            |
| `schedule`               | `EventSchedule?`             | The same information as a rule, for a calendar                                                   |
| `expertTiers`            | `GameEventExpertTier[]?`     | Extra reward tiers added by expert skills                                                        |
| `requirements`           | `string[]?`                  | What a player needs to take part                                                                 |
| `tiers`                  | `GameEventTier[]?`           | Ranking or milestone tiers, from lowest to highest                                               |
| `allianceRankings`       | `GameEventRanking[]?`        | Alliance rewards by placement                                                                    |
| `allianceRankingUpdates` | `GameEventRankingVersion[]?` | Later alliance reward lists that replace `allianceRankings`, in the order the game replaced them |
| `personalRankings`       | `GameEventRankingTable[]?`   | Personal rewards by placement, one table for each thing a placement is based on                  |
| `pointLevels`            | `GameEventPointLevels?`      | Reward levels that need both personal and alliance points                                        |
| `phases`                 | `GameEventPhase[]?`          | Named phases of the event                                                                        |
| `days`                   | `GameEventDay[]?`            | Per-day scoring and milestones. Also holds the separate versions of an event                     |
| `waves`                  | `GameEventWave[]?`           | Attack waves                                                                                     |
| `zones`                  | `GameEventZone[]?`           | Zones with their open days                                                                       |
| `missions`               | `GameEventMission[]?`        | Missions with base points                                                                        |
| `missionPointsLabel`     | `string?`                    | Names the mission points when they are a currency                                                |
| `versions`               | `GameEventVersion[]?`        | Missions and tiers that differ by the age of the state                                           |
| `shop`                   | `GameEventShopOffer[]?`      | Shop offers with cost and limit                                                                  |
| `shops`                  | `GameEventShop[]?`           | One shop for each group, such as each hero generation                                            |
| `shopCurrencyItemId`     | `string?`                    | The item id of the shop currency                                                                 |
| `shopCurrencyName`       | `string?`                    | The currency name, set only when the currency is not in `items()`                                |
| `refreshes`              | `GameEventRefresh[]?`        | Refresh costs with quality chances                                                               |
| `heroByGeneration`       | `GameEventGenerationHero[]?` | The hero whose shards the event gives for each generation                                        |
| `rewards`                | `GameEventReward[]?`         | Rewards that do not belong to a tier or ranking                                                  |
| `tips`                   | `string[]?`                  | Tips for the event                                                                               |
| `eventBuffId`            | `string?`                    | The id of the matching row in [Event buffs](/docs/event-buff)                                    |

### `GameEventReward`

| Field          | Type      | Description                                         |
| -------------- | --------- | --------------------------------------------------- |
| `name`         | `string`  | Reward name                                         |
| `itemId`       | `string?` | Id of an entry in [Items](/docs/items)              |
| `decorationId` | `string?` | Set when the reward is a decoration and not an item |
| `skinId`       | `string?` | Id of an entry in [Skins](/docs/skins)              |
| `amount`       | `number?` | Amount given                                        |
| `note`         | `string?` | Extra detail                                        |

### `GameEventTier`

| Field        | Type                  | Description                                      |
| ------------ | --------------------- | ------------------------------------------------ |
| `name`       | `string`              | Tier name                                        |
| `note`       | `string?`             | Extra detail                                     |
| `scoreTotal` | `number?`             | Points needed. Left out until the value is known |
| `rewards`    | `GameEventReward[]?`  | Tier-wide rewards                                |
| `rankings`   | `GameEventRanking[]?` | Per-placement rewards                            |

### `GameEventRanking`

| Field          | Type                     | Description                                       |
| -------------- | ------------------------ | ------------------------------------------------- |
| `groupRanking` | `string`                 | The placement group, such as a rank range         |
| `starChange`   | `number?`                | Star change for the placement. Negative on a loss |
| `rewards`      | `GameEventReward[]`      | Rewards for the placement                         |
| `levels`       | `GameEventStageLevel[]?` | Enemy levels, on Mercenary Prestige rankings      |

### `GameEventScoringAction`

Each entry of a `GameEventDay` `scoring` list is a scoring action.

| Field     | Type        | Description                                                       |
| --------- | ----------- | ----------------------------------------------------------------- |
| `action`  | `string`    | What the player does                                              |
| `points`  | `number`    | Points the action gives                                           |
| `itemId`  | `string?`   | Set when the action names one item that is in `items()`           |
| `itemIds` | `string[]?` | Set when the action names a kind of item. Never set with `itemId` |

### `EventSchedule`

| Field    | Type           | Description               |
| -------- | -------------- | ------------------------- |
| `repeat` | `EventRepeat?` | When the event comes back |
| `runs`   | `EventRun[]?`  | The runs of one cycle     |

`EventRepeat` has a `kind` of `'none'`, `'every'`, or `'weekly'`. An `'every'` repeat has `every` (a number) and `unit` (`'hours'`, `'days'`, `'weeks'`, or `'months'`). A `'weekly'` repeat has `weekdays`.

`EventRun` has `length` and `unit` (`'minutes'`, `'hours'`, or `'days'`), plus an optional `label`, `startWeekday`, and `startTimeUtc` (`HH:MM`). Times are in UTC.

### `GameEventExpertTier`

| Field              | Type                              | Description                                             |
| ------------------ | --------------------------------- | ------------------------------------------------------- |
| `expertId`         | `string`                          | Id of the expert, as in [Experts](/docs/experts)        |
| `skill`            | `string`                          | Name of the expert skill                                |
| `tier`             | `number`                          | The extra tier, 1 to 3                                  |
| `unlockSkillLevel` | `number`                          | Skill level at which the tier appears: 1, 6, or 10      |
| `thresholds`       | `GameEventExpertTierThreshold[]?` | Points the tier needs, with the `days` the value is for |
| `rewards`          | `GameEventReward[]?`              | Rewards of the tier                                     |

### `GameEventResultShape`

`resultShape` has five values. Each one is derived from the data of the event, in this order.

| Value           | Rule                                                                   | Events |
| --------------- | ---------------------------------------------------------------------- | ------ |
| `waves`         | The event has `waves`.                                                 | 1      |
| `tier`          | A tier holds `rankings`.                                               | 5      |
| `ranking`       | The event has `personalRankings` or `allianceRankings`.                | 21     |
| `milestones`    | A tier has `scoreTotal`, or the event has `pointLevels` or `missions`. | 16     |
| `participation` | None of the above. The data has no score or rank.                      | 18     |

### `GameEventRankingTableView`

`eventRankingTables()` returns this shape.

| Field      | Type                        | Description                                                                  |
| ---------- | --------------------------- | ---------------------------------------------------------------------------- |
| `id`       | `string`                    | Table id, such as `personal-1`, `alliance`, `alliance-update-1`, or `tier-1` |
| `scope`    | `'personal' \| 'alliance'?` | Set when the event states it                                                 |
| `name`     | `string?`                   | Name of the tier or update the table comes from                              |
| `basedOn`  | `string?`                   | What a personal placement is based on                                        |
| `rankings` | `GameEventRanking[]`        | The placements                                                               |

---

## Factory

```typescript
import { events } from 'whiteout-survival-data'

events() // all 65 events
events(source) // wrap a pre-filtered array
```

---

## Filters

| Method       | Signature                             | Description                                                                   |
| ------------ | ------------------------------------- | ----------------------------------------------------------------------------- |
| `byCategory` | `byCategory(category: EventCategory)` | Filter to events of one category: `solo`, `alliance`, `rookie`, or `holiday`. |

```typescript
import { events } from 'whiteout-survival-data'

events().byCategory('alliance').count() // 12
events().byCategory('holiday').get() // Dreamscape Memory, Frosty Fortune, Romance Season, Vision of Dawn, Vault of Enigma
```

---

## Terminal methods

| Method              | Returns                  | Description                         |
| ------------------- | ------------------------ | ----------------------------------- |
| `.get()`            | `GameEvent[]`            | All results                         |
| `.first()`          | `GameEvent \| undefined` | First result                        |
| `.find(id)`         | `GameEvent \| undefined` | Find by `id`                        |
| `.findByName(name)` | `GameEvent \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `GameEvent[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                 | Number of results                   |

---

## Helper functions

| Function                    | Returns                       | Description                                   |
| --------------------------- | ----------------------------- | --------------------------------------------- |
| `eventRankingTables(event)` | `GameEventRankingTableView[]` | Every ranking table of one event in one shape |

The order of the tables is the `personalRankings` tables (`personal-1` and on, with `basedOn`), the `allianceRankings` table (`alliance`), the `allianceRankingUpdates` lists (`alliance-update-1` and on, with the `name` of the update), and the tiers that hold rankings (`tier-1` and on, with the `name` of the tier). A tier table has a `scope` only when its name says personal or alliance. The star rating tiers of Alliance Showdown and the winner tier of SvS have none. The array is empty for an event with no ranking.

---

## Schedule

`frequency` and `duration` are free text. `schedule` holds the same information as a rule, and it is set on 50 of the 65 events.

```typescript
import { events } from 'whiteout-survival-data'

const bear = events().find('bear-hunt')
bear?.duration // '30 minutes'
bear?.schedule
// { repeat: { kind: 'every', every: 47.5, unit: 'hours' }, runs: [{ length: 30, unit: 'minutes' }] }
```

An event with two runs in a cycle has two entries in `runs`. Hall of Chief has `Season 1` for 6 days and `Season 2` for 7 days. Crazy Joe has a run on Tuesday and one on Thursday. Frostfire Mine has a run of 30 minutes for each of its seven time slots.

The `schedule` has no dates, because the game does not publish them. A repeat rule is set when the text gives an interval, such as "Weekly", "Every two weeks", "Once a month", or "Yearly" (12 months). A run is set when the text gives a length. Some events have a repeat rule and no run, or the other way around, when the text has only one of the two.

The SvS week follows the package owner: Preparation for 5 days from Monday, and a Battle of 12 hours from Saturday 10:00 UTC, repeating every four weeks. Canyon Clash follows the owner as well: voting on Monday and Tuesday, registration on Wednesday and Thursday, matchmaking on Friday, and the battle on Saturday.

---

## Item links in scoring actions

A scoring action has an `itemId` when its text names one item that is in `items()`. Some actions name a kind of item and not one item. They are linked as follows.

| Action text                                       | Link                                                                              |
| ------------------------------------------------- | --------------------------------------------------------------------------------- |
| Use 1 Rare, Epic, or Mythic Hero Shard (45 rows)  | `itemId` of the general shard of that rarity, such as `mythic-general-hero-shard` |
| Use Epic Recruitment 1 time (4 rows)              | `itemId` `platinum-key`. Advanced Recruitment uses `gold-key`                     |
| Use any 1 Expert Sigil, excluding Common (4 rows) | `itemIds`, the 10 named sigils                                                    |
| Use 1m of Speedups for a type (65 rows)           | `itemIds`, the speedups of that type: construction, research, troop, or learning  |

The general speedups are not in the speedup lists, because the wording names the type. An action has an `itemId` or `itemIds`, never both.

---

## Expert extra tiers

Three expert skills add reward tiers to an event: Baldur's Blazing Sunrise to Alliance Mobilization, Baldur's Dawn Hymn to Alliance Showdown, and Valeria's Well Prepared to the preparation phase of State of Power. Each skill adds up to three extra tiers, at skill levels 1, 6, and 10. The `expertTiers` list of these events has one entry for each extra tier. The extra tiers come after the normal milestone tiers.

---

## Examples

```typescript
import { eventRankingTables, events } from 'whiteout-survival-data'

// Alliance events
events().byCategory('alliance').count() // 12

// Read a nested list: the 20 waves of Crazy Joe
events().findByName('Crazy Joe')?.waves?.length // 20

// Events with a related event buff row
events()
  .get()
  .filter((e) => e.eventBuffId !== undefined)
  .map((e) => e.id)

// Every ranking table of an event in one shape
const tables = eventRankingTables(events().find('king-of-icefield')!)
tables.map((t) => `${t.id} ${t.scope}`)
// ['personal-1 personal', 'personal-2 personal', 'personal-3 personal', 'personal-4 personal']
```

---

## Known gaps

{% callout type="warning" title="Data that is not complete" %}
`eventBuffId` equals the event `id` for ten events, and Sunfire Castle links to the row `castle-battle`.

Fifteen events have no `schedule`, because their text gives no usable one: Deadshot, Develop New Tech and its second version, Dreamscape Memory, Frostdragon Tyrant, Frosty Fortune, Home Beyond, Return to Tundra, Silver Shell Events, Stand of Arms, The Labyrinth, Trial Event, Tundra Album, Tundra Games, and Tundra Star.

The points that an expert extra tier needs are not published. The only value is the threshold of Dawn Hymn tier 1, 200,000 points on days 1 to 4 of Alliance Showdown. Every other threshold is left out.

Six events have `resultShape` `milestones` only because they list missions: Alliance Mobilization, Beast Whisperer, Flame and Fang, Symphony of Change, Vision of Dawn, and Wild Brawl. A different shape may fit them better.

Several rewards are incomplete. Image-only rewards are loaded only where they can be read, and rewards with no name are recorded as unidentified items. The Fishing Tournament leaderboard rewards (9 rank bands) have no amounts. Hall of Chief ranking lists show only the first ranks, and the season hero shard rewards of its total ranking have no amount. King of Icefield ranking tables hold only the first rows. The 13 "Use 1 Widget of any Hero Exclusive Gear" scoring rows have no item link, because `items()` has no widget items.

Silver Shell Events, Tundra Album, and Shining City Pack do not load their shops and packs. Tundra Trade Route truck rewards are random and are not listed. The Vision of Dawn version for the age before Fire Crystal has no `scoreTotal` on its Hope chests yet. The Alliance Mobilization 120% and 200% exclusive missions and its gem purchase missions are left out. Alliance Mobilization is set to once a month, as its text says, although it runs twice a month until about 13 weeks of state age.

Mercenary Prestige level tables keep two rows as printed, Champion's Nightmare level 50 and Epic Nightmare level 13, each with a `note`, because they look like typos.
{% /callout %}

---

## Next steps

- See [Event buffs](/docs/event-buff) for which buff sources count in each game mode
- Browse [Items](/docs/items) to resolve the `itemId` values used in rewards and scoring actions
- Read [Experts](/docs/experts) for the skills behind the expert extra tiers
- Read the [query builder](/docs/query-builder) guide for more filter patterns
