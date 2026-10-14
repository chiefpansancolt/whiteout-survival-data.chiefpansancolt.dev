---
title: Hero widgets
nextjs:
  metadata:
    title: whiteout-survival-data - Hero widgets
    description: Query the Widgets that each hero exclusive weapon level costs.
---

The Widgets that each level of a hero's exclusive weapon costs. Use it to total the Widgets for a weapon range. The same table applies to every hero that has an exclusive weapon. {% .lead %}

---

## Type

### `HeroWidgetLevel`

| Field     | Type     | Description                                              |
| --------- | -------- | -------------------------------------------------------- |
| `id`      | `string` | Stable identifier, such as `level-1`                     |
| `name`    | `string` | Display name, such as `Level 1`                          |
| `level`   | `number` | Exclusive weapon level from 1 to 10                      |
| `widgets` | `number` | Widgets needed to reach this level from the previous one |

---

## Factory

```typescript
import { heroWidgets } from 'whiteout-survival-data'

heroWidgets() // all 10 levels
heroWidgets(source) // wrap a pre-filtered array
```

---

## Filters

| Method    | Signature                | Description                                |
| --------- | ------------------------ | ------------------------------------------ |
| `byLevel` | `byLevel(level: number)` | The row for exclusive weapon level `level` |

---

## Terminal methods

| Method              | Returns                        | Description                         |
| ------------------- | ------------------------------ | ----------------------------------- |
| `.get()`            | `HeroWidgetLevel[]`            | All results                         |
| `.first()`          | `HeroWidgetLevel \| undefined` | First result                        |
| `.find(id)`         | `HeroWidgetLevel \| undefined` | Find by `id`                        |
| `.findByName(name)` | `HeroWidgetLevel \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `HeroWidgetLevel[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                       | Number of results                   |

---

## Examples

```typescript
import { heroWidgets } from 'whiteout-survival-data'

const levelTen = heroWidgets().byLevel(10).first()
levelTen?.widgets // 50

const totalWidgets = heroWidgets()
  .get()
  .reduce((sum, row) => sum + row.widgets, 0)
totalWidgets // 275
```

---

## Notes

The table has 10 rows, one for each exclusive weapon level from 1 to 10. The cost is 5 Widgets for level 1 and rises by 5 for each level to 50 for level 10, 275 in all.

There is no Widget item in [Items](/docs/items) yet, so `widgets` is a plain number and not an item cost.

Only a hero with an `exclusiveWeapon` has weapon levels, and the weapon skills unlock at the `unlockLevel` values on that weapon. See [Heroes](/docs/heroes).

---

## Next steps

- See [Heroes](/docs/heroes) for the exclusive weapon of each Legendary hero
- Use the [Hero upgrade calculator](/docs/calculator-hero-upgrade) to plan the weapon levels of one hero
- Read the [query builder](/docs/query-builder) guide for more filter patterns
