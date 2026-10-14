---
title: Alliance facilities
nextjs:
  metadata:
    title: whiteout-survival-data - Alliance facilities
    description: Query the 8 map-based Alliance Facility types with the bonus and map locations of each level.
---

The 8 map-based Alliance Facility types, with the bonus and the map locations of each level. {% .lead %}

The facilities are construction, defense, expedition, gathering, production, tech, training, and weapons. They have 12 levels in all.

---

## Types

### `AllianceFacility`

| Field       | Type                      | Description                                             |
| ----------- | ------------------------- | ------------------------------------------------------- |
| `id`        | `string`                  | Stable identifier, such as `defense`                    |
| `name`      | `string`                  | Display name                                            |
| `bonusStat` | `string`                  | Stat the facility boosts, such as `Troop Defense Boost` |
| `levels`    | `AllianceFacilityLevel[]` | The levels the data covers                              |

### `AllianceFacilityLevel`

| Field                   | Type                         | Description                                                    |
| ----------------------- | ---------------------------- | -------------------------------------------------------------- |
| `level`                 | `number`                     | Facility level                                                 |
| `boosterPercent`        | `number`                     | Booster percent listed for the level in the in-game map info   |
| `heavilyInjuredPercent` | `number`                     | Heavily injured percent listed for the level                   |
| `lossesPercent`         | `number`                     | Losses percent listed for the level                            |
| `ownLimit`              | `number`                     | Most facilities of that level one alliance can own. Always `1` |
| `available`             | `number`                     | Facilities of that level on the map. Equals `locations.length` |
| `locations`             | `AllianceFacilityLocation[]` | Map coordinates                                                |

### `AllianceFacilityLocation`

| Field | Type     | Description |
| ----- | -------- | ----------- |
| `x`   | `number` | Map x       |
| `y`   | `number` | Map y       |

---

## Factory

```typescript
import { allianceFacility } from 'whiteout-survival-data'

allianceFacility() // all 8 facilities
allianceFacility(source) // wrap a pre-filtered array
```

---

## Filters

This module has no filters or sorts of its own. Use the terminal methods.

---

## Terminal methods

| Method              | Returns                         | Description                         |
| ------------------- | ------------------------------- | ----------------------------------- |
| `.get()`            | `AllianceFacility[]`            | All results                         |
| `.first()`          | `AllianceFacility \| undefined` | First result                        |
| `.find(id)`         | `AllianceFacility \| undefined` | Find by `id`                        |
| `.findByName(name)` | `AllianceFacility \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `AllianceFacility[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                        | Number of results                   |

---

## Examples

```typescript
import { allianceFacility } from 'whiteout-survival-data'

// Bonus stat and levels of one facility
const defense = allianceFacility().find('defense')
defense?.bonusStat // 'Troop Defense Boost'
defense?.levels.map((l) => [l.level, l.boosterPercent, l.available])
// [[2, 5, 8], [4, 8, 3]]

// Map coordinates of the level 1 construction facilities
allianceFacility().find('construction')?.levels[0].locations
// [{ x: 1068, y: 138 }, { x: 537, y: 138 }, ...]

// Facilities whose name contains a word
allianceFacility().search('ing').length // 2
```

---

## Notes

The capture rules are not stored as data: a 30-minute capture, 3 days of control, stacking rules, and a limit of 12 facilities.

{% callout type="warning" title="Some levels are missing" %}
The data comes from the in-game map info, which documents only some levels of each facility. For example, `defense` has Levels 2 and 4, and `gathering` has only Level 1. The missing levels are gaps. They are not guessed.
{% /callout %}

---

## Next steps

- See [Fortresses](/docs/alliance-fortress) for the other map locations of the alliance
- See [Prestige buildings](/docs/alliance-prestige) for buildings in the alliance territory
- See [Alliance tech](/docs/alliance-tech) for the alliance technology tree
