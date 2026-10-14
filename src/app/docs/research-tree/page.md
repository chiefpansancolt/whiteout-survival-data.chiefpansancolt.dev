---
title: Research tree
nextjs:
  metadata:
    title: whiteout-survival-data - Research tree
    description: Get the layout of the Research tech tree, with its tabs, node positions, and links.
---

The layout of the Research tech tree: the seven tabs, the position of every node, and the links between them. {% .lead %}

Use it to draw the tree without writing a graph layout. The module gives positions and shapes. Your page draws the icons, names, and lines. Each node id points to a node of [Research](/docs/research).

---

## Types

### `ResearchTreeTab`

| Field        | Type                 | Description                                    |
| ------------ | -------------------- | ---------------------------------------------- |
| `id`         | `string`             | Tab id, such as `t12-infantry`                 |
| `name`       | `string`             | Tab name, such as `T12 Infantry`               |
| `categories` | `ResearchCategory[]` | The `research()` categories that the tab shows |
| `width`      | `number`             | Width of the tab in pixels, with the padding   |
| `height`     | `number`             | Height of the tab in pixels, with the padding  |
| `nodes`      | `ResearchTreeNode[]` | Placed nodes                                   |
| `edges`      | `ResearchTreeEdge[]` | Links between nodes                            |

### `ResearchTreeNode`

| Field        | Type                  | Description                                                     |
| ------------ | --------------------- | --------------------------------------------------------------- |
| `id`         | `string`              | A `research()` id, or `fire-crystal-shard` for the hub          |
| `kind`       | `'research' \| 'hub'` | `hub` for the one Fire Crystal Shard node, an item of `items()` |
| `x`          | `number`              | Centre of the node icon                                         |
| `y`          | `number`              | Centre of the node icon                                         |
| `labelAbove` | `boolean`             | `true` when the label sits above the icon and not below it      |

### `ResearchTreeEdge`

| Field           | Type                                 | Description                    |
| --------------- | ------------------------------------ | ------------------------------ |
| `from`          | `string`                             | Node id of the prerequisite    |
| `to`            | `string`                             | Node id that needs it          |
| `shape`         | `'vertical' \| 'horizontal' \| 'up'` | Shape of the line              |
| `splitFraction` | `number?`                            | Where along the line it splits |

---

## Functions

| Function                | Returns             | Description                                                               |
| ----------------------- | ------------------- | ------------------------------------------------------------------------- |
| `researchTree(source?)` | `ResearchTreeTab[]` | The seven tabs. `source` defaults to all nodes from `research()`          |
| `RESEARCH_TREE_LAYOUT`  | object              | The sizes the layout uses, in pixels, so a page can draw at the same size |

`RESEARCH_TREE_LAYOUT` holds `rankGap` 150, `laneGap` 96, `nodeWidth` 76, `nodeHeight` 52, `labelHeight` 42, and `padding` 20.

This module is a function and not a query builder, so it has no filters, sorts, or terminal methods. Use array methods on the result.

---

## Tabs

| Tab                  | `categories`                           | Nodes | Layout                                          |
| -------------------- | -------------------------------------- | ----- | ----------------------------------------------- |
| `battle`             | Battle                                 | 102   | Downward, in ranks                              |
| `growth`             | Growth                                 | 45    | Downward, in ranks                              |
| `economy`            | Economy                                | 44    | Downward, in ranks                              |
| `war-academy-troops` | T11 Infantry, T11 Lancer, T11 Marksman | 31    | Three branches around one hub                   |
| `t12-infantry`       | T12 Infantry                           | 23    | A chain, a capstone, a stack, and a side branch |
| `t12-marksman`       | T12 Marksman                           | 23    | The same as `t12-infantry`                      |
| `t12-lancer`         | T12 Lancer                             | 23    | The same as `t12-infantry`                      |

The 31 nodes of `war-academy-troops` are the 30 T11 nodes and the hub.

---

## Examples

```typescript
import {
  research,
  RESEARCH_TREE_LAYOUT,
  researchTree,
} from 'whiteout-survival-data'

const tabs = researchTree()
tabs.map((tab) => `${tab.name}: ${tab.nodes.length} nodes`)
// ['Battle: 102 nodes', 'Growth: 45 nodes', 'Economy: 44 nodes',
//  'War Academy Troops: 31 nodes', 'T12 Infantry: 23 nodes', ...]

// A node of a tab: its centre, and the node to read from research()
const tab = tabs.find((t) => t.id === 't12-infantry')
const capstone = tab?.nodes.find((n) => n.id === 'exalted-infantry')
capstone?.x // 358
capstone?.y // 196
research().find('exalted-infantry')?.name // 'Exalted Infantry'

// The links of a tab, with the shape of each line
tab?.edges[0] // { from: 'exalted-trek', to: 'exalted-armament', shape: 'horizontal' }

RESEARCH_TREE_LAYOUT.nodeWidth // 76
```

---

## Notes

`x` and `y` are the centre of the node icon. The label sits below the icon, or above it when `labelAbove` is set. The top left of every tab is at the padding, so no node has a negative position.

A link is a prerequisite between two nodes of the same tab: a node needs a level of another node. A link comes from the `research` entries in the `prerequisites` of every level, once for each pair. Building prerequisites give no link. A level that needs the level before it of the same node gives no link.

Battle, Growth, and Economy use a rank layout. A node is one rank below its deepest prerequisite, and the ranks are `rankGap` apart. Inside a rank the nodes are `laneGap` apart and are ordered four times by the average position of their neighbours, to keep the lines short. All links in these tabs use the `vertical` shape.

The War Academy tab puts the Fire Crystal Shard hub at the top left. The T11 Infantry branch runs to the right of the hub, the T11 Lancer branch runs down, and the T11 Marksman branch runs up with its labels above the icons. Each branch starts at its tier 1 node. A link from the hub to that node has the shape of the branch.

The T12 tabs lay out the five tier 1 nodes as a chain, put the Exalted capstone below the chain, and stack tiers 2 to 6 below it, each tier in a row one rank down. Tiers 7 and 8 branch to the right of the tier 3 node. The chain and the branches use the `horizontal` shape, and the stack uses the `vertical` shape. The link from tier 3 to tier 7 has a `splitFraction` of 0.85, so that its line splits late, and the link to tier 8 has 0.5.

---

## Next steps

- Read node costs and bonuses in [Research](/docs/research)
- Plan a path with the [Research calculator](/docs/calculator-research)
- Look up the Fire Crystal Shard hub icon in [Items](/docs/items)
