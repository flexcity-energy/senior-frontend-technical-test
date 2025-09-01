import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

// ---------- Utilities ----------
const isIsoDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const clampDate = (s) => (isIsoDate(s) ? s : null);
const pick = (obj, keys) => Object.fromEntries(keys.map((k) => [k, obj[k]]));

function ymd(y, m /* 0-based */, d) {
  // Use UTC to avoid TZ drift
  const dt = new Date(Date.UTC(y, m, d));
  const yyyy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function daysInMonth(y, m /* 0-based */) {
  return new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
}
function dow(y, m, d) {
  // 0=Sunday, 1=Monday, ... 6=Saturday (JS default, using UTC)
  return new Date(Date.UTC(y, m, d)).getUTCDay();
}

// Small deterministic PRNG so the seed is stable across restarts
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seededInt(rng, minIncl, maxIncl) {
  return Math.floor(rng() * (maxIncl - minIncl + 1)) + minIncl;
}

// ---------- In-memory store (seed) ----------
/**
 * Asset:
 * { id, code, contact: { email, phone } }
 */
const assets = [
  {
    id: randomUUID(),
    code: "ASSET-A",
    contact: { email: "a.owner@example.com", phone: "+33 1 23 45 67 01" },
  },
  {
    id: randomUUID(),
    code: "ASSET-B",
    contact: { email: "b.owner@example.com", phone: "+33 1 23 45 67 02" },
  },
  {
    id: randomUUID(),
    code: "ASSET-C",
    contact: { email: "c.owner@example.com", phone: "+33 1 23 45 67 03" },
  },
];

/**
 * Nomination:
 * { id, assetId, date(YYYY-MM-DD), volumeMw, price }
 * Rule: one nomination per (assetId, date)
 */
const nominations = [];

// ---------- SEED: nominations for the whole year (with variable empty days) ----------
(function seedNominationsForYear() {
  const now = new Date();
  const YEAR = now.getUTCFullYear(); // current year

  assets.forEach((asset, assetIdx) => {
    for (let month = 0; month < 12; month++) {
      const dim = daysInMonth(YEAR, month);

      // Deterministic RNG per (year, month, asset)
      const seed = (YEAR * 1000) ^ (month * 37) ^ (assetIdx * 7919);
      const rng = mulberry32(seed >>> 0);

      // --- Choose "empty day" strategy (varies by month/asset) ---
      // 1) Always empty the 1st and last day of the month
      const emptyDays = new Set([1, dim]);

      // 2) Pick a mid-week day (Mon..Fri = 1..5) to leave empty in this month
      // Map to actual dates: choose one occurrence near the middle of month
      const midWeekDow = 1 + seededInt(rng, 0, 4); // 1..5
      const midCandidate = Math.max(2, Math.min(dim - 1, Math.floor(dim / 2)));
      // find the closest day near middle that matches midWeekDow
      let midEmpty = midCandidate;
      let bestDelta = dim; // big
      for (let d = 2; d <= dim - 1; d++) {
        const jsDow = dow(YEAR, month, d); // 0=Sun..6=Sat
        const isoDow = jsDow === 0 ? 7 : jsDow; // 1=Mon..7=Sun
        if (isoDow === midWeekDow) {
          const delta = Math.abs(d - midCandidate);
          if (delta < bestDelta) {
            bestDelta = delta;
            midEmpty = d;
          }
        }
      }
      emptyDays.add(midEmpty);

      // 3) Choose a week index within the month, and leave its first and last day empty
      // Define week as ISO-like: weeks starting on Monday
      // Pick week number 1..5-ish depending on month length
      const approxWeeks = Math.ceil(
        (dim + (new Date(Date.UTC(YEAR, month, 1)).getUTCDay() || 7) - 1) / 7,
      );
      const weekToSkip = Math.max(
        1,
        Math.min(approxWeeks, seededInt(rng, 1, Math.max(2, approxWeeks))),
      );
      // Compute Monday of each week and the corresponding Sunday
      // Find the first Monday in or before day 1
      const day1Dow = dow(YEAR, month, 1) || 7; // 1..7 (Mon..Sun)
      const firstMonday = 1 - (day1Dow - 1); // may be <= 0 (spill into previous month)
      const mondayOfWeek = firstMonday + (weekToSkip - 1) * 7;
      const sundayOfWeek = mondayOfWeek + 6;

      // If within this month, mark them empty
      if (mondayOfWeek >= 1 && mondayOfWeek <= dim) emptyDays.add(mondayOfWeek);
      if (sundayOfWeek >= 1 && sundayOfWeek <= dim) emptyDays.add(sundayOfWeek);

      // 4) One extra random empty day (not fixed) in this month
      const extraEmpty = seededInt(rng, 2, Math.max(2, dim - 1));
      emptyDays.add(extraEmpty);

      // --- Generate nominations on a subset of remaining days (varying pattern) ---
      // Use a "skip frequency" based on seed to avoid fixed cadence
      const cadence = 2 + seededInt(rng, 0, 2); // 2..4
      const offset = seededInt(rng, 0, 2); // 0..2

      for (let d = 1; d <= dim; d++) {
        if (emptyDays.has(d)) continue;
        // Vary inclusion (creates ~1/2 to ~1/3 coverage)
        if ((d + offset) % cadence !== 0) continue;

        const dateStr = ymd(YEAR, month, d);

        // Generate varied volume/price per (month, day, asset)
        const volBase = seededInt(rng, -5, 30); // may be negative
        const vol = volBase + (rng() < 0.3 ? rng() * 2 - 1 : 0); // add small fraction sometimes
        const price = 35 + rng() * 20; // ~35..55

        nominations.push({
          id: randomUUID(),
          assetId: asset.id,
          date: dateStr,
          volumeMw: Math.round(vol * 10) / 10,
          price: Math.round(price * 10) / 10,
        });
      }
    }
  });
})();

// ---------- Validation ----------
function validateAssetInput(input, { isCreate = true } = {}) {
  const errors = [];

  if (isCreate && input.id !== undefined)
    errors.push("id must not be provided on create");
  if (!input || typeof input !== "object")
    errors.push("body must be an object");

  const code = input?.code;
  if (typeof code !== "string" || !code.trim())
    errors.push("code is required (non-empty string)");

  const contact = input?.contact;
  if (!contact || typeof contact !== "object")
    errors.push("contact is required");
  if (!contact?.email || typeof contact.email !== "string")
    errors.push("contact.email is required (string)");
  if (!contact?.phone || typeof contact.phone !== "string")
    errors.push("contact.phone is required (string)");

  return errors;
}

function validateNominationInput(input, { isCreate = true } = {}) {
  const errors = [];

  if (isCreate && input.id !== undefined)
    errors.push("id must not be provided on create");
  if (!input || typeof input !== "object")
    errors.push("body must be an object");

  const assetId = input?.assetId;
  if (typeof assetId !== "string" || !assets.find((a) => a.id === assetId)) {
    errors.push("assetId must reference an existing asset");
  }

  const date = input?.date;
  if (typeof date !== "string" || !isIsoDate(date))
    errors.push('date must be ISO "YYYY-MM-DD"');

  const volumeMw = input?.volumeMw;
  if (typeof volumeMw !== "number" || Number.isNaN(volumeMw))
    errors.push("volumeMw must be a number");

  const price = input?.price;
  if (typeof price !== "number" || Number.isNaN(price))
    errors.push("price must be a number");

  return errors;
}

// ---------- Assets routes ----------
app.get("/assets", (req, res) => {
  res.json(assets);
});

app.post("/assets", (req, res) => {
  const errors = validateAssetInput(req.body, { isCreate: true });
  if (errors.length) return res.status(400).json({ errors });

  const { code } = req.body;
  if (assets.some((a) => a.code === code)) {
    return res.status(409).json({ error: "code must be unique" });
  }

  const asset = {
    id: randomUUID(),
    code: req.body.code.trim(),
    contact: pick(req.body.contact, ["email", "phone"]),
  };
  assets.push(asset);
  res.status(201).json(asset);
});

app.put("/assets/:id", (req, res) => {
  const idx = assets.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "asset not found" });

  const errors = validateAssetInput(req.body, { isCreate: false });
  if (errors.length) return res.status(400).json({ errors });

  const { code } = req.body;
  if (assets.some((a) => a.code === code && a.id !== req.params.id)) {
    return res.status(409).json({ error: "code must be unique" });
  }

  const updated = {
    ...assets[idx],
    code: req.body.code.trim(),
    contact: pick(req.body.contact, ["email", "phone"]),
  };
  assets[idx] = updated;
  res.json(updated);
});

app.delete("/assets/:id", (req, res) => {
  const idx = assets.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "asset not found" });

  // also delete nominations belonging to this asset
  for (let i = nominations.length - 1; i >= 0; i--) {
    if (nominations[i].assetId === req.params.id) nominations.splice(i, 1);
  }

  assets.splice(idx, 1);
  res.status(204).end();
});

// ---------- Nominations routes ----------
/**
 * GET /nominations?assetId=&from=&to=
 * from/to inclusive, YYYY-MM-DD
 */
app.get("/nominations", (req, res) => {
  let result = [...nominations];

  const { assetId, from, to } = req.query;

  if (assetId) {
    result = result.filter((n) => n.assetId === assetId);
  }
  const fromDate = clampDate(from);
  const toDate = clampDate(to);

  if (fromDate) result = result.filter((n) => n.date >= fromDate);
  if (toDate) result = result.filter((n) => n.date <= toDate);

  res.json(result);
});

app.post("/nominations", (req, res) => {
  const errors = validateNominationInput(req.body, { isCreate: true });
  if (errors.length) return res.status(400).json({ errors });

  // uniqueness: (assetId, date)
  if (
    nominations.some(
      (n) => n.assetId === req.body.assetId && n.date === req.body.date,
    )
  ) {
    return res.status(409).json({
      error: "one nomination per asset per day (assetId + date must be unique)",
    });
  }

  const created = {
    id: randomUUID(),
    assetId: req.body.assetId,
    date: req.body.date,
    volumeMw: req.body.volumeMw,
    price: req.body.price,
  };
  nominations.push(created);
  res.status(201).json(created);
});

app.put("/nominations/:id", (req, res) => {
  const idx = nominations.findIndex((n) => n.id === req.params.id);
  if (idx === -1)
    return res.status(404).json({ error: "nomination not found" });

  const errors = validateNominationInput(req.body, { isCreate: false });
  if (errors.length) return res.status(400).json({ errors });

  // enforce uniqueness (assetId, date) excluding current nomination
  if (
    nominations.some(
      (n) =>
        n.id !== req.params.id &&
        n.assetId === req.body.assetId &&
        n.date === req.body.date,
    )
  ) {
    return res.status(409).json({
      error: "one nomination per asset per day (assetId + date must be unique)",
    });
  }

  const updated = {
    ...nominations[idx],
    assetId: req.body.assetId,
    date: req.body.date,
    volumeMw: req.body.volumeMw,
    price: req.body.price,
  };
  nominations[idx] = updated;
  res.json(updated);
});

app.delete("/nominations/:id", (req, res) => {
  const idx = nominations.findIndex((n) => n.id === req.params.id);
  if (idx === -1)
    return res.status(404).json({ error: "nomination not found" });
  nominations.splice(idx, 1);
  res.status(204).end();
});

// ---------- Start ----------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
