const APP_VERSION = "18.4-admin-language-fix";

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
      <div><b>Versión</b><br>v18.4</div>
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
    $("dataStatus").textContent = `✅ ${activeRoundStatusText()} · apuesta ¥${stakeForMatch(selectedMatch())} · ${knockoutStatusText()} · v18.4`;
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


// ===== V18.4 LANGUAGE FIX =====
const UI_LANG = {
  es: {
    title: "Polla Mundial 2026",
    enter: "Ingresar",
    namePlaceholder: "Tu nombre",
    savePrediction: "Guardar pronóstico",
    participants: "Participantes",
    rules: "Reglas",
    exact: "Marcador exacto",
    winner: "Ganador/empate correcto",
    fail: "Fallo",
    pot: "Pozo",
    admin: "Panel administrador"
  },
  ja: {
    title: "ワールドカップ予想 2026",
    enter: "入る",
    namePlaceholder: "名前",
    savePrediction: "予想を保存",
    participants: "参加者",
    rules: "ルール",
    exact: "スコア的中",
    winner: "勝敗/引き分け的中",
    fail: "はずれ",
    pot: "賞金",
    admin: "管理パネル"
  },
  en: {
    title: "World Cup Prediction 2026",
    enter: "Enter",
    namePlaceholder: "Your name",
    savePrediction: "Save prediction",
    participants: "Participants",
    rules: "Rules",
    exact: "Exact score",
    winner: "Correct winner/draw",
    fail: "Miss",
    pot: "Pot",
    admin: "Admin panel"
  },
  pt: {
    title: "Bolão Copa do Mundo 2026",
    enter: "Entrar",
    namePlaceholder: "Seu nome",
    savePrediction: "Salvar palpite",
    participants: "Participantes",
    rules: "Regras",
    exact: "Placar exato",
    winner: "Vencedor/empate correto",
    fail: "Erro",
    pot: "Prêmio",
    admin: "Painel admin"
  }
};

let currentLang = localStorage.getItem("currentLang") || "es";

function applyLanguageLabels() {
  const t = UI_LANG[currentLang] || UI_LANG.es;
  document.documentElement.lang = currentLang;
  document.querySelectorAll(".langs button, .language-btn").forEach(b => b.classList.remove("active"));
  const active = document.getElementById("btn-" + currentLang);
  if (active) active.classList.add("active");

  const title = document.querySelector("[data-i18n='title'], .app-title, h1");
  if (title) title.textContent = t.title;

  const nameInput = document.getElementById("playerName");
  if (nameInput) nameInput.placeholder = t.namePlaceholder;

  const enterBtn = document.querySelector("[onclick='enterGame()']");
  if (enterBtn) enterBtn.textContent = t.enter;

  const saveBtn = document.querySelector("[onclick='saveSelectedPrediction()']");
  if (saveBtn) saveBtn.textContent = t.savePrediction;

  const participantsBtn = document.querySelector("[onclick='toggleParticipants()']");
  if (participantsBtn) participantsBtn.textContent = t.participants;

  const rulesTitle = document.querySelector(".rules-card h2");
  if (rulesTitle) rulesTitle.textContent = "📌 " + t.rules;

  const adminTitle = document.querySelector("#adminPanel h2");
  if (adminTitle) adminTitle.textContent = "🔐 " + t.admin;

  const potLabel = document.querySelector("[data-i18n='pot']");
  if (potLabel) potLabel.textContent = t.pot;
}

window.setLang = function(lang) {
  currentLang = UI_LANG[lang] ? lang : "es";
  localStorage.setItem("currentLang", currentLang);
  applyLanguageLabels();
  try { renderAll(); } catch(e) { console.warn("renderAll after lang failed", e); }
};

document.addEventListener("DOMContentLoaded", async () => {
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
