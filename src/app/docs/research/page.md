---
title: Research
nextjs:
  metadata:
    title: whiteout-survival-data - Research
    description: Query the Research Center tech tree by category and tier, with cost, time, and bonus of every level.
---

The Research Center tech tree: 290 nodes, one per research line, each with its per-level cost, time, and bonus. {% .lead %}

Use it to look up what a research costs, what it requires, and what it gives. To draw the tree, see [Research tree](/docs/research-tree). To plan a full research path, see the [Research calculator](/docs/calculator-research).

---

## Types

### `ResearchNode`

| Field      | Type               | Description                                                    |
| ---------- | ------------------ | -------------------------------------------------------------- |
| `id`       | `string`           | Stable identifier, such as `molten-blades-ii`                  |
| `name`     | `string`           | Display name                                                   |
| `img`      | `string`           | Path to the node icon. Empty for nodes that have no icon       |
| `category` | `ResearchCategory` | One of the 9 categories                                        |
| `queue`    | `ResearchQueue`    | `main` or `warAcademy`                                         |
| `tier`     | `number`           | Position of the node inside the tier count of its own category |
| `levels`   | `ResearchLevel[]`  | Every level of the node                                        |

`queue` is `main` for Growth, Economy, and Battle, and `warAcademy` for the six T11 and T12 categories, because the game researches the two groups in separate queues.

### `ResearchLevel`

| Field                 | Type                    | Description                                                    |
| --------------------- | ----------------------- | -------------------------------------------------------------- |
| `level`               | `number`                | Level number                                                   |
| `prerequisites`       | `ResearchRequirement[]` | Flat list of requirements                                      |
| `cost`                | `ResearchCost[]`        | `{ itemId, amount }` entries. `itemId` is an id from `items()` |
| `researchTimeSeconds` | `number?`               | Seconds to research the level                                  |
| `bonus`               | `ResearchBonus[]`       | Stats the level grants                                         |
| `power`               | `number`                | Power the level adds                                           |

### `ResearchRequirement`

| Field   | Type                                       | Description                                                                   |
| ------- | ------------------------------------------ | ----------------------------------------------------------------------------- |
| `type`  | `'building' \| 'research' \| 'unreleased'` | Where the requirement resolves                                                |
| `id`    | `string`                                   | A `buildings()` id, a `research()` id, or a best-effort slug                  |
| `level` | `number \| string`                         | A level of the target. For a building, the same text as `BuildingLevel.label` |

A `building` entry such as `Research Center 7` or `War Academy FC 10` round-trips into `buildings().find(id)!.levels`. An `unreleased` entry does not resolve against `research()` by design, so the gap stays visible. No node uses it now.

### `ResearchBonus`

| Field         | Type                   | Description                                                                   |
| ------------- | ---------------------- | ----------------------------------------------------------------------------- |
| `stat`        | `string`               | Stat name                                                                     |
| `statKey`     | `string?`              | Stat name in lowercase kebab case. Not set for the `Other` stat               |
| `value`       | `string`               | Text of the bonus, such as `"1.25%"`, `"600"`, or `"1,000"`                   |
| `amount`      | `number?`              | Parsed value, with the commas removed. Not set for unlock text                |
| `unit`        | `'percent' \| 'flat'?` | `percent` for a `%` value, `flat` for a plain number                          |
| `totalAmount` | `number?`              | Sum of `amount` of the same stat over the levels of the node up to this level |

### Categories

| Category                               | Nodes   | Tiers |
| -------------------------------------- | ------- | ----- |
| Battle                                 | 102     | 6     |
| Growth                                 | 45      | 7     |
| Economy                                | 44      | 6     |
| T11 Infantry, T11 Marksman, T11 Lancer | 10 each | 7     |
| T12 Infantry, T12 Marksman, T12 Lancer | 23 each | 8     |

---

## Factory

```typescript
import { research } from 'whiteout-survival-data'

research() // all 290 nodes
research(source) // wrap a pre-filtered array
```

---

## Filters

| Method          | Signature                                | Description                                        |
| --------------- | ---------------------------------------- | -------------------------------------------------- |
| `byCategory(c)` | `byCategory(category: ResearchCategory)` | Nodes in one of the 9 categories                   |
| `byTier(tier)`  | `byTier(tier: number)`                   | Nodes at the given tier position in their category |

---

## Terminal methods

| Method              | Returns                     | Description                         |
| ------------------- | --------------------------- | ----------------------------------- |
| `.get()`            | `ResearchNode[]`            | All results                         |
| `.first()`          | `ResearchNode \| undefined` | First result                        |
| `.find(id)`         | `ResearchNode \| undefined` | Find by `id`                        |
| `.findByName(name)` | `ResearchNode \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `ResearchNode[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                    | Number of results                   |

---

## Examples

```typescript
import { research } from 'whiteout-survival-data'

// Tier 1 nodes of the Battle category
research().byCategory('Battle').byTier(1).count() // 17

// Cost and bonus of the first level of one node
const node = research().findByName('Assaut Techniques I')
node?.levels[0].cost // meat, wood, coal, iron, steel
node?.levels[0].bonus
// [{ stat: 'Troops Lethality', statKey: 'troops-lethality', value: '0.50%', amount: 0.5, unit: 'percent', totalAmount: 0.5 }]

// What a research needs
research().find('molten-blades-ii')?.levels[0].prerequisites
// [
//   { type: 'building', id: 'war-academy', level: 'FC 10' },
//   { type: 'research', id: 'indomitable-wall', level: 1 },
// ]
```

---

## Notes

Research costs use the same resources as building costs: Meat, Wood, Coal, Iron, and Steel. The latest T11 and T12 tiers also use Fire Crystal Shard and Refined Fire Crystal.

### Bonus values

`bonus` is an array because a level can grant more than one stat. Most levels grant one stat. 9 nodes have levels with two stats, for example `helios-infantry-training`.

`amount` is the bonus that the level adds, not the bonus so far. `totalAmount` is the bonus up to this level. The amounts `1.25`, `1.25`, and `1.5` have the totals `1.25`, `2.5`, and `4`.

For T12 nodes, `value` is the bonus up to the level, not the bonus of the level. `exalted-shoulderguard` has `3.00%`, `6.00%`, `9.00%`, `12.00%`, and `15.00%`, so its `amount` is 3 on every level and its `totalAmount` is 3, 6, 9, 12, and 15. A Molten II line has 50 levels of 1, and a total of 50 at level 50. The rule for `amount` and `totalAmount` is the same for every node, so you can add up `amount` for any node.

Three bonuses of the `Other` stat hold unlock text such as `Unlock XI Helios Infantry`. They have no `statKey`, `amount`, `unit`, or `totalAmount`.

### Stat keys

`statKey` is the stat name in lowercase kebab case, for example `"Infantry Attack"` gives `infantry-attack`. It is the same key in `research()`, `skins()`, `experts()`, `vip()`, and `allianceTech()`, so you can add up bonuses from different modules. Two names are written in the singular, so they map to the plural key.

| Stat name       | `statKey`          |
| --------------- | ------------------ |
| `Troop Attack`  | `troops-attack`    |
| `Troop Defense` | `troops-defense`   |
| `Other`         | none (unlock text) |

### Research time

Every level has `researchTimeSeconds`. The 15 lines with five levels, for example `exalted-blunderbuss`, upgrade instantly, so all 75 of their levels have `researchTimeSeconds` 0. The three Exalted capstones, `exalted-infantry`, `exalted-lancer`, and `exalted-marksman`, are placeholders that unlock once the five lines of the troop type are complete. They take no time.

### Corrected spellings

Several prerequisite names resolve only after fixing spelling errors. The package corrects them with an explicit alias list. It does not use fuzzy matching. The node names keep the spelling shown here.

| Misspelled name             | Node name             |
| --------------------------- | --------------------- |
| `Assault Techniques`        | `Assaut Techniques`   |
| `Bulwark Formation`         | `Bulwark Formations`  |
| `Coal Minning`              | `Coal Mining`         |
| `Ion Mining`, `Iorn Mining` | `Iron Mining`         |
| `Marskman Armor`            | `Marksman Armor`      |
| `Helios Marksmen`           | `Helios Marksman`     |
| `Survival Expansion`        | `Survival Techniques` |

All 50 levels of `molten-plating-ii` use `Infantry Health`, as the rest of the Infantry Molten II lines do for their own troop type. The package gives Infirmary Capacity at all three levels of Ward Expansion III, as level 1 does.

### Added prerequisites

- Each troop type's 4 tier 2 Molten X I items also require that troop type's Exalted capstone at level 1, next to their War Academy building gate.
- Tool Enhancement I also requires Tooling Up I at level 1, next to Ward Expansion I and Camp Expansion I.
- Each troop type's 4 tier 4 Molten X II items (`Molten Blades II` and so on) require that troop type's tier 3 node (`indomitable-wall`, `starfire`, or `meridian-phalanx`) at level 1.
- Each troop type's 4 tier 6 Molten X III items require that troop type's Solar Supremacy node at level 15.

{% callout type="warning" title="Exalted capstones have no cost or bonus" %}
`exalted-infantry`, `exalted-marksman`, and `exalted-lancer` are capstones that unlock once all 5 of the tier 1 Exalted items of their T12 troop type reach level 5. Each has one level and 8,000,000 power. The `cost` and `bonus` arrays are empty because no data is known, and `img` is an empty string because no icon exists.
{% /callout %}

---

## Next steps

- Draw the tree with [Research tree](/docs/research-tree)
- Plan a research path with the [Research calculator](/docs/calculator-research)
- See [Troops](/docs/troops) for the tiers that Helios and Exalted research unlock
- See [Buildings](/docs/buildings) for the levels that building requirements point to
- Look up cost icons in [Items](/docs/items)
