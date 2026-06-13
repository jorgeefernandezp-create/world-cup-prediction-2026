// Vercel Serverless Function
// Endpoint: /api/sync-results
// Provider: API-FOOTBALL / API-SPORTS
//
// Required Vercel Environment Variables:
// API_FOOTBALL_KEY = your API key
// API_FOOTBALL_LEAGUE_ID = World Cup league id from API-FOOTBALL dashboard
//
// This function returns only final scores. It does not write to Firebase.
// The browser app receives the result and writes it to Firestore.

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
  KSA: ["Saudi Arabia", "Arabia Saudita"],
  URU: ["Uruguay"],
  IRI: ["Iran", "Irán"],
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

const STATIC_MATCHES = [
  ["66456904","MEX","RSA"],["66456906","KOR","CZE"],["66456916","CAN","BIH"],["66456940","USA","PAR"],
  ["66456918","QAT","SUI"],["66456928","BRA","MAR"],["66456930","HTI","SCO"],["66456942","AUS","TUR"],
  ["66457070","GER","CUW"],["66456968","NED","JPN"],["66457072","CIV","ECU"],["66456970","SWE","TUN"],
  ["66456994","ESP","CPV"],["66456982","BEL","EGY"],["66456996","KSA","URU"],["66456984","IRI","NZL"],
  ["66457006","FRA","SEN"],["66457008","IRQ","NOR"],["66457018","ARG","DZA"],["66457020","AUT","JOR"],
  ["66457030","POR","COD"],["66457042","ENG","CRO"],["66457044","GHA","PAN"],["66457032","UZB","COL"],
  ["66456910","CZE","RSA"],["66456922","SUI","BIH"],["66456920","CAN","QAT"],["66456908","MEX","KOR"],
  ["66456944","USA","AUS"],["66456934","SCO","MAR"],["66456932","BRA","HTI"],["66456946","TUR","PAR"],
  ["66456972","NED","SWE"],["66457074","GER","CIV"],["66457076","ECU","CUW"],["66456974","TUN","JPN"],
  ["66456998","ESP","KSA"],["66456986","BEL","IRI"],["66457000","URU","CPV"],["66456988","NZL","EGY"],
  ["66457022","ARG","AUT"],["66457010","FRA","IRQ"],["66457012","NOR","SEN"],["66457024","JOR","DZA"],
  ["66457034","POR","UZB"],["66457046","ENG","GHA"],["66457048","PAN","CRO"],["66457036","COL","COD"],
  ["66456924","SUI","CAN"],["66456926","BIH","QAT"],["66456936","SCO","BRA"],["66456938","MAR","HTI"],
  ["66456912","CZE","MEX"],["66456914","RSA","KOR"],["66457078","ECU","GER"],["66457080","CUW","CIV"],
  ["66456976","TUN","NED"],["66456978","JPN","SWE"],["66456948","TUR","USA"],["66456950","PAR","AUS"],
  ["66457014","NOR","FRA"],["66457016","SEN","IRQ"],["66457002","URU","ESP"],["66457004","CPV","KSA"],
  ["66456990","NZL","BEL"],["66456992","EGY","IRI"],["66457050","PAN","ENG"],["66457052","CRO","GHA"],
  ["66457038","COL","POR"],["66457040","COD","UZB"],["66457026","JOR","ARG"],["66457028","DZA","AUT"]
];

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function teamMatches(apiName, code) {
  const aliases = TEAM_ALIASES[code] || [code];
  const n = norm(apiName);
  return aliases.some(a => n === norm(a) || n.includes(norm(a)) || norm(a).includes(n));
}

function findLocalMatch(homeName, awayName) {
  for (const [id, homeCode, awayCode] of STATIC_MATCHES) {
    if (teamMatches(homeName, homeCode) && teamMatches(awayName, awayCode)) {
      return { id, homeCode, awayCode, reversed: false };
    }
    if (teamMatches(homeName, awayCode) && teamMatches(awayName, homeCode)) {
      return { id, homeCode, awayCode, reversed: true };
    }
  }
  return null;
}

export default async function handler(req, res) {
  try {
    const key = process.env.API_FOOTBALL_KEY;
    const league = process.env.API_FOOTBALL_LEAGUE_ID;
    if (!key || !league) {
      return res.status(200).json({
        ok: false,
        message: "Missing API_FOOTBALL_KEY or API_FOOTBALL_LEAGUE_ID in Vercel Environment Variables.",
        results: []
      });
    }

    const season = process.env.API_FOOTBALL_SEASON || "2026";
    const url = `https://v3.football.api-sports.io/fixtures?league=${league}&season=${season}`;
    const apiRes = await fetch(url, {
      headers: { "x-apisports-key": key }
    });

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ ok: false, message: "API provider error", results: [] });
    }

    const data = await apiRes.json();
    const fixtures = Array.isArray(data.response) ? data.response : [];

    const finals = [];
    for (const f of fixtures) {
      const status = f.fixture?.status?.short || "";
      const isFinal = ["FT", "AET", "PEN"].includes(status);
      if (!isFinal) continue;

      const homeName = f.teams?.home?.name;
      const awayName = f.teams?.away?.name;
      const gh = f.goals?.home;
      const ga = f.goals?.away;
      if (homeName == null || awayName == null || gh == null || ga == null) continue;

      const local = findLocalMatch(homeName, awayName);
      if (!local) continue;

      finals.push({
        matchId: local.id,
        home: local.reversed ? Number(ga) : Number(gh),
        away: local.reversed ? Number(gh) : Number(ga),
        status,
        providerFixtureId: f.fixture?.id || null,
        providerHome: homeName,
        providerAway: awayName,
        updatedAt: new Date().toISOString()
      });
    }

    return res.status(200).json({ ok: true, provider: "api-football", count: finals.length, results: finals });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message, results: [] });
  }
}
