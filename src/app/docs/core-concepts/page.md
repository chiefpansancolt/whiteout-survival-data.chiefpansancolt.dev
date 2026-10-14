---
title: Core concepts
nextjs:
  metadata:
    title: whiteout-survival-data - Core concepts
    description: Understand the QueryBase pattern, terminal methods, and the factory function structure shared by the modules.
---

Most modules in whiteout-survival-data follow the same pattern. Learn it once and you can use any of them. {% .lead %}

---

## One factory function per module

Each module covers one category of Whiteout Survival data: heroes, buildings, pets, research, and so on. Every module exports a **factory function** that returns a chainable query builder:

```typescript
import { buildings, heroes, pets } from 'whiteout-survival-data'

heroes() // HeroQuery
buildings() // BuildingQuery
pets() // PetQuery
```

Calling the factory with no arguments wraps the full dataset of the module. You can also pass a pre-filtered array back in. This is how you branch a query without losing the original:

```typescript
import { heroes } from 'whiteout-survival-data'

const epicHeroes = heroes().byRarity('Epic').get()

// Wrap an already-filtered array to keep chaining
const epicLancers = heroes(epicHeroes).byClass('Lancer').get()
```

---

## The QueryBase pattern

Every standard query builder extends the `QueryBase<T>` abstract class. It provides six **terminal methods** that work the same way in every module. Each module then adds its own filter methods.

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

The constraint `{ id: string; name: string }` means every item has at least an `id` and a `name`. That is what makes `find()`, `findByName()`, and `search()` work the same way everywhere.

---

## Terminal methods

Terminal methods end a query chain and return results.

### `get(): T[]`

Returns all matching results as an array. This is the most common terminal method.

```typescript
import { buildings } from 'whiteout-survival-data'

const allBuildings = buildings().get()
const militaryBuildings = buildings().byCategory('Military').get()
```

### `first(): T | undefined`

Returns the first result, or `undefined` if the query is empty.

```typescript
import { heroes } from 'whiteout-survival-data'

const firstInfantryHero = heroes().byClass('Infantry').first()
```

### `find(id: string): T | undefined`

Finds an item by its exact `id` field.

```typescript
import { heroes } from 'whiteout-survival-data'

const smith = heroes().find('smith')
```

### `findByName(name: string): T | undefined`

Finds an item by name. The match is on the full name and ignores case.

```typescript
import { buildings } from 'whiteout-survival-data'

const furnace = buildings().findByName('furnace')
```

### `search(query: string): T[]`

Returns every item whose name contains the given text, ignoring case. Unlike `findByName`, it returns a plain array of every partial match. The array is not a query builder, so you cannot chain after it.

```typescript
import { items } from 'whiteout-survival-data'

const shardItems = items().search('shard')
```

### `count(): number`

Returns the number of results.

```typescript
import { pets } from 'whiteout-survival-data'

const epicPetCount = pets().byRarity('Epic').count()
```

---

## Immutable chaining

Every filter method returns a **new instance** of the query builder. The original is never changed, so you can branch from any point in a chain:

```typescript
import { heroes } from 'whiteout-survival-data'

const epicHeroes = heroes().byRarity('Epic')

// These two queries are independent
const epicLancers = epicHeroes.byClass('Lancer').get()
const epicMarksmen = epicHeroes.byClass('Marksman').get()

// The original query is unchanged
const allEpic = epicHeroes.get()
```

---

## Functions that are not query builders

A few exports return a built result and not a query builder, because the data is a table or a tree and not a flat list:

- `fireCrystalTable()` and `fireCrystalShardTable()` return a table with `columns` and `rows`.
- `researchTree()` returns the tabs of the Research tech tree with the position and links of each node.
- The calculators, such as `calculateBuildings()` and `calculateResearch()`, are plain functions that take a goal object and return a result object. See the [calculators overview](/docs/calculators).

Modules can also export helper functions next to the factory, such as `serverAge()`, `troopPower()`, and `chiefGearSetBonus()`. Each module page lists its own.

---

## Putting it all together

Here is an example that uses factory functions, chaining, and terminal methods together:

```typescript
import { buildings, heroes, pets } from 'whiteout-survival-data'

// Legendary heroes of one class
const legendaryInfantry = heroes()
  .byRarity('Legendary')
  .byClass('Infantry')
  .get()

// A single building, looked up by name
const furnace = buildings().findByName('Furnace')!

// A count
const epicPetCount = pets().byRarity('Epic').count()

console.log(`Legendary Infantry heroes: ${legendaryInfantry.length}`)
console.log(`Furnace levels: ${furnace.levels.length}`)
console.log(`Epic pets: ${epicPetCount}`)
```

---

## Next steps

- See the [query builder](/docs/query-builder) page for filter patterns shared across modules
- Learn about [TypeScript integration](/docs/typescript) for typed exports
- Browse the [Buildings](/docs/buildings) page for a first example module
