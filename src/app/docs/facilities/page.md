---
title: Facilities
nextjs:
  metadata:
    title: whiteout-survival-data - Facilities
    description: Query the nine functional buildings that have no levels, power, or build cost.
---

Nine functional buildings that have no levels, power, or build cost. Look up what each hub does and the Furnace level that unlocks it. {% .lead %}

Buildings with upgrade levels are in [Buildings](/docs/buildings).

---

## Type

### `Facility`

| Field                | Type     | Description                                 |
| -------------------- | -------- | ------------------------------------------- |
| `id`                 | `string` | Stable identifier                           |
| `name`               | `string` | Display name                                |
| `img`                | `string` | Path to the facility's icon                 |
| `description`        | `string` | What the facility does in the game          |
| `unlockFurnaceLevel` | `number` | Furnace level at which the facility unlocks |

---

## Factory

```typescript
import { facilities } from 'whiteout-survival-data'

facilities() // all 9 facilities
facilities(source) // wrap a pre-filtered array
```

---

## Terminal methods

`facilities()` has no filters of its own.

| Method              | Returns                 | Description                         |
| ------------------- | ----------------------- | ----------------------------------- |
| `.get()`            | `Facility[]`            | All results                         |
| `.first()`          | `Facility \| undefined` | First result                        |
| `.find(id)`         | `Facility \| undefined` | Find by `id`                        |
| `.findByName(name)` | `Facility \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `Facility[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                | Number of results                   |

---

## Examples

```typescript
import { facilities } from 'whiteout-survival-data'

const heroHall = facilities().findByName('Hero Hall')
heroHall?.description
heroHall?.unlockFurnaceLevel // 4

facilities()
  .search('office')
  .map((facility) => facility.name) // ['Enlistment Office']

facilities().count() // 9
```

---

## Unlock levels

| Facility          | Furnace level |
| ----------------- | ------------- |
| Suggestion Box    | 2             |
| Hero Hall         | 4             |
| Explorer's Cabin  | 4             |
| Chief's House     | 6             |
| Lighthouse        | 7             |
| Arena             | 8             |
| Enlistment Office | 11            |
| Beast Cage        | 18            |
| Dawn Academy      | 25            |

---

## Notes

Facilities have no upgrade levels, no power, and no build cost, so they use their own minimal shape and not a `Building`.

Enlistment Office replaces troops lost in battle from a reserve pool once the Infirmary's injured troops capacity is exceeded. Accumulated Loyalty gates it, and its capacity is four times the Infirmary's own.

---

## Next steps

- See [Buildings](/docs/buildings) for the upgradable city buildings
- Browse [Pets](/docs/pets), which are tamed at the Beast Cage
- Browse [Experts](/docs/experts), the Dawn Academy Experts
