// Vercel Serverless Function
// Endpoint: /api/sync-results
// Version 9.0 - football-data.org final
// Uses FOOTBALL_DATA_API_KEY from Vercel Environment Variables.
// Header required by football-data.org: X-Auth-Token.
// This endpoint returns final scores matched to your internal match IDs.
// It does NOT delete players, predictions or results.

const TEAM_ALIASES = {
  MEX: ["Mexico", "México"],
  RSA: ["South Africa", "Sudáfrica"],
  KOR: ["South Korea", "Korea Republic", "Corea del Sur"],
  CZE: ["Czechia", "Czech Republic", "Chequia"],
  CAN: ["Canada", "Canadá"],
  BIH: ["Bosnia and Herzegovina", "Bosnia-Herzegovina", "Bosnia"],
  USA: ["United States", "USA", "United States of America"],
  PAR: ["Paraguay"],
  QAT: ["Qatar"],
  SUI: ["Switzerland", "Suiza"],
  BRA: ["Brazil", "Brasil"],
  MAR: ["Morocco", "Marruecos"],
  HTI: ["Haiti", "Haití"],
  SCO: ["Scotland", "Escocia"],
  AUS: ["Australia"],
  TUR: ["Turkey", "Türkiye", "Turquía"],
  GER: ["Germany", "Alemania"],
  CUW: ["Curacao", "Curaçao"],
  NED: ["Netherlands", "Países Bajos", "Holland"],
  JPN: ["Japan", "Japón"],
  CIV: ["Ivory Coast", "Côte d'Ivoire", "Cote d'Ivoire", "Costa de Marfil"],
  ECU: ["Ecuador"],
  SWE: ["Sweden", "Suecia"],
  TUN: ["Tunisia", "Túnez"],
  ESP: ["Spain", "España"],
  CPV: ["Cape Verde", "Cabo Verde"],
  BEL: ["Belgium", "Bélgica"],
  EGY: ["Egypt", "Egipto"],
  KSA: ["Saudi Arabia", "Saudi Arabia", "Arabia Saudita"],
  URU: ["Uruguay"],
  IRI: ["Iran", "IR Iran", "Irán"],
  NZL: ["New Zealand", "Nueva Zelanda"],
  FRA: ["France", "Francia"],
  SEN: ["Senegal"],
  IRQ: ["Iraq", "Irak"],
  NOR: ["Norway", "Noruega"],
  ARG: ["Argentina"],
  DZA: ["Algeria", "Argelia"],
  AUT: ["Austria"],
  JOR: ["Jordan", "Jordania"],
  POR: ["Portugal"],
  COD: ["DR Congo", "Congo DR", "Congo"],
  ENG: ["England", "Inglaterra"],
  CRO: ["Croatia", "Croacia"],
  GHA: ["Ghana"],
  PAN: ["Panama", "Panamá"],
  UZB: ["Uzbekistan", "Uzbekistán"],
  COL: ["Colombia"]
};

const LOCAL_MATCHES = [
  ["66456904","MEX","RSA","2026-06-11T19:00:00Z"],["66456906","KOR","CZE","2026-06-12T02:00:00Z"],
  ["66456916","CAN","BIH","2026-06-12T19:00:00Z"],["66456940","USA","PAR","2026-06-13T01:00:00Z"],
  ["66456918","QAT","SUI","2026-06-13T19:00:00Z"],["66456928","BRA","MAR","2026-06-13T22:00:00Z"],
  ["66456930","HTI","SCO","2026-06-14T01:00:00Z"],["66456942","AUS","TUR","2026-06-14T04:00:00Z"],
  ["66457070","GER","CUW","2026-06-14T17:00:00Z"],["66456968","NED","JPN","2026-06-14T20:00:00Z"],
  ["66457072","CIV","ECU","2026-06-14T23:00:00Z"],["66456970","SWE","TUN","2026-06-15T02:00:00Z"],
  ["66456994","ESP","CPV","2026-06-15T16:00:00Z"],["66456982","BEL","EGY","2026-06-15T19:00:00Z"],
  ["66456996","KSA","URU","2026-06-15T22:00:00Z"],["66456984","IRI","NZL","2026-06-16T01:00:00Z"],
  ["66457006","FRA","SEN","2026-06-16T19:00:00Z"],["66457008","IRQ","NOR","2026-06-16T22:00:00Z"],
  ["66457018","ARG","DZA","2026-06-17T01:00:00Z"],["66457020","AUT","JOR","2026-06-17T04:00:00Z"],
  ["66457030","POR","COD","2026-06-17T17:00:00Z"],["66457042","ENG","CRO","2026-06-17T20:00:00Z"],
  ["66457044","GHA","PAN","2026-06-17T23:00:00Z"],["66457032","UZB","COL","2026-06-18T02:00:00Z"],
  ["66456910","CZE","RSA","2026-06-18T16:00:00Z"],["66456922","SUI","BIH","2026-06-18T19:00:00Z"],
  ["66456920","CAN","QAT","2026-06-18T22:00:00Z"],["66456908","MEX","KOR","2026-06-19T01:00:00Z"],
  ["66456944","USA","AUS","2026-06-19T19:00:00Z"],["66456934","SCO","MAR","2026-06-19T22:00:00Z"],
  ["66456932","BRA","HTI","2026-06-20T00:30:00Z"],["66456946","TUR","PAR","2026-06-20T03:00:00Z"],
  ["66456972","NED","SWE","2026-06-20T17:00:00Z"],["66457074","GER","CIV","2026-06-20T20:00:00Z"],
  ["66457076","ECU","CUW","2026-06-21T00:00:00Z"],["66456974","TUN","JPN","2026-06-21T04:00:00Z"],
  ["66456998","ESP","KSA","2026-06-21T16:00:00Z"],["66456986","BEL","IRI","2026-06-21T19:00:00Z"],
  ["66457000","URU","CPV","2026-06-21T22:00:00Z"],["66456988","NZL","EGY","2026-06-22T01:00:00Z"],
  ["66457022","ARG","AUT","2026-06-22T17:00:00Z"],["66457010","FRA","IRQ","2026-06-22T21:00:00Z"],
  ["66457012","NOR","SEN","2026-06-23T00:00:00Z"],["66457024","JOR","DZA","2026-06-23T03:00:00Z"],
  ["66457034","POR","UZB","2026-06-23T17:00:00Z"],["66457046","ENG","GHA","2026-06-23T20:00:00Z"],
  ["66457048","PAN","CRO","2026-06-23T23:00:00Z"],["66457036","COL","COD","2026-06-24T02:00:00Z"],
  ["66456924","SUI","CAN","2026-06-24T19:00:00Z"],["66456926","BIH","QAT","2026-06-24T19:00:00Z"],
  ["66456936","SCO","BRA","2026-06-24T22:00:00Z"],["66456938","MAR","HTI","2026-06-24T22:00:00Z"],
  ["66456912","CZE","MEX","2026-06-25T01:00:00Z"],["66456914","RSA","KOR","2026-06-25T01:00:00Z"],
  ["66457078","ECU","GER","2026-06-25T20:00:00Z"],["66457080","CUW","CIV","2026-06-25T20:00:00Z"],
  ["66456976","TUN","NED","2026-06-25T23:00:00Z"],["66456978","JPN","SWE","2026-06-25T23:00:00Z"],
  ["66456948","TUR","USA","2026-06-26T02:00:00Z"],["66456950","PAR","AUS","2026-06-26T02:00:00Z"],
  ["66457014","NOR","FRA","2026-06-26T19:00:00Z"],["66457016","SEN","IRQ","2026-06-26T19:00:00Z"],
  ["66457002","URU","ESP","2026-06-27T00:00:00Z"],["66457004","CPV","KSA","2026-06-27T00:00:00Z"],
  ["66456990","NZL","BEL","2026-06-27T03:00:00Z"],["66456992","EGY","IRI","2026-06-27T03:00:00Z"],
  ["66457050","PAN","ENG","2026-06-27T21:00:00Z"],["66457052","CRO","GHA","2026-06-27T21:00:00Z"],
  ["66457038","COL","POR","2026-06-27T23:30:00Z"],["66457040","COD","UZB","2026-06-27T23:30:00Z"],
  ["66457026","JOR","ARG","2026-06-28T02:00:00Z"],["66457028","DZA","AUT","2026-06-28T02:00:00Z"]
  ["53452545","RSA","CAN","2026-06-28T19:00:00Z"],
  ["53452557","BRA","JPN","2026-06-29T17:00:00Z"],
  ["53452541","GER","TBD","2026-06-29T20:30:00Z"],
  ["53452547","NED","MAR","2026-06-30T01:00:00Z"],
  ["53452561","CIV","TBD","2026-06-30T17:00:00Z"],
  ["53452563","MEX","TBD","2026-07-01T01:00:00Z"],
  ["53452553","USA","BIH","2026-07-02T00:00:00Z"],
  ["53452505","SUI","TBD","2026-07-03T03:00:00Z"],
  ["53452503","AUS","TBD","2026-07-03T18:00:00Z"],
  ["53452569","ARG","TBD","2026-07-03T22:00:00Z"],
].map(([id, homeCode, awayCode, startUtc]) => ({ id, homeCode, awayCode, startUtc }));

// Temporary fallback for already finished test matches. The API remains the first source.
const FALLBACK_RESULTS = [
  ["66456904",2,0],["66456906",2,1],["66456916",1,1],["66456940",4,1],
  ["66456918",1,1],["66456928",1,1],["66456930",0,1],["66456942",2,0],
  ["66457070",7,1],["66456968",2,2],["66457072",1,0],["66456970",5,1],
  ["66456994",0,0],["66456982",1,1],["66456996",1,1],["66456984",2,2]
];

function norm(s) {
  return String(s || "").toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}
function teamMatches(apiName, code) {
  const aliases = TEAM_ALIASES[code] || [code];
  const n = norm(apiName);
  return aliases.some(a => n === norm(a) || n.includes(norm(a)) || norm(a).includes(n));
}
function ymd(date) {
  return date.toISOString().slice(0, 10);
}
function daysBetween(a, b) {
  return Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 86400000;
}
function findLocalMatch(homeName, awayName, utcDate) {
  const candidates = [];
  for (const m of LOCAL_MATCHES) {
    const normal = teamMatches(homeName, m.homeCode) && teamMatches(awayName, m.awayCode);
    const reversed = teamMatches(homeName, m.awayCode) && teamMatches(awayName, m.homeCode);
    if (normal || reversed) {
      const dist = daysBetween(m.startUtc, utcDate);
      if (dist <= 3) candidates.push({ ...m, reversed, dist });
    }
  }
  candidates.sort((a, b) => a.dist - b.dist);
  return candidates[0] || null;
}

async function fetchFootballDataMatches(key, dateFrom, dateTo) {
  const headers = { "X-Auth-Token": key };
  const urls = [
    `https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
    `https://api.football-data.org/v4/competitions/WC/matches?season=2026`
  ];

  const all = [];
  const errors = [];
  for (const url of urls) {
    try {
      const r = await fetch(url, { headers });
      const text = await r.text();
      let data = {};
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
      if (!r.ok) {
        errors.push({ url, status: r.status, message: data.message || text.slice(0, 150) });
        continue;
      }
      if (Array.isArray(data.matches)) all.push(...data.matches);
    } catch (err) {
      errors.push({ url, message: err.message });
    }
  }

  return { matches: all, errors };
}

function convertFootballDataMatch(match) {
  if (!match || match.status !== "FINISHED") return null;

  const homeName = match.homeTeam?.name || match.homeTeam?.shortName || match.homeTeam?.tla;
  const awayName = match.awayTeam?.name || match.awayTeam?.shortName || match.awayTeam?.tla;
  const homeScore = match.score?.fullTime?.home ?? match.score?.regularTime?.home;
  const awayScore = match.score?.fullTime?.away ?? match.score?.regularTime?.away;
  const utcDate = match.utcDate;

  if (homeName == null || awayName == null || homeScore == null || awayScore == null || !utcDate) return null;

  const local = findLocalMatch(homeName, awayName, utcDate);
  if (!local) return null;

  return {
    matchId: local.id,
    home: local.reversed ? Number(awayScore) : Number(homeScore),
    away: local.reversed ? Number(homeScore) : Number(awayScore),
    status: "FT",
    provider: "football-data.org",
    providerFixtureId: match.id || null,
    providerHome: homeName,
    providerAway: awayName,
    fixtureDate: utcDate,
    updatedAt: new Date().toISOString()
  };
}

function fallbackResultsObject() {
  return FALLBACK_RESULTS.map(([matchId, home, away]) => {
    const m = LOCAL_MATCHES.find(x => x.id === matchId);
    return {
      matchId,
      home,
      away,
      status: "FT",
      provider: "fallback-static",
      providerFixtureId: null,
      providerHome: m?.homeCode || "",
      providerAway: m?.awayCode || "",
      fixtureDate: m?.startUtc || "",
      updatedAt: new Date().toISOString()
    };
  });
}

export default async function handler(req, res) {
  try {
    const key = process.env.FOOTBALL_DATA_API_KEY || process.env.FOOTBALL_DATA_KEY || process.env.API_FOOTBALL_KEY;
    const useFallback = String(req.query.fallback || "").toLowerCase() === "1";
    const now = new Date();
    const dateFrom = req.query.dateFrom || ymd(new Date(now.getTime() - 7 * 86400000));
    const dateTo = req.query.dateTo || ymd(new Date(now.getTime() + 2 * 86400000));

    if (!key) {
      return res.status(200).json({
        ok: false,
        provider: "football-data.org",
        message: "Missing FOOTBALL_DATA_API_KEY in Vercel Environment Variables.",
        results: useFallback ? fallbackResultsObject() : []
      });
    }

    const { matches, errors } = await fetchFootballDataMatches(key, dateFrom, dateTo);
    const finals = [];
    const seen = new Set();

    for (const match of matches) {
      const item = convertFootballDataMatch(match);
      if (!item || seen.has(item.matchId)) continue;
      seen.add(item.matchId);
      finals.push(item);
    }

    // If football-data does not expose the World Cup yet on the free token, keep old completed matches working.
    const combined = [...finals];
    for (const fb of fallbackResultsObject()) {
      if (!seen.has(fb.matchId)) combined.push(fb);
    }

    return res.status(200).json({
      ok: true,
      provider: "football-data.org",
      source: "football-data.org + fallback",
      checkedRange: { dateFrom, dateTo },
      apiMatchesFound: matches.length,
      apiResultsMatched: finals.length,
      fallbackAdded: combined.length - finals.length,
      count: combined.length,
      errors,
      results: combined
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      provider: "football-data.org",
      message: err.message,
      results: fallbackResultsObject()
    });
  }
}
