---
title: Dailies
nextjs:
  metadata:
    title: whiteout-survival-data - Dailies
    description: Use the 15 steps of a recommended daily routine as a default task list.
---

Use the steps of a recommended daily routine as the default list of daily tasks, and add your own tasks on top of it. 15 steps are included, in order. {% .lead %}

The in-game daily missions are not in this list. They are in [Daily missions](/docs/daily-missions).

---

## Type

### `DailyTask`

| Field         | Type      | Description                            |
| ------------- | --------- | -------------------------------------- |
| `id`          | `string`  | The name in lowercase kebab-case       |
| `name`        | `string`  | Display name of the step               |
| `img`         | `string?` | Path to an icon, relative to `images/` |
| `description` | `string?` | Detail for the step                    |

No entry has an `img` or a `description` yet.

---

## Factory

```typescript
import { dailies } from 'whiteout-survival-data'

dailies() // all 15 steps
dailies(source) // wrap a pre-filtered array
```

`dailies()` has no filters of its own.

---

## Terminal methods

| Method              | Returns                  | Description                          |
| ------------------- | ------------------------ | ------------------------------------ |
| `.get()`            | `DailyTask[]`            | All results, in order of the routine |
| `.first()`          | `DailyTask \| undefined` | First result                         |
| `.find(id)`         | `DailyTask \| undefined` | Find by `id`                         |
| `.findByName(name)` | `DailyTask \| undefined` | Case-insensitive exact name match    |
| `.search(query)`    | `DailyTask[]`            | Case-insensitive partial name match  |
| `.count()`          | `number`                 | Number of results                    |

---

## Examples

```typescript
import { dailies } from 'whiteout-survival-data'

// Every step of the routine, in order
dailies().count() // 15
dailies()
  .get()
  .slice(0, 3)
  .map((task) => task.name)
// ['Start by Checking Events Before Spending Anything', 'Complete Daily Missions', 'Clear Lighthouse Intel Throughout the Day']

// One step by id or by name
dailies().find('claim-your-daily-vip-reward')?.name // 'Claim Your Daily VIP Reward'
dailies().findByName('use stamina with a purpose')?.id // 'use-stamina-with-a-purpose'

// Steps that contain a word
dailies().search('pet').length // 1
```

---

## Notes

The 15 entries are the steps of a recommended daily routine. They are not the in-game daily missions, so for example "Complete Daily Missions" is a step of the routine and not a mission. "Participate in Alliance Events When Scheduled" is a step of the routine, but not every important activity is daily.

Some steps are about the same part of the game as a mission, such as "Use Your Free Arena Attempts" and the Arena Challenge mission. A step is a habit and a mission is a task with a target and rewards. The missions, with their targets, activeness, and rewards, are in [Daily missions](/docs/daily-missions) only.

---

## Known gaps

{% callout type="warning" title="No reset time" %}
The package has no daily reset time. The Lighthouse Intel refresh times are commonly 00:00, 08:00, and 16:00 server time, which is not a daily reset time.
{% /callout %}

---

## Next steps

- See [Daily missions](/docs/daily-missions) for the in-game missions and the activity bar
- Browse [Events](/docs/events) for the events a routine should check
- Read the [query builder](/docs/query-builder) guide for more filter patterns
