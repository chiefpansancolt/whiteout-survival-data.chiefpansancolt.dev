---
title: TypeScript integration
nextjs:
  metadata:
    title: whiteout-survival-data - TypeScript integration
    description: Use the TypeScript types, shared base types, and query builder generics exported by whiteout-survival-data.
---

whiteout-survival-data ships with TypeScript declarations: every function, type, and interface is typed, and no additional packages are required. {% .lead %}

---

## Importing types

All types are exported from the main entry point. Use `import type` when you only need the type for annotations:

```typescript
import type {
  Building,
  Expert,
  Hero,
  Item,
  Pet,
  ResearchNode,
  Skin,
} from 'whiteout-survival-data'
```

You can also import types alongside runtime values:

```typescript
import { heroes, type Hero } from 'whiteout-survival-data'

function summarize(hero: Hero): string {
  return `${hero.name}: ${hero.rarity} ${hero.class}`
}

const smith = heroes().find('smith')!
console.log(summarize(smith))
```

---

## Common shared types

A few base types are shared across modules. They live in `src/types/common.ts` and are re-exported from the main package.

### `Base`

```typescript
interface Base {
  id: string
  name: string
  img: string
}
```

The minimal shape of an entity: a stable identifier, a display name, and an image path. Some entities, such as `Building` and `Skin`, make `img` optional because a few entries have no image yet. See [Image assets](/docs/images).

### `Resource`

```typescript
interface Resource {
  name: string
  count: number
  itemId?: string
  pricePerItem?: number
}
```

Describes a cost or a reward, such as the Wood needed for a building level. When `itemId` is set, it resolves through `items()`:

```typescript
import { buildings, items } from 'whiteout-survival-data'

const furnace = buildings().findByName('Furnace')!
const firstCost = furnace.levels[0].cost[0]
// { name: 'Wood', count: 2000, itemId: 'wood' }

const wood = items().find(firstCost.itemId!)
```

### `BonusUnit`

```typescript
type BonusUnit = 'percent' | 'flat'
```

Tells you whether a bonus amount is a percentage or a flat number.

---

## Union types

Fields with a fixed set of values are typed as unions of string literals. Each module exports its own, for example:

| Type               | Values                                                      | Used by       |
| ------------------ | ----------------------------------------------------------- | ------------- |
| `HeroRarity`       | `'Rare'`, `'Epic'`, `'Legendary'`                           | `heroes()`    |
| `HeroClass`        | `'Infantry'`, `'Lancer'`, `'Marksman'`                      | `heroes()`    |
| `PetRarity`        | `'Common'`, `'Uncommon'`, `'Rare'`, `'Epic'`, `'Legendary'` | `pets()`      |
| `BuildingCategory` | `'Military'`, `'Inner City'`, `'Entertainment'`             | `buildings()` |
| `EventCategory`    | `'solo'`, `'alliance'`, `'rookie'`, `'holiday'`             | `events()`    |

Use them to type your own filter inputs:

```typescript
import { heroes, type HeroRarity } from 'whiteout-survival-data'

function heroesOfRarity(rarity: HeroRarity) {
  return heroes().byRarity(rarity).get()
}
```

---

## Query builder generics

Every query builder class extends `QueryBase<T>`, constrained to entities with at least `id` and `name`:

```typescript
abstract class QueryBase<T extends { id: string; name: string }> {
  constructor(protected readonly data: T[])
  get(): T[]
  first(): T | undefined
  find(id: string): T | undefined
  findByName(name: string): T | undefined
  search(query: string): T[]
  count(): number
}
```

Module-specific query classes (`HeroQuery`, `BuildingQuery`, `PetQuery`, and so on) extend this with typed filter methods. Each filter returns its own query type, so the chain keeps its types:

```typescript
class HeroQuery extends QueryBase<Hero> {
  byRarity(rarity: HeroRarity): HeroQuery
  byClass(heroClass: HeroClass): HeroQuery
}
```

You rarely need the query classes directly, but they are exported if you want to type a parameter or a return value:

```typescript
import { heroes, type HeroQuery } from 'whiteout-survival-data'

function legendaryOnly(query: HeroQuery) {
  return query.byRarity('Legendary')
}

legendaryOnly(heroes()).get()
```

---

## Next steps

- See [Image assets](/docs/images) for the `img` field shape shared by the entities
- Read the [core concepts](/docs/core-concepts) page for how the query builder pattern uses these types
- Browse the [query builder](/docs/query-builder) guide for filter patterns built on these types
