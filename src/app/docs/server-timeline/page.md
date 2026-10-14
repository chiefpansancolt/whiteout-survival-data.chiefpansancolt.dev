---
title: Server timeline
nextjs:
  metadata:
    title: whiteout-survival-data - Server timeline
    description: See what unlocks at each server age and what a server has unlocked so far.
---

See what unlocks at each server age. Pass your server start date to find your server age and everything that is unlocked or still locked. {% .lead %}

The timeline holds 33 milestones, from day 0 to day 1240. Heroes, experts, pets, events, and Fire Crystal levels are stored as ids. They resolve to full entries from [Heroes](/docs/heroes), [Experts](/docs/experts), [Pets](/docs/pets), and [Events](/docs/events) when you call `resolve()` or `serverTimelineStatus()`.

---

## Type

### `ServerTimelineMilestone`

| Field                 | Type                       | Description                                                                                         |
| --------------------- | -------------------------- | --------------------------------------------------------------------------------------------------- |
| `id`                  | `string`                   | Stable identifier, such as `day-54`                                                                 |
| `name`                | `string`                   | Display name, such as `Day 54`                                                                      |
| `day`                 | `number`                   | Server age in days at which the content unlocks. Day 0 is the server start date                     |
| `heroIds`             | `string[]`                 | Ids of the heroes that unlock. Resolve with `heroes()`                                              |
| `heroShardEventIds`   | `Record<string, string[]>` | Ids of the events that give shards of each hero, by hero id. A hero with no listed event has no key |
| `expertIds`           | `string[]`                 | Ids of the experts that unlock. Resolve with `experts()`                                            |
| `petIds`              | `string[]`                 | Ids of the pets that unlock. Resolve with `pets()`                                                  |
| `eventIds`            | `string[]`                 | Ids of the events that unlock. Resolve with `events()`                                              |
| `fireCrystalLevelIds` | `string[]`                 | Ids of the Fire Crystal levels that unlock, such as `fc-5`                                          |
| `unlocks`             | `ServerTimelineUnlock[]`   | Everything else that unlocks                                                                        |

### `ServerTimelineUnlock`

| Field    | Type      | Description                                                                                |
| -------- | --------- | ------------------------------------------------------------------------------------------ |
| `name`   | `string`  | What unlocks, as text                                                                      |
| `key`    | `string?` | Names an unlock that a site reads, so the site does not match text. Unique in the timeline |
| `itemId` | `string?` | Id of an entry in [Items](/docs/items). Resolved to `item`                                 |

The `key` is set for `war-academy` on day 220 and `t12-research` on day 680, and for no other unlock.

### `ResolvedServerTimelineMilestone`

The result of `resolve()`. It keeps `id`, `name`, and `day`, and replaces each id field.

| Field               | Type                             | Description                                                                       |
| ------------------- | -------------------------------- | --------------------------------------------------------------------------------- |
| `heroes`            | `Hero[]`                         | The heroes that unlock                                                            |
| `heroShardEvents`   | `Record<string, GameEvent[]>`    | The shard events of every hero by hero id. An empty array when no event is listed |
| `experts`           | `(Expert \| UnreleasedExpert)[]` | The experts that unlock                                                           |
| `pets`              | `Pet[]`                          | The pets that unlock                                                              |
| `events`            | `GameEvent[]`                    | The events that unlock                                                            |
| `fireCrystalLevels` | `FireCrystalLevel[]`             | The Fire Crystal levels that unlock                                               |
| `unlocks`           | `ResolvedServerTimelineUnlock[]` | Each unlock with its `item` in place of `itemId`                                  |

### `ServerTimelineStatus`

| Field       | Type                              | Description                                                          |
| ----------- | --------------------------------- | -------------------------------------------------------------------- |
| `age`       | `number`                          | Server age in whole days                                             |
| `startDate` | `string`                          | Server start date in `YYYY-MM-DD` format, in UTC                     |
| `unlocked`  | `ServerTimelineStatusMilestone[]` | Milestones at or before the age, oldest first                        |
| `locked`    | `ServerTimelineStatusMilestone[]` | Milestones after the age, oldest first                               |
| `next`      | `ServerTimelineStatusMilestone?`  | The first locked milestone. Not set when every milestone is unlocked |

`ServerTimelineStatusMilestone` is a resolved milestone with a `date` added: the calendar date on which it unlocks for that server, in `YYYY-MM-DD` format and UTC.

---

## Factory

```typescript
import { serverTimeline } from 'whiteout-survival-data'

serverTimeline() // all 33 milestones
serverTimeline(source) // wrap a pre-filtered array
```

---

## Filters

| Method       | Signature                 | Description                                                                               |
| ------------ | ------------------------- | ----------------------------------------------------------------------------------------- |
| `unlockedAt` | `unlockedAt(age: number)` | Milestones at or before the server age in days. A milestone on the age itself is unlocked |
| `lockedAt`   | `lockedAt(age: number)`   | Milestones after the server age in days                                                   |

```typescript
import { serverTimeline } from 'whiteout-survival-data'

serverTimeline().unlockedAt(100).count() // 7
serverTimeline().lockedAt(100).first()?.day // 120
```

---

## Terminal methods

| Method              | Returns                                | Description                                                                  |
| ------------------- | -------------------------------------- | ---------------------------------------------------------------------------- |
| `.get()`            | `ServerTimelineMilestone[]`            | All results                                                                  |
| `.first()`          | `ServerTimelineMilestone \| undefined` | First result                                                                 |
| `.find(id)`         | `ServerTimelineMilestone \| undefined` | Find by `id`                                                                 |
| `.findByName(name)` | `ServerTimelineMilestone \| undefined` | Case-insensitive exact name match                                            |
| `.search(query)`    | `ServerTimelineMilestone[]`            | Case-insensitive partial name match                                          |
| `.count()`          | `number`                               | Number of results                                                            |
| `.resolve()`        | `ResolvedServerTimelineMilestone[]`    | Replaces every id with its entry. Throws `Error` when an id matches no entry |

---

## Functions

| Function                                 | Returns                | Description                                                      |
| ---------------------------------------- | ---------------------- | ---------------------------------------------------------------- |
| `serverAge(startDate, asOf?)`            | `number`               | Whole days from the start date to `asOf`. `asOf` defaults to now |
| `serverTimelineStatus(startDate, asOf?)` | `ServerTimelineStatus` | The age, the unlocked and locked milestones, and the next one    |
| `heroGenerationAt(serverAge)`            | `number`               | The highest hero generation unlocked at a server age in days     |

Dates are a `Date` or a string such as `2026-01-15`. Both count in UTC and ignore the time of day. `serverAge` and `serverTimelineStatus` throw `RangeError` when a date is invalid or `asOf` is before the start date. `heroGenerationAt` is 1 on day 0 and 17 from day 1240, and throws `RangeError` for a negative or non-numeric age.

---

## Examples

```typescript
import {
  heroGenerationAt,
  serverAge,
  serverTimeline,
  serverTimelineStatus,
} from 'whiteout-survival-data'

// Server age in whole days. Day 0 is the start date.
serverAge('2026-07-01', '2026-10-11') // 102

// Everything unlocked and locked for a server, with heroes and pets resolved
const status = serverTimelineStatus('2026-07-01', '2026-10-11')
status.age // 102
status.unlocked.flatMap((m) => m.heroes.map((h) => h.name))
// ['Natalia', 'Jeronimo', 'Molly', 'Zinman', 'Flint', 'Philly', 'Alonso']
status.next?.name // 'Day 120'
status.next?.date // '2026-10-29'

// The highest hero generation unlocked at a server age
heroGenerationAt(status.age) // 2

// The day on which a keyed unlock happens
const warAcademy = serverTimeline()
  .get()
  .find((m) => m.unlocks.some((u) => u.key === 'war-academy'))
warAcademy?.day // 220

// Query the milestones directly
serverTimeline().find('day-54')?.petIds
// ['cave-hyena', 'arctic-wolf', 'musk-ox', 'titan-roc', 'giant-tapir']

// Resolve the first milestone after day 1000
serverTimeline()
  .lockedAt(1000)
  .resolve()[0]
  .heroes.map((h) => h.name)
// ['Hank', 'Estrella', 'Viveca']
```

---

## Notes

The experts unlock on four days: day 120 (Holger, Agnes, Cyrille), day 160 (Romulus), day 200 (Valeria, Baldur, Fabian), and day 230 (Kathy, Ronne). Days 160 and 230 have no other content, so their milestones hold only experts. The day of each expert is also `unlockRequirement.daysRequired` in [Experts](/docs/experts).

Generation 17 (Aiden, Bertha, and Eleanor) is on day 1240. The package owner states that the day is accurate, because the heroes of every generation from generation 6 on unlock 80 days after the generation before.

The pet days on the timeline and `unlockRequirement.daysRequired` in [Pets](/docs/pets) are the same. Titan Roc and Giant Tapir are on day 54, Snow Leopard and Giant Elk on day 90, Cave Lion and Snow Ape on day 140, Iron Rhino and Saber-tooth Tiger on day 200, Mammoth and Frost Gorilla on day 280, and Frostscale Chameleon on day 370.

The events that unlock are Sunfire Castle (day 53), State vs. State and King of the Ice (day 80), and Hero's Mission (day 195). They link to `sunfire-castle`, `svs-state-of-power`, `king-of-icefield`, and `heros-mission` in [Events](/docs/events). Hero's Mission replaces Gina's Revenge on day 195, so the timeline keeps only Hero's Mission. The other `unlocks` text is not an event page, so it has no link.

The shard events of each hero cover five events: Lucky Wheel, Hall of Heroes, Hall of Chief, King of Icefield, and State of Power (SVS). For Generations 2 to 9, the event is the first way to get shards of a new generation. Each of these generations has one hero for Lucky Wheel, one for Hall of Heroes, and one for the other three events. Generation 1 and Generations 10 to 17 use `shardSources` from [Heroes](/docs/heroes), limited to the same events. Jeronimo and Natalia have no listed event. Hall of Chief is listed only for Philly (Generation 2).

The Fire Crystal levels link as follows: FC 1 to FC 3 on day 60, FC 4 and FC 5 on day 150, FC 6 to FC 8 on day 315, and FC 9 and FC 10 on day 500. The "Fire Crystal Age Unlocks" entry on day 60 has the `itemId` `fire-crystal`, so it shows the Fire Crystal icon from [Items](/docs/items). The laboratory entries read "Crystal Laboratory Unlocks (4x)" on day 150, "Crystal Laboratory Updated (5x)" on day 220, and "Crystal Laboratory Updated (6x)" on day 315. Day 315 also reads "Daily Missions Update (20x Fire Crystal rewards)".

---

## Known gaps

{% callout type="warning" title="Assumptions in the timeline" %}
Justus, an expert that the game has not released, is on day 360, the day of the generation 6 heroes. He unlocks "after Gen 6 Heroes unlock in your state" and has no stated day, so day 360 is the earliest day he can unlock. `resolve()` returns him in `experts` with `unreleased` set to `true`.

Gareth is on no milestone.

Generation 18 is not announced, so it is not on the timeline.

The Fire Crystal level images are 52 by 52 pixel crops. They are small and keep the red table background.

Hall of Chief is left out of the shard events for Generation 3 and later by choice.
{% /callout %}

---

## Next steps

- See [Heroes](/docs/heroes), [Experts](/docs/experts), and [Pets](/docs/pets) for the entries the ids resolve to
- Browse [Events](/docs/events) for the events that unlock on the timeline
- Read [Fire Crystal table](/docs/fire-crystal-table) for the Fire Crystal levels
