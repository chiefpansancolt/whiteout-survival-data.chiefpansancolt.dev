---
title: Skins
nextjs:
  metadata:
    title: whiteout-survival-data - Skins
    description: Look up cosmetic skins, their sources, and the stat bonus they grant.
---

Look up the 215 cosmetic skins of the game: avatar frames, nameplates, name cards, and march, city, and teleport skins. Each skin lists its source and the stat bonus it grants. {% .lead %}

Functional items are in [Items](/docs/items).

---

## Type

### `Skin`

| Field         | Type         | Description                                                 |
| ------------- | ------------ | ----------------------------------------------------------- |
| `id`          | `string`     | Unique slug, as in Items. Several names repeat across types |
| `name`        | `string`     | Display name                                                |
| `img`         | `string?`    | Path to the skin icon, relative to `images/`                |
| `skinType`    | `SkinType`   | One of 8 skin types                                         |
| `description` | `string`     | Text of the skin. It ends with the bonus when there is one  |
| `bonus`       | `SkinBonus?` | The stat bonus. Not set when the skin grants none           |
| `sources`     | `string[]`   | Where the skin comes from                                   |

### `SkinBonus`

| Field     | Type                  | Description                                   |
| --------- | --------------------- | --------------------------------------------- |
| `stat`    | `string`              | Stat name, such as `Troops Defense`           |
| `statKey` | `string`              | Stable key, such as `troops-defense`          |
| `value`   | `string`              | Display string, such as `+2%`                 |
| `amount`  | `number`              | Parsed amount, such as `2`                    |
| `unit`    | `'percent' \| 'flat'` | Whether `amount` is a percent or a flat value |

### Skin types

| Skin type     | Skins |
| ------------- | ----- |
| Avatar Frame  | 77    |
| March Skin    | 53    |
| City Skin     | 41    |
| Nameplate     | 20    |
| Name Card     | 12    |
| Teleport Skin | 6     |
| Chat          | 4     |
| Chief Profile | 2     |

---

## Factory

```typescript
import { skins } from 'whiteout-survival-data'

skins() // all 215 skins
skins(source) // wrap a pre-filtered array
```

---

## Filters

| Method       | Signature                        | Description              |
| ------------ | -------------------------------- | ------------------------ |
| `bySkinType` | `bySkinType(skinType: SkinType)` | Filter to one skin type. |

```typescript
import { skins } from 'whiteout-survival-data'

skins().bySkinType('Avatar Frame').count() // 77
```

---

## Terminal methods

| Method              | Returns             | Description                         |
| ------------------- | ------------------- | ----------------------------------- |
| `.get()`            | `Skin[]`            | All results                         |
| `.first()`          | `Skin \| undefined` | First result                        |
| `.find(id)`         | `Skin \| undefined` | Find by `id`                        |
| `.findByName(name)` | `Skin \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `Skin[]`            | Case-insensitive partial name match |
| `.count()`          | `number`            | Number of results                   |

---

## Examples

```typescript
import { skins } from 'whiteout-survival-data'

// A skin with a stat bonus
const frame = skins().find('abundance-scent')
frame?.bonus
// { stat: 'Troops Defense', statKey: 'troops-defense', value: '+2%', amount: 2, unit: 'percent' }
frame?.sources // ['Thanksgiving Event Pack']

// Skins that grant no stat bonus
skins()
  .get()
  .filter((skin) => skin.bonus === undefined).length // 39
```

---

## Notes

`bonus` is set on 176 of the 215 skins. The `value` is a string, so use `amount` and `unit` to add bonuses up.

Every description follows one pattern, `Grants the [X <Skin Type>] (<duration>).` The duration is too inconsistent to model as a field. It can be `Permanent`, `30 day`, or a breakdown by rank such as `Permanent/7 days/3 days` with its own list of conditions. The duration stays in the free-text `description`.

The skins `tundra-adventure` and `wing-of-the-icy-wind` keep their ids and icons. Their names are `Tundra Adventurer` and `Wings of the Icy Wind`.

---

## Known gaps

{% callout type="warning" title="Skins without icons or bonuses" %}
The 24 skins added most recently have no `img`, because no icon exists for them yet.

A few City Skins, such as Frost Sphere VI, have a long domain bonus text for an area effect on nearby allies. That text does not reduce to one stat and value, so it stays in `description` only and the skin has no `bonus`.
{% /callout %}

---

## Next steps

- See [Items](/docs/items) for functional items such as resources, chests, and speedups
- Browse [Events](/docs/events) for events that give skins as rewards
- Try the [Buffs calculator](/docs/calculator-buffs) to add skin bonuses to your totals
