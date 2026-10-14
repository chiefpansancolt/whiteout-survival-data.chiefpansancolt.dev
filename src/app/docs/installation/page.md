---
title: Installation
nextjs:
  metadata:
    title: whiteout-survival-data - Installation
    description: Install whiteout-survival-data and start importing Whiteout Survival game data into your project.
---

Get up and running with whiteout-survival-data in your JavaScript or TypeScript project in under a minute. {% .lead %}

---

## Install the package

Install with your preferred package manager:

### npm

```shell
npm install whiteout-survival-data
```

### Yarn

```shell
yarn add whiteout-survival-data
```

### pnpm

```shell
pnpm add whiteout-survival-data
```

---

## Basic imports

### Named imports

Import individual factory functions and types directly from the package:

```typescript
import { buildings, heroes, pets } from 'whiteout-survival-data'

const allHeroes = heroes().get()
const epicPets = pets().byRarity('Epic').get()
const militaryBuildings = buildings().byCategory('Military').get()
```

This is the recommended approach for most use cases. Bundlers that support tree-shaking only include the modules you use.

### Namespace import

You can also import the whole package as a namespace:

```typescript
import * as whiteout from 'whiteout-survival-data'

const legendaryHeroes = whiteout.heroes().byRarity('Legendary').get()
```

### Type-only imports

When you only need types for annotations, use `import type`:

```typescript
import type { Building, Hero, Pet } from 'whiteout-survival-data'

function describe(item: Building | Hero | Pet): string {
  return item.name
}
```

---

## Package exports map

The package exposes three entry points through its exports map:

| Entry point                       | Description                                              | Example import                                                             |
| --------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------- |
| `whiteout-survival-data`          | Main entry: every factory function, calculator, and type | `import { heroes } from 'whiteout-survival-data'`                          |
| `whiteout-survival-data/data/*`   | Raw JSON data files backing the modules                  | `import buildings from 'whiteout-survival-data/data/chief/buildings.json'` |
| `whiteout-survival-data/images/*` | Bundled image assets for the game data                   | Referenced via file path in your bundler or asset pipeline                 |

### Main entry point

The main entry point re-exports every module's factory function (`heroes()`, `buildings()`, `pets()`, `research()`, and the rest), the calculators, and every exported TypeScript type.

```typescript
import { buildings, heroes, pets, research } from 'whiteout-survival-data'
```

### Raw data files

You can import the JSON files directly, without the JS or TS package code. Your TypeScript config needs `resolveJsonModule` to import JSON.

```typescript
import buildings from 'whiteout-survival-data/data/chief/buildings.json'
```

### Image assets

Most data items ship with an `img` field that points at a bundled image under `whiteout-survival-data/images/`. See the [Image assets](/docs/images) page for usage patterns.

```typescript
import { heroes } from 'whiteout-survival-data'

const smith = heroes().find('smith')!
smith.img
// "/images/heroes/Smith/Smith.png"
```

---

## Requirements

- **Node.js** 24 or later
- **TypeScript** (optional, but recommended)

The package ships with TypeScript declarations and works in both ESM and CommonJS projects. No additional `@types` package is needed.

---

## Next steps

- Learn the [core concepts](/docs/core-concepts) behind the query builder pattern
- Explore the [query builder](/docs/query-builder) for filtering and looking up data
- See [TypeScript integration](/docs/typescript) for type usage across the modules
