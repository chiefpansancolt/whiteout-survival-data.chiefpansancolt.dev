---
title: Getting Started
nextjs:
  metadata:
    title: whiteout-survival-data - Getting Started
    description: Getting started with whiteout-survival-data, a typed dataset for Whiteout Survival with structured JSON data, image assets, a chainable query builder API, and calculators.
---

Documentation for the whiteout-survival-data npm package: a typed dataset for Whiteout Survival with structured JSON data, bundled image assets, a chainable query builder API, and calculators for heroes, buildings, research, pets, and more. {% .lead %}

{% callout type="warning" title="Data is still growing" %}
Some data may be missing while the data is collected and refined. Some fields are placeholders, and some values may change as they are checked. The API can also change before a stable release. If you have data that is missing, share it through an issue or a pull request (see [how to contribute](/docs/how-to-contribute)). See [Known Gaps](https://github.com/chiefpansancolt/whiteout-survival-data#known-gaps) for what is missing now.
{% /callout %}

{% quick-links %}

{% quick-link title="Installation" icon="installation" href="/docs/installation" description="Install the package and start querying Whiteout Survival data in your project." /%}

{% quick-link title="Core concepts" icon="presets" href="/docs/core-concepts" description="Learn the factory function and query builder pattern shared by the modules." /%}

{% quick-link title="Query builder" icon="plugins" href="/docs/query-builder" description="Filter and look up heroes, buildings, pets, and more with chainable methods." /%}

{% quick-link title="TypeScript" icon="theming" href="/docs/typescript" description="Typed exports for every module, with shared base types." /%}

{% quick-link title="Calculators overview" icon="lightbulb" href="/docs/calculators" description="Plain functions that turn a goal into resources, time, power, and event points." /%}

{% /quick-links %}

---

## Quick start

### Install the package

```shell
npm install whiteout-survival-data
```

### Import and query data

Every module exports a factory function that returns a chainable query builder.

```typescript
import { buildings, heroes, pets } from 'whiteout-survival-data'

// The Furnace at Fire Crystal level 10
const furnace = buildings().findByName('Furnace')!
furnace.levels.find((level) => level.label === 'FC 10')

// Legendary Infantry heroes
heroes().byRarity('Legendary').byClass('Infantry').get()

// A single hero by id
heroes().find('smith')

// How many Epic pets there are
pets().byRarity('Epic').count()
```

---

## What's included

The package has data and query builders for the modules below. The number in brackets is the number of entries each factory returns.

### Buildings and city

- **Buildings**: `buildings()` (27) lists every building with its per-level cost, build time, power, and requirements. `facilities()` (9) lists buildings that have no upgrade levels.
- **Fire Crystal tables**: `fireCrystalTable()` (8) gives the Fire Crystals and Refined Fire Crystals each building needs for FC 1 to FC 10. `fireCrystalLevels()` (10) gives the level badge icons. `fireCrystalShardTable()` (9) gives the Fire Crystal Shards and Refined Fire Crystals for T11 and T12 troop research.
- **Daybreak Island**: `lumberCamp()` (10), `treeOfLife()` (10), and `decoration()` (103).

### Heroes and experts

- **Heroes**: `heroes()` (65) lists heroes with stats, skills, shard costs, levels, and exclusive weapons. `heroWidgets()` (10) lists the Widgets each exclusive weapon level costs.
- **Hero gear**: `heroGearEnhancement()` (100), `heroGearEmpowerment()` (100), `heroGearMasteryForging()` (84), `heroGearSlots()` (4), and `heroGearStats()` (12).
- **Experts**: `experts()` (10) lists the Dawn Academy experts with skills, talents, and affinity levels. `expertRelationships()` (11) lists the relationship statuses by affinity level. `unreleasedExperts()` (1) lists experts that are announced and not released.
- **Pets**: `pets()` (14) lists Beast Cage pets with skills and level tables.

### Gear, troops, and research

- **Chief Gear**: `chiefGearSlots()` (6), `chiefGear()` (150), and `chiefGearSetBonuses()` (14).
- **Chief Charm**: `chiefCharmSlots()` (3) and `chiefCharm()` (75).
- **Converters**: `chiefGearConverter()` (7) and `chiefCharmConverter()` (4) list material exchange rates.
- **Troops**: `troops()` (3) lists troop tiers with cost, training time, power, and unlock requirements.
- **Research**: `research()` (290) lists the Research Center tech tree. `researchTree()` (7) gives the positions and links of the tech tree tabs.

### Alliance

- **Alliance**: `allianceBanner()` (37), `allianceTech()` (59), `allianceFacility()` (8), `allianceFortress()` (17), and `alliancePrestige()` (6).

### Events, items, and account

- **Events**: `events()` (65) lists game events with scoring, rewards, and tips. `eventBuff()` (14) lists the buff sources that apply in each game mode.
- **Items and skins**: `items()` (331) is the item catalog with icons and sources. `skins()` (215) lists cosmetic skins.
- **Server timeline**: `serverTimeline()` (33) lists the unlocks by server age.
- **Account and city rules**: `chiefOrders()` (9), `castleAppointments()` (8), `presidentSkills()` (9), and `vip()` (12).
- **Daily tasks and collections**: `dailies()` (15), `dailyMissions()` (21), `collectionRewardLevels()` (51), and `tundraAlbum()` (14).

### Calculators

Fifteen calculators take a goal object and return the resources, time, power, and event points for the plan. They cover State of Power, buffs, beasts, Alliance Showdown, King of Icefield, Hall of Chief, Chief Gear, Chief Charm, troops, research, pets, experts, buildings, hero gear, and hero upgrades. See the [calculators overview](/docs/calculators).

---

## Getting help

### Submit an issue

Found a bug, a missing value, or a feature request? Open an issue on the [GitHub repository](https://github.com/chiefpansancolt/whiteout-survival-data/issues).

### View on GitHub

Check out the source code at [github.com/chiefpansancolt/whiteout-survival-data](https://github.com/chiefpansancolt/whiteout-survival-data).

### Contributing

Bug reports, feature requests, and pull requests are welcome. See [how to contribute](/docs/how-to-contribute) for details.

This project is not affiliated with, endorsed by, or connected to Whiteout Survival or Century Games. Game images and names are used for reference purposes only.
