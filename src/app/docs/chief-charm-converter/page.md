---
title: Chief Charm converter
nextjs:
  metadata:
    title: whiteout-survival-data - Chief Charm converter
    description: Query the exchange rates of the Chief Charm material converter.
---

The exchange rates of the Chief Charm material converter, for turning one charm material into another. {% .lead %}

For example, you can turn Charm Guides into Charm Secrets. The module holds 4 conversions. The materials are the same ones that [Chief Charm](/docs/chief-charm) upgrades use.

---

## Type

### `ItemConversion`

| Field          | Type     | Description                                               |
| -------------- | -------- | --------------------------------------------------------- |
| `id`           | `string` | Stable identifier, such as `charm-guide-to-charm-secrets` |
| `name`         | `string` | Display name                                              |
| `fromItemId`   | `string` | Id from `items()` of the material spent                   |
| `fromQuantity` | `number` | Amount of the material spent                              |
| `toItemId`     | `string` | Id from `items()` of the material received                |
| `toQuantity`   | `number` | Amount of the material received                           |

The shared type also has an optional `weeklyLimit`. These conversions never set it.

---

## Factory

```typescript
import { chiefCharmConverter } from 'whiteout-survival-data'

chiefCharmConverter() // all 4 conversions
chiefCharmConverter(source) // wrap a pre-filtered array
```

---

## Filters

| Method               | Signature                    | Description                       |
| -------------------- | ---------------------------- | --------------------------------- |
| `byFromItem(itemId)` | `byFromItem(itemId: string)` | Conversions that consume the item |
| `byToItem(itemId)`   | `byToItem(itemId: string)`   | Conversions that produce the item |

---

## Terminal methods

| Method              | Returns                       | Description                         |
| ------------------- | ----------------------------- | ----------------------------------- |
| `.get()`            | `ItemConversion[]`            | All results                         |
| `.first()`          | `ItemConversion \| undefined` | First result                        |
| `.find(id)`         | `ItemConversion \| undefined` | Find by `id`                        |
| `.findByName(name)` | `ItemConversion \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `ItemConversion[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                      | Number of results                   |

---

## Examples

```typescript
import { chiefCharmConverter } from 'whiteout-survival-data'

// Every way to spend Charm Guides
chiefCharmConverter().byFromItem('charm-guide').count() // 2

// Every way to get Charm Secrets
chiefCharmConverter().byToItem('charm-secrets').count() // 2

// One rate: 40 Charm Guides give 1 Charm Secrets
const rate = chiefCharmConverter().find('charm-guide-to-charm-secrets')
rate?.fromQuantity // 40
rate?.toQuantity // 1
```

---

## Notes

These conversions have no `weeklyLimit`. The [Chief Gear converter](/docs/chief-gear-converter) does have one.

---

## Next steps

- See [Chief Charm](/docs/chief-charm) for the upgrade steps that use these materials
- Look up the material icons in [Items](/docs/items)
