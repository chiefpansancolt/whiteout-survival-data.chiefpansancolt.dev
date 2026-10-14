---
title: Fortresses
nextjs:
  metadata:
    title: whiteout-survival-data - Fortresses
    description: Query the castle, strongholds, and fortresses on the alliance map with coordinates and phase rewards.
---

The castle, the 4 strongholds, and the 12 fortresses on the alliance map, with their coordinates and the reward of each phase. {% .lead %}

The module has 17 entries. The castle is at (597, 597).

---

## Types

### `AllianceFortress`

| Field     | Type                       | Description                                     |
| --------- | -------------------------- | ----------------------------------------------- |
| `id`      | `string`                   | Stable identifier, such as `stronghold-1`       |
| `name`    | `string`                   | Display name                                    |
| `kind`    | `AllianceFortressKind`     | `castle`, `stronghold`, or `fortress`           |
| `x`       | `number`                   | Map x coordinate                                |
| `y`       | `number`                   | Map y coordinate                                |
| `rewards` | `AllianceFortressReward[]` | One reward for each phase. Empty for the castle |

### `AllianceFortressReward`

| Field    | Type     | Description          |
| -------- | -------- | -------------------- |
| `phase`  | `number` | Phase number, 1 to 8 |
| `reward` | `string` | Reward for the phase |

---

## Factory

```typescript
import { allianceFortress } from 'whiteout-survival-data'

allianceFortress() // all 17 entries
allianceFortress(source) // wrap a pre-filtered array
```

---

## Filters

| Method      | Signature                            | Description                                            |
| ----------- | ------------------------------------ | ------------------------------------------------------ |
| `ofKind(k)` | `ofKind(kind: AllianceFortressKind)` | Keeps one kind: `castle`, `stronghold`, or `fortress`. |

---

## Terminal methods

| Method              | Returns                         | Description                         |
| ------------------- | ------------------------------- | ----------------------------------- |
| `.get()`            | `AllianceFortress[]`            | All results                         |
| `.first()`          | `AllianceFortress \| undefined` | First result                        |
| `.find(id)`         | `AllianceFortress \| undefined` | Find by `id`                        |
| `.findByName(name)` | `AllianceFortress \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `AllianceFortress[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                        | Number of results                   |

---

## Examples

```typescript
import { allianceFortress } from 'whiteout-survival-data'

// The 4 strongholds with their map coordinates
allianceFortress()
  .ofKind('stronghold')
  .get()
  .map((s) => [s.name, s.x, s.y])
// [['Stronghold 1', 597, 800], ['Stronghold 2', 400, 597], ...]

// Phase 1 reward of one stronghold
allianceFortress().find('stronghold-1')?.rewards[0]
// { phase: 1, reward: 'Shards' }

// Number of fortresses
allianceFortress().ofKind('fortress').count() // 12
```

---

## Notes

Each stronghold and fortress has 8 rewards, one for each phase.

{% callout type="warning" title="The castle has no rewards" %}
The rewards of the castle are not documented, so its `rewards` array is empty.
{% /callout %}

---

## Next steps

- See [Alliance facilities](/docs/alliance-facility) for the other map locations of the alliance
- See [Territory banners](/docs/alliance-banner) for the banner build costs
- See [Prestige buildings](/docs/alliance-prestige) for buildings in the alliance territory
