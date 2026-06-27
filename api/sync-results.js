// Version 13.0 - football-data.org live sync
// Returns matched final results for the client to save into Firebase.
// Requires Vercel Environment Variable: FOOTBALL_DATA_API_KEY

const LOCAL_MATCHES = [
  {
    "id": "66457014",
    "homeKey": "Norway",
    "awayKey": "France",
    "start": "2026-06-26T19:00:00Z"
  },
  {
    "id": "66457016",
    "homeKey": "Senegal",
    "awayKey": "Iraq",
    "start": "2026-06-26T19:00:00Z"
  },
  {
    "id": "66457002",
    "homeKey": "Uruguay",
    "awayKey": "Spain",
    "start": "2026-06-27T00:00:00Z"
  },
  {
    "id": "66457004",
    "homeKey": "Cape Verde",
    "awayKey": "Saudi Arabia",
    "start": "2026-06-27T00:00:00Z"
  },
  {
    "id": "66456990",
    "homeKey": "New Zealand",
    "awayKey": "Belgium",
    "start": "2026-06-27T03:00:00Z"
  },
  {
    "id": "66456992",
    "homeKey": "Egypt",
    "awayKey": "Iran",
    "start": "2026-06-27T03:00:00Z"
  },
  {
    "id": "66457050",
    "homeKey": "Panama",
    "awayKey": "England",
    "start": "2026-06-27T21:00:00Z"
  },
  {
    "id": "66457052",
    "homeKey": "Croatia",
    "awayKey": "Ghana",
    "start": "2026-06-27T21:00:00Z"
  },
  {
    "id": "66457038",
    "homeKey": "Colombia",
    "awayKey": "Portugal",
    "start": "2026-06-27T23:30:00Z"
  },
  {
    "id": "66457040",
    "homeKey": "DR Congo",
    "awayKey": "Uzbekistan",
    "start": "2026-06-27T23:30:00Z"
  },
  {
    "id": "66457026",
    "homeKey": "Jordan",
    "awayKey": "Argentina",
    "start": "2026-06-28T02:00:00Z"
  },
  {
    "id": "66457028",
    "homeKey": "Algeria",
    "awayKey": "Austria",
    "start": "2026-06-28T02:00:00Z"
  },
  {
    "id": "53452545",
    "homeKey": "South Africa",
    "awayKey": "Canada",
    "start": "2026-06-28T19:00:00Z"
  },
  {
    "id": "53452557",
    "homeKey": "Brazil",
    "awayKey": "Japan",
    "start": "2026-06-29T17:00:00Z"
  },
  {
    "id": "53452541",
    "homeKey": "Germany",
    "awayKey": "3.º mejor A/B/C/D/F",
    "start": "2026-06-29T20:30:00Z"
  },
  {
    "id": "53452547",
    "homeKey": "Netherlands",
    "awayKey": "Morocco",
    "start": "2026-06-30T01:00:00Z"
  },
  {
    "id": "53452561",
    "homeKey": "Ivory Coast",
    "awayKey": "2.º Grupo I",
    "start": "2026-06-30T17:00:00Z"
  },
  {
    "id": "53452543",
    "homeKey": "1.º Grupo I",
    "awayKey": "3.º mejor C/D/F/G/H",
    "start": "2026-06-30T21:00:00Z"
  },
  {
    "id": "53452563",
    "homeKey": "Mexico",
    "awayKey": "3.º mejor C/E/F/H/I",
    "start": "2026-07-01T01:00:00Z"
  },
  {
    "id": "53452565",
    "homeKey": "1.º Grupo L",
    "awayKey": "3.º mejor E/H/I/J/K",
    "start": "2026-07-01T16:00:00Z"
  },
  {
    "id": "53452555",
    "homeKey": "1.º Grupo G",
    "awayKey": "3.º mejor A/E/H/I/J",
    "start": "2026-07-01T20:00:00Z"
  },
  {
    "id": "53452553",
    "homeKey": "United States",
    "awayKey": "Bosnia and Herzegovina",
    "start": "2026-07-02T00:00:00Z"
  },
  {
    "id": "53452551",
    "homeKey": "1.º Grupo H",
    "awayKey": "2.º Grupo J",
    "start": "2026-07-02T19:00:00Z"
  },
  {
    "id": "53452549",
    "homeKey": "2.º Grupo K",
    "awayKey": "2.º Grupo L",
    "start": "2026-07-02T23:00:00Z"
  },
  {
    "id": "53452505",
    "homeKey": "Switzerland",
    "awayKey": "3.º mejor E/F/G/I/J",
    "start": "2026-07-03T03:00:00Z"
  },
  {
    "id": "53452503",
    "homeKey": "Australia",
    "awayKey": "2.º Grupo G",
    "start": "2026-07-03T18:00:00Z"
  },
  {
    "id": "53452569",
    "homeKey": "Argentina",
    "awayKey": "2.º Grupo H",
    "start": "2026-07-03T22:00:00Z"
  },
  {
    "id": "53452507",
    "homeKey": "1.º Grupo K",
    "awayKey": "3.º mejor D/E/I/J/L",
    "start": "2026-07-04T01:30:00Z"
  },
  {
    "id": "53452511",
    "homeKey": "Ganador RSA-CAN",
    "awayKey": "Ganador NED-MAR",
    "start": "2026-07-04T17:00:00Z"
  },
  {
    "id": "53452509",
    "homeKey": "Ganador GER-3.º",
    "awayKey": "Ganador Grupo I-3.º",
    "start": "2026-07-04T21:00:00Z"
  },
  {
    "id": "53452517",
    "homeKey": "Ganador BRA-JPN",
    "awayKey": "Ganador CIV-2.º I",
    "start": "2026-07-05T17:00:00Z"
  },
  {
    "id": "53452519",
    "homeKey": "Ganador MEX-3.º",
    "awayKey": "Ganador 1.º L-3.º",
    "start": "2026-07-05T21:00:00Z"
  },
  {
    "id": "53452515",
    "homeKey": "Ganador 1.º G-3.º",
    "awayKey": "Ganador USA-BIH",
    "start": "2026-07-06T17:00:00Z"
  },
  {
    "id": "53452513",
    "homeKey": "Ganador 1.º H-2.º J",
    "awayKey": "Ganador 2.º K-2.º L",
    "start": "2026-07-06T21:00:00Z"
  },
  {
    "id": "53452521",
    "homeKey": "Ganador AUS-2.º G",
    "awayKey": "Ganador ARG-2.º H",
    "start": "2026-07-07T17:00:00Z"
  },
  {
    "id": "53452523",
    "homeKey": "Ganador SUI-3.º",
    "awayKey": "Ganador 1.º K-3.º",
    "start": "2026-07-07T21:00:00Z"
  },
  {
    "id": "53452525",
    "homeKey": "Ganador Octavos 1",
    "awayKey": "Ganador Octavos 2",
    "start": "2026-07-09T19:00:00Z"
  },
  {
    "id": "53452527",
    "homeKey": "Ganador Octavos 3",
    "awayKey": "Ganador Octavos 4",
    "start": "2026-07-10T19:00:00Z"
  },
  {
    "id": "53452529",
    "homeKey": "Ganador Octavos 5",
    "awayKey": "Ganador Octavos 6",
    "start": "2026-07-11T19:00:00Z"
  },
  {
    "id": "53452531",
    "homeKey": "Ganador Octavos 7",
    "awayKey": "Ganador Octavos 8",
    "start": "2026-07-12T19:00:00Z"
  },
  {
    "id": "53452533",
    "homeKey": "Ganador Cuartos 1",
    "awayKey": "Ganador Cuartos 2",
    "start": "2026-07-14T19:00:00Z"
  },
  {
    "id": "53452535",
    "homeKey": "Ganador Cuartos 3",
    "awayKey": "Ganador Cuartos 4",
    "start": "2026-07-15T19:00:00Z"
  },
  {
    "id": "53452537",
    "homeKey": "Perdedor Semifinal 1",
    "awayKey": "Perdedor Semifinal 2",
    "start": "2026-07-18T19:00:00Z"
  },
  {
    "id": "53452539",
    "homeKey": "Ganador Semifinal 1",
    "awayKey": "Ganador Semifinal 2",
    "start": "2026-07-19T19:00:00Z"
  }
];

const TEAM_ALIASES = {
  "Norway": ["Norway", "Noruega"],
  "France": ["France", "Francia"],
  "Senegal": ["Senegal"],
  "Iraq": ["Iraq", "Irak"],
  "Uruguay": ["Uruguay"],
  "Spain": ["Spain", "España"],
  "Cape Verde": ["Cape Verde", "Cabo Verde"],
  "Saudi Arabia": ["Saudi Arabia", "Arabia Saudita"],
  "New Zealand": ["New Zealand", "Nueva Zelanda"],
  "Belgium": ["Belgium", "Bélgica"],
  "Egypt": ["Egypt", "Egipto"],
  "Iran": ["Iran", "IR Iran", "Irán"],
  "Panama": ["Panama", "Panamá"],
  "England": ["England", "Inglaterra"],
  "Croatia": ["Croatia", "Croacia"],
  "Ghana": ["Ghana"],
  "Colombia": ["Colombia"],
  "Portugal": ["Portugal"],
  "DR Congo": ["DR Congo", "Congo DR", "Congo"],
  "Uzbekistan": ["Uzbekistan", "Uzbekistán"],
  "Jordan": ["Jordan", "Jordania"],
  "Argentina": ["Argentina"],
  "Algeria": ["Algeria", "Argelia"],
  "Austria": ["Austria"],
  "South Africa": ["South Africa", "Sudáfrica"],
  "Canada": ["Canada", "Canadá"],
  "Brazil": ["Brazil", "Brasil"],
  "Japan": ["Japan", "Japón"],
  "Germany": ["Germany", "Alemania"],
  "Netherlands": ["Netherlands", "Países Bajos", "Holland"],
  "Morocco": ["Morocco", "Marruecos"],
  "Ivory Coast": ["Ivory Coast", "Côte d'Ivoire", "Cote d'Ivoire", "Costa de Marfil"],
  "Mexico": ["Mexico", "México"],
  "United States": ["United States", "USA", "United States of America", "Estados Unidos"],
  "Bosnia and Herzegovina": ["Bosnia and Herzegovina", "Bosnia-Herzegovina", "Bosnia"],
  "Switzerland": ["Switzerland", "Suiza"],
  "Australia": ["Australia"]
};

function norm(s) {
  return String(s || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function isPlaceholder(s) {
  return /Ganador|Perdedor|Grupo|mejor|Octavos|Cuartos|Semifinal|^[123]\.º/i.test(String(s || ""));
}

function teamMatches(apiName, localName) {
  if (!apiName || !localName || isPlaceholder(localName)) return false;
  const n = norm(apiName);
  const aliases = TEAM_ALIASES[localName] || [localName];
  return aliases.some(a => {
    const aa = norm(a);
    return aa && (n === aa || n.includes(aa) || aa.includes(n));
  });
}

function daysBetween(a, b) {
  return Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 86400000;
}

function findLocalMatch(homeName, awayName, utcDate) {
  const candidates = [];
  for (const m of LOCAL_MATCHES) {
    const normal = teamMatches(homeName, m.homeKey) && teamMatches(awayName, m.awayKey);
    const reversed = teamMatches(homeName, m.awayKey) && teamMatches(awayName, m.homeKey);
    if (normal || reversed) {
      const dist = daysBetween(m.start, utcDate);
      if (dist <= 3) candidates.push({...m, reversed, dist});
    }
  }
  candidates.sort((a,b) => a.dist - b.dist);
  return candidates[0] || null;
}

function ymd(d) { return d.toISOString().slice(0, 10); }

async function footballDataFetch(url, token) {
  const r = await fetch(url, { headers: { "X-Auth-Token": token } });
  const text = await r.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!r.ok) throw new Error(data.message || data.error || text.slice(0, 160) || `HTTP ${r.status}`);
  return data;
}

function convertMatch(match) {
  const status = String(match.status || "").toUpperCase();
  if (!["FINISHED", "IN_PLAY", "PAUSED"].includes(status)) return null;

  const homeName = match.homeTeam?.name || match.homeTeam?.shortName || match.homeTeam?.tla;
  const awayName = match.awayTeam?.name || match.awayTeam?.shortName || match.awayTeam?.tla;
  const h = match.score?.fullTime?.home ?? match.score?.regularTime?.home;
  const a = match.score?.fullTime?.away ?? match.score?.regularTime?.away;
  const utcDate = match.utcDate;
  if (!homeName || !awayName || h == null || a == null || !utcDate) return null;

  const local = findLocalMatch(homeName, awayName, utcDate);
  if (!local) return null;

  return {
    matchId: String(local.id),
    home: local.reversed ? Number(a) : Number(h),
    away: local.reversed ? Number(h) : Number(a),
    status: status === "FINISHED" ? "FT" : status,
    provider: "football-data.org",
    providerFixtureId: match.id || null,
    providerHome: homeName,
    providerAway: awayName,
    fixtureDate: utcDate
  };
}

export default async function handler(req, res) {
  try {
    const token = process.env.FOOTBALL_DATA_API_KEY || process.env.FOOTBALL_DATA_KEY;
    if (!token) {
      return res.status(200).json({
        ok: false,
        provider: "football-data.org",
        message: "Falta FOOTBALL_DATA_API_KEY en Vercel.",
        results: []
      });
    }

    const now = new Date();
    const dateFrom = req.query.dateFrom || ymd(new Date(now.getTime() - 10 * 86400000));
    const dateTo = req.query.dateTo || ymd(new Date(now.getTime() + 30 * 86400000));
    const urls = [
      `https://api.football-data.org/v4/competitions/WC/matches?season=2026`,
      `https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`
    ];

    const all = [];
    const errors = [];
    for (const url of urls) {
      try {
        const data = await footballDataFetch(url, token);
        if (Array.isArray(data.matches)) all.push(...data.matches);
      } catch (e) {
        errors.push(e.message);
      }
    }

    const seenProvider = new Set();
    const results = [];
    const seenLocal = new Set();

    for (const raw of all) {
      if (raw.id && seenProvider.has(String(raw.id))) continue;
      if (raw.id) seenProvider.add(String(raw.id));
      const item = convertMatch(raw);
      if (!item || seenLocal.has(item.matchId)) continue;
      seenLocal.add(item.matchId);
      results.push(item);
    }

    return res.status(200).json({
      ok: true,
      provider: "football-data.org",
      checkedRange: { dateFrom, dateTo },
      apiMatchesFound: all.length,
      count: results.length,
      results,
      errors
    });
  } catch (e) {
    return res.status(200).json({
      ok: false,
      provider: "football-data.org",
      message: e.message || "Error desconocido",
      results: []
    });
  }
}
