---
title: Territory banners
nextjs:
  metadata:
    title: whiteout-survival-data - Territory banners
    description: Query the Alliance Territory banner build cost by level range.
---

The build-cost table for the Alliance Territory banner, by level range. Use it to find what a banner level costs in resources. {% .lead %}

The module has 37 entries, one per level range. The first range, Level 0-10, has an empty `cost`.

---

## Type

### `AllianceBannerLevel`

| Field      | Type                   | Description                                         |
| ---------- | ---------------------- | --------------------------------------------------- |
| `id`       | `string`               | Stable identifier, such as `level-11-15`            |
| `name`     | `string`               | Display name, such as `Level 11-15`                 |
| `minLevel` | `number`               | First banner level in the range                     |
| `maxLevel` | `number`               | Last banner level in the range                      |
| `cost`     | `AllianceBannerCost[]` | Resources to build a banner at a level in the range |

### `AllianceBannerCost`

| Field    | Type     | Description          |
| -------- | -------- | -------------------- |
| `itemId` | `string` | An id from `items()` |
| `amount` | `number` | Amount needed        |

---

## Factory

```typescript
import { allianceBanner } from 'whiteout-survival-data'

allianceBanner() // all 37 level ranges
allianceBanner(source) // wrap a pre-filtered array
```

---

## Filters

| Method       | Signature                | Description                                        |
| ------------ | ------------------------ | -------------------------------------------------- |
| `atLevel(n)` | `atLevel(level: number)` | Keeps the range where `minLevel <= n <= maxLevel`. |

---

## Terminal methods

| Method              | Returns                            | Description                         |
| ------------------- | ---------------------------------- | ----------------------------------- |
| `.get()`            | `AllianceBannerLevel[]`            | All results                         |
| `.first()`          | `AllianceBannerLevel \| undefined` | First result                        |
| `.find(id)`         | `AllianceBannerLevel \| undefined` | Find by `id`                        |
| `.findByName(name)` | `AllianceBannerLevel \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `AllianceBannerLevel[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                           | Number of results                   |

---

## Examples

```typescript
import { allianceBanner } from 'whiteout-survival-data'

// The range that contains banner level 14
allianceBanner().atLevel(14).first()?.name // 'Level 11-15'

// Cost to build a banner at level 125
allianceBanner().atLevel(125).first()?.cost
// [
//   { itemId: 'meat', amount: 49500 },
//   { itemId: 'wood', amount: 49500 },
//   { itemId: 'coal', amount: 10000 },
// ]

// All ranges
allianceBanner().count() // 37
```

---

## Notes

Banners are built and leveled within level ranges, and every level in a range costs the same. For this reason the type stores `minLevel` and `maxLevel` and not a single `level`.

Meat and Wood are always required in equal amounts. Coal is added from Level 121-130, and Iron from Level 146-150. The last range is Level 276-285.

---

## Next steps

- See [Alliance tech](/docs/alliance-tech) for the alliance technology tree
- See [Fortresses](/docs/alliance-fortress) for the strongholds and fortresses on the alliance map
- Look up resource icons in [Items](/docs/items)
