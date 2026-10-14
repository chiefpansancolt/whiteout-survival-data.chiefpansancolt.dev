---
title: Alliance tech
nextjs:
  metadata:
    title: whiteout-survival-data - Alliance tech
    description: Query the Alliance Technology tree by category and tier, with cost, time, and bonus of every level.
---

The Alliance Technology tree: 59 nodes across the Growth, Territory, and Battle categories, with the cost, time, prerequisites, and bonus of every level. {% .lead %}

Each category is split into 3 tiers. The nodes have 278 levels in all.

---

## Types

### `AllianceTechNode`

| Field         | Type                   | Description                                                     |
| ------------- | ---------------------- | --------------------------------------------------------------- |
| `id`          | `string`               | Stable identifier                                               |
| `name`        | `string`               | Display name                                                    |
| `img`         | `string`               | Path to the node icon                                           |
| `category`    | `AllianceTechCategory` | `Growth`, `Territory`, or `Battle`                              |
| `tier`        | `number`               | Tier, 1 to 3                                                    |
| `description` | `string`               | The stat the node affects                                       |
| `stat`        | `string?`              | Short name of the stat the node raises, such as `Troops Attack` |
| `statKey`     | `string?`              | Stat name in lowercase kebab case                               |
| `levels`      | `AllianceTechLevel[]`  | Every level of the node                                         |

### `AllianceTechLevel`

| Field           | Type                        | Description                                                     |
| --------------- | --------------------------- | --------------------------------------------------------------- |
| `level`         | `number`                    | Level number                                                    |
| `prerequisites` | `AllianceTechRequirement[]` | `{ id, level }` entries that point to other Alliance Tech nodes |
| `cost`          | `AllianceTechCost[]`        | `{ itemId, amount }` entries. `itemId` is an id from `items()`  |
| `timeSeconds`   | `number`                    | Upgrade time in seconds                                         |
| `bonus`         | `string?`                   | Raw value of the stat at that level, such as `'3%'`             |
| `amount`        | `number?`                   | Parsed value of `bonus`                                         |
| `unit`          | `'percent' \| 'flat'?`      | Unit of `amount`                                                |

---

## Factory

```typescript
import { allianceTech } from 'whiteout-survival-data'

allianceTech() // all 59 nodes
allianceTech(source) // wrap a pre-filtered array
```

---

## Filters

| Method          | Signature                                    | Description                                        |
| --------------- | -------------------------------------------- | -------------------------------------------------- |
| `byCategory(c)` | `byCategory(category: AllianceTechCategory)` | Keeps nodes in `Growth`, `Territory`, or `Battle`. |
| `byTier(n)`     | `byTier(tier: number)`                       | Keeps nodes in tier `n` (1 to 3).                  |

---

## Terminal methods

| Method              | Returns                         | Description                         |
| ------------------- | ------------------------------- | ----------------------------------- |
| `.get()`            | `AllianceTechNode[]`            | All results                         |
| `.first()`          | `AllianceTechNode \| undefined` | First result                        |
| `.find(id)`         | `AllianceTechNode \| undefined` | Find by `id`                        |
| `.findByName(name)` | `AllianceTechNode \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `AllianceTechNode[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                        | Number of results                   |

---

## Examples

```typescript
import { allianceTech } from 'whiteout-survival-data'

// Tier 1 nodes of the Battle category
allianceTech()
  .byCategory('Battle')
  .byTier(1)
  .get()
  .map((n) => n.name)
// ['Infantry Attack I', 'Lancer Attack I', 'Marksman Attack I',
//  'Rally Expansion I', 'Troops Attack I']

// Cost, time, and bonus of the first level of one node
const level = allianceTech().findByName('Infantry Attack I')?.levels[0]
level?.cost // [{ itemId: 'meat', amount: 22800 }, { itemId: 'wood', amount: 22800 }]
level?.timeSeconds // 1800
level?.bonus // '1%'
```

---

## Notes

Unlike [Research](/docs/research), the nodes have no power column. Every prerequisite is another Alliance Tech node. No building gates the tree.

The `bonus` of each level is the bonus at that level, not a step. Upgrade time is stored in seconds.

The `stat` is a short name for what the node raises, written from its `description`. For example `Enhances all Troops' Attack.` gives `Troops Attack`. The `statKey` is the same kebab-case key as in `research()`, so `infantry-attack` means the same stat in both. You can add up bonuses from the two modules.

{% callout type="warning" title="Nodes without a stat or bonus" %}
`bonus` is `undefined` for the two one-off unlock nodes that have no stat effect, Tundra Surveying and Fertile Land Expedition. These two nodes and Long Live Our Alliance have no `stat`, `statKey`, `amount`, or `unit`. The other 56 nodes have a `stat` and a `statKey`.
{% /callout %}

{% callout type="warning" title="Prerequisite gaps" %}
Marksman Attack I has no prerequisite for its Levels 4 and 5. Infantry Attack I and Lancer Attack I also leave their Levels 4 and 5 without a prerequisite. Rally Expansion I has only 3 levels.

The only prerequisite of Tundra Surveying is Alliance Regimentation II at Level 5, the last level of that line, because Tundra Surveying is a one-off unlock gate.
{% /callout %}

The bonuses of Storehouse Expansion II are `50%`, `100%`, `200%`, `300%`, and `400%`, like Storehouse Expansion I.

---

## Next steps

- See [Research](/docs/research) for the player tech tree with the same stat keys
- See [Territory banners](/docs/alliance-banner) for the banner build costs
- Look up resource icons in [Items](/docs/items)
