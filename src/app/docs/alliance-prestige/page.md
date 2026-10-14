---
title: Prestige buildings
nextjs:
  metadata:
    title: whiteout-survival-data - Prestige buildings
    description: Query the alliance prestige buildings, the event that gives each one, and the bonus of each tier.
---

The prestige buildings that an alliance can build in its territory after it does well in an event, with the bonus that each one gives. {% .lead %}

Use it to see which event gives each building and what it grants. The module has 6 entries.

---

## Types

### `AlliancePrestigeBuilding`

| Field    | Type                      | Description                              |
| -------- | ------------------------- | ---------------------------------------- |
| `id`     | `string`                  | Stable identifier, such as `battle-horn` |
| `name`   | `string`                  | Display name                             |
| `source` | `AlliancePrestigeSource`  | The event that gives the building        |
| `levels` | `AlliancePrestigeLevel[]` | The 4 tiers of the building              |

### `AlliancePrestigeSource`

| Field         | Type      | Description                                                                        |
| ------------- | --------- | ---------------------------------------------------------------------------------- |
| `event`       | `string`  | Name of the event                                                                  |
| `eventId`     | `string?` | Id of the event in `events()`. Left out when the package has no data for the event |
| `requirement` | `string?` | What the alliance must reach in the event                                          |

### `AlliancePrestigeLevel`

| Field     | Type                      | Description                 |
| --------- | ------------------------- | --------------------------- |
| `name`    | `string`                  | Tier name, such as `Silver` |
| `bonuses` | `AlliancePrestigeBonus[]` | Bonuses of the tier         |

### `AlliancePrestigeBonus`

| Field     | Type                  | Description                                   |
| --------- | --------------------- | --------------------------------------------- |
| `stat`    | `string`              | Stat name, such as `Resource Gathering Speed` |
| `statKey` | `string`              | Stat name in lowercase kebab case             |
| `value`   | `string`              | Text of the bonus, such as `+10%`             |
| `amount`  | `number`              | Parsed value                                  |
| `unit`    | `'percent' \| 'flat'` | Unit of `amount`                              |

---

## Factory

```typescript
import { alliancePrestige } from 'whiteout-survival-data'

alliancePrestige() // all 6 buildings
alliancePrestige(source) // wrap a pre-filtered array
```

---

## Filters

This module has no filters or sorts of its own. Use the terminal methods.

---

## Terminal methods

| Method              | Returns                                 | Description                         |
| ------------------- | --------------------------------------- | ----------------------------------- |
| `.get()`            | `AlliancePrestigeBuilding[]`            | All results                         |
| `.first()`          | `AlliancePrestigeBuilding \| undefined` | First result                        |
| `.find(id)`         | `AlliancePrestigeBuilding \| undefined` | Find by `id`                        |
| `.findByName(name)` | `AlliancePrestigeBuilding \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `AlliancePrestigeBuilding[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                                | Number of results                   |

---

## Examples

```typescript
import { alliancePrestige, events } from 'whiteout-survival-data'

const statue = alliancePrestige().find('championship-statue')
statue?.source
// { event: 'Alliance Championship', eventId: 'alliance-championship', requirement: 'Reach Silver III' }

// The bonus of one tier of the Championship Statue. It applies to all four resources.
const ultimate = statue?.levels.find((level) => level.name === 'Ultimate')
ultimate?.bonuses.map((b) => `${b.stat} ${b.value}`)
// ['Resource Gathering Speed +10%']

// The event that gives a building, when the package has it
const horn = alliancePrestige().find('battle-horn')
horn?.source.eventId && events().find(horn.source.eventId)?.name // 'Alliance Showdown'

alliancePrestige().count() // 6
```

---

## Notes

The 6 buildings and the event that gives each one:

| Building            | Event                 | Requirement              |
| ------------------- | --------------------- | ------------------------ |
| Championship Statue | Alliance Championship | Reach Silver III         |
| Guardian            | Alliance Mobilization | Reach Senior Tier        |
| Foundry Rewards     | Foundry Battle        | S-rated                  |
| Battle Horn         | Alliance Showdown     | 5-Star                   |
| Weapons Master      | Tundra Arms League    | Advance to Championships |
| Siege Herald        | Winter Siege          | Reach Pioneer Tier       |

Each building has 4 tiers. Each tier has one bonus, `Resource Gathering Speed`, which applies to all four resources: meat, wood, coal, and iron. The bonus of a tier is +3%, +5%, +7%, and +10%, in the order of the tiers.

The Championship Statue gives its bonus to the members in the territory of the alliance. Its tiers are Silver, Gold, Diamond, and Ultimate.

{% callout type="warning" title="Known gaps" %}
The tiers of the other five buildings are named `Tier 1` to `Tier 4`, because the names of their tiers are not known. The package has no Winter Siege event, so Siege Herald has no `eventId`.

The cost to build a prestige building is not in the data.
{% /callout %}

---

## Next steps

- See [Events](/docs/events) for the events that give the buildings
- See [Territory banners](/docs/alliance-banner) for the banner build costs
- See [Alliance facilities](/docs/alliance-facility) for the map facilities
