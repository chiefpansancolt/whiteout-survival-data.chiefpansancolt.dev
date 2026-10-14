---
title: Castle appointments
nextjs:
  metadata:
    title: whiteout-survival-data - Castle appointments
    description: Look up the Sunfire Castle positions and the buffs each one gives.
---

Look up the positions of the Sunfire Castle and the buffs they give: President, Vice President, and the five Ministers. Use it to show which buffs are available for each position. {% .lead %}

The skills of the President, the global perks, are in [President skills](/docs/president-skills).

---

## Type

### `CastleAppointment`

| Field            | Type                        | Description                                        |
| ---------------- | --------------------------- | -------------------------------------------------- |
| `id`             | `string`                    | Stable identifier, such as `minister-of-health`    |
| `name`           | `string`                    | Display name                                       |
| `kind`           | `CastleAppointmentKind`     | `'president'`, `'vice-president'`, or `'minister'` |
| `bonuses`        | `CastleAppointmentBonus[]`  | Buffs the position gives                           |
| `boostedBonuses` | `CastleAppointmentBonus[]?` | Boosted values of the same buffs, on the Ministers |

### `CastleAppointmentBonus`

| Field     | Type                  | Description                                                |
| --------- | --------------------- | ---------------------------------------------------------- |
| `stat`    | `string`              | Stat name                                                  |
| `statKey` | `string`              | Stable key, the same as in [Research](/docs/research)      |
| `value`   | `string`              | Display string in the wording of the game, such as `+100%` |
| `amount`  | `number`              | Parsed amount                                              |
| `unit`    | `'percent' \| 'flat'` | Whether `amount` is a percent or a flat value              |

The `statKey` values are the same as in `research()`, so a position bonus matches a research bonus of the same stat.

### `CASTLE_APPOINTMENT`

| Field                        | Value   | Description                             |
| ---------------------------- | ------- | --------------------------------------- |
| `cooldownSeconds`            | `7200`  | Cooldown between appointments, 2 hours  |
| `applicationValiditySeconds` | `86400` | An application stays valid for 24 hours |
| `maxApplicationsPerPosition` | `100`   | Most applications for each position     |

---

## Factory

```typescript
import { castleAppointments } from 'whiteout-survival-data'

castleAppointments() // all 8 positions
castleAppointments(source) // wrap a pre-filtered array
```

---

## Filters

| Method   | Signature                             | Description                                                                        |
| -------- | ------------------------------------- | ---------------------------------------------------------------------------------- |
| `byKind` | `byKind(kind: CastleAppointmentKind)` | Filter to the positions of one kind: `president`, `vice-president`, or `minister`. |

---

## Terminal methods

| Method              | Returns                          | Description                         |
| ------------------- | -------------------------------- | ----------------------------------- |
| `.get()`            | `CastleAppointment[]`            | All results                         |
| `.first()`          | `CastleAppointment \| undefined` | First result                        |
| `.find(id)`         | `CastleAppointment \| undefined` | Find by `id`                        |
| `.findByName(name)` | `CastleAppointment \| undefined` | Case-insensitive exact name match   |
| `.search(query)`    | `CastleAppointment[]`            | Case-insensitive partial name match |
| `.count()`          | `number`                         | Number of results                   |

---

## Data

| Position              | Bonuses                                         | Boosted values |
| --------------------- | ----------------------------------------------- | -------------- |
| Supreme President     | Troops Attack, Defense, Lethality, Health +7.5% | none           |
| President             | Troops Attack, Defense, Lethality, Health +5%   | none           |
| Vice President        | Construction, Research, Training Speed +10%     | none           |
| Minister of Defense   | Troops Lethality +10%                           | +15%           |
| Minister of Strategy  | Troops Attack +5%, Deployment Capacity +2,500   | +8%, +3,750    |
| Minister of Health    | Healing Speed +100%, Infirmary Capacity +5,000  | +150%, +7,500  |
| Minister of Education | Training Speed +50%, Training Capacity +200     | +75%, +300     |
| Minister of Interior  | Resource Production Speed +80%                  | +120%          |

---

## Examples

```typescript
import { CASTLE_APPOINTMENT, castleAppointments } from 'whiteout-survival-data'

castleAppointments().count() // 8

// Buffs of one position
const health = castleAppointments().find('minister-of-health')!
health.bonuses.map((b) => `${b.stat} ${b.value}`)
// ['Healing Speed +100%', 'Infirmary Capacity +5,000']
health.boostedBonuses?.map((b) => b.value) // ['+150%', '+7,500']

// Positions of one kind
castleAppointments().byKind('minister').count() // 5

// Rules of the appointments
CASTLE_APPOINTMENT.cooldownSeconds // 7200
```

---

## Known gaps

{% callout type="warning" title="Assumptions" %}
The package does not state what makes a minister buff boosted, so `boostedBonuses` holds the values only.

The President positions and the Vice President have no boosted value.

The Supreme President has one value and the President has another. The package does not say which state holds which, because it depends on the State of Power result.

The Ministers of Security, Development, and Science are not in the data. The package has no appointment duration.

The positions have no icons. The game shows a player portrait for each position.
{% /callout %}

---

## Next steps

- See [President skills](/docs/president-skills) for the global perks of the President
- Browse [Research](/docs/research) for bonuses that share the same `statKey` values
- Try the [Buffs calculator](/docs/calculator-buffs) to add the buffs of a position to your totals
