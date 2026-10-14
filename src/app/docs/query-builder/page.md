---
title: Query builder basics
nextjs:
  metadata:
    title: whiteout-survival-data - Query builder basics
    description: Learn how to filter and look up Whiteout Survival data using the chainable query builder API.
---

The query builder API lets you filter and look up the data of any module with readable, chainable method calls. {% .lead %}

---

## How it works

Every factory function (`heroes()`, `buildings()`, `pets()`, and so on) returns a query builder that wraps an array of typed data. Calling a filter method returns a **new** query builder with only the matching items. You finish the chain with a terminal method (`get()`, `first()`, `find()`, `findByName()`, `search()`, or `count()`) to extract results.

```typescript
import { heroes } from 'whiteout-survival-data'

const results = heroes()
  .byRarity('Legendary') // Filter to Legendary heroes
  .byClass('Marksman') // Filter to Marksmen
  .get() // Extract the array
```

---

## Common filter patterns

Filter method names are specific to each module, but a few shapes repeat:

### Filtering by category

Many modules group their entries by a category and expose `byCategory()`:

```typescript
import { buildings, items, research } from 'whiteout-survival-data'

const innerCity = buildings().byCategory('Inner City').get()
const speedups = items().byCategory('Speedups').get()
const battleResearch = research().byCategory('Battle').get()
```

### Filtering by rarity

Heroes and pets filter by rarity:

```typescript
import { heroes, pets } from 'whiteout-survival-data'

const legendaryHeroes = heroes().byRarity('Legendary').get()
const epicPets = pets().byRarity('Epic').get()
```

### Filtering by troop type or class

```typescript
import { heroes } from 'whiteout-survival-data'

const lancers = heroes().byClass('Lancer').get()
```

### Filtering by level or tier

Tables that hold one row for each level or tier expose `byLevel()` or `byTier()`:

```typescript
import { heroWidgets, research } from 'whiteout-survival-data'

const levelThreeWidgets = heroWidgets().byLevel(3).get()
const tierOneResearch = research().byTier(1).get()
```

### Filtering by server age

The server timeline filters by the age of a server in days:

```typescript
import { serverTimeline } from 'whiteout-survival-data'

const unlockedAtDay100 = serverTimeline().unlockedAt(100).get()
const stillLockedAtDay100 = serverTimeline().lockedAt(100).get()
```

See each module page for its exact filter list.

---

## Sorting

The query builders have no sort methods. Call `get()` and use the array `sort` method on a copy of the result:

```typescript
import { heroes } from 'whiteout-survival-data'

const newestFirst = [...heroes().get()].sort(
  (a, b) => b.generation - a.generation,
)
```

---

## Combining operations

### Branching from a shared base

Since every filter method returns a new instance, you can branch from any intermediate query without affecting the original:

```typescript
import { heroes } from 'whiteout-survival-data'

const epicHeroes = heroes().byRarity('Epic')

const epicLancers = epicHeroes.byClass('Lancer').get()
const firstEpic = epicHeroes.first()
const total = epicHeroes.count()

// `epicHeroes` itself is unchanged and still holds all Epic heroes
```

### Passing a custom source

Every factory function accepts an optional array, so you can wrap your own subset in the same query builder and keep chaining:

```typescript
import { heroes, type Hero } from 'whiteout-survival-data'

const recentHeroes: Hero[] = heroes()
  .get()
  .filter((hero) => hero.generation >= 10)

const recentInfantry = heroes(recentHeroes).byClass('Infantry').get()
```

---

## Collecting results

### As an array

```typescript
const allHeroes = heroes().get() // Hero[]
const names = heroes()
  .get()
  .map((hero) => hero.name) // string[]
```

### First item only

```typescript
const first = heroes().byClass('Lancer').first() // Hero | undefined
```

### By ID, exact name, or partial name

```typescript
const byId = heroes().find('smith') // Hero | undefined
const exact = heroes().findByName('Smith') // Hero | undefined
const partial = heroes().search('sm') // Hero[]
```

### Count

```typescript
const total = heroes().byRarity('Epic').count() // number
```

---

## Common patterns

### Building a lookup table

```typescript
import { heroes } from 'whiteout-survival-data'

const heroMap = new Map(
  heroes()
    .get()
    .map((hero) => [hero.id, hero]),
)

const smith = heroMap.get('smith')
```

### Conditional filtering

```typescript
import { heroes, type HeroClass, type HeroQuery } from 'whiteout-survival-data'

function queryHeroes(heroClass?: HeroClass, legendaryOnly?: boolean) {
  let query: HeroQuery = heroes()

  if (heroClass) {
    query = query.byClass(heroClass)
  }
  if (legendaryOnly) {
    query = query.byRarity('Legendary')
  }

  return query.get()
}
```

### Nested level data

Buildings, research nodes, pets, and heroes carry their levels on the entity. Read them straight off the result, with no separate query:

```typescript
import { buildings } from 'whiteout-survival-data'

const furnace = buildings().findByName('Furnace')!
const fireCrystalTen = furnace.levels.find((level) => level.label === 'FC 10')!

for (const cost of fireCrystalTen.cost) {
  console.log(`${cost.count}x ${cost.name}`)
}
```

---

## Next steps

- See [TypeScript integration](/docs/typescript) for type-safe querying
- Read the [core concepts](/docs/core-concepts) page for the `QueryBase` pattern in depth
- Browse individual module pages (for example [Heroes](/docs/heroes) and [Buildings](/docs/buildings)) for module-specific filters
