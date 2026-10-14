---
title: Image assets
nextjs:
  metadata:
    title: whiteout-survival-data - Image assets
    description: Use the bundled image assets for heroes, buildings, items, and more, referenced through a relative path stored on the data.
---

The package bundles image assets for most of its data, reachable through a relative path stored right on each entry. {% .lead %}

---

## How images work

Most entities carry an `img` field. It is a path relative to the package root, already prefixed with `/images/`.

```typescript
import { heroes } from 'whiteout-survival-data'

const smith = heroes().find('smith')!
smith.img
// "/images/heroes/Smith/Smith.png"
```

Some entries have more than one image. Heroes have a `shardImg` for the hero shard, and each hero skill has its own `img`. Buildings have a `fireCrystalImg` for the Fire Crystal version of the building.

```typescript
import { buildings, heroes } from 'whiteout-survival-data'

const smith = heroes().find('smith')!
smith.skills.exploration[0].img
// "/images/heroes/Smith/skills/Smith-HammerBurn.png"

const furnace = buildings().findByName('Furnace')!
furnace.img // "/images/buildings/Furnace.png"
furnace.fireCrystalImg // "/images/buildings/Furnace_FC.png"
```

On `Building` and `Skin`, `img` is optional, because a few entries have no image yet. Check the field before you use it:

```typescript
import { skins } from 'whiteout-survival-data'

const withImages = skins()
  .get()
  .filter((skin) => skin.img !== undefined)
```

---

## Image organization

Images are organized under `images/<category>/`, and each folder matches a part of the data:

| Folder                   | Contains                                                     |
| ------------------------ | ------------------------------------------------------------ |
| `alliance-tech/`         | Alliance Tech node icons                                     |
| `buildings/`             | Building icons and Fire Crystal versions                     |
| `chief-charm/`           | Chief Charm icons by troop type and level                    |
| `chief-gear/`            | Chief Gear icons by slot and rarity                          |
| `chief-orders/`          | Chief Order icons                                            |
| `collection-medallions/` | Collection medallion pictures                                |
| `daybreak-island/`       | Daybreak Island decoration icons                             |
| `events/`                | Event icons                                                  |
| `experts/`               | Expert portraits and skill icons                             |
| `facilities/`            | Facility icons                                               |
| `fire-crystal/`          | Fire Crystal level badges, FC 1 to FC 10                     |
| `hero-gear/`             | Hero gear piece icons by slot and troop type                 |
| `heroes/`                | Hero portraits, shards, and skill icons, one folder per hero |
| `items/`                 | Item icons                                                   |
| `pets/`                  | Pet portraits and skill icons, one folder per pet            |
| `president-skills/`      | President skill icons                                        |
| `research/`              | Research node icons                                          |
| `resources/`             | Basic resource icons                                         |
| `skins/`                 | Cosmetic skin pictures                                       |
| `tundra-album/`          | Tundra Album pictures and puzzle pieces                      |

Folder names match the `img` path exactly, and the paths are case-sensitive. Every image is PNG or JPG.

---

## Accessing images

Images are located at `node_modules/whiteout-survival-data/images/...`. They are also exposed through the `whiteout-survival-data/images/*` entry in the package exports map, so bundlers can resolve them directly.

### In a bundler (Webpack, Vite, and others)

Combine the package name with the relative path from the data:

```typescript
import { heroes } from 'whiteout-survival-data'

const smith = heroes().find('smith')!
const imagePath = `whiteout-survival-data${smith.img}`
// "whiteout-survival-data/images/heroes/Smith/Smith.png"
```

### In React

```tsx
import { heroes } from 'whiteout-survival-data'

function HeroCard({ id }: { id: string }) {
  const hero = heroes().find(id)
  if (!hero) return null

  return (
    <div>
      <img
        src={`/node_modules/whiteout-survival-data${hero.img}`}
        alt={hero.name}
      />
      <h3>{hero.name}</h3>
    </div>
  )
}
```

### Copying images to your public directory

For production use, copy the images folder into the public or static folder of your project as a build step. A `postinstall` script keeps it in sync on every install:

```shell
#!/bin/bash
# scripts/copy-game-assets.sh
rm -rf public/images
cp -r node_modules/whiteout-survival-data/images public/images
```

```json
{
  "scripts": {
    "postinstall": "bash scripts/copy-game-assets.sh"
  }
}
```

Every `img` field is already prefixed with `/images/`, so after the copy you can use it with no path rewriting:

```tsx
import { heroes } from 'whiteout-survival-data'

const smith = heroes().find('smith')!

;<img src={smith.img} alt={smith.name} />
// resolves to /images/heroes/Smith/Smith.png in your public/ folder
```

### In Next.js

With the copy step in place, `img` fields work with `next/image` and need no helper, because the path is already relative to the public root:

```tsx
import Image from 'next/image'
import { heroes } from 'whiteout-survival-data'

function HeroIcon({ id }: { id: string }) {
  const hero = heroes().find(id)
  if (!hero) return null

  return (
    <Image src={hero.img} alt={hero.name} width={64} height={64} unoptimized />
  )
}
```

Use `unoptimized` for small, pre-sized icons. The Next.js image optimization adds work without much benefit at that size.

---

## Next steps

- See [TypeScript integration](/docs/typescript) for the `Base` interface that image-bearing entities extend
- Browse any module page (for example [Heroes](/docs/heroes) or [Buildings](/docs/buildings)) to see real `img` path examples
- See the [core concepts](/docs/core-concepts) page for how entities are shaped across the package
