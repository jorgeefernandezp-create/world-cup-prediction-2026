const APP_VERSION = "19.0-final-stable-language-complete";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore, collection, serverTimestamp, onSnapshot,
  doc, setDoc, getDoc
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

const BASE_MATCHES = [
  {
    "id": "53452545",
    "group": "Ronda de 32",
    "homeKey": "South Africa",
    "awayKey": "Canada",
    "start": "2026-06-28T19:00:00Z",
    "nextMatchId": "53452511",
    "nextSlot": "home"
  },
  {
    "id": "53452557",
    "group": "Ronda de 32",
    "homeKey": "Brazil",
    "awayKey": "Japan",
    "start": "2026-06-29T17:00:00Z",
    "nextMatchId": "53452517",
    "nextSlot": "home"
  },
  {
    "id": "53452541",
    "group": "Ronda de 32",
    "homeKey": "Germany",
    "awayKey": "Sweden",
    "start": "2026-06-29T20:30:00Z",
    "nextMatchId": "53452509",
    "nextSlot": "home"
  },
  {
    "id": "53452547",
    "group": "Ronda de 32",
    "homeKey": "Netherlands",
    "awayKey": "Morocco",
    "start": "2026-06-30T01:00:00Z",
    "nextMatchId": "53452511",
    "nextSlot": "away"
  },
  {
    "id": "53452561",
    "group": "Ronda de 32",
    "homeKey": "Ivory Coast",
    "awayKey": "Norway",
    "start": "2026-06-30T17:00:00Z",
    "nextMatchId": "53452517",
    "nextSlot": "away"
  },
  {
    "id": "53452543",
    "group": "Ronda de 32",
    "homeKey": "France",
    "awayKey": "Tunisia",
    "start": "2026-06-30T21:00:00Z",
    "nextMatchId": "53452509",
    "nextSlot": "away"
  },
  {
    "id": "53452563",
    "group": "Ronda de 32",
    "homeKey": "Mexico",
    "awayKey": "Saudi Arabia",
    "start": "2026-07-01T01:00:00Z",
    "nextMatchId": "53452519",
    "nextSlot": "home"
  },
  {
    "id": "53452565",
    "group": "Ronda de 32",
    "homeKey": "England",
    "awayKey": "Austria",
    "start": "2026-07-01T16:00:00Z",
    "nextMatchId": "53452519",
    "nextSlot": "away"
  },
  {
    "id": "53452555",
    "group": "Ronda de 32",
    "homeKey": "Belgium",
    "awayKey": "Uruguay",
    "start": "2026-07-01T20:00:00Z",
    "nextMatchId": "53452515",
    "nextSlot": "home"
  },
  {
    "id": "53452553",
    "group": "Ronda de 32",
    "homeKey": "United States",
    "awayKey": "Bosnia and Herzegovina",
    "start": "2026-07-02T00:00:00Z",
    "nextMatchId": "53452515",
    "nextSlot": "away"
  },
  {
    "id": "53452551",
    "group": "Ronda de 32",
    "homeKey": "Spain",
    "awayKey": "Austria",
    "start": "2026-07-02T19:00:00Z",
    "nextMatchId": "53452513",
    "nextSlot": "home"
  },
  {
    "id": "53452549",
    "group": "Ronda de 32",
    "homeKey": "Colombia",
    "awayKey": "Croatia",
    "start": "2026-07-02T23:00:00Z",
    "nextMatchId": "53452513",
    "nextSlot": "away"
  },
  {
    "id": "53452505",
    "group": "Ronda de 32",
    "homeKey": "Switzerland",
    "awayKey": "Algeria",
    "start": "2026-07-03T03:00:00Z",
    "nextMatchId": "53452523",
    "nextSlot": "home"
  },
  {
    "id": "53452503",
    "group": "Ronda de 32",
    "homeKey": "Australia",
    "awayKey": "Egypt",
    "start": "2026-07-03T18:00:00Z",
    "nextMatchId": "53452521",
    "nextSlot": "home"
  },
  {
    "id": "53452569",
    "group": "Ronda de 32",
    "homeKey": "Argentina",
    "awayKey": "Cape Verde",
    "start": "2026-07-03T22:00:00Z",
    "nextMatchId": "53452521",
    "nextSlot": "away"
  },
  {
    "id": "53452507",
    "group": "Ronda de 32",
    "homeKey": "Portugal",
    "awayKey": "Croatia",
    "start": "2026-07-04T01:30:00Z",
    "nextMatchId": "53452523",
    "nextSlot": "away"
  },
  {
    "id": "53452511",
    "group": "Octavos",
    "homeKey": "Ganador Sudáfrica-Canadá",
    "awayKey": "Ganador Países Bajos-Marruecos",
    "start": "2026-07-04T17:00:00Z",
    "nextMatchId": "53452525",
    "nextSlot": "home"
  },
  {
    "id": "53452509",
    "group": "Octavos",
    "homeKey": "Ganador Alemania-Suecia",
    "awayKey": "Ganador Francia-Túnez",
    "start": "2026-07-04T21:00:00Z",
    "nextMatchId": "53452525",
    "nextSlot": "away"
  },
  {
    "id": "53452517",
    "group": "Octavos",
    "homeKey": "Ganador Brasil-Japón",
    "awayKey": "Ganador Costa de Marfil-Noruega",
    "start": "2026-07-05T17:00:00Z",
    "nextMatchId": "53452527",
    "nextSlot": "home"
  },
  {
    "id": "53452519",
    "group": "Octavos",
    "homeKey": "Ganador México-Arabia Saudita",
    "awayKey": "Ganador Inglaterra-Austria",
    "start": "2026-07-05T21:00:00Z",
    "nextMatchId": "53452527",
    "nextSlot": "away"
  },
  {
    "id": "53452515",
    "group": "Octavos",
    "homeKey": "Ganador Bélgica-Uruguay",
    "awayKey": "Ganador Estados Unidos-Bosnia",
    "start": "2026-07-06T17:00:00Z",
    "nextMatchId": "53452529",
    "nextSlot": "home"
  },
  {
    "id": "53452513",
    "group": "Octavos",
    "homeKey": "Ganador España-Austria",
    "awayKey": "Ganador Colombia-Croacia",
    "start": "2026-07-06T21:00:00Z",
    "nextMatchId": "53452529",
    "nextSlot": "away"
  },
  {
    "id": "53452521",
    "group": "Octavos",
    "homeKey": "Ganador Australia-Egipto",
    "awayKey": "Ganador Argentina-Cabo Verde",
    "start": "2026-07-07T17:00:00Z",
    "nextMatchId": "53452531",
    "nextSlot": "home"
  },
  {
    "id": "53452523",
    "group": "Octavos",
    "homeKey": "Ganador Suiza-Argelia",
    "awayKey": "Ganador Portugal-Croacia",
    "start": "2026-07-07T21:00:00Z",
    "nextMatchId": "53452531",
    "nextSlot": "away"
  },
  {
    "id": "53452525",
    "group": "Cuartos",
    "homeKey": "Ganador Octavos 1",
    "awayKey": "Ganador Octavos 2",
    "start": "2026-07-09T19:00:00Z",
    "nextMatchId": "53452533",
    "nextSlot": "home"
  },
  {
    "id": "53452527",
    "group": "Cuartos",
    "homeKey": "Ganador Octavos 3",
    "awayKey": "Ganador Octavos 4",
    "start": "2026-07-10T19:00:00Z",
    "nextMatchId": "53452533",
    "nextSlot": "away"
  },
  {
    "id": "53452529",
    "group": "Cuartos",
    "homeKey": "Ganador Octavos 5",
    "awayKey": "Ganador Octavos 6",
    "start": "2026-07-11T19:00:00Z",
    "nextMatchId": "53452535",
    "nextSlot": "home"
  },
  {
    "id": "53452531",
    "group": "Cuartos",
    "homeKey": "Ganador Octavos 7",
    "awayKey": "Ganador Octavos 8",
    "start": "2026-07-12T19:00:00Z",
    "nextMatchId": "53452535",
    "nextSlot": "away"
  },
  {
    "id": "53452533",
    "group": "Semifinal",
    "homeKey": "Ganador Cuartos 1",
    "awayKey": "Ganador Cuartos 2",
    "start": "2026-07-14T19:00:00Z",
    "nextMatchId": "53452539",
    "nextSlot": "home"
  },
  {
    "id": "53452535",
    "group": "Semifinal",
    "homeKey": "Ganador Cuartos 3",
    "awayKey": "Ganador Cuartos 4",
    "start": "2026-07-15T19:00:00Z",
    "nextMatchId": "53452539",
    "nextSlot": "away"
  },
  {
    "id": "53452537",
    "group": "Tercer puesto",
    "homeKey": "Perdedor Semifinal 1",
    "awayKey": "Perdedor Semifinal 2",
    "start": "2026-07-18T19:00:00Z",
    "nextMatchId": "",
    "nextSlot": ""
  },
  {
    "id": "53452539",
    "group": "Final",
    "homeKey": "Ganador Semifinal 1",
    "awayKey": "Ganador Semifinal 2",
    "start": "2026-07-19T19:00:00Z",
    "nextMatchId": "",
    "nextSlot": ""
  }
];
let MATCHES = structuredClone(BASE_MATCHES);

const TEAM_ES = {
  "South Africa":"Sudáfrica","Canada":"Canadá","Brazil":"Brasil","Japan":"Japón","Germany":"Alemania","Sweden":"Suecia",
  "Netherlands":"Países Bajos","Morocco":"Marruecos","Ivory Coast":"Costa de Marfil","Norway":"Noruega","France":"Francia",
  "Tunisia":"Túnez","Mexico":"México","Saudi Arabia":"Arabia Saudita","England":"Inglaterra","Austria":"Austria",
  "Belgium":"Bélgica","Uruguay":"Uruguay","United States":"Estados Unidos","Bosnia and Herzegovina":"Bosnia y Herzegovina",
  "Spain":"España","Colombia":"Colombia","Croatia":"Croacia","Switzerland":"Suiza","Algeria":"Argelia","Australia":"Australia",
  "Egypt":"Egipto","Argentina":"Argentina","Cape Verde":"Cabo Verde","Portugal":"Portugal"
};
const TEAM_FLAGS = {
  "South Africa":"🇿🇦","Canada":"🇨🇦","Brazil":"🇧🇷","Japan":"🇯🇵","Germany":"🇩🇪","Sweden":"🇸🇪",
  "Netherlands":"🇳🇱","Morocco":"🇲🇦","Ivory Coast":"🇨🇮","Norway":"🇳🇴","France":"🇫🇷","Tunisia":"🇹🇳",
  "Mexico":"🇲🇽","Saudi Arabia":"🇸🇦","England":"🏴","Austria":"🇦🇹","Belgium":"🇧🇪","Uruguay":"🇺🇾",
  "United States":"🇺🇸","Bosnia and Herzegovina":"🇧🇦","Spain":"🇪🇸","Colombia":"🇨🇴","Croatia":"🇭🇷",
  "Switzerland":"🇨🇭","Algeria":"🇩🇿","Australia":"🇦🇺","Egypt":"🇪🇬","Argentina":"🇦🇷","Cape Verde":"🇨🇻","Portugal":"🇵🇹"
};

let currentPlayerName = localStorage.getItem("playerName") || "";
let selectedDayKey = localStorage.getItem("selectedDayKey") || "";
let selectedMatchId = localStorage.getItem("selectedMatchId") || "";
let predictionsCache = [];
let resultsCache = {};
let stakeAmount = 100;
let participantsOpen = false;
let localDraftScores = {};
let countdownIntervalStarted = false;

// ===== V18.1: mantener Ronda de 32 visible y monto por fase =====
const ROUND_ORDER = ["Ronda de 32","Octavos","Cuartos","Semifinal","Tercer puesto","Final"];
const DEFAULT_ROUND_STAKES = {"Ronda de 32":300,"Octavos":300,"Cuartos":500,"Semifinal":1000,"Tercer puesto":1000,"Final":1000};
let roundStakes = {...DEFAULT_ROUND_STAKES};

function isRoundComplete(roundName) {
  const list = MATCHES.filter(m => m.group === roundName);
  if (!list.length) return true;
  return list.every(m => !!resultFor(m.id));
}
function activeRoundName() {
  for (const r of ROUND_ORDER) {
    if (!isRoundComplete(r)) return r;
  }
  return "Final";
}
function matchesForActiveRound() {
  applyCrossings();
  const round = activeRoundName();
  return MATCHES.filter(m => m.group === round).sort((a,b)=>new Date(a.start)-new Date(b.start));
}
function stakeForMatch(match) {
  if (!match) return stakeAmount || 100;
  return Number(roundStakes[match.group] ?? stakeAmount ?? 100);
}
function activeRoundStatusText() {
  const round = activeRoundName();
  const list = MATCHES.filter(m => m.group === round);
  const done = list.filter(m => !!resultFor(m.id)).length;
  return `${round}: ${done}/${list.length} finalizados`;
}
let apiLastSync = localStorage.getItem("apiLastSync") || "";
let apiLastStatus = localStorage.getItem("apiLastStatus") || "Pendiente";
let lastApiCount = localStorage.getItem("lastApiCount") || "0";

function $(id) { return document.getElementById(id); }
function safeId(name) { return String(name).toLowerCase().trim().replace(/[^a-z0-9áéíóúñãõç一-龯ぁ-んァ-ン]/gi, "_"); }
function jstDateKey(iso) { return new Date(iso).toLocaleDateString("sv-SE", { timeZone: JAPAN_TIMEZONE }); }
function dateShort(iso) { return new Date(iso).toLocaleDateString("es-ES", { weekday:"short", day:"2-digit", month:"short", timeZone:JAPAN_TIMEZONE }).replace(".",""); }
function dateLong(iso) { return new Date(iso).toLocaleDateString("es-ES", { weekday:"long", day:"numeric", month:"long", year:"numeric", timeZone:JAPAN_TIMEZONE }); }
function timeJst(iso) { return new Date(iso).toLocaleTimeString("es-ES", { hour:"2-digit", minute:"2-digit", hour12:false, timeZone:JAPAN_TIMEZONE }); }
function isPlaceholder(k) { return /Ganador|Perdedor|Octavos|Cuartos|Semifinal/i.test(String(k||"")); }
function teamName(k) { return TEAM_ES[k] || k || "Por definir"; }
function teamFlag(k) { return TEAM_FLAGS[k] || (isPlaceholder(k) ? "🏆" : "🏳️"); }
function teamWithFlag(k) { return `${teamFlag(k)} ${teamName(k)}`; }

function resultFor(matchId) {
  const r = resultsCache[String(matchId)];
  if (!r) return null;
  const h = r.home ?? r.homeScore ?? r.finalHome;
  const a = r.away ?? r.awayScore ?? r.finalAway;
  if (h === null || h === undefined || a === null || a === undefined) return null;
  return { home:Number(h), away:Number(a), raw:r };
}

function winnerLoserFor(m) {
  const r = resultFor(m.id);
  if (!r) return null;
  if (r.home > r.away) return { winner:m.homeKey, loser:m.awayKey };
  if (r.away > r.home) return { winner:m.awayKey, loser:m.homeKey };
  const hp = r.raw.homePenalty ?? r.raw.homePenalties ?? r.raw.penaltyHome;
  const ap = r.raw.awayPenalty ?? r.raw.awayPenalties ?? r.raw.penaltyAway;
  if (hp != null && ap != null) {
    if (Number(hp) > Number(ap)) return { winner:m.homeKey, loser:m.awayKey };
    if (Number(ap) > Number(hp)) return { winner:m.awayKey, loser:m.homeKey };
  }
  return null;
}

const ADVANCE = Object.fromEntries(BASE_MATCHES.filter(m => m.nextMatchId).map(m => [m.id, { nextMatchId:m.nextMatchId, slot:m.nextSlot }]));
ADVANCE["53452533"].loserMatchId = "53452537"; ADVANCE["53452533"].loserSlot = "home";
ADVANCE["53452535"].loserMatchId = "53452537"; ADVANCE["53452535"].loserSlot = "away";

function setSlot(matchId, slot, team) {
  if (!team || isPlaceholder(team)) return false;
  const t = MATCHES.find(m => String(m.id) === String(matchId));
  if (!t) return false;
  if (slot === "home" && t.homeKey !== team) { t.homeKey = team; return true; }
  if (slot === "away" && t.awayKey !== team) { t.awayKey = team; return true; }
  return false;
}

function applyCrossings() {
  MATCHES = structuredClone(BASE_MATCHES);
  let changed = true, loops = 0;
  while (changed && loops < 12) {
    changed = false; loops++;
    for (const [id, edge] of Object.entries(ADVANCE)) {
      const source = MATCHES.find(m => String(m.id) === String(id));
      if (!source) continue;
      const wl = winnerLoserFor(source);
      if (!wl) continue;
      if (setSlot(edge.nextMatchId, edge.slot, wl.winner)) changed = true;
      if (edge.loserMatchId && wl.loser) {
        if (setSlot(edge.loserMatchId, edge.loserSlot, wl.loser)) changed = true;
      }
    }
  }
}
function knockoutStatusText() {
  const count = Object.keys(ADVANCE).filter(id => winnerLoserFor(MATCHES.find(m => String(m.id) === String(id)) || {})).length;
  return `${count} cruces aplicados`;
}

function isStartedOrFinished(m) { return Date.now() >= new Date(m.start).getTime() || !!resultFor(m.id); }
function visibleMatches() {
  return matchesForActiveRound();
}
function groupsByDate() {
  const groups = {};
  visibleMatches().forEach(m => {
    const key = jstDateKey(m.start);
    (groups[key] ||= []).push(m);
  });
  return groups;
}
function ensureSelection() {
  const groups = groupsByDate();
  const keys = Object.keys(groups).sort();
  if (!keys.length) return;
  if (!selectedDayKey || !groups[selectedDayKey]) selectedDayKey = keys[0];
  const current = (groups[selectedDayKey] || []).find(m => String(m.id) === String(selectedMatchId));
  if (!current) selectedMatchId = groups[selectedDayKey][0].id;
  localStorage.setItem("selectedDayKey", selectedDayKey);
  localStorage.setItem("selectedMatchId", selectedMatchId);
}
function selectedMatch() { ensureSelection(); return visibleMatches().find(m => String(m.id) === String(selectedMatchId)) || visibleMatches()[0]; }

function msToCountdown(ms) {
  if (ms <= 0) return "00d 00h 00m 00s";
  const total = Math.floor(ms/1000), d=Math.floor(total/86400), h=Math.floor((total%86400)/3600), m=Math.floor((total%3600)/60), s=total%60;
  return `${d}d ${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
}
function countdownText(m) {
  const diff = new Date(m.start).getTime() - Date.now();
  return diff <= 0 ? "🔒 Apuesta cerrada" : `Cierra en ${msToCountdown(diff)}`;
}
function scorePoints(p,r) {
  if (!r) return 0;
  const ph=Number(p.predictedHome), pa=Number(p.predictedAway);
  if (ph===r.home && pa===r.away) return 5;
  return Math.sign(ph-pa) === Math.sign(r.home-r.away) ? 3 : 0;
}
function currentPredictionFor(id) {
  const pid = safeId(currentPlayerName);
  return predictionsCache.find(p => p.playerId === pid && String(p.matchId) === String(id));
}

function renderTabs() {
  const groups = groupsByDate();
  const keys = Object.keys(groups).sort();
  $("dateTabs").innerHTML = keys.map(k => {
    const first = groups[k][0];
    return `<button class="${k===selectedDayKey?"active-date":""}" onclick="selectDateTab('${k}')">
      <span class="tab-day">${dateShort(first.start).split(" ")[0]}</span>
      <span class="tab-date">${dateShort(first.start).replace(/^\S+ /,"")}</span>
      <span class="tab-count">${groups[k].length} partidos</span>
    </button>`;
  }).join("");

  const list = groups[selectedDayKey] || [];
  $("matchTabs").innerHTML = list.map(m => {
    const r = resultFor(m.id);
    const status = r ? `FT ${r.home}-${r.away}` : countdownText(m);
    return `<button class="${String(m.id)===String(selectedMatchId)?"active-match":""}" onclick="selectMatchTab('${m.id}')">
      ${timeJst(m.start)}<br>${teamWithFlag(m.homeKey)} vs ${teamWithFlag(m.awayKey)}<br><small data-countdown-match="${m.id}">${status}</small>
    </button>`;
  }).join("");
}

function renderSelectedMatch() {
  const m = selectedMatch();
  if (!m) return;
  const r = resultFor(m.id);
  const locked = isStartedOrFinished(m);
  const saved = currentPredictionFor(m.id);
  const draft = localDraftScores[String(m.id)] || null;
  $("selectedMatchBox").innerHTML = `
    <div class="selected-match">
      <div class="teams-line">${teamWithFlag(m.homeKey)} vs ${teamWithFlag(m.awayKey)}</div>
      <div class="match-meta">🗓️ ${dateLong(m.start)} · 🕒 ${timeJst(m.start)} JST<br>${m.group} · Apuesta: ¥${stakeForMatch(m)}</div>
      ${r ? `<span class="result-badge">Resultado final: ${r.home} - ${r.away}</span><div class="winner-final">${winnerTextForMatch(m)}</div><div class="poll-winner-final">${pollWinnerText(m)}</div>` : `<div id="selectedCountdown" class="countdown">${countdownText(m)}</div>`}
      ${locked ? `<div class="locked">🔒 Apuesta cerrada</div>` : `<div class="score"><input id="selected_home" type="number" inputmode="numeric" pattern="[0-9]*" min="0" autocomplete="off" placeholder="0" oninput="saveDraftScore()" value="${draft ? draft.home : (saved ? saved.predictedHome : "")}"><span>-</span><input id="selected_away" type="number" inputmode="numeric" pattern="[0-9]*" min="0" autocomplete="off" placeholder="0" oninput="saveDraftScore()" value="${draft ? draft.away : (saved ? saved.predictedAway : "")}"></div>`}
    </div>`;
}

function renderRanking() {
  const m = selectedMatch();
  if (!m) return;
  const preds = predictionsCache.filter(p => String(p.matchId) === String(m.id));
  const r = resultFor(m.id);
  const ranked = preds.map(p => ({...p, points:scorePoints(p,r)})).sort((a,b)=>b.points-a.points || String(a.playerName).localeCompare(String(b.playerName)));
  $("potBox").textContent = `¥${preds.length * stakeForMatch(m)}`;
  $("matchParticipantsSummary").textContent = `${preds.length} participantes`;
  const list = $("matchParticipantsList");
  if (list) {
    list.style.display = participantsOpen ? "block" : "none";
    list.innerHTML = preds.length ? preds.map(p => `<div class="participant-row">${p.playerName}: ${p.predictedHome}-${p.predictedAway}</div>`).join("") : `<div class="participant-row">Aún no hay participantes.</div>`;
  }
  if (!r) $("winnerBox").textContent = "Aún no hay resultado final.";
  else $("winnerBox").innerHTML = pollWinnerText(m);
  $("matchRankingBody").innerHTML = ranked.map((p,i)=>`<tr><td>${i+1}</td><td>${p.playerName}</td><td>${p.predictedHome} - ${p.predictedAway}</td><td>${p.points}</td></tr>`).join("");
}


// ===== V18: MOTOR FINAL DEL TORNEO Y ESTADO ADMIN =====
function rebuildTournamentFromResults() {
  applyCrossings();
  applyLanguageLabels();
  renderAll();
  updateAdminSystemStatus();
    forceAdminPanelVisibility();
}

function updateAdminSystemStatus() {
  const box = document.getElementById("systemStatusBox");
  if (!box) return;
  const pending = visibleMatches().length;
  const crosses = knockoutStatusText();
  box.innerHTML = `
    <div class="system-grid">
      <div><b>Versión</b><br>v19.0</div>
      <div><b>API</b><br>${apiLastStatus}</div>
      <div><b>Última sync</b><br>${apiLastSync || "Pendiente"}</div>
      <div><b>Resultados API</b><br>${lastApiCount}</div>
      <div><b>Cruces</b><br>${crosses}</div>
      <div><b>Partidos pendientes</b><br>${pending}</div>
      <div><b>Apuesta actual</b><br>¥${stakeAmount}</div>
    </div>`;
}

function showAdminMessage(msg) {
  const st = document.getElementById("adminStatus");
  if (st) st.textContent = msg;
}

function saveApiState(status, count) {
  apiLastStatus = status;
  lastApiCount = String(count ?? 0);
  apiLastSync = new Date().toLocaleString("es-ES", { timeZone: JAPAN_TIMEZONE });
  localStorage.setItem("apiLastStatus", apiLastStatus);
  localStorage.setItem("lastApiCount", lastApiCount);
  localStorage.setItem("apiLastSync", apiLastSync);
  updateAdminSystemStatus();
}


// ===== V18.2: API -> FIREBASE -> SCORE FINAL -> GANADOR POLLA =====
async function saveApiResultsToFirebase(apiData) {
  const list = apiData?.results || apiData?.matches || apiData?.data || [];
  if (!Array.isArray(list) || !list.length) return 0;

  let saved = 0;
  for (const item of list) {
    const matchId = String(item.matchId || item.id || item.localId || item.gameId || "");
    if (!matchId) continue;

    const home = item.home ?? item.homeScore ?? item.finalHome ?? item.scoreHome ?? item.homeGoals;
    const away = item.away ?? item.awayScore ?? item.finalAway ?? item.scoreAway ?? item.awayGoals;
    const status = item.status || item.state || item.matchStatus || "FINISHED";
    if (home === undefined || away === undefined || home === null || away === null) continue;

    await setDoc(doc(db, "results", matchId), {
      home: Number(home),
      away: Number(away),
      status,
      provider: apiData.provider || "football-data",
      updatedAt: serverTimestamp()
    }, { merge: true });
    saved++;
  }
  return saved;
}

function winnerTextForMatch(match) {
  const r = resultFor(match.id);
  if (!r) return "";
  if (r.home > r.away) return `🏆 Ganador: ${teamName(match.homeKey)}`;
  if (r.away > r.home) return `🏆 Ganador: ${teamName(match.awayKey)}`;
  const raw = r.raw || {};
  const hp = raw.homePenalty ?? raw.homePenalties ?? raw.penaltyHome;
  const ap = raw.awayPenalty ?? raw.awayPenalties ?? raw.penaltyAway;
  if (hp != null && ap != null) {
    if (Number(hp) > Number(ap)) return `🏆 Ganador: ${teamName(match.homeKey)} (penales)`;
    if (Number(ap) > Number(hp)) return `🏆 Ganador: ${teamName(match.awayKey)} (penales)`;
  }
  return "Empate";
}

function pollWinnerText(match) {
  const r = resultFor(match.id);
  if (!r) return "Aún no hay resultado final.";
  const preds = predictionsCache.filter(p => String(p.matchId) === String(match.id));
  if (!preds.length) return "Sin participantes.";
  const ranked = preds.map(p => ({ ...p, points: scorePoints(p, r) }))
    .sort((a,b) => b.points - a.points || String(a.playerName).localeCompare(String(b.playerName)));
  const top = ranked[0]?.points || 0;
  if (top <= 0) return "Sin ganador con puntos.";
  const winners = ranked.filter(p => p.points === top);
  return `🏆 Ganador de la polla: ${winners.map(w => w.playerName).join(", ")} (${top} pts)`;
}

function renderAll() {
  try {
    applyCrossings();
    ensureSelection();
    renderTabs();
    renderSelectedMatch();
    renderRanking();
    $("welcomeText").textContent = currentPlayerName ? `Bienvenido, ${currentPlayerName}!` : "";
    $("dataStatus").textContent = `✅ ${activeRoundStatusText()} · apuesta ¥${stakeForMatch(selectedMatch())} · ${knockoutStatusText()} · v19.0`;
    if (typeof v19TranslatePage === "function") v19TranslatePage();
    updateAdminSystemStatus();
  } catch(e) {
    console.error(e);
    $("dataStatus").textContent = "⚠️ Error cargando calendario. Revisa consola.";
  }
}

function updateCountdownOnly() {
  const m = selectedMatch();
  if (!m) return;
  const el = $("selectedCountdown");
  if (el && !resultFor(m.id)) el.textContent = countdownText(m);
  document.querySelectorAll("[data-countdown-match]").forEach(node => {
    const mm = MATCHES.find(x => String(x.id) === String(node.getAttribute("data-countdown-match")));
    if (!mm) return;
    const r = resultFor(mm.id);
    node.textContent = r ? `FT ${r.home}-${r.away}` : countdownText(mm);
  });
}


window.selectDateTab = function(key) { selectedDayKey=key; selectedMatchId=(groupsByDate()[key]||[])[0]?.id || ""; localStorage.setItem("selectedDayKey",key); localStorage.setItem("selectedMatchId",selectedMatchId); renderAll(); };
window.selectMatchTab = function(id) { selectedMatchId=id; localStorage.setItem("selectedMatchId",id); renderAll(); };
window.saveDraftScore = function() {
  const m=selectedMatch(); if(!m) return;
  localDraftScores[String(m.id)] = { home:$("selected_home")?.value ?? "", away:$("selected_away")?.value ?? "" };
};
window.saveSelectedPrediction = async function() {
  const m=selectedMatch();
  if (!currentPlayerName) { $("predictionStatus").textContent="⚠️ Primero ingresa tu nombre."; return; }
  if (isStartedOrFinished(m)) { $("predictionStatus").textContent="🔒 La apuesta ya está cerrada."; return; }
  const h=$("selected_home")?.value, a=$("selected_away")?.value;
  if (h==="" || a==="") { $("predictionStatus").textContent="⚠️ Completa el marcador."; return; }
  const playerId=safeId(currentPlayerName);
  await setDoc(doc(db,"predictions",`${playerId}_${m.id}`), {
    playerId, playerName:currentPlayerName, matchId:m.id, homeKey:m.homeKey, awayKey:m.awayKey,
    predictedHome:Number(h), predictedAway:Number(a), updatedAt:serverTimestamp()
  }, { merge:true });
  delete localDraftScores[String(m.id)];
  $("predictionStatus").textContent="✅ Pronóstico guardado.";
};
window.toggleParticipants = function() { participantsOpen=!participantsOpen; renderRanking(); };
window.saveStakeAmount = async function() {
  const v = Number($("stakeAmount")?.value || stakeAmount || 100);
  stakeAmount = v;
  await setDoc(doc(db,"settings","app"), { stakeAmount:v, updatedAt:serverTimestamp() }, { merge:true });
  if ($("adminStatus")) $("adminStatus").textContent = `✅ Monto actualizado: ¥${v}`;
  renderAll();
};

window.setQuickStakeAmount = async function(value) {
  const input = document.getElementById("stakeAmount");
  if (input) input.value = value;
  stakeAmount = Number(value) || 100;
  await setDoc(doc(db,"settings","app"), { stakeAmount, updatedAt:serverTimestamp() }, { merge:true });
  const st = document.getElementById("adminStatus");
  if (st) st.textContent = `✅ Monto actualizado: ¥${stakeAmount}`;
  renderAll();
  updateAdminSystemStatus();
};


window.saveRoundStake = async function(roundName, inputId) {
  const input = document.getElementById(inputId);
  const value = Number(input?.value || roundStakes[roundName] || 300);
  if (!value || value < 0) {
    showAdminMessage("⚠️ Ingresa un monto válido.");
    return;
  }
  roundStakes[roundName] = value;
  stakeAmount = value;
  await setDoc(doc(db,"settings","app"), { stakeAmount:value, roundStakes, updatedAt:serverTimestamp() }, { merge:true });
  showAdminMessage(`✅ ${roundName} actualizado a ¥${value}`);
  renderAll();
};

window.setR32Stake300 = async function() {
  roundStakes["Ronda de 32"] = 300;
  stakeAmount = 300;
  const input = document.getElementById("stakeR32"); if (input) input.value = 300;
  const main = document.getElementById("stakeAmount"); if (main) main.value = 300;
  await setDoc(doc(db,"settings","app"), { stakeAmount:300, roundStakes, updatedAt:serverTimestamp() }, { merge:true });
  showAdminMessage("✅ Ronda de 32 configurada a ¥300 por apuesta.");
  renderAll();
};

window.syncResultsFromApi = async function() {
  showAdminMessage("⏳ Sincronizando API...");
  try {
    const r = await fetch("/api/sync-results?v=182", { cache: "no-store" });
    const data = await r.json();

    const saved = await saveApiResultsToFirebase(data);
    const count = saved || data.count || data.resultsUpdated || data.updated || 0;

    if (data.ok) {
      saveApiState("🟢 OK", count);
      showAdminMessage(`✅ API sincronizada. Resultados guardados: ${count}`);
    } else {
      saveApiState("🟡 Sin cambios", count);
      showAdminMessage("⚠️ API respondió sin resultados nuevos.");
    }

    rebuildTournamentFromResults();
  } catch(e) {
    console.warn(e);
    saveApiState("🔴 Error", 0);
    showAdminMessage("⚠️ No se pudo sincronizar API.");
  }
};
window.syncOpenFootball = window.syncResultsFromApi;
window.saveResultsAndCalculate = function() { renderAll(); };
window.rebuildKnockoutCrossings = function() { renderAll(); $("adminStatus").textContent = `✅ Cruces reconstruidos: ${knockoutStatusText()}`; };

async function loadSettings() {
  try {
    const s = await getDoc(doc(db,"settings","app"));
    if (s.exists()) {
    const data = s.data();
    if (data.stakeAmount != null) stakeAmount = Number(data.stakeAmount) || 100;
    if (data.roundStakes) roundStakes = { ...DEFAULT_ROUND_STAKES, ...data.roundStakes };
  }
    if ($("stakeAmount")) $("stakeAmount").value = stakeAmount;
  const r32Input = document.getElementById("stakeR32"); if (r32Input) r32Input.value = roundStakes["Ronda de 32"];
  } catch(e) {}
}
function listenFirebase() {
  onSnapshot(collection(db,"predictions"), snap => { predictionsCache = snap.docs.map(d=>d.data()); renderAll(); });
  onSnapshot(collection(db,"results"), snap => { resultsCache = {}; snap.docs.forEach(d => resultsCache[String(d.id)] = d.data()); renderAll(); });
  onSnapshot(doc(db,"settings","app"), snap => { if (snap.exists()) {
    const data = snap.data();
    if (data.stakeAmount != null) stakeAmount=Number(data.stakeAmount)||100;
    if (data.roundStakes) roundStakes = { ...DEFAULT_ROUND_STAKES, ...data.roundStakes };
    if($("stakeAmount")) $("stakeAmount").value=stakeAmount;
    const r32 = document.getElementById("stakeR32"); if (r32) r32.value = roundStakes["Ronda de 32"];
    renderAll();
  } });
}


// ===== V18.3 ADMIN PANEL VISIBLE =====
function isAdminMode() {
  return new URLSearchParams(window.location.search).get("admin") === "jorge";
}

function forceAdminPanelVisibility() {
  const panel = document.getElementById("adminPanel");
  if (!panel) return;
  if (isAdminMode()) {
    panel.style.display = "block";
    panel.hidden = false;
    panel.classList.add("admin-visible");
  } else {
    panel.style.display = "none";
    panel.hidden = true;
  }
}

window.forceSetR32To300 = async function() {
  stakeAmount = 300;
  if (typeof roundStakes !== "undefined") {
    roundStakes["Ronda de 32"] = 300;
  }
  const stakeAmountInput = document.getElementById("stakeAmount");
  if (stakeAmountInput) stakeAmountInput.value = 300;
  const stakeR32Input = document.getElementById("stakeR32");
  if (stakeR32Input) stakeR32Input.value = 300;

  await setDoc(doc(db, "settings", "app"), {
    stakeAmount: 300,
    roundStakes: typeof roundStakes !== "undefined" ? roundStakes : { "Ronda de 32": 300 },
    updatedAt: serverTimestamp()
  }, { merge: true });

  const status = document.getElementById("adminStatus");
  if (status) status.textContent = "✅ Ronda de 32 fijada a ¥300.";
  renderAll();
};

window.adminSyncApiNow = async function() {
  if (typeof syncResultsFromApi === "function") return syncResultsFromApi();
};

window.adminRebuildNow = function() {
  if (typeof rebuildKnockoutCrossings === "function") return rebuildKnockoutCrossings();
  if (typeof rebuildTournamentFromResults === "function") return rebuildTournamentFromResults();
  renderAll();
};



// ===== V19 FINAL: IDIOMAS COMPLETOS SIN TOCAR DATOS =====
// Esta capa traduce la interfaz visible después de cada render.
// No modifica Firebase, API, equipos, apuestas, participantes ni cruces.
const V19_I18N = {
  es: {
    title:"Polla Mundial 2026", subtitle:"Marca tu score antes de que empiece el partido.",
    namePlaceholder:"Tu nombre", enter:"Ingresar", savePrediction:"Guardar pronóstico",
    participants:"Participantes", rules:"Reglas", exact:"Marcador exacto",
    correct:"Ganador/empate correcto", fail:"Fallo", admin:"Panel administrador",
    quick:"Control rápido", sync:"Sincronizar API ahora", rebuild:"Reconstruir torneo",
    set300:"Fijar 16avos en ¥300", r32Amount:"Monto Ronda de 32 / 16avos",
    r32Note:"Las apuestas existentes se mantienen. Solo cambia el monto para calcular el pozo.",
    saveR32:"Guardar Ronda de 32", generalAmount:"Monto general", saveAmount:"Guardar monto",
    pot:"Pozo", finalResult:"Resultado final", winner:"Ganador", pollWinner:"Ganador de la polla",
    noFinal:"Aún no hay resultado final.", noParticipants:"Aún no hay participantes.",
    noPoints:"Sin ganador con puntos.", closed:"Apuesta cerrada", closesIn:"Cierra en",
    bet:"Apuesta", welcome:"Bienvenido", system:"Estado del sistema",
    apiSaved:"API sincronizada", apiError:"No se pudo sincronizar API"
  },
  ja: {
    title:"ワールドカップ予想 2026", subtitle:"試合開始前にスコアを入力してください。",
    namePlaceholder:"名前", enter:"入る", savePrediction:"予想を保存",
    participants:"参加者", rules:"ルール", exact:"スコア完全的中",
    correct:"勝敗/引き分け的中", fail:"不的中", admin:"管理パネル",
    quick:"クイック操作", sync:"APIを今すぐ同期", rebuild:"トーナメント再計算",
    set300:"ベスト32を¥300に設定", r32Amount:"ベスト32 / 16強の参加費",
    r32Note:"既存の予想はそのままです。賞金計算の金額だけ変更します。",
    saveR32:"ベスト32の金額を保存", generalAmount:"基本参加費", saveAmount:"金額を保存",
    pot:"賞金", finalResult:"最終スコア", winner:"勝者", pollWinner:"賭けの勝者",
    noFinal:"まだ最終結果はありません。", noParticipants:"まだ参加者はいません。",
    noPoints:"ポイント獲得者はいません。", closed:"受付終了", closesIn:"締切まで",
    bet:"参加費", welcome:"ようこそ", system:"システム状態",
    apiSaved:"API同期完了", apiError:"APIを同期できませんでした"
  },
  en: {
    title:"World Cup Prediction 2026", subtitle:"Enter your score before the match starts.",
    namePlaceholder:"Your name", enter:"Enter", savePrediction:"Save prediction",
    participants:"Participants", rules:"Rules", exact:"Exact score",
    correct:"Correct winner/draw", fail:"Miss", admin:"Admin panel",
    quick:"Quick control", sync:"Sync API now", rebuild:"Rebuild tournament",
    set300:"Set Round of 32 to ¥300", r32Amount:"Round of 32 amount",
    r32Note:"Existing predictions stay. Only the pot amount changes.",
    saveR32:"Save Round of 32", generalAmount:"General amount", saveAmount:"Save amount",
    pot:"Pot", finalResult:"Final score", winner:"Winner", pollWinner:"Pool winner",
    noFinal:"No final result yet.", noParticipants:"No participants yet.",
    noPoints:"No winner with points.", closed:"Betting closed", closesIn:"Closes in",
    bet:"Bet", welcome:"Welcome", system:"System status",
    apiSaved:"API synced", apiError:"Could not sync API"
  },
  pt: {
    title:"Bolão Copa do Mundo 2026", subtitle:"Marque seu placar antes do jogo começar.",
    namePlaceholder:"Seu nome", enter:"Entrar", savePrediction:"Salvar palpite",
    participants:"Participantes", rules:"Regras", exact:"Placar exato",
    correct:"Vencedor/empate correto", fail:"Erro", admin:"Painel admin",
    quick:"Controle rápido", sync:"Sincronizar API agora", rebuild:"Reconstruir torneio",
    set300:"Fixar 16avos em ¥300", r32Amount:"Valor Rodada de 32 / 16avos",
    r32Note:"Os palpites existentes continuam. Só muda o valor para calcular o prêmio.",
    saveR32:"Salvar Rodada de 32", generalAmount:"Valor geral", saveAmount:"Salvar valor",
    pot:"Prêmio", finalResult:"Resultado final", winner:"Vencedor", pollWinner:"Vencedor do bolão",
    noFinal:"Ainda não há resultado final.", noParticipants:"Ainda não há participantes.",
    noPoints:"Sem vencedor com pontos.", closed:"Aposta fechada", closesIn:"Fecha em",
    bet:"Aposta", welcome:"Bem-vindo", system:"Estado do sistema",
    apiSaved:"API sincronizada", apiError:"Não foi possível sincronizar a API"
  }
};

const V19_TEAM_NAMES = {
  "South Africa":{es:"Sudáfrica",ja:"南アフリカ",en:"South Africa",pt:"África do Sul"},
  "Canada":{es:"Canadá",ja:"カナダ",en:"Canada",pt:"Canadá"},
  "Brazil":{es:"Brasil",ja:"ブラジル",en:"Brazil",pt:"Brasil"},
  "Japan":{es:"Japón",ja:"日本",en:"Japan",pt:"Japão"},
  "Germany":{es:"Alemania",ja:"ドイツ",en:"Germany",pt:"Alemanha"},
  "Paraguay":{es:"Paraguay",ja:"パラグアイ",en:"Paraguay",pt:"Paraguai"},
  "Sweden":{es:"Suecia",ja:"スウェーデン",en:"Sweden",pt:"Suécia"},
  "Netherlands":{es:"Países Bajos",ja:"オランダ",en:"Netherlands",pt:"Países Baixos"},
  "Morocco":{es:"Marruecos",ja:"モロッコ",en:"Morocco",pt:"Marrocos"},
  "Ivory Coast":{es:"Costa de Marfil",ja:"コートジボワール",en:"Ivory Coast",pt:"Costa do Marfim"},
  "Norway":{es:"Noruega",ja:"ノルウェー",en:"Norway",pt:"Noruega"},
  "France":{es:"Francia",ja:"フランス",en:"France",pt:"França"},
  "Tunisia":{es:"Túnez",ja:"チュニジア",en:"Tunisia",pt:"Tunísia"},
  "Mexico":{es:"México",ja:"メキシコ",en:"Mexico",pt:"México"},
  "Ecuador":{es:"Ecuador",ja:"エクアドル",en:"Ecuador",pt:"Equador"},
  "Saudi Arabia":{es:"Arabia Saudita",ja:"サウジアラビア",en:"Saudi Arabia",pt:"Arábia Saudita"},
  "England":{es:"Inglaterra",ja:"イングランド",en:"England",pt:"Inglaterra"},
  "DR Congo":{es:"RD Congo",ja:"コンゴ民主共和国",en:"DR Congo",pt:"RD Congo"},
  "Austria":{es:"Austria",ja:"オーストリア",en:"Austria",pt:"Áustria"},
  "Belgium":{es:"Bélgica",ja:"ベルギー",en:"Belgium",pt:"Bélgica"},
  "Senegal":{es:"Senegal",ja:"セネガル",en:"Senegal",pt:"Senegal"},
  "United States":{es:"Estados Unidos",ja:"アメリカ",en:"United States",pt:"Estados Unidos"},
  "Bosnia and Herzegovina":{es:"Bosnia y Herzegovina",ja:"ボスニア・ヘルツェゴビナ",en:"Bosnia and Herzegovina",pt:"Bósnia e Herzegovina"},
  "Spain":{es:"España",ja:"スペイン",en:"Spain",pt:"Espanha"},
  "Colombia":{es:"Colombia",ja:"コロンビア",en:"Colombia",pt:"Colômbia"},
  "Croatia":{es:"Croacia",ja:"クロアチア",en:"Croatia",pt:"Croácia"},
  "Portugal":{es:"Portugal",ja:"ポルトガル",en:"Portugal",pt:"Portugal"},
  "Switzerland":{es:"Suiza",ja:"スイス",en:"Switzerland",pt:"Suíça"},
  "Algeria":{es:"Argelia",ja:"アルジェリア",en:"Algeria",pt:"Argélia"},
  "Australia":{es:"Australia",ja:"オーストラリア",en:"Australia",pt:"Austrália"},
  "Egypt":{es:"Egipto",ja:"エジプト",en:"Egypt",pt:"Egito"},
  "Argentina":{es:"Argentina",ja:"アルゼンチン",en:"Argentina",pt:"Argentina"},
  "Cape Verde":{es:"Cabo Verde",ja:"カーボベルデ",en:"Cape Verde",pt:"Cabo Verde"},
  "Ghana":{es:"Ghana",ja:"ガーナ",en:"Ghana",pt:"Gana"},
  "Uruguay":{es:"Uruguay",ja:"ウルグアイ",en:"Uruguay",pt:"Uruguai"}
};

let v19Lang = localStorage.getItem("currentLang") || "es";
function v19t(k){ return (V19_I18N[v19Lang] && V19_I18N[v19Lang][k]) || V19_I18N.es[k] || k; }
function v19Team(name){ return (V19_TEAM_NAMES[name] && V19_TEAM_NAMES[name][v19Lang]) || name; }

function v19ReplaceText(from, to) {
  if (!from || !to || from === to || !document.body) return;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(n => {
    if (n.nodeValue && n.nodeValue.includes(from)) n.nodeValue = n.nodeValue.split(from).join(to);
  });
}

function v19TranslatePage() {
  document.documentElement.lang = v19Lang;
  document.querySelectorAll(".langs button,.language-switcher button").forEach(b => b.classList.remove("active"));
  const active = document.getElementById("btn-" + v19Lang);
  if (active) active.classList.add("active");

  const nameInput = document.getElementById("playerName");
  if (nameInput) nameInput.placeholder = v19t("namePlaceholder");

  const pairs = [
    ["Polla Mundial 2026", v19t("title")],
    ["Marca tu score antes de que empiece el partido.", v19t("subtitle")],
    ["Ingresar", v19t("enter")],
    ["Guardar pronóstico", v19t("savePrediction")],
    ["Participantes", v19t("participants")],
    ["Reglas", v19t("rules")],
    ["Marcador exacto", v19t("exact")],
    ["Ganador/empate correcto", v19t("correct")],
    ["Fallo", v19t("fail")],
    ["Panel administrador", v19t("admin")],
    ["Control rápido", v19t("quick")],
    ["Sincronizar API ahora", v19t("sync")],
    ["Reconstruir torneo", v19t("rebuild")],
    ["Fijar 16avos en ¥300", v19t("set300")],
    ["Monto Ronda de 32 / 16avos", v19t("r32Amount")],
    ["Las apuestas existentes se mantienen. Solo cambia el monto para calcular el pozo.", v19t("r32Note")],
    ["Guardar Ronda de 32", v19t("saveR32")],
    ["Monto general", v19t("generalAmount")],
    ["Guardar monto", v19t("saveAmount")],
    ["Pozo", v19t("pot")],
    ["Resultado final", v19t("finalResult")],
    ["Ganador de la polla", v19t("pollWinner")],
    ["Ganador", v19t("winner")],
    ["Aún no hay resultado final.", v19t("noFinal")],
    ["Aún no hay participantes.", v19t("noParticipants")],
    ["Sin ganador con puntos.", v19t("noPoints")],
    ["Apuesta cerrada", v19t("closed")],
    ["Cierra en", v19t("closesIn")],
    ["Apuesta", v19t("bet")],
    ["Bienvenido", v19t("welcome")],
    ["Estado del sistema", v19t("system")]
  ];
  pairs.forEach(([a,b]) => v19ReplaceText(a,b));

  Object.keys(V19_TEAM_NAMES).forEach(team => {
    const translated = v19Team(team);
    if (translated !== team) v19ReplaceText(team, translated);
  });
}

window.setLang = function(lang) {
  v19Lang = V19_I18N[lang] ? lang : "es";
  localStorage.setItem("currentLang", v19Lang);
  try { if (typeof renderAll === "function") renderAll(); } catch(e) {}
  setTimeout(v19TranslatePage, 0);
  setTimeout(v19TranslatePage, 120);
  setTimeout(v19TranslatePage, 400);
};

function v19ScheduleTranslate() {
  setTimeout(v19TranslatePage, 0);
  setTimeout(v19TranslatePage, 120);
  setTimeout(v19TranslatePage, 400);
}

document.addEventListener("DOMContentLoaded", async () => {
  v19ScheduleTranslate();
  forceAdminPanelVisibility();
  $("rulesBody").innerHTML = `<tr><td>Marcador exacto</td><td>+5</td></tr><tr><td>Ganador/empate correcto</td><td>+3</td></tr><tr><td>Fallo</td><td>0</td></tr>`;
  await loadSettings();
  renderAll();
  updateAdminSystemStatus();
  listenFirebase();
  setTimeout(() => window.syncResultsFromApi(), 1000);
  if (!countdownIntervalStarted) {
    countdownIntervalStarted = true;
    setInterval(updateCountdownOnly, 1000);
  }
});
