---
title: Chief Gear converter
nextjs:
  metadata:
    title: whiteout-survival-data - Chief Gear converter
    description: Query the exchange rates of the Chief Gear material converter.
---

The exchange rates of the Chief Gear material converter, for turning one gear material into another. {% .lead %}

For example, you can turn Design Plans into Hardened Alloy. The module holds 7 conversions. The materials are the same ones that [Chief Gear](/docs/chief-gear) upgrades use.

---

## Type

### `ItemConversion`

| Field          | Type      | Description                                              |
| -------------- | --------- | -------------------------------------------------------- |
| `id`           | `string`  | Stable identifier, such as `design-plans-to-lunar-amber` |
| `name`         | `string`  | Display name                                             |
| `fromItemId`   | `string`  | Id from `items()` of the material spent                  |
| `fromQuantity` | `number`  | Amount of the material spent                             |
| `toItemId`     | `string`  | Id from `items()` of the material received               |
| `toQuantity`   | `number`  | Amount of the material received                          |
| `weeklyLimit`  | `number?` | Maximum uses of the conversion in one week               |

---

## Factory

```typescript
import { chiefGearConverter } from 'whiteout-survival-data'

chiefGearConverter() // all 7 conversions
chiefGearConverter(source) // wrap a pre-filtered array
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
import { chiefGearConverter } from 'whiteout-survival-data'

// Every way to spend Design Plans
chiefGearConverter().byFromItem('design-plans').count() // 3

// Every way to get Hardened Alloy
chiefGearConverter().byToItem('hardened-alloy').count() // 2

// One rate: 10 Design Plans give 1 Lunar Amber, up to 500 times per week
const rate = chiefGearConverter().find('design-plans-to-lunar-amber')
rate?.fromQuantity // 10
rate?.toQuantity // 1
rate?.weeklyLimit // 500
```

---

## Notes

`weeklyLimit` is the maximum number of times that an exchange can be used in one week. The [Chief Charm converter](/docs/chief-charm-converter) does not have this field.

---

## Next steps

- See [Chief Gear](/docs/chief-gear) for the upgrade steps that use these materials
- Look up the material icons in [Items](/docs/items)
