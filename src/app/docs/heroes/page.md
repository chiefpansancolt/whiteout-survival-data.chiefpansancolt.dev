---
title: Heroes
nextjs:
  metadata:
    title: whiteout-survival-data - Heroes
    description: Query all 65 heroes with stats, skills, shard costs, level power, and a star stat estimate.
---

All 65 heroes released so far, with stats, skills, shard costs, and level power. Look up a hero, list heroes by rarity or class, or estimate a hero's stats at a lower star. {% .lead %}

---

## Types

### `Hero`

| Field             | Type               | Description                                                                |
| ----------------- | ------------------ | -------------------------------------------------------------------------- |
| `id`              | `string`           | Stable identifier                                                          |
| `name`            | `string`           | Display name                                                               |
| `img`             | `string`           | Path to the hero's portrait                                                |
| `shardImg`        | `string?`          | Path to the shard icon. Set for 13 heroes                                  |
| `powerAtStarZero` | `number?`          | Hero Power at star 0. Set only for heroes where it was read in the game    |
| `rarity`          | `HeroRarity`       | `'Rare'`, `'Epic'`, or `'Legendary'`                                       |
| `class`           | `HeroClass`        | `'Infantry'`, `'Lancer'`, or `'Marksman'`                                  |
| `subClass`        | `HeroSubClass`     | `'Growth'` or `'Combat'`                                                   |
| `generation`      | `number`           | 0 for the pre-Legendary heroes, 1 to 17 for Legendary heroes               |
| `stats`           | `object`           | Level 80, 5-star stats: `exploration` and `expedition`                     |
| `skills`          | `HeroSkills`       | `exploration[]`, `expedition[]`, and an optional `talent`                  |
| `exclusiveWeapon` | `ExclusiveWeapon?` | Legendary heroes only                                                      |
| `shardCosts`      | `HeroShardTier[]`  | 5 stars of 6 tier costs, with `total` and cumulative `power`               |
| `shardSources`    | `string[]`         | Where the shards come from                                                 |
| `levels`          | `HeroLevel[]`      | 80 entries of `furnaceLevelRequired`, `xpRequired`, and cumulative `power` |

`stats.exploration` is a `HeroStats` with flat `attack`, `defense`, and `health`. `stats.expedition` is a `HeroExpeditionStats` with `attack` and `defense` as percents.

### `HeroSkill`

| Field         | Type               | Description                                        |
| ------------- | ------------------ | -------------------------------------------------- |
| `name`        | `string`           | Skill name                                         |
| `img`         | `string`           | Path to the skill icon                             |
| `description` | `string`           | Description text with 5 slash-separated values     |
| `levels`      | `HeroSkillLevel[]` | 5 levels, matching the 5 values in the description |

### `HeroSkillLevel`

| Field             | Type                | Description                                                  |
| ----------------- | ------------------- | ------------------------------------------------------------ |
| `level`           | `number`            | Skill level from 1 to 5                                      |
| `manualsRequired` | `number`            | Manuals needed. A Talent skill needs none, so it is `0`      |
| `powerGain`       | `number`            | Power the level adds. `0` for a Talent skill                 |
| `starRequired`    | `number`            | Hero star needed to unlock the level. `0` for a Talent skill |
| `effects`         | `HeroSkillEffect[]` | The numbers of the description for this level, in text order |

### `HeroSkillEffect`

| Field    | Type                  | Description                                                  |
| -------- | --------------------- | ------------------------------------------------------------ |
| `name`   | `string`              | What the number sets, such as `Stamina Cost Reduction`       |
| `amount` | `number`              | The number of the skill text at this level                   |
| `unit`   | `HeroSkillEffectUnit` | `'percent'`, `'percentOfAttack'`, `'seconds'`, or `'number'` |

### `ExclusiveWeapon`

| Field    | Type                     | Description                                                          |
| -------- | ------------------------ | -------------------------------------------------------------------- |
| `name`   | `string`                 | Weapon name                                                          |
| `img`    | `string`                 | Path to the weapon icon                                              |
| `power`  | `number`                 | Power rating                                                         |
| `stats`  | `ExclusiveWeaponStats`   | `exploration` stats, plus `expedition` with `lethality` and `health` |
| `skills` | `ExclusiveWeaponSkill[]` | Two skills of `{ name, img, description, unlockLevel? }`             |

### `HeroShardTier`

| Field       | Type        | Description                                                             |
| ----------- | ----------- | ----------------------------------------------------------------------- |
| `star`      | `number`    | Star from 1 to 5                                                        |
| `tierCosts` | `number[]`  | Shards for each of the 6 tiers                                          |
| `total`     | `number`    | Sum of the tier costs                                                   |
| `power`     | `number`    | Total Power once this star is reached, not the gain of this star        |
| `tierPower` | `number[]?` | Hero Power read in the game at each of the 6 tiers. Set only where read |

### `HeroLevel`

| Field                  | Type     | Description                                            |
| ---------------------- | -------- | ------------------------------------------------------ |
| `level`                | `number` | Hero level from 1 to 80                                |
| `furnaceLevelRequired` | `number` | Furnace level needed to reach the level                |
| `xpRequired`           | `number` | Hero XP needed from the previous level. `0` at level 1 |
| `power`                | `number` | Total Power once the level is reached                  |

### `HeroStatEstimate`

| Field         | Type                  | Description                                                  |
| ------------- | --------------------- | ------------------------------------------------------------ |
| `level`       | `number`              | Always `80`                                                  |
| `star`        | `number`              | The star asked for                                           |
| `tier`        | `number`              | The tier asked for                                           |
| `estimated`   | `boolean`             | `false` only at 5 stars, where the stats are the stored ones |
| `exploration` | `HeroStats`           | Whole-number `attack`, `defense`, and `health`               |
| `expedition`  | `HeroExpeditionStats` | `attack` and `defense` percents with 2 decimals              |

---

## Factory

```typescript
import { heroes } from 'whiteout-survival-data'

heroes() // all 65 heroes
heroes(source) // wrap a pre-filtered array
```

---

## Filters

| Method     | Signature                       | Description                                        |
| ---------- | ------------------------------- | -------------------------------------------------- |
| `byRarity` | `byRarity(rarity: HeroRarity)`  | Heroes of one rarity: Rare, Epic, or Legendary     |
| `byClass`  | `byClass(heroClass: HeroClass)` | Heroes of one class: Infantry, Lancer, or Marksman |

```typescript
import { heroes } from 'whiteout-survival-data'

heroes().byRarity('Legendary').byClass('Infantry').get() // 18 heroes
```

---

## Terminal methods

| Method              | Returns             | Description                         |
| ------------------- | ------------------- | ----------------------------------- |
| `.get()`            | `Hero[]`            | All results                         |
| `.first()`          | `Hero \| undefined` | First result                        |
| `.find(id)`         | `Hero \| undefined` | Find by `id`                        |
| `.findByName(name)` | `Hero \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `Hero[]`            | Case-insensitive partial name match |
| `.count()`          | `number`            | Number of results                   |

---

## Stat estimate

`estimateHeroStats(hero, star, tier)` estimates the stats of a hero at level 80 for a lower star. `star` is 0 to 5 and `tier` is 0 to 5 inside the star, as the in-game label `star.tier` (3.2 is star 3, tier 2). `tier` defaults to `0`.

It returns `level`, `star`, `tier`, `exploration`, `expedition`, and `estimated`. Exploration stats are whole numbers. Expedition stats are percents with 2 decimals. At 5 stars `estimated` is `false` and the result is the stored stats. The tier must be 0 at 5 stars. A star or tier that is not a whole number in range throws a `RangeError`.

`HERO_STAT_ESTIMATE` exports the accepted ranges: `{ level: 80, maxStar: 5, maxTier: 5 }`.

```typescript
import {
  estimateHeroStats,
  HERO_STAT_ESTIMATE,
  heroes,
} from 'whiteout-survival-data'

const hector = heroes().findByName('Hector')!
hector.stats.exploration // { attack: 3780, defense: 4928, health: 73926 }

const threeStars = estimateHeroStats(hector, 3, 0)
threeStars.estimated // true
threeStars.exploration // { attack: 2125, defense: 2771, health: 41565 }

HERO_STAT_ESTIMATE // { level: 80, maxStar: 5, maxTier: 5 }
```

The formula scales the stats of a hero by the ratio of its own 5-star stats to a reference hero, grows the stat by a step for each star, and adds 14.7% of the star's step for each tier. The Exploration star growth is 1.376. The value is fitted to Hector at level 80, whose in-game stats at 3.0 are 2,130 attack, 2,765 defense, and 41,569 health. The estimate is within 0.3% of them.

{% callout title="Estimate only" type="warning" %}
The estimate has been checked only against Hector at 3.0 to 3.3. The 3.2 step is about 10% larger in the game than the formula gives. There is no data for other hero levels, so it covers level 80 only.
{% /callout %}

---

## Examples

```typescript
import { heroes } from 'whiteout-survival-data'

// Legendary Infantry heroes
heroes().byRarity('Legendary').byClass('Infantry').get()

// Look up by name
const hector = heroes().findByName('Hector')!
hector.stats.exploration // { attack: 3780, defense: 4928, health: 73926 }

// Read the numbers of one skill level without parsing text
const gina = heroes().find('gina')!
const skill = gina.skills.expedition.find(
  (s) => s.name === 'Endurance Training',
)!
skill.levels[1].effects // [{ name: 'Stamina Cost Reduction', amount: 12, unit: 'percent' }]
```

---

## Notes

### Roster

The data holds 65 heroes. Generation 0 has 13 pre-Legendary heroes (4 Rare, 9 Epic). Legendary Generations 1 to 17 have 52 heroes. Generation 1 has 4, because Jeronimo and Natalia are both Infantry. Every later generation has 1 Infantry, 1 Lancer, and 1 Marksman hero. New generations are added as they are released.

`subClass` is stored for each hero and not derived, because it does not follow a rule from rarity or class. Gina and Jasser are both Epic Marksman. Gina is `Combat` and Jasser is `Growth`.

### Skills

Skills are grouped like the in-game skill tabs. Legendary heroes have 3 Exploration and 3 Expedition skills. Rare heroes have 2 and 2. Epic heroes have 3 Exploration and 2 Expedition skills. The Talent tab is empty for every Legendary hero except Jeronimo and Natalia, the Generation 1 Infantry heroes. `skills.talent` is `undefined` for every other hero.

Each skill has 5 `levels`. `effects` holds the numbers of the description for that level. It has one entry for each set of 5 numbers in the description, in the order of the text.

| `unit`            | Meaning                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `percent`         | A percent, such as 12 for 12%                                        |
| `percentOfAttack` | A multiple of the Attack of the hero, such as 210 for "Attack\*210%" |
| `seconds`         | A time in seconds, such as the 0.5 of a stun of 0.5 seconds          |
| `number`          | A plain count, such as the 8 strikes before an effect                |

A skill with two sets, such as Incendiary Arrow of Gina, has two entries at every level, and no two entries of one skill have the same name. A name has no suffix when the skill grants or raises the stat, such as `Attack`, and ends in `Reduction` when it lowers one, such as `Damage Taken Reduction`. A qualifier in parentheses names the troop type or the target, such as `Damage Dealt (Lancers)`. The names are the same at all 5 levels of a skill.

`manualsRequired` is 0 / 10 / 30 / 50 / 75 for levels 1 to 5 on every Exploration and Expedition skill. The Talent skill of Jeronimo and Natalia needs no Manuals, so it is 0 at every level.

`starRequired` is the hero star needed to unlock the skill level. It depends on the skill slot and not on the skill. A 1st Exploration skill unlocks its levels at stars 0/1/2/3/4. A 3rd Exploration skill or a 2nd Expedition skill needs stars 2/2/2/3/4.

`powerGain` is the same for every skill of a rarity, in every slot.

| Rarity    | Level 1 | Level 2 | Level 3 | Level 4 | Level 5 |
| --------- | ------- | ------- | ------- | ------- | ------- |
| Rare      | 540     | 2,030   | 3,780   | 6,426   | 10,152  |
| Epic      | 720     | 2,707   | 5,040   | 8,568   | 13,536  |
| Legendary | 900     | 3,380   | 6,300   | 10,710  | 16,920  |

### Exclusive weapon

`exclusiveWeapon` is set on Legendary heroes only. It is also called the Special item. Its Expedition bonus uses `lethality` and `health` percents, a different stat pair than the Expedition stats of the hero. It also has a `power` rating and two skills. These skills do not scale over 5 levels. Each has one fixed effect that activates at `unlockLevel`. Most heroes state it as a "(Lv. N)" suffix. Some newer heroes omit it, so `unlockLevel` is not set for them.

The Widgets that each weapon level costs are in [Hero widgets](/docs/hero-widgets).

### Shard costs and shard power

`shardCosts` has 5 stars of 6 tier costs for every hero. The tier costs are the same for every rarity, and so are the `total` values, which equal the sum of the tier costs of the star. Each star also has a `power` field. It is the total Power once the star is reached, not the gain of that star alone.

`power` is confirmed for Rare and Epic heroes and for every Legendary hero through Generation 4. Only the total Power at the maximum star is known. Each star's `power` is that total spread cumulatively by its share of the shards needed to reach the maximum star, on the assumption that every shard adds the same Power. The standard total is 1,065 shards. Cumulative Power for stars 1 to 5:

| Rarity / hero  | Star 1 | Star 2 | Star 3  | Star 4  | Star 5 (max) |
| -------------- | ------ | ------ | ------- | ------- | ------------ |
| Rare           | 4,222  | 21,111 | 69,667  | 196,335 | 449,670      |
| Epic           | 5,197  | 25,983 | 85,744  | 241,643 | 553,440      |
| Molly / Zinman | 6,496  | 32,479 | 107,180 | 302,054 | 691,800      |
| Natalia        | 7,145  | 35,727 | 117,898 | 332,259 | 760,980      |
| Jeronimo       | 8,120  | 40,599 | 133,975 | 377,567 | 864,750      |
| Generation 2   | 7,795  | 38,975 | 128,616 | 362,464 | 830,160      |
| Generation 3   | 9,744  | 48,718 | 160,770 | 453,080 | 1,037,700    |
| Generation 4   | 12,017 | 60,086 | 198,284 | 558,799 | 1,279,830    |

Hector, Norah, and Gwen (Generation 5) also have Hero Power read in the game, which is not part of the table above. `powerAtStarZero` is the Power at star 0 (22,200, twice the level 1 Power of 11,100). `tierPower` on stars 1 to 3 lists the Power at each of the six tiers, 1.1 to 3.6, ending at 449,772. Stars 4 and 5 are not read yet. These readings show that Power per tier is not spread evenly over the shards, so the cumulative `power` values above are a projection.

`shardSources` lists where the shards of each hero come from, for example `["VIP Packs"]` or `["Hall of Heroes", "Daily Deals"]`. It is empty for Ling Xue, the one Generation 0 hero with no listed sources.

`shardImg` is set for Gina, Molly, Zinman, Flint, Philly, Alonso, Logan, Reina, Gwen, Wu Ming, Gordon, Hendrik, and Magnus. The matching hero shard item in [Items](/docs/items) points to the same file.

### Level power

`levels` is the 80-level Furnace, XP, and Power progression. `furnaceLevelRequired` is the Furnace level needed to reach the hero level. `xpRequired` is the Hero XP needed from the previous level, and it is 0 at level 1. Both are identical for every hero, regardless of rarity, class, or generation.

`power` is the total Power once the level is reached. It follows one shared 80-entry curve. The gain at level L is `start * base[L] / 250` with integer division, and `power` is the running total of the gains. The `base` curve is the same for all heroes, and only the level 1 `start` differs. It is 3,250 for Rare and 4,000 for Epic. For Legendary Generations 1 to 5 it is 5,000, 6,000, 7,500, 9,250, and 11,100.

The values reproduce the known checkpoints for every covered rarity and generation. Rare levels 10, 40, and 80 give 9,945, 42,185, and 121,290. Legendary Generation 1 gives 15,300, 64,900, and 186,600.

Jeronimo is an exception to his generation. His start is 6,250 and not the 5,000 of Generation 1, so his level 80 total is 233,250 and not 186,600. The curve and the formula are the same.

{% callout title="Known gaps" type="warning" %}
Shard `power` is a `0` placeholder for Legendary Generations 5 to 17, because no maximum star Power is confirmed for them. The Generation 5 `tierPower` readings are a partial exception, as described above. The tier 3.4 reading of 352,258 does not fit the other readings, so 352,314 is stored until it is checked in the game.

Level `power` is a `0` placeholder for Legendary Generations 6 to 17, because no level 1 start value is known. The start values of Generations 3 to 5 are projected and are not measured in the game.

The Talent skill `powerGain` is a `0` placeholder. A star does gate the Talent skill, but the curve is not known, so `starRequired` is a `0` placeholder for Jeronimo and Natalia.
{% /callout %}

---

## Next steps

- See [Hero widgets](/docs/hero-widgets) for the Widgets each exclusive weapon level costs
- Browse the [Hero gear](/docs/hero-gear-slots) pages for the four gear slots
- Use the [Hero upgrade calculator](/docs/calculator-hero-upgrade) to plan a hero's progression
- Read the [query builder](/docs/query-builder) guide for more filter patterns
