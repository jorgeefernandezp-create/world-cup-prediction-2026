const APP_VERSION = "16.1-best-thirds-resolver-final";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore, collection, serverTimestamp, query, orderBy, onSnapshot,
  doc, setDoc, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  "apiKey": "AIzaSyCT7xdrWuQ-HRxi_MsPgeLVVkyNyGSO4_k",
  "authDomain": "world-cup-prediction-202-c21c7.firebaseapp.com",
  "projectId": "world-cup-prediction-202-c21c7",
  "storageBucket": "world-cup-prediction-202-c21c7.firebasestorage.app",
  "messagingSenderId": "799745348621",
  "appId": "1:799745348621:web:f444420211d86ae1e67144",
  "measurementId": "G-RRB3QSV828"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const JAPAN_TIMEZONE = "Asia/Tokyo";
const MATCHES = [
  {
    "id": "66457014",
    "group": "Grupo I",
    "homeKey": "Norway",
    "awayKey": "France",
    "start": "2026-06-26T19:00:00Z"
  },
  {
    "id": "66457016",
    "group": "Grupo I",
    "homeKey": "Senegal",
    "awayKey": "Iraq",
    "start": "2026-06-26T19:00:00Z"
  },
  {
    "id": "66457002",
    "group": "Grupo H",
    "homeKey": "Uruguay",
    "awayKey": "Spain",
    "start": "2026-06-27T00:00:00Z"
  },
  {
    "id": "66457004",
    "group": "Grupo H",
    "homeKey": "Cape Verde",
    "awayKey": "Saudi Arabia",
    "start": "2026-06-27T00:00:00Z"
  },
  {
    "id": "66456990",
    "group": "Grupo G",
    "homeKey": "New Zealand",
    "awayKey": "Belgium",
    "start": "2026-06-27T03:00:00Z"
  },
  {
    "id": "66456992",
    "group": "Grupo G",
    "homeKey": "Egypt",
    "awayKey": "Iran",
    "start": "2026-06-27T03:00:00Z"
  },
  {
    "id": "66457050",
    "group": "Grupo L",
    "homeKey": "Panama",
    "awayKey": "England",
    "start": "2026-06-27T21:00:00Z"
  },
  {
    "id": "66457052",
    "group": "Grupo L",
    "homeKey": "Croatia",
    "awayKey": "Ghana",
    "start": "2026-06-27T21:00:00Z"
  },
  {
    "id": "66457038",
    "group": "Grupo K",
    "homeKey": "Colombia",
    "awayKey": "Portugal",
    "start": "2026-06-27T23:30:00Z"
  },
  {
    "id": "66457040",
    "group": "Grupo K",
    "homeKey": "DR Congo",
    "awayKey": "Uzbekistan",
    "start": "2026-06-27T23:30:00Z"
  },
  {
    "id": "66457026",
    "group": "Grupo J",
    "homeKey": "Jordan",
    "awayKey": "Argentina",
    "start": "2026-06-28T02:00:00Z"
  },
  {
    "id": "66457028",
    "group": "Grupo J",
    "homeKey": "Algeria",
    "awayKey": "Austria",
    "start": "2026-06-28T02:00:00Z"
  },
  {
    "id": "53452545",
    "group": "Ronda de 32",
    "homeKey": "South Africa",
    "awayKey": "Canada",
    "start": "2026-06-28T19:00:00Z"
  },
  {
    "id": "53452557",
    "group": "Ronda de 32",
    "homeKey": "Brazil",
    "awayKey": "Japan",
    "start": "2026-06-29T17:00:00Z"
  },
  {
    "id": "53452541",
    "group": "Ronda de 32",
    "homeKey": "Germany",
    "awayKey": "Sweden",
    "start": "2026-06-29T20:30:00Z"
  },
  {
    "id": "53452547",
    "group": "Ronda de 32",
    "homeKey": "Netherlands",
    "awayKey": "Morocco",
    "start": "2026-06-30T01:00:00Z"
  },
  {
    "id": "53452561",
    "group": "Ronda de 32",
    "homeKey": "Ivory Coast",
    "awayKey": "Norway",
    "start": "2026-06-30T17:00:00Z"
  },
  {
    "id": "53452543",
    "group": "Ronda de 32",
    "homeKey": "France",
    "awayKey": "Tunisia",
    "start": "2026-06-30T21:00:00Z"
  },
  {
    "id": "53452563",
    "group": "Ronda de 32",
    "homeKey": "Mexico",
    "awayKey": "Saudi Arabia",
    "start": "2026-07-01T01:00:00Z"
  },
  {
    "id": "53452565",
    "group": "Ronda de 32",
    "homeKey": "England",
    "awayKey": "Austria",
    "start": "2026-07-01T16:00:00Z"
  },
  {
    "id": "53452555",
    "group": "Ronda de 32",
    "homeKey": "Belgium",
    "awayKey": "Uruguay",
    "start": "2026-07-01T20:00:00Z"
  },
  {
    "id": "53452553",
    "group": "Ronda de 32",
    "homeKey": "United States",
    "awayKey": "Bosnia and Herzegovina",
    "start": "2026-07-02T00:00:00Z"
  },
  {
    "id": "53452551",
    "group": "Ronda de 32",
    "homeKey": "Spain",
    "awayKey": "Austria",
    "start": "2026-07-02T19:00:00Z"
  },
  {
    "id": "53452549",
    "group": "Ronda de 32",
    "homeKey": "Colombia",
    "awayKey": "Croatia",
    "start": "2026-07-02T23:00:00Z"
  },
  {
    "id": "53452505",
    "group": "Ronda de 32",
    "homeKey": "Switzerland",
    "awayKey": "Algeria",
    "start": "2026-07-03T03:00:00Z"
  },
  {
    "id": "53452503",
    "group": "Ronda de 32",
    "homeKey": "Australia",
    "awayKey": "Egypt",
    "start": "2026-07-03T18:00:00Z"
  },
  {
    "id": "53452569",
    "group": "Ronda de 32",
    "homeKey": "Argentina",
    "awayKey": "Cape Verde",
    "start": "2026-07-03T22:00:00Z"
  },
  {
    "id": "53452507",
    "group": "Ronda de 32",
    "homeKey": "Portugal",
    "awayKey": "Croatia",
    "start": "2026-07-04T01:30:00Z"
  },
  {
    "id": "53452511",
    "group": "Octavos",
    "homeKey": "Ganador RSA-CAN",
    "awayKey": "Ganador NED-MAR",
    "start": "2026-07-04T17:00:00Z"
  },
  {
    "id": "53452509",
    "group": "Octavos",
    "homeKey": "Ganador GER-3.º",
    "awayKey": "Ganador Grupo I-3.º",
    "start": "2026-07-04T21:00:00Z"
  },
  {
    "id": "53452517",
    "group": "Octavos",
    "homeKey": "Ganador BRA-JPN",
    "awayKey": "Ganador CIV-2.º I",
    "start": "2026-07-05T17:00:00Z"
  },
  {
    "id": "53452519",
    "group": "Octavos",
    "homeKey": "Ganador MEX-3.º",
    "awayKey": "Ganador 1.º L-3.º",
    "start": "2026-07-05T21:00:00Z"
  },
  {
    "id": "53452515",
    "group": "Octavos",
    "homeKey": "Ganador 1.º G-3.º",
    "awayKey": "Ganador USA-BIH",
    "start": "2026-07-06T17:00:00Z"
  },
  {
    "id": "53452513",
    "group": "Octavos",
    "homeKey": "Ganador 1.º H-2.º J",
    "awayKey": "Ganador 2.º K-2.º L",
    "start": "2026-07-06T21:00:00Z"
  },
  {
    "id": "53452521",
    "group": "Octavos",
    "homeKey": "Ganador AUS-2.º G",
    "awayKey": "Ganador ARG-2.º H",
    "start": "2026-07-07T17:00:00Z"
  },
  {
    "id": "53452523",
    "group": "Octavos",
    "homeKey": "Ganador SUI-3.º",
    "awayKey": "Ganador 1.º K-3.º",
    "start": "2026-07-07T21:00:00Z"
  },
  {
    "id": "53452525",
    "group": "Cuartos",
    "homeKey": "Ganador Octavos 1",
    "awayKey": "Ganador Octavos 2",
    "start": "2026-07-09T19:00:00Z"
  },
  {
    "id": "53452527",
    "group": "Cuartos",
    "homeKey": "Ganador Octavos 3",
    "awayKey": "Ganador Octavos 4",
    "start": "2026-07-10T19:00:00Z"
  },
  {
    "id": "53452529",
    "group": "Cuartos",
    "homeKey": "Ganador Octavos 5",
    "awayKey": "Ganador Octavos 6",
    "start": "2026-07-11T19:00:00Z"
  },
  {
    "id": "53452531",
    "group": "Cuartos",
    "homeKey": "Ganador Octavos 7",
    "awayKey": "Ganador Octavos 8",
    "start": "2026-07-12T19:00:00Z"
  },
  {
    "id": "53452533",
    "group": "Semifinal",
    "homeKey": "Ganador Cuartos 1",
    "awayKey": "Ganador Cuartos 2",
    "start": "2026-07-14T19:00:00Z"
  },
  {
    "id": "53452535",
    "group": "Semifinal",
    "homeKey": "Ganador Cuartos 3",
    "awayKey": "Ganador Cuartos 4",
    "start": "2026-07-15T19:00:00Z"
  },
  {
    "id": "53452537",
    "group": "Tercer puesto",
    "homeKey": "Perdedor Semifinal 1",
    "awayKey": "Perdedor Semifinal 2",
    "start": "2026-07-18T19:00:00Z"
  },
  {
    "id": "53452539",
    "group": "Final",
    "homeKey": "Ganador Semifinal 1",
    "awayKey": "Ganador Semifinal 2",
    "start": "2026-07-19T19:00:00Z"
  }
];

const TEAM_ES = {
  "Norway":"Noruega", "France":"Francia", "Senegal":"Senegal", "Iraq":"Irak",
  "Uruguay":"Uruguay", "Spain":"España", "Cape Verde":"Cabo Verde", "Saudi Arabia":"Arabia Saudita",
  "New Zealand":"Nueva Zelanda", "Belgium":"Bélgica", "Egypt":"Egipto", "Iran":"Irán",
  "Panama":"Panamá", "England":"Inglaterra", "Croatia":"Croacia", "Ghana":"Ghana",
  "Colombia":"Colombia", "Portugal":"Portugal", "DR Congo":"RD Congo", "Uzbekistan":"Uzbekistán",
  "Jordan":"Jordania", "Argentina":"Argentina", "Algeria":"Argelia", "Austria":"Austria",
  "South Africa":"Sudáfrica", "Canada":"Canadá", "Brazil":"Brasil", "Japan":"Japón",
  "Germany":"Alemania", "Netherlands":"Países Bajos", "Morocco":"Marruecos",
  "Ivory Coast":"Costa de Marfil", "Mexico":"México", "United States":"Estados Unidos",
  "Bosnia and Herzegovina":"Bosnia y Herzegovina", "Switzerland":"Suiza", "Australia":"Australia"
,
  "Sweden":"Suecia",
  "Tunisia":"Túnez",
};

const TEAM_FLAGS = {
  "Norway":"🇳🇴", "France":"🇫🇷", "Senegal":"🇸🇳", "Iraq":"🇮🇶",
  "Uruguay":"🇺🇾", "Spain":"🇪🇸", "Cape Verde":"🇨🇻", "Saudi Arabia":"🇸🇦",
  "New Zealand":"🇳🇿", "Belgium":"🇧🇪", "Egypt":"🇪🇬", "Iran":"🇮🇷",
  "Panama":"🇵🇦", "England":"🏴", "Croatia":"🇭🇷", "Ghana":"🇬🇭",
  "Colombia":"🇨🇴", "Portugal":"🇵🇹", "DR Congo":"🇨🇩", "Uzbekistan":"🇺🇿",
  "Jordan":"🇯🇴", "Argentina":"🇦🇷", "Algeria":"🇩🇿", "Austria":"🇦🇹",
  "South Africa":"🇿🇦", "Canada":"🇨🇦", "Brazil":"🇧🇷", "Japan":"🇯🇵",
  "Germany":"🇩🇪", "Netherlands":"🇳🇱", "Morocco":"🇲🇦",
  "Ivory Coast":"🇨🇮", "Mexico":"🇲🇽", "United States":"🇺🇸",
  "Bosnia and Herzegovina":"🇧🇦", "Switzerland":"🇨🇭", "Australia":"🇦🇺"
,
  "3.º mejor A/B/C/D/F":"🏆",
  "3.º mejor C/D/F/G/H":"🏆",
  "3.º mejor C/E/F/H/I":"🏆",
  "3.º mejor E/H/I/J/K":"🏆",
  "3.º mejor A/E/H/I/J":"🏆",
  "3.º mejor E/F/G/I/J":"🏆",
  "3.º mejor D/E/I/J/L":"🏆",
  "1.º Grupo L":"🏆",
  "1.º Grupo G":"🏆",
  "1.º Grupo H":"🏆",
  "1.º Grupo K":"🏆",
  "2.º Grupo J":"🥈",
  "2.º Grupo K":"🥈",
  "2.º Grupo L":"🥈",
  "2.º Grupo G":"🥈",
  "2.º Grupo H":"🥈",
,
  "Sweden":"🇸🇪",
  "Tunisia":"🇹🇳",
};

let currentPlayerName = localStorage.getItem("playerName") || "";
let selectedDayKey = localStorage.getItem("selectedDayKey") || "";
let selectedMatchId = localStorage.getItem("selectedMatchId") || "";
let predictionsCache = [];
let resultsCache = {};
let stakeAmount = 100;
let participantsOpen = false;
let currentLang = "es";
let localDraftScores = {};
let countdownIntervalStarted = false;

function $(id) { return document.getElementById(id); }
function jstDateKey(iso) { return new Date(iso).toLocaleDateString("sv-SE", { timeZone: JAPAN_TIMEZONE }); }
function dateShort(iso) { return new Date(iso).toLocaleDateString("es-ES", { weekday:"short", day:"2-digit", month:"short", timeZone:JAPAN_TIMEZONE }).replace(".",""); }
function timeJst(iso) { return new Date(iso).toLocaleTimeString("es-ES", { hour:"2-digit", minute:"2-digit", hour12:false, timeZone:JAPAN_TIMEZONE }); }
function dateLong(iso) { return new Date(iso).toLocaleDateString("es-ES", { weekday:"long", day:"numeric", month:"long", year:"numeric", timeZone:JAPAN_TIMEZONE }); }
function safeId(name) { return String(name).toLowerCase().trim().replace(/[^a-z0-9áéíóúñãõç一-龯ぁ-んァ-ン]/gi, "_"); }
function teamName(k) { return TEAM_ES[k] || k || "Por definir"; }
function isPlaceholder(k) { return /Ganador|Perdedor|Grupo|mejor|Octavos|Cuartos|Semifinal|^[123]\.º/i.test(String(k||"")); }
function teamDisplay(k) { return isPlaceholder(k) ? k : teamName(k); }

function flagFor(k) { return TEAM_FLAGS[k] || (isPlaceholder(k) ? "🏆" : "🏳️"); }
function msToCountdown(ms) {
  if (ms <= 0) return "00d 00h 00m 00s";
  const total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${d}d ${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
}
function isMatchLocked(match) {
  return Date.now() >= new Date(match.start).getTime() || !!resultFor(match.id);
}
function countdownText(match) {
  const diff = new Date(match.start).getTime() - Date.now();
  if (diff <= 0) return "🔒 Apuesta cerrada";
  return `Cierra en ${msToCountdown(diff)}`;
}
function teamWithFlag(k) {
  return `${flagFor(k)} ${teamDisplay(k)}`;
}


function resultFor(matchId) {
  const r = resultsCache[String(matchId)];
  if (!r) return null;
  if (r.home === null || r.home === undefined || r.away === null || r.away === undefined) return null;
  return { home: Number(r.home), away: Number(r.away) };
}

function scorePoints(pred, res) {
  if (!res) return 0;
  const ph = Number(pred.predictedHome), pa = Number(pred.predictedAway);
  if (ph === res.home && pa === res.away) return 5;
  const predSign = Math.sign(ph - pa);
  const realSign = Math.sign(res.home - res.away);
  return predSign === realSign ? 3 : 0;
}


// ===== V15: MOTOR DE CRUCES ELIMINATORIOS =====
// No toca API ni Firebase. Usa los resultados ya guardados en resultsCache.
// Cada vez que Firebase trae un resultado final, el ganador se coloca en su siguiente partido.
const KNOCKOUT_ADVANCE_MAP = {
  // Ronda de 32 -> Octavos
  "53452545": { nextMatchId: "53452511", slot: "home" },
  "53452547": { nextMatchId: "53452511", slot: "away" },
  "53452541": { nextMatchId: "53452509", slot: "home" },
  "53452543": { nextMatchId: "53452509", slot: "away" },
  "53452557": { nextMatchId: "53452517", slot: "home" },
  "53452561": { nextMatchId: "53452517", slot: "away" },
  "53452563": { nextMatchId: "53452519", slot: "home" },
  "53452565": { nextMatchId: "53452519", slot: "away" },
  "53452555": { nextMatchId: "53452515", slot: "home" },
  "53452553": { nextMatchId: "53452515", slot: "away" },
  "53452551": { nextMatchId: "53452513", slot: "home" },
  "53452549": { nextMatchId: "53452513", slot: "away" },
  "53452503": { nextMatchId: "53452521", slot: "home" },
  "53452569": { nextMatchId: "53452521", slot: "away" },
  "53452505": { nextMatchId: "53452523", slot: "home" },
  "53452507": { nextMatchId: "53452523", slot: "away" },

  // Octavos -> Cuartos
  "53452511": { nextMatchId: "53452525", slot: "home" },
  "53452509": { nextMatchId: "53452525", slot: "away" },
  "53452517": { nextMatchId: "53452527", slot: "home" },
  "53452519": { nextMatchId: "53452527", slot: "away" },
  "53452515": { nextMatchId: "53452529", slot: "home" },
  "53452513": { nextMatchId: "53452529", slot: "away" },
  "53452521": { nextMatchId: "53452531", slot: "home" },
  "53452523": { nextMatchId: "53452531", slot: "away" },

  // Cuartos -> Semifinal
  "53452525": { nextMatchId: "53452533", slot: "home" },
  "53452527": { nextMatchId: "53452533", slot: "away" },
  "53452529": { nextMatchId: "53452535", slot: "home" },
  "53452531": { nextMatchId: "53452535", slot: "away" },

  // Semifinal -> Final
  "53452533": { nextMatchId: "53452539", slot: "home", loserMatchId: "53452537", loserSlot: "home" },
  "53452535": { nextMatchId: "53452539", slot: "away", loserMatchId: "53452537", loserSlot: "away" }
};

function rememberOriginalTeams() {
  MATCHES.forEach(m => {
    if (!m.originalHomeKey) m.originalHomeKey = m.homeKey;
    if (!m.originalAwayKey) m.originalAwayKey = m.awayKey;
  });
}

function resetDynamicTeams() {
  MATCHES.forEach(m => {
    if (m.originalHomeKey) m.homeKey = m.originalHomeKey;
    if (m.originalAwayKey) m.awayKey = m.originalAwayKey;
  });
}

function winnerLoserForMatch(match) {
  const res = resultFor(match.id);
  if (!res) return null;
  if (Number(res.home) > Number(res.away)) {
    return { winner: match.homeKey, loser: match.awayKey };
  }
  if (Number(res.away) > Number(res.home)) {
    return { winner: match.awayKey, loser: match.homeKey };
  }
  // Si hay empate en eliminatoria, normalmente football-data puede traer penales.
  // Si no hay penales todavía, no se avanza para evitar error.
  const raw = resultsCache[String(match.id)] || {};
  const homePens = raw.homePenalty ?? raw.homePenalties ?? raw.penaltyHome;
  const awayPens = raw.awayPenalty ?? raw.awayPenalties ?? raw.penaltyAway;
  if (homePens != null && awayPens != null) {
    if (Number(homePens) > Number(awayPens)) return { winner: match.homeKey, loser: match.awayKey };
    if (Number(awayPens) > Number(homePens)) return { winner: match.awayKey, loser: match.homeKey };
  }
  return null;
}

function setTeamInMatch(matchId, slot, teamKey) {
  if (!teamKey || isPlaceholder(teamKey)) return false;
  const target = MATCHES.find(m => String(m.id) === String(matchId));
  if (!target) return false;
  if (slot === "home" && target.homeKey !== teamKey) {
    target.homeKey = teamKey;
    return true;
  }
  if (slot === "away" && target.awayKey !== teamKey) {
    target.awayKey = teamKey;
    return true;
  }
  return false;
}

function applyKnockoutCrossings() {
  rememberOriginalTeams();
  resetDynamicTeams();
  applyBestThirdResolvers();

  let changed = true;
  let loops = 0;
  while (changed && loops < 10) {
    changed = false;
    loops++;

    Object.entries(KNOCKOUT_ADVANCE_MAP).forEach(([sourceId, edge]) => {
      const source = MATCHES.find(m => String(m.id) === String(sourceId));
      if (!source) return;

      const wl = winnerLoserForMatch(source);
      if (!wl || !wl.winner) return;

      if (setTeamInMatch(edge.nextMatchId, edge.slot, wl.winner)) changed = true;

      if (edge.loserMatchId && wl.loser) {
        if (setTeamInMatch(edge.loserMatchId, edge.loserSlot, wl.loser)) changed = true;
      }
    });
  }
}

function knockoutStatusText() {
  const updated = Object.entries(KNOCKOUT_ADVANCE_MAP).filter(([sourceId, edge]) => {
    const source = MATCHES.find(m => String(m.id) === String(sourceId));
    if (!source) return false;
    return !!winnerLoserForMatch(source);
  }).length;
  return `${updated} cruces aplicados`;
}


// ===== V16: SOLO ELIMINATORIAS PENDIENTES =====
const KNOCKOUT_ROUNDS = ["Ronda de 32","Octavos","Cuartos","Semifinal","Tercer puesto","Final"];
function isKnockoutMatch(m) {
  return KNOCKOUT_ROUNDS.includes(m.group || m.roundName || "");
}
function isMatchFinishedOrStarted(m) {
  return Date.now() >= new Date(m.start).getTime() || !!resultFor(m.id);
}
function visibleActiveMatches() {
  applyKnockoutCrossings();
  return MATCHES
    .filter(m => isKnockoutMatch(m))
    .filter(m => !isMatchFinishedOrStarted(m))
    .sort((a,b) => new Date(a.start) - new Date(b.start));
}
function allKnockoutMatches() {
  return MATCHES.filter(m => isKnockoutMatch(m)).sort((a,b)=>new Date(a.start)-new Date(b.start));
}
function firstActiveMatch() {
  return visibleActiveMatches()[0] || allKnockoutMatches()[0] || MATCHES[0];
}


// ===== V16.1: RESOLVER DE MEJORES TERCEROS / PLACEHOLDERS =====
// Convierte textos como "3.º mejor A/B/C/D/F" en equipos reales cuando ya están definidos.
// Si alguna plaza aún no está confirmada, se deja el texto genérico hasta que se actualice.
const BEST_THIRD_RESOLVER = {
  "3.º mejor A/B/C/D/F": "Sweden",
  "3.º mejor C/D/F/G/H": "Tunisia",
  "3.º mejor C/E/F/H/I": "Saudi Arabia",
  "3.º mejor E/H/I/J/K": "Austria",
  "3.º mejor A/E/H/I/J": "Uruguay",
  "3.º mejor E/F/G/I/J": "Algeria",
  "3.º mejor D/E/I/J/L": "Croatia",

  "1.º Grupo G": "Belgium",
  "2.º Grupo G": "Egypt",
  "1.º Grupo H": "Spain",
  "2.º Grupo H": "Cape Verde",
  "1.º Grupo I": "France",
  "2.º Grupo I": "Norway",
  "1.º Grupo J": "Argentina",
  "2.º Grupo J": "Austria",
  "1.º Grupo K": "Portugal",
  "2.º Grupo K": "Colombia",
  "1.º Grupo L": "England",
  "2.º Grupo L": "Croatia"
};

function resolveStaticPlaceholderTeam(teamKey) {
  const key = String(teamKey || "");
  return BEST_THIRD_RESOLVER[key] || key;
}

function applyBestThirdResolvers() {
  rememberOriginalTeams?.();
  MATCHES.forEach(m => {
    if (!m.originalHomeKey) m.originalHomeKey = m.homeKey;
    if (!m.originalAwayKey) m.originalAwayKey = m.awayKey;

    const h = resolveStaticPlaceholderTeam(m.homeKey);
    const a = resolveStaticPlaceholderTeam(m.awayKey);
    if (h !== m.homeKey) m.homeKey = h;
    if (a !== m.awayKey) m.awayKey = a;
  });
}

function groupsByDate() {
  const g = {};
  visibleActiveMatches().forEach(m => {
    const k = jstDateKey(m.start);
    (g[k] ||= []).push(m);
  });
  return g;
}

function ensureSelection() {
  const groups = groupsByDate();
  const keys = Object.keys(groups).sort();
  if (!keys.length) return;
  if (!selectedDayKey || !groups[selectedDayKey]) selectedDayKey = keys[0];
  const currentVisible = (groups[selectedDayKey] || []).find(m => String(m.id) === String(selectedMatchId));
  if (!selectedMatchId || !currentVisible) {
    selectedMatchId = groups[selectedDayKey][0].id;
  }
  localStorage.setItem("selectedDayKey", selectedDayKey);
  localStorage.setItem("selectedMatchId", selectedMatchId);
}

function selectedMatch() {
  ensureSelection();
  const active = visibleActiveMatches();
  return active.find(m => String(m.id) === String(selectedMatchId)) || firstActiveMatch();
}

function renderTabs() {
  const groups = groupsByDate();
  const keys = Object.keys(groups).sort();
  $("dateTabs").innerHTML = keys.map(k => {
    const first = groups[k][0];
    return `<button class="${k === selectedDayKey ? "active-date" : ""}" onclick="selectDateTab('${k}')">
      <span class="tab-day">${dateShort(first.start).split(" ")[0]}</span>
      <span class="tab-date">${dateShort(first.start).replace(/^\S+ /,"")}</span>
      <span class="tab-count">${groups[k].length} partidos</span>
    </button>`;
  }).join("");

  const list = groups[selectedDayKey] || [];
  $("matchTabs").innerHTML = list.map(m => {
    const r = resultFor(m.id);
    const score = r ? ` · FT ${r.home}-${r.away}` : "";
    const status = r ? "Finalizado" : (isMatchLocked(m) ? "Apuesta cerrada" : countdownText(m));
    return `<button class="${String(m.id) === String(selectedMatchId) ? "active-match" : ""}" onclick="selectMatchTab('${m.id}')">
      ${timeJst(m.start)}<br>${teamWithFlag(m.homeKey)} vs ${teamWithFlag(m.awayKey)}${score}<br><small data-countdown-match="${m.id}">${status}</small>
    </button>`;
  }).join("");
}

function renderSelectedMatch() {
  const m = selectedMatch();
  const r = resultFor(m.id);
  const locked = isMatchLocked(m);
  const saved = currentPredictionFor(m.id);
  const draft = localDraftScores[String(m.id)] || null;
  $("selectedMatchBox").innerHTML = `
    <div class="selected-match">
      <div class="teams-line">${teamWithFlag(m.homeKey)} vs ${teamWithFlag(m.awayKey)}</div>
      <div class="match-meta">📅 ${dateLong(m.start)} · 🕒 ${timeJst(m.start)} JST<br>${m.group}</div>
      ${r ? `<span class="result-badge">Resultado final: ${r.home} - ${r.away}</span>` : `<div id="selectedCountdown" class="countdown">${countdownText(m)}</div>`}
      ${locked ? `<div class="locked">🔒 Apuesta cerrada</div>` : `<div class="score"><input id="selected_home" type="number" inputmode="numeric" pattern="[0-9]*" min="0" placeholder="0" autocomplete="off" oninput="saveDraftScore()" autocomplete="off" oninput="saveDraftScore()" value="${draft ? draft.home : (saved ? saved.predictedHome : "")}"><span>-</span><input id="selected_away" type="number" inputmode="numeric" pattern="[0-9]*" min="0" placeholder="0" autocomplete="off" oninput="saveDraftScore()" autocomplete="off" oninput="saveDraftScore()" value="${draft ? draft.away : (saved ? saved.predictedAway : "")}"></div>`}
    </div>`;
}

function currentPredictionFor(matchId) {
  if (!currentPlayerName) return null;
  const pid = safeId(currentPlayerName);
  return predictionsCache.find(p => p.playerId === pid && String(p.matchId) === String(matchId)) || null;
}

function renderRanking() {
  const m = selectedMatch();
  const preds = predictionsCache.filter(p => String(p.matchId) === String(m.id));
  const res = resultFor(m.id);
  const ranked = preds.map(p => ({...p, points: scorePoints(p, res)})).sort((a,b) => b.points - a.points || String(a.playerName).localeCompare(String(b.playerName)));
  $("potBox").textContent = `¥${preds.length * stakeAmount}`;
  $("matchParticipantsSummary").textContent = `${preds.length} participantes`;
  const plist = $("matchParticipantsList");
  if (plist) {
    plist.style.display = participantsOpen ? "block" : "none";
    plist.innerHTML = preds.length
      ? preds.map(p => `<div class="participant-row">${p.playerName}: ${p.predictedHome}-${p.predictedAway}</div>`).join("")
      : `<div class="participant-row">Aún no hay participantes para este partido.</div>`;
  }
  if (!res) {
    $("winnerBox").textContent = "Aún no hay resultado final.";
  } else {
    const winners = ranked.filter(p => p.points === ranked[0]?.points && p.points > 0);
    $("winnerBox").innerHTML = winners.length ? `🏆 ${winners.map(w => w.playerName).join(", ")}` : "Sin ganador con puntos.";
  }
  $("matchRankingBody").innerHTML = ranked.map((p,i) => `<tr><td>${i+1}</td><td>${p.playerName}</td><td>${p.predictedHome} - ${p.predictedAway}</td><td>${p.points}</td></tr>`).join("");
}

function renderFullCalendar() {}


function isScoreInputFocused() {
  const a = document.activeElement;
  return a && (a.id === "selected_home" || a.id === "selected_away");
}
function updateCountdownOnly() {
  const m = selectedMatch();
  const el = document.getElementById("selectedCountdown");
  if (el && m && !resultFor(m.id)) el.textContent = countdownText(m);
  document.querySelectorAll("[data-countdown-match]").forEach(node => {
    const id = node.getAttribute("data-countdown-match");
    const mm = MATCHES.find(x => String(x.id) === String(id));
    if (!mm) return;
    const r = resultFor(mm.id);
    node.textContent = r ? "Finalizado" : (isMatchLocked(mm) ? "Apuesta cerrada" : countdownText(mm));
  });
  if (m && isMatchLocked(m) && !isScoreInputFocused()) {
    const home = document.getElementById("selected_home");
    const away = document.getElementById("selected_away");
    if (home || away) renderSelectedMatch();
  }
}

function renderAll() {
  applyKnockoutCrossings();
  applyBestThirdResolvers();
  ensureSelection();
  renderTabs();
  renderSelectedMatch();
  renderRanking();
  
  const ds = $("dataStatus");
  if (ds) ds.textContent = `✅ Calendario cargado con cuenta regresiva: ${MATCHES.length} partidos · v16.1`;
  $("welcomeText").textContent = currentPlayerName ? `Bienvenido, ${currentPlayerName}!` : "";
}

window.setLang = function(lang) {
  currentLang = lang;
  document.querySelectorAll(".langs button").forEach(b => b.classList.remove("active"));
  const b = $("btn-" + lang); if (b) b.classList.add("active");
  renderAll();
};

window.enterGame = async function() {
  const name = $("playerName").value.trim();
  if (!name) { $("saveStatus").textContent = "⚠️ Primero ingresa tu nombre."; return; }
  currentPlayerName = name;
  localStorage.setItem("playerName", name);
  await setDoc(doc(db, "players", safeId(name)), { name, language: currentLang, updatedAt: serverTimestamp() }, { merge: true });
  $("saveStatus").textContent = "✅ Participante guardado.";
  $("playerName").value = "";
  renderAll();
};

window.selectDateTab = function(dayKey) {
  selectedDayKey = dayKey;
  const first = groupsByDate()[dayKey]?.[0];
  if (first) selectedMatchId = first.id;
  localStorage.setItem("selectedDayKey", selectedDayKey);
  localStorage.setItem("selectedMatchId", selectedMatchId);
  renderAll();
};

window.selectMatchTab = function(id) {
  selectedMatchId = id;
  localStorage.setItem("selectedMatchId", selectedMatchId);
  renderAll();
};


window.saveDraftScore = function() {
  const m = selectedMatch();
  const h = document.getElementById("selected_home")?.value ?? "";
  const a = document.getElementById("selected_away")?.value ?? "";
  if (m) localDraftScores[String(m.id)] = { home: h, away: a };
};

window.saveSelectedPrediction = async function() {
  const m = selectedMatch();
  if (!currentPlayerName) { $("predictionStatus").textContent = "⚠️ Primero ingresa tu nombre."; return; }
  if (isMatchLocked(m)) { $("predictionStatus").textContent = "🔒 La apuesta ya está cerrada para este partido."; return; }
  const h = $("selected_home")?.value;
  const a = $("selected_away")?.value;
  if (h === undefined || a === undefined) { $("predictionStatus").textContent = "🔒 Este partido está cerrado."; return; }
  if (h === "" || a === "") { $("predictionStatus").textContent = "⚠️ Completa el marcador."; return; }
  const playerId = safeId(currentPlayerName);
  await setDoc(doc(db, "predictions", `${playerId}_${m.id}`), {
    playerId, playerName: currentPlayerName, matchId: m.id, homeKey: m.homeKey, awayKey: m.awayKey,
    predictedHome: Number(h), predictedAway: Number(a), updatedAt: serverTimestamp()
  }, { merge: true });
  delete localDraftScores[String(m.id)];
  $("predictionStatus").textContent = "✅ Pronóstico guardado.";
};

window.toggleParticipants = function() {
  participantsOpen = !participantsOpen;
  const list = document.getElementById("matchParticipantsList");
  if (list) list.style.display = participantsOpen ? "block" : "none";
  renderRanking();
};

window.syncResultsFromApi = async function() {
  const ds = $("dataStatus");
  const adminStatus = $("adminStatus");
  try {
    if (ds) ds.textContent = "⏳ Sincronizando resultados con football-data...";
    const r = await fetch("/api/sync-results?v=130", { cache: "no-store" });
    const data = await r.json();
    if (!data.ok) {
      const msg = data.message || "API respondió sin resultados.";
      if (ds) ds.textContent = `⚠️ ${msg}`;
      if (adminStatus) adminStatus.textContent = `⚠️ ${msg}`;
      return;
    }

    let saved = 0;
    for (const item of data.results || []) {
      if (item.home == null || item.away == null || !item.matchId) continue;
      await setDoc(doc(db, "results", String(item.matchId)), {
        matchId: String(item.matchId),
        home: Number(item.home),
        away: Number(item.away),
        status: item.status || "FT",
        provider: item.provider || "football-data.org",
        providerFixtureId: item.providerFixtureId || null,
        providerHome: item.providerHome || "",
        providerAway: item.providerAway || "",
        updatedAt: serverTimestamp()
      }, { merge: true });
      saved++;
    }

    const msg = `✅ API sincronizada. ${saved} resultados guardados. Revisados: ${data.apiMatchesFound || 0}`;
    if (ds) ds.textContent = msg;
    if (adminStatus) adminStatus.textContent = msg;
    renderAll();
  } catch(e) {
    console.error(e);
    if (ds) ds.textContent = "⚠️ Error sincronizando API.";
    if (adminStatus) adminStatus.textContent = "⚠️ Error sincronizando API.";
  }
};

window.syncOpenFootball = function() { renderAll(); };

async function loadAppSettings() {
  try {
    const snap = await getDoc(doc(db, "settings", "app"));
    if (snap.exists()) {
      const data = snap.data();
      if (data.stakeAmount != null) stakeAmount = Number(data.stakeAmount) || 100;
    }
  } catch (e) {
    console.warn("No se pudo leer settings/app", e);
  }
}

window.saveStakeAmount = async function() {
  const input = document.getElementById("stakeAmount");
  const value = Number(input?.value || stakeAmount || 100);
  if (!value || value < 0) {
    const st = document.getElementById("adminStatus");
    if (st) st.textContent = "⚠️ Ingresa un monto válido.";
    return;
  }
  stakeAmount = value;
  await setDoc(doc(db, "settings", "app"), {
    stakeAmount: value,
    updatedAt: serverTimestamp()
  }, { merge: true });
  const st = document.getElementById("adminStatus");
  if (st) st.textContent = `✅ Monto actualizado: ¥${value}`;
  renderAll();
};

window.saveResultsAndCalculate = function() { renderAll(); };

function listenPredictions() {
  onSnapshot(collection(db, "predictions"), snap => {
    predictionsCache = snap.docs.map(d => d.data());
    if (isScoreInputFocused()) renderRanking();
    else renderAll();
  });
}
function listenResults() {
  onSnapshot(collection(db, "results"), snap => {
    resultsCache = {};
    snap.docs.forEach(d => resultsCache[String(d.id)] = d.data());
    if (isScoreInputFocused()) {
      renderRanking();
      updateCountdownOnly();
    } else renderAll();
  });
}


window.rebuildKnockoutCrossings = function() {
  applyKnockoutCrossings();
  renderAll();
  const ds = document.getElementById("dataStatus");
  if (ds) ds.textContent = `✅ Cruces reconstruidos: ${knockoutStatusText()} · v15`;
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadAppSettings();
  const stakeInput = document.getElementById("stakeAmount");
  if (stakeInput) stakeInput.value = stakeAmount;
  if (!location.search.includes("admin=jorge")) {
    const admin = $("adminPanel"); if (admin) admin.style.display = "none";
  }
  $("rulesBody").innerHTML = `<tr><td>Marcador exacto</td><td>+5</td></tr><tr><td>Ganador/empate correcto</td><td>+3</td></tr><tr><td>Fallo</td><td>0</td></tr>`;
  renderAll();
  listenPredictions();
  listenResults();
  setTimeout(() => window.syncResultsFromApi(), 500);
  if (!countdownIntervalStarted) {
    countdownIntervalStarted = true;
    setInterval(() => {
      updateCountdownOnly();
    }, 1000);
  }
});
