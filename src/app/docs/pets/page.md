---
title: Pets
nextjs:
  metadata:
    title: whiteout-survival-data - Pets
    description: Query the 14 pets tamed at the Beast Cage with unlock rules, skill values, and level tables.
---

The 14 pets tamed at the Beast Cage, each with one troop bonus skill and a level table. Read pet unlock rules, skill values, and the cost and bonus of each pet level. {% .lead %}

---

## Types

### `Pet`

| Field                  | Type                   | Description                                                    |
| ---------------------- | ---------------------- | -------------------------------------------------------------- |
| `id`                   | `string`               | Stable identifier                                              |
| `name`                 | `string`               | Display name                                                   |
| `img`                  | `string`               | Path to the profile portrait                                   |
| `rarity`               | `PetRarity`            | `'Common'`, `'Uncommon'`, `'Rare'`, `'Epic'`, or `'Legendary'` |
| `maxLevel`             | `number`               | 50, 60, 70, 80, or 100, by rarity                              |
| `maxRefinementPercent` | `number`               | Maximum refinement, such as `6.7` for Cave Hyena               |
| `unlockRequirement`    | `PetUnlockRequirement` | Days, and a Furnace level or a prerequisite pet                |
| `skill`                | `PetSkill`             | The single troop bonus skill                                   |
| `levels`               | `PetLevel[]`           | One row for each level                                         |

### `PetUnlockRequirement`

| Field             | Type                  | Description                                          |
| ----------------- | --------------------- | ---------------------------------------------------- |
| `daysRequired`    | `number`              | Days since server start                              |
| `furnaceLevel`    | `number?`             | Furnace level needed. Set on the three earliest pets |
| `prerequisitePet` | `PetPrerequisitePet?` | Set on every later pet                               |

`PetPrerequisitePet` has `petId`, `name`, and the `level` needed on that pet.

### `PetSkill`

| Field                   | Type        | Description                                                        |
| ----------------------- | ----------- | ------------------------------------------------------------------ |
| `name`                  | `string`    | Skill name                                                         |
| `img`                   | `string`    | Path to the skill icon                                             |
| `description`           | `string`    | Description text                                                   |
| `values`                | `number[]`  | One value for each tier. Tiers are `maxLevel / 10`                 |
| `durationSeconds`       | `number?`   | Effect duration                                                    |
| `cooldownSeconds`       | `number?`   | Flat cooldown                                                      |
| `cooldownSecondsByTier` | `number[]?` | Cooldown for each tier, for skills whose cooldown shortens by tier |

### `PetLevel`

| Field                  | Type                        | Description                                                                      |
| ---------------------- | --------------------------- | -------------------------------------------------------------------------------- |
| `level`                | `number`                    | Pet level                                                                        |
| `petFoodCost`          | `number`                    | Pet Food needed                                                                  |
| `troopAttack`          | `PetStatValue`              | Troop Attack bonus                                                               |
| `troopDefense`         | `PetStatValue`              | Troop Defense bonus                                                              |
| `troopsPower`          | `PetStatValue`              | Troops Power bonus                                                               |
| `advancementMaterials` | `PetAdvancementMaterial[]?` | Items spent for the advancement, as `{ itemId, amount }`                         |
| `advancementScore`     | `number?`                   | Pet advancement score the advancement adds. Set only with `advancementMaterials` |

`PetStatValue` is `{ value, refinedValue? }`. `refinedValue` appears only at levels divisible by 10, the rows that also carry `advancementMaterials`.

---

## Factory

```typescript
import { pets } from 'whiteout-survival-data'

pets() // all 14 pets
pets(source) // wrap a pre-filtered array
```

---

## Filters

| Method     | Signature                     | Description                                                     |
| ---------- | ----------------------------- | --------------------------------------------------------------- |
| `byRarity` | `byRarity(rarity: PetRarity)` | Pets of one rarity: Common, Uncommon, Rare, Epic, or Legendary. |

---

## Terminal methods

| Method              | Returns            | Description                         |
| ------------------- | ------------------ | ----------------------------------- |
| `.get()`            | `Pet[]`            | All results                         |
| `.first()`          | `Pet \| undefined` | First result                        |
| `.find(id)`         | `Pet \| undefined` | Find by `id`                        |
| `.findByName(name)` | `Pet \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `Pet[]`            | Case-insensitive partial name match |
| `.count()`          | `number`           | Number of results                   |

---

## Constants

`PET_REFINEMENT_STATS` lists the six stats that pet refinement rolls, with the `statKey` that `research()` and the other modules use for the same stat.

| `stat`             | `statKey`            |
| ------------------ | -------------------- |
| Infantry Lethality | `infantry-lethality` |
| Infantry Health    | `infantry-health`    |
| Lancer Lethality   | `lancer-lethality`   |
| Lancer Health      | `lancer-health`      |
| Marksman Lethality | `marksman-lethality` |
| Marksman Health    | `marksman-health`    |

---

## Examples

```typescript
import { PET_REFINEMENT_STATS, pets } from 'whiteout-survival-data'

// The Legendary pets
pets().byRarity('Legendary').get() // 7 pets

// The six stats that pet refinement rolls
PET_REFINEMENT_STATS.map((s) => s.stat)
// ['Infantry Lethality', 'Infantry Health', 'Lancer Lethality', 'Lancer Health', 'Marksman Lethality', 'Marksman Health']

// What the first pets need to unlock
const hyena = pets().find('cave-hyena')
hyena?.unlockRequirement // { daysRequired: 54, furnaceLevel: 18 }

// The advancement score of the level 10 advancement
hyena?.levels[9].advancementScore // 500
```

---

## Notes

### Roster

There are 14 pets across 5 rarities: Common (1), Uncommon (2), Rare (2), Epic (2), and Legendary (7). Each pet's single `skill` scales in tiers of `maxLevel / 10`. These are the same every-10-levels milestones as the Advancement rows of the level table.

### Unlock rules

`unlockRequirement` always has `daysRequired`, the days since server start. It also has either `furnaceLevel` or `prerequisitePet`. The three earliest pets need Furnace Lv.18. Every later pet needs a set level on the pet before it in one linear chain, not a chain split by rarity.

`daysRequired` follows the [server timeline](/docs/server-timeline): day 54 for the first five pets, then 90, 140, 200, 280, and 370 for the later ones.

### Levels

Each `levels` entry has `troopAttack`, `troopDefense`, and `troopsPower` as `{ value, refinedValue? }` pairs. Troop Attack and Troop Defense are separate fields, but they are equal at every level of every pet in the roster.

A row with `advancementMaterials` also has `advancementScore`, the pet advancement score the advancement adds. SvS, Alliance Showdown, and King of Icefield count it. It depends only on the level, so it is the same for every pet.

| Level | 10  | 20    | 30    | 40    | 50    | 60    | 70     | 80     | 90     | 100    |
| ----- | --- | ----- | ----- | ----- | ----- | ----- | ------ | ------ | ------ | ------ |
| Score | 500 | 1,000 | 2,000 | 3,000 | 4,500 | 6,750 | 10,000 | 12,000 | 14,500 | 17,500 |

### Skills

Most skills have a `values` array that scales with the effect's own percentage or flat number, such as the Construction Speed bonus of Cave Hyena, and a flat `cooldownSeconds`. Musk Ox and Giant Elk have a skill with no numeric effect to scale. Their cooldown shortens by tier instead. It is stored in `cooldownSecondsByTier` and copied into `values`, so the tier count matches every other pet.

### Refinement

`maxRefinementPercent` is stored for each pet (Cave Hyena: 6.70). It is about 4/3 of the largest refined value in that pet's level table. The value is stored as given and not derived.

Refinement rolls bonus stats on a pet. A refinement rolls a new result that can be better or worse, refinement is irreversible, and a refinement after a quality increase does not drop the quality.

{% callout title="Known gaps" type="warning" %}
The package stores the maximum refinement of each pet. The percent range of each quality (None, Green, Blue, Purple, and Gold), the size of a step, and the Wild Mark cost of a roll are not stored.
{% /callout %}

---

## Next steps

- Use the [Pets calculator](/docs/calculator-pets) to plan pet upgrades
- See [Facilities](/docs/facilities) for the Beast Cage
- Check unlock days on the [server timeline](/docs/server-timeline)
- Read the [query builder](/docs/query-builder) guide for more filter patterns
