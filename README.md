# BioAge

Open-source biological age calculator and longevity protocol tracker.

Compute your biological age from standard bloodwork using the **PhenoAge** formula (Levine et al. 2018), log your active protocols, and track your progress over time.

---

## Features

- **PhenoAge Calculator** — enter 9 standard CBC/metabolic markers and get your biological age instantly
- **Organ sub-scores** — metabolic, immune, inflammatory, and hematological system ages
- **Protocol Logger** — track peptides, senolytics, NAD+ pathway agents, and more
- **Trend Chart** — visualise your biological age trajectory over time
- **Shareable Card** — export a beautiful dark-themed PNG report card

---

## The Formula

BioAge implements the Levine et al. 2018 PhenoAge formula exactly.

**Reference:**
> Levine ME, Lu AT, Quach A, et al. "An epigenetic biomarker of aging for lifespan and healthspan." *Aging (Albany NY)*. 2018;10(4):573–591. doi:[10.18632/aging.101414](https://doi.org/10.18632/aging.101414)

### Step 1 — Linear combination

```
xb = -19.9067
   + (-0.0336 × albumin)
   + (0.0095  × creatinine)
   + (0.1953  × ln(glucose))
   + (0.0954  × ln(CRP + 0.001))
   + (-0.012  × lymphocyte%)
   + (0.0268  × MCV)
   + (0.3306  × RDW)
   + (0.00188 × ALP)
   + (0.0554  × WBC)
   + (0.0804  × chronological_age)
```

### Step 2 — Mortality score

```
mortality_score = 1 - exp(-exp(xb) × (exp(120 × 0.0076927) - 1) / 0.0076927)
```

### Step 3 — PhenoAge

```
PhenoAge = 141.50225 + ln(-0.00553 × ln(1 - mortality_score)) / 0.090165
```

The pure formula lives in [`lib/phenoage.ts`](lib/phenoage.ts) with zero runtime dependencies.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | SQLite via Prisma |
| Charts | Recharts |
| Card export | html2canvas |
| Fonts | Syne + DM Mono |

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/your-username/bioage
cd bioage

# 2. Install dependencies
npm install

# 3. Set up the database
npx prisma migrate dev

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
app/
  page.tsx              # Dashboard
  calculate/page.tsx    # PhenoAge input + results
  protocol/page.tsx     # Protocol logger
  card/page.tsx         # Shareable card generator
  api/
    calculate/route.ts  # PhenoAge computation API
    entries/route.ts    # BioAge entry CRUD
    protocol/route.ts   # Protocol entry CRUD

components/
  BioAgeCard.tsx        # Shareable card component
  OrganBar.tsx          # Animated organ age bar
  ProtocolPill.tsx      # Protocol tag pill
  TrendChart.tsx        # Recharts bio age trend
  Nav.tsx               # Navigation

lib/
  phenoage.ts           # Pure PhenoAge formula (zero deps)
  organ-scores.ts       # Organ sub-score calculations
  population-norms.ts   # Reference ranges for sub-scores
  prisma.ts             # Prisma client singleton

prisma/
  schema.prisma         # Database schema
```

---

## Disclaimer

BioAge is for **informational purposes only**. It is not medical advice. PhenoAge is a research tool and should not be used to make clinical decisions. Always consult a qualified healthcare professional.

---

## Contributing

Contributions welcome. Key areas:

- Additional biological age algorithms (GrimAge, DunedinPACE)
- Improved organ sub-score models
- Wearable data integrations
- Export formats

Open an issue or PR on GitHub.

---

## License

MIT
