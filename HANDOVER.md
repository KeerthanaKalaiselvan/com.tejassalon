# Tejas — design port + go-live checklist

The Tejas identity (Marcellus/Jost, plum-black + gold, cinematic hero loop,
parallax, real studio photography) now runs on the **real** app, so booking,
login, cart, history and admin all work.

---

## ⛔ Blockers before this goes public

These are facts I could not verify. I left each one out rather than guess —
publishing an invented price or wrong opening hour is worse than an omission.

| # | Needed | Where it goes | Why it's blocked |
|---|--------|---------------|------------------|
| 1 | **Real opening hours** (per day) | `frontend/lib/site.ts` → `SITE.hours`, and `openingHoursSpecification` in `app/layout.tsx` | Google publishes only "Closes 9 pm". v1 held two contradictory sets: JSON-LD said Mon–Fri 10:00–21:00 / Sat–Sun 10:00–22:00, while the booking calendar offered 9 AM–11 PM. Both are currently omitted. The booking flow needs real hours. |
| 2 | **Service list + prices** | `backend/prisma/seed.ts` | The old seed had 12 generic services with invented prices (Hair Cut ₹499, Keratin ₹2999, Bridal Makeup ₹3999…). All removed. The 6 that remain are evidenced; each has `priceFrom: 0`, which renders "on enquiry". |
| 3 | **Retail product list + prices** | `backend/prisma/seed.ts` | The 10 products ("Nourish Shampoo" etc.) were invented, and their photos are stock mockups with blank labels — not your shelf. None seeded. The **"What our specialists recommend"** section is built and tested against real data; it currently shows an honest invitation to call. Send me a list and it populates. This is the highest-risk invention — a customer can order against a wrong price. |
| 4 | **WhatsApp number** | `frontend/.env.local` + `backend/.env` | Both hold the placeholder `919999999999`. Booking confirmations go nowhere until this is real. |
| 5 | **Admin credentials** | env at seed time | The old seed hardcoded mobile `9999999999` / `ChangeMe123!`. Removed — see Security below. |

> **Important:** if you already ran the old seed against your Atlas cluster, the
> invented services and products are still **in the database**. Re-running the
> seed updates the 6 real services but does not delete the old rows. Drop the
> `Service` and `Product` collections before reseeding.

---

## Security changes

- **Removed the hardcoded admin.** `prisma/seed.ts` no longer creates
  `9999999999` / `ChangeMe123!`. It now only creates an admin from env, and
  rejects passwords under 12 characters:
  ```bash
  ADMIN_MOBILE=90030xxxxx ADMIN_PASSWORD='<strong password>' npm run prisma:seed
  ```
  Without those vars it skips admin creation and says so.
- `ADMIN_SETUP_KEY` in `backend/.env` is still the literal string
  `change-this-one-time-admin-bootstrap-key`. **Change it.**
- `backend/.env` and `.env.real.bak` are on disk. Confirm they are gitignored
  and that the Atlas password has never been committed.
- `FRONTEND_ORIGIN` is `http://localhost:3000`, but the dev script runs on
  **3070**. CORS will reject the browser in dev until these match.

---

## Bugs found and fixed

1. **Homepage hung for 90s, then 500'd, whenever the API was down.**
   `next: { revalidate: 60 }` makes Next revalidate in the background; that
   fetch is fire-and-forget, so with the API unreachable its rejection surfaced
   as an `unhandledRejection` *outside* `safeFetch`'s try/catch and tore down the
   response stream. Now `cache: "no-store"` with an explicit `AbortController`.
   90s → 23ms.
2. **The hero could render permanently invisible.** The entrance was gated on
   `requestAnimationFrame`, which browsers throttle in background tabs — so the
   content could stay at `opacity: 0`. Entrance is now pure CSS.
3. **~170 light-theme classes** (`bg-white`, `text-navy`, `text-ink/NN`) left
   dark text on the dark ground — invisible buttons and body copy across
   `/book`, `/login`, `/cart`, `/history`, `/admin`.
4. **Horizontal scroll** — decorative glows sit at negative offsets and
   `overflow-x: hidden` on `body` alone doesn't clip while `html` is `visible`.
5. **Prices rendered as "From ₹0"** when unpublished — now "on enquiry".
6. **Hero had no pause control** (WCAG 2.2.2: auto-starting motion over 5s
   needs one). Added, plus the video no longer autoplays under
   `prefers-reduced-motion` — the poster frame stands in.

---

## Removed

- **"Festive Glow Offer — 20% off your first hair color or facial."** An
  invented promotion. `OfferBanner` is no longer mounted. Give me a real offer
  and I'll put it back.
- **Team section** — v1's "team" entries were role labels, not people. The real
  team photograph now carries the About section instead.

---

## Run it

```bash
# backend (needs a reachable MongoDB Atlas URL in backend/.env)
cd backend && npm install && npm run prisma:push && npm run prisma:seed && npm run dev

# frontend
cd frontend && npm install && npm run dev
```

Set `NEXT_PUBLIC_API_URL` to the backend origin and `FRONTEND_ORIGIN` to the
frontend origin — they must agree or CORS blocks every request.

## Where the facts live

`frontend/lib/site.ts` is the single source of truth for address, phone, rating,
geo and the verbatim Google reviews. Every entry there is evidenced. If you add
to it, add the evidence with it.
