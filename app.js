const APP_VERSION = "9.2-hide-old-matches-final";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore, collection, serverTimestamp, query, orderBy, onSnapshot,
  doc, setDoc, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

history.scrollRestoration = "manual";
window.addEventListener("load", () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  }, 50);
});

const firebaseConfig = {
  apiKey: "AIzaSyCT7xdrWuQ-HRxi_MsPgeLVVkyNyGSO4_k",
  authDomain: "world-cup-prediction-202-c21c7.firebaseapp.com",
  projectId: "world-cup-prediction-202-c21c7",
  storageBucket: "world-cup-prediction-202-c21c7.firebasestorage.app",
  messagingSenderId: "799745348621",
  appId: "1:799745348621:web:f444420211d86ae1e67144",
  measurementId: "G-RRB3QSV828"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const JAPAN_TIMEZONE = "Asia/Tokyo";
// MODO NUEVO: desde sábado 27/06/2026 en Japón.
// Esto NO borra Firebase. Solo oculta partidos anteriores de la pantalla.
const ACTIVE_FROM_JST_DATE = "2026-06-27";
function jstDateKeyFromISO(iso) {
  return new Date(iso).toLocaleDateString("sv-SE", { timeZone: JAPAN_TIMEZONE });
}
function isVisibleMatchByJst(iso) {
  return jstDateKeyFromISO(iso) >= ACTIVE_FROM_JST_DATE;
}

const STATIC_MATCHES = [
  {
    "id": "66456904",
    "group": "Group A",
    "homeCode": "MEX",
    "awayCode": "RSA",
    "homeKey": "Mexico",
    "awayKey": "South Africa",
    "startUtc": "2026-06-11T19:00:00Z",
    "finalHome": 2,
    "finalAway": 0,
    "status": "complete"
  },
  {
    "id": "66456906",
    "group": "Group A",
    "homeCode": "KOR",
    "awayCode": "CZE",
    "homeKey": "South Korea",
    "awayKey": "Czechia",
    "startUtc": "2026-06-12T02:00:00Z",
    "finalHome": 2,
    "finalAway": 1,
    "status": "complete"
  },
  {
    "id": "66456916",
    "group": "Group B",
    "homeCode": "CAN",
    "awayCode": "BIH",
    "homeKey": "Canada",
    "awayKey": "Bosnia and Herzegovina",
    "startUtc": "2026-06-12T19:00:00Z",
    "finalHome": 1,
    "finalAway": 1,
    "status": "complete"
  },
  {
    "id": "66456940",
    "group": "Group D",
    "homeCode": "USA",
    "awayCode": "PAR",
    "homeKey": "United States",
    "awayKey": "Paraguay",
    "startUtc": "2026-06-13T01:00:00Z",
    "finalHome": 4,
    "finalAway": 1,
    "status": "complete"
  },
  {
    "id": "66456918",
    "group": "Group B",
    "homeCode": "QAT",
    "awayCode": "SUI",
    "homeKey": "Qatar",
    "awayKey": "Switzerland",
    "startUtc": "2026-06-13T19:00:00Z"
  },
  {
    "id": "66456928",
    "group": "Group C",
    "homeCode": "BRA",
    "awayCode": "MAR",
    "homeKey": "Brazil",
    "awayKey": "Morocco",
    "startUtc": "2026-06-13T22:00:00Z"
  },
  {
    "id": "66456930",
    "group": "Group C",
    "homeCode": "HTI",
    "awayCode": "SCO",
    "homeKey": "Haiti",
    "awayKey": "Scotland",
    "startUtc": "2026-06-14T01:00:00Z"
  },
  {
    "id": "66456942",
    "group": "Group D",
    "homeCode": "AUS",
    "awayCode": "TUR",
    "homeKey": "Australia",
    "awayKey": "Turkey",
    "startUtc": "2026-06-14T04:00:00Z"
  },
  {
    "id": "66457070",
    "group": "Group E",
    "homeCode": "GER",
    "awayCode": "CUW",
    "homeKey": "Germany",
    "awayKey": "Curacao",
    "startUtc": "2026-06-14T17:00:00Z"
  },
  {
    "id": "66456968",
    "group": "Group F",
    "homeCode": "NED",
    "awayCode": "JPN",
    "homeKey": "Netherlands",
    "awayKey": "Japan",
    "startUtc": "2026-06-14T20:00:00Z"
  },
  {
    "id": "66457072",
    "group": "Group E",
    "homeCode": "CIV",
    "awayCode": "ECU",
    "homeKey": "Ivory Coast",
    "awayKey": "Ecuador",
    "startUtc": "2026-06-14T23:00:00Z"
  },
  {
    "id": "66456970",
    "group": "Group F",
    "homeCode": "SWE",
    "awayCode": "TUN",
    "homeKey": "Sweden",
    "awayKey": "Tunisia",
    "startUtc": "2026-06-15T02:00:00Z"
  },
  {
    "id": "66456994",
    "group": "Group H",
    "homeCode": "ESP",
    "awayCode": "CPV",
    "homeKey": "Spain",
    "awayKey": "Cape Verde",
    "startUtc": "2026-06-15T16:00:00Z"
  },
  {
    "id": "66456982",
    "group": "Group G",
    "homeCode": "BEL",
    "awayCode": "EGY",
    "homeKey": "Belgium",
    "awayKey": "Egypt",
    "startUtc": "2026-06-15T19:00:00Z"
  },
  {
    "id": "66456996",
    "group": "Group H",
    "homeCode": "KSA",
    "awayCode": "URU",
    "homeKey": "Saudi Arabia",
    "awayKey": "Uruguay",
    "startUtc": "2026-06-15T22:00:00Z"
  },
  {
    "id": "66456984",
    "group": "Group G",
    "homeCode": "IRI",
    "awayCode": "NZL",
    "homeKey": "Iran",
    "awayKey": "New Zealand",
    "startUtc": "2026-06-16T01:00:00Z"
  },
  {
    "id": "66457006",
    "group": "Group I",
    "homeCode": "FRA",
    "awayCode": "SEN",
    "homeKey": "France",
    "awayKey": "Senegal",
    "startUtc": "2026-06-16T19:00:00Z"
  },
  {
    "id": "66457008",
    "group": "Group I",
    "homeCode": "IRQ",
    "awayCode": "NOR",
    "homeKey": "Iraq",
    "awayKey": "Norway",
    "startUtc": "2026-06-16T22:00:00Z"
  },
  {
    "id": "66457018",
    "group": "Group J",
    "homeCode": "ARG",
    "awayCode": "DZA",
    "homeKey": "Argentina",
    "awayKey": "Algeria",
    "startUtc": "2026-06-17T01:00:00Z"
  },
  {
    "id": "66457020",
    "group": "Group J",
    "homeCode": "AUT",
    "awayCode": "JOR",
    "homeKey": "Austria",
    "awayKey": "Jordan",
    "startUtc": "2026-06-17T04:00:00Z"
  },
  {
    "id": "66457030",
    "group": "Group K",
    "homeCode": "POR",
    "awayCode": "COD",
    "homeKey": "Portugal",
    "awayKey": "DR Congo",
    "startUtc": "2026-06-17T17:00:00Z"
  },
  {
    "id": "66457042",
    "group": "Group L",
    "homeCode": "ENG",
    "awayCode": "CRO",
    "homeKey": "England",
    "awayKey": "Croatia",
    "startUtc": "2026-06-17T20:00:00Z"
  },
  {
    "id": "66457044",
    "group": "Group L",
    "homeCode": "GHA",
    "awayCode": "PAN",
    "homeKey": "Ghana",
    "awayKey": "Panama",
    "startUtc": "2026-06-17T23:00:00Z"
  },
  {
    "id": "66457032",
    "group": "Group K",
    "homeCode": "UZB",
    "awayCode": "COL",
    "homeKey": "Uzbekistan",
    "awayKey": "Colombia",
    "startUtc": "2026-06-18T02:00:00Z"
  },
  {
    "id": "66456910",
    "group": "Group A",
    "homeCode": "CZE",
    "awayCode": "RSA",
    "homeKey": "Czechia",
    "awayKey": "South Africa",
    "startUtc": "2026-06-18T16:00:00Z"
  },
  {
    "id": "66456922",
    "group": "Group B",
    "homeCode": "SUI",
    "awayCode": "BIH",
    "homeKey": "Switzerland",
    "awayKey": "Bosnia and Herzegovina",
    "startUtc": "2026-06-18T19:00:00Z"
  },
  {
    "id": "66456920",
    "group": "Group B",
    "homeCode": "CAN",
    "awayCode": "QAT",
    "homeKey": "Canada",
    "awayKey": "Qatar",
    "startUtc": "2026-06-18T22:00:00Z"
  },
  {
    "id": "66456908",
    "group": "Group A",
    "homeCode": "MEX",
    "awayCode": "KOR",
    "homeKey": "Mexico",
    "awayKey": "South Korea",
    "startUtc": "2026-06-19T01:00:00Z"
  },
  {
    "id": "66456944",
    "group": "Group D",
    "homeCode": "USA",
    "awayCode": "AUS",
    "homeKey": "United States",
    "awayKey": "Australia",
    "startUtc": "2026-06-19T19:00:00Z"
  },
  {
    "id": "66456934",
    "group": "Group C",
    "homeCode": "SCO",
    "awayCode": "MAR",
    "homeKey": "Scotland",
    "awayKey": "Morocco",
    "startUtc": "2026-06-19T22:00:00Z"
  },
  {
    "id": "66456932",
    "group": "Group C",
    "homeCode": "BRA",
    "awayCode": "HTI",
    "homeKey": "Brazil",
    "awayKey": "Haiti",
    "startUtc": "2026-06-20T00:30:00Z"
  },
  {
    "id": "66456946",
    "group": "Group D",
    "homeCode": "TUR",
    "awayCode": "PAR",
    "homeKey": "Turkey",
    "awayKey": "Paraguay",
    "startUtc": "2026-06-20T03:00:00Z"
  },
  {
    "id": "66456972",
    "group": "Group F",
    "homeCode": "NED",
    "awayCode": "SWE",
    "homeKey": "Netherlands",
    "awayKey": "Sweden",
    "startUtc": "2026-06-20T17:00:00Z"
  },
  {
    "id": "66457074",
    "group": "Group E",
    "homeCode": "GER",
    "awayCode": "CIV",
    "homeKey": "Germany",
    "awayKey": "Ivory Coast",
    "startUtc": "2026-06-20T20:00:00Z"
  },
  {
    "id": "66457076",
    "group": "Group E",
    "homeCode": "ECU",
    "awayCode": "CUW",
    "homeKey": "Ecuador",
    "awayKey": "Curacao",
    "startUtc": "2026-06-21T00:00:00Z"
  },
  {
    "id": "66456974",
    "group": "Group F",
    "homeCode": "TUN",
    "awayCode": "JPN",
    "homeKey": "Tunisia",
    "awayKey": "Japan",
    "startUtc": "2026-06-21T04:00:00Z"
  },
  {
    "id": "66456998",
    "group": "Group H",
    "homeCode": "ESP",
    "awayCode": "KSA",
    "homeKey": "Spain",
    "awayKey": "Saudi Arabia",
    "startUtc": "2026-06-21T16:00:00Z"
  },
  {
    "id": "66456986",
    "group": "Group G",
    "homeCode": "BEL",
    "awayCode": "IRI",
    "homeKey": "Belgium",
    "awayKey": "Iran",
    "startUtc": "2026-06-21T19:00:00Z"
  },
  {
    "id": "66457000",
    "group": "Group H",
    "homeCode": "URU",
    "awayCode": "CPV",
    "homeKey": "Uruguay",
    "awayKey": "Cape Verde",
    "startUtc": "2026-06-21T22:00:00Z"
  },
  {
    "id": "66456988",
    "group": "Group G",
    "homeCode": "NZL",
    "awayCode": "EGY",
    "homeKey": "New Zealand",
    "awayKey": "Egypt",
    "startUtc": "2026-06-22T01:00:00Z"
  },
  {
    "id": "66457022",
    "group": "Group J",
    "homeCode": "ARG",
    "awayCode": "AUT",
    "homeKey": "Argentina",
    "awayKey": "Austria",
    "startUtc": "2026-06-22T17:00:00Z"
  },
  {
    "id": "66457010",
    "group": "Group I",
    "homeCode": "FRA",
    "awayCode": "IRQ",
    "homeKey": "France",
    "awayKey": "Iraq",
    "startUtc": "2026-06-22T21:00:00Z"
  },
  {
    "id": "66457012",
    "group": "Group I",
    "homeCode": "NOR",
    "awayCode": "SEN",
    "homeKey": "Norway",
    "awayKey": "Senegal",
    "startUtc": "2026-06-23T00:00:00Z"
  },
  {
    "id": "66457024",
    "group": "Group J",
    "homeCode": "JOR",
    "awayCode": "DZA",
    "homeKey": "Jordan",
    "awayKey": "Algeria",
    "startUtc": "2026-06-23T03:00:00Z"
  },
  {
    "id": "66457034",
    "group": "Group K",
    "homeCode": "POR",
    "awayCode": "UZB",
    "homeKey": "Portugal",
    "awayKey": "Uzbekistan",
    "startUtc": "2026-06-23T17:00:00Z"
  },
  {
    "id": "66457046",
    "group": "Group L",
    "homeCode": "ENG",
    "awayCode": "GHA",
    "homeKey": "England",
    "awayKey": "Ghana",
    "startUtc": "2026-06-23T20:00:00Z"
  },
  {
    "id": "66457048",
    "group": "Group L",
    "homeCode": "PAN",
    "awayCode": "CRO",
    "homeKey": "Panama",
    "awayKey": "Croatia",
    "startUtc": "2026-06-23T23:00:00Z"
  },
  {
    "id": "66457036",
    "group": "Group K",
    "homeCode": "COL",
    "awayCode": "COD",
    "homeKey": "Colombia",
    "awayKey": "DR Congo",
    "startUtc": "2026-06-24T02:00:00Z"
  },
  {
    "id": "66456924",
    "group": "Group B",
    "homeCode": "SUI",
    "awayCode": "CAN",
    "homeKey": "Switzerland",
    "awayKey": "Canada",
    "startUtc": "2026-06-24T19:00:00Z"
  },
  {
    "id": "66456926",
    "group": "Group B",
    "homeCode": "BIH",
    "awayCode": "QAT",
    "homeKey": "Bosnia and Herzegovina",
    "awayKey": "Qatar",
    "startUtc": "2026-06-24T19:00:00Z"
  },
  {
    "id": "66456936",
    "group": "Group C",
    "homeCode": "SCO",
    "awayCode": "BRA",
    "homeKey": "Scotland",
    "awayKey": "Brazil",
    "startUtc": "2026-06-24T22:00:00Z"
  },
  {
    "id": "66456938",
    "group": "Group C",
    "homeCode": "MAR",
    "awayCode": "HTI",
    "homeKey": "Morocco",
    "awayKey": "Haiti",
    "startUtc": "2026-06-24T22:00:00Z"
  },
  {
    "id": "66456912",
    "group": "Group A",
    "homeCode": "CZE",
    "awayCode": "MEX",
    "homeKey": "Czechia",
    "awayKey": "Mexico",
    "startUtc": "2026-06-25T01:00:00Z"
  },
  {
    "id": "66456914",
    "group": "Group A",
    "homeCode": "RSA",
    "awayCode": "KOR",
    "homeKey": "South Africa",
    "awayKey": "South Korea",
    "startUtc": "2026-06-25T01:00:00Z"
  },
  {
    "id": "66457078",
    "group": "Group E",
    "homeCode": "ECU",
    "awayCode": "GER",
    "homeKey": "Ecuador",
    "awayKey": "Germany",
    "startUtc": "2026-06-25T20:00:00Z"
  },
  {
    "id": "66457080",
    "group": "Group E",
    "homeCode": "CUW",
    "awayCode": "CIV",
    "homeKey": "Curacao",
    "awayKey": "Ivory Coast",
    "startUtc": "2026-06-25T20:00:00Z"
  },
  {
    "id": "66456976",
    "group": "Group F",
    "homeCode": "TUN",
    "awayCode": "NED",
    "homeKey": "Tunisia",
    "awayKey": "Netherlands",
    "startUtc": "2026-06-25T23:00:00Z"
  },
  {
    "id": "66456978",
    "group": "Group F",
    "homeCode": "JPN",
    "awayCode": "SWE",
    "homeKey": "Japan",
    "awayKey": "Sweden",
    "startUtc": "2026-06-25T23:00:00Z"
  },
  {
    "id": "66456948",
    "group": "Group D",
    "homeCode": "TUR",
    "awayCode": "USA",
    "homeKey": "Turkey",
    "awayKey": "United States",
    "startUtc": "2026-06-26T02:00:00Z"
  },
  {
    "id": "66456950",
    "group": "Group D",
    "homeCode": "PAR",
    "awayCode": "AUS",
    "homeKey": "Paraguay",
    "awayKey": "Australia",
    "startUtc": "2026-06-26T02:00:00Z"
  },
  {
    "id": "66457014",
    "group": "Group I",
    "homeCode": "NOR",
    "awayCode": "FRA",
    "homeKey": "Norway",
    "awayKey": "France",
    "startUtc": "2026-06-26T19:00:00Z"
  },
  {
    "id": "66457016",
    "group": "Group I",
    "homeCode": "SEN",
    "awayCode": "IRQ",
    "homeKey": "Senegal",
    "awayKey": "Iraq",
    "startUtc": "2026-06-26T19:00:00Z"
  },
  {
    "id": "66457002",
    "group": "Group H",
    "homeCode": "URU",
    "awayCode": "ESP",
    "homeKey": "Uruguay",
    "awayKey": "Spain",
    "startUtc": "2026-06-27T00:00:00Z"
  },
  {
    "id": "66457004",
    "group": "Group H",
    "homeCode": "CPV",
    "awayCode": "KSA",
    "homeKey": "Cape Verde",
    "awayKey": "Saudi Arabia",
    "startUtc": "2026-06-27T00:00:00Z"
  },
  {
    "id": "66456990",
    "group": "Group G",
    "homeCode": "NZL",
    "awayCode": "BEL",
    "homeKey": "New Zealand",
    "awayKey": "Belgium",
    "startUtc": "2026-06-27T03:00:00Z"
  },
  {
    "id": "66456992",
    "group": "Group G",
    "homeCode": "EGY",
    "awayCode": "IRI",
    "homeKey": "Egypt",
    "awayKey": "Iran",
    "startUtc": "2026-06-27T03:00:00Z"
  },
  {
    "id": "66457050",
    "group": "Group L",
    "homeCode": "PAN",
    "awayCode": "ENG",
    "homeKey": "Panama",
    "awayKey": "England",
    "startUtc": "2026-06-27T21:00:00Z"
  },
  {
    "id": "66457052",
    "group": "Group L",
    "homeCode": "CRO",
    "awayCode": "GHA",
    "homeKey": "Croatia",
    "awayKey": "Ghana",
    "startUtc": "2026-06-27T21:00:00Z"
  },
  {
    "id": "66457038",
    "group": "Group K",
    "homeCode": "COL",
    "awayCode": "POR",
    "homeKey": "Colombia",
    "awayKey": "Portugal",
    "startUtc": "2026-06-27T23:30:00Z"
  },
  {
    "id": "66457040",
    "group": "Group K",
    "homeCode": "COD",
    "awayCode": "UZB",
    "homeKey": "DR Congo",
    "awayKey": "Uzbekistan",
    "startUtc": "2026-06-27T23:30:00Z"
  },
  {
    "id": "66457026",
    "group": "Group J",
    "homeCode": "JOR",
    "awayCode": "ARG",
    "homeKey": "Jordan",
    "awayKey": "Argentina",
    "startUtc": "2026-06-28T02:00:00Z"
  },
  {
    "id": "66457028",
    "group": "Group J",
    "homeCode": "DZA",
    "awayCode": "AUT",
    "homeKey": "Algeria",
    "awayKey": "Austria",
    "startUtc": "2026-06-28T02:00:00Z"
  }
];

const TEAM_NAMES = {
  "Mexico": [
    "México",
    "メキシコ",
    "Mexico",
    "México",
    "🇲🇽"
  ],
  "South Africa": [
    "Sudáfrica",
    "南アフリカ",
    "South Africa",
    "África do Sul",
    "🇿🇦"
  ],
  "South Korea": [
    "Corea del Sur",
    "韓国",
    "South Korea",
    "Coreia do Sul",
    "🇰🇷"
  ],
  "Czechia": [
    "Chequia",
    "チェコ",
    "Czechia",
    "Tchéquia",
    "🇨🇿"
  ],
  "Canada": [
    "Canadá",
    "カナダ",
    "Canada",
    "Canadá",
    "🇨🇦"
  ],
  "Bosnia and Herzegovina": [
    "Bosnia y Herzegovina",
    "ボスニア・ヘルツェゴビナ",
    "Bosnia and Herzegovina",
    "Bósnia e Herzegovina",
    "🇧🇦"
  ],
  "United States": [
    "Estados Unidos",
    "アメリカ",
    "United States",
    "Estados Unidos",
    "🇺🇸"
  ],
  "Paraguay": [
    "Paraguay",
    "パラグアイ",
    "Paraguay",
    "Paraguai",
    "🇵🇾"
  ],
  "Qatar": [
    "Qatar",
    "カタール",
    "Qatar",
    "Catar",
    "🇶🇦"
  ],
  "Switzerland": [
    "Suiza",
    "スイス",
    "Switzerland",
    "Suíça",
    "🇨🇭"
  ],
  "Brazil": [
    "Brasil",
    "ブラジル",
    "Brazil",
    "Brasil",
    "🇧🇷"
  ],
  "Morocco": [
    "Marruecos",
    "モロッコ",
    "Morocco",
    "Marrocos",
    "🇲🇦"
  ],
  "Haiti": [
    "Haití",
    "ハイチ",
    "Haiti",
    "Haiti",
    "🇭🇹"
  ],
  "Scotland": [
    "Escocia",
    "スコットランド",
    "Scotland",
    "Escócia",
    "🏴"
  ],
  "Australia": [
    "Australia",
    "オーストラリア",
    "Australia",
    "Austrália",
    "🇦🇺"
  ],
  "Turkey": [
    "Turquía",
    "トルコ",
    "Turkey",
    "Turquia",
    "🇹🇷"
  ],
  "Germany": [
    "Alemania",
    "ドイツ",
    "Germany",
    "Alemanha",
    "🇩🇪"
  ],
  "Curacao": [
    "Curazao",
    "キュラソー",
    "Curacao",
    "Curaçao",
    "🇨🇼"
  ],
  "Netherlands": [
    "Países Bajos",
    "オランダ",
    "Netherlands",
    "Países Baixos",
    "🇳🇱"
  ],
  "Japan": [
    "Japón",
    "日本",
    "Japan",
    "Japão",
    "🇯🇵"
  ],
  "Ivory Coast": [
    "Costa de Marfil",
    "コートジボワール",
    "Ivory Coast",
    "Costa do Marfim",
    "🇨🇮"
  ],
  "Ecuador": [
    "Ecuador",
    "エクアドル",
    "Ecuador",
    "Equador",
    "🇪🇨"
  ],
  "Sweden": [
    "Suecia",
    "スウェーデン",
    "Sweden",
    "Suécia",
    "🇸🇪"
  ],
  "Tunisia": [
    "Túnez",
    "チュニジア",
    "Tunisia",
    "Tunísia",
    "🇹🇳"
  ],
  "Spain": [
    "España",
    "スペイン",
    "Spain",
    "Espanha",
    "🇪🇸"
  ],
  "Cape Verde": [
    "Cabo Verde",
    "カーボベルデ",
    "Cape Verde",
    "Cabo Verde",
    "🇨🇻"
  ],
  "Belgium": [
    "Bélgica",
    "ベルギー",
    "Belgium",
    "Bélgica",
    "🇧🇪"
  ],
  "Egypt": [
    "Egipto",
    "エジプト",
    "Egypt",
    "Egito",
    "🇪🇬"
  ],
  "Saudi Arabia": [
    "Arabia Saudita",
    "サウジアラビア",
    "Saudi Arabia",
    "Arábia Saudita",
    "🇸🇦"
  ],
  "Uruguay": [
    "Uruguay",
    "ウルグアイ",
    "Uruguay",
    "Uruguai",
    "🇺🇾"
  ],
  "Iran": [
    "Irán",
    "イラン",
    "Iran",
    "Irã",
    "🇮🇷"
  ],
  "New Zealand": [
    "Nueva Zelanda",
    "ニュージーランド",
    "New Zealand",
    "Nova Zelândia",
    "🇳🇿"
  ],
  "France": [
    "Francia",
    "フランス",
    "France",
    "França",
    "🇫🇷"
  ],
  "Senegal": [
    "Senegal",
    "セネガル",
    "Senegal",
    "Senegal",
    "🇸🇳"
  ],
  "Iraq": [
    "Irak",
    "イラク",
    "Iraq",
    "Iraque",
    "🇮🇶"
  ],
  "Norway": [
    "Noruega",
    "ノルウェー",
    "Norway",
    "Noruega",
    "🇳🇴"
  ],
  "Argentina": [
    "Argentina",
    "アルゼンチン",
    "Argentina",
    "Argentina",
    "🇦🇷"
  ],
  "Algeria": [
    "Argelia",
    "アルジェリア",
    "Algeria",
    "Argélia",
    "🇩🇿"
  ],
  "Austria": [
    "Austria",
    "オーストリア",
    "Austria",
    "Áustria",
    "🇦🇹"
  ],
  "Jordan": [
    "Jordania",
    "ヨルダン",
    "Jordan",
    "Jordânia",
    "🇯🇴"
  ],
  "Portugal": [
    "Portugal",
    "ポルトガル",
    "Portugal",
    "Portugal",
    "🇵🇹"
  ],
  "DR Congo": [
    "RD Congo",
    "コンゴ民主共和国",
    "DR Congo",
    "RD Congo",
    "🇨🇩"
  ],
  "England": [
    "Inglaterra",
    "イングランド",
    "England",
    "Inglaterra",
    "🏴"
  ],
  "Croatia": [
    "Croacia",
    "クロアチア",
    "Croatia",
    "Croácia",
    "🇭🇷"
  ],
  "Ghana": [
    "Ghana",
    "ガーナ",
    "Ghana",
    "Gana",
    "🇬🇭"
  ],
  "Panama": [
    "Panamá",
    "パナマ",
    "Panama",
    "Panamá",
    "🇵🇦"
  ],
  "Uzbekistan": [
    "Uzbekistán",
    "ウズベキスタン",
    "Uzbekistan",
    "Uzbequistão",
    "🇺🇿"
  ],
  "Colombia": [
    "Colombia",
    "コロンビア",
    "Colombia",
    "Colômbia",
    "🇨🇴"
  ]
};

const T = {
  es: {subtitle:"Polla Mundialista por partido",nameTitle:"👤 Ingresa tu nombre",placeholder:"Ejemplo: Jorge",enterBtn:"Entrar",welcome:"Bienvenido",saved:"✅ Participante guardado.",error:"❌ Error.",potTitle:"💰 Pozo y participantes",participants:"participantes",rulesTitle:"📖 Reglas",ruleTh:"Acierto",pointsTh:"Pts",rules:[["Marcador exacto","+5"],["Ganador/empate correcto","+3"],["Fallo","0"]],matchRankTitle:"🏆 Ganador del partido",rankNameTh:"Nombre",rankPredTh:"Score",rankPtsTh:"Pts",predTitle:"⚽ Partido",predHelp:"Elige fecha y partido.",saveBtn:"Guardar pronóstico",predSaved:"✅ Pronóstico guardado.",noName:"⚠️ Primero ingresa tu nombre.",closed:"🔒 Cerrado",matches:"partidos",winnerPending:"Aún no hay resultado final.",noPreds:"Aún no hay pronósticos para este partido.",score:"Score",countdown:"Cierra en",viewParticipants:"Ver participantes ▼",hideParticipants:"Ocultar participantes ▲", group:"Grupo"},
  ja: {subtitle:"試合ごとのワールドカップ予想",nameTitle:"👤 お名前を入力してください",placeholder:"例：田中",enterBtn:"参加する",welcome:"ようこそ",saved:"✅ 参加者が登録されました。",error:"❌ エラー。",potTitle:"💰 合計と参加者",participants:"参加者",rulesTitle:"📖 ルール",ruleTh:"内容",pointsTh:"点",rules:[["スコア完全的中","5点"],["勝敗・引き分け的中","3点"],["不的中","0"]],matchRankTitle:"🏆 この試合の勝者",rankNameTh:"名前",rankPredTh:"予想",rankPtsTh:"点",predTitle:"⚽ 試合",predHelp:"日付と試合を選んでください。",saveBtn:"予想を保存",predSaved:"✅ 保存しました。",noName:"⚠️ 先にお名前を入力してください。",closed:"🔒 受付終了",matches:"試合",winnerPending:"まだ試合結果がありません。",noPreds:"この試合の予想はまだありません。",score:"スコア",countdown:"締切まで",viewParticipants:"参加者を見る ▼",hideParticipants:"参加者を隠す ▲", group:"グループ"},
  en: {subtitle:"Prediction pool by match",nameTitle:"👤 Enter your name",placeholder:"Example: Jorge",enterBtn:"Join",welcome:"Welcome",saved:"✅ Participant saved.",error:"❌ Error.",potTitle:"💰 Pot and participants",participants:"participants",rulesTitle:"📖 Rules",ruleTh:"Prediction",pointsTh:"Pts",rules:[["Exact score","+5"],["Correct winner/draw","+3"],["Wrong","0"]],matchRankTitle:"🏆 Match winner",rankNameTh:"Name",rankPredTh:"Score",rankPtsTh:"Pts",predTitle:"⚽ Match",predHelp:"Choose date and match.",saveBtn:"Save prediction",predSaved:"✅ Prediction saved.",noName:"⚠️ Enter your name first.",closed:"🔒 Closed",matches:"matches",winnerPending:"No final result yet.",noPreds:"No predictions for this match yet.",score:"Score",countdown:"Closes in",viewParticipants:"View participants ▼",hideParticipants:"Hide participants ▲", group:"Group"},
  pt: {subtitle:"Bolão por partida",nameTitle:"👤 Digite seu nome",placeholder:"Exemplo: Jorge",enterBtn:"Entrar",welcome:"Bem-vindo",saved:"✅ Participante salvo.",error:"❌ Erro.",potTitle:"💰 Prêmio e participantes",participants:"participantes",rulesTitle:"📖 Regras",ruleTh:"Acerto",pointsTh:"Pts",rules:[["Placar exato","+5"],["Vencedor/empate correto","+3"],["Erro","0"]],matchRankTitle:"🏆 Vencedor da partida",rankNameTh:"Nome",rankPredTh:"Score",rankPtsTh:"Pts",predTitle:"⚽ Partida",predHelp:"Escolha data e partida.",saveBtn:"Salvar palpite",predSaved:"✅ Palpite salvo.",noName:"⚠️ Primeiro digite seu nome.",closed:"🔒 Encerrado",matches:"partidas",winnerPending:"Ainda não há resultado final.",noPreds:"Ainda não há palpites para esta partida.",score:"Score",countdown:"Fecha em",viewParticipants:"Ver participantes ▼",hideParticipants:"Ocultar participantes ▲", group:"Grupo"}
};

let currentLang = "es";
let currentPlayerName = localStorage.getItem("playerName") || "";
let resultsCache = {};
let predictionsCache = [];
let selectedDayKey = localStorage.getItem("selectedDayKey") || null;
let selectedMatchId = localStorage.getItem("selectedMatchId") || null;
let stakeAmount = 100;
let lastWinnerKey = "";
let participantsOpen = false;

let allMatches = STATIC_MATCHES.map(m => ({
  id: m.id,
  groupLetter: (m.group || "").replace("Group ",""),
  homeKey: m.homeKey,
  awayKey: m.awayKey,
  homeCode: m.homeCode,
  awayCode: m.awayCode,
  start: m.startUtc,
  finalHome: m.finalHome,
  finalAway: m.finalAway,
  status: m.status || "scheduled"
}));

let matches = allMatches.filter(m => isVisibleMatchByJst(m.start));

function safeId(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9áéíóúñãõç一-龯ぁ-んァ-ン]/gi, "_");
}
function langIndex() { return currentLang === "es" ? 0 : currentLang === "ja" ? 1 : currentLang === "en" ? 2 : 3; }
function teamLabel(key) {
  const data = TEAM_NAMES[key] || [key,key,key,key,"⚽"];
  return `${data[4]} ${data[langIndex()]}`;
}
function teamShort(key) {
  const data = TEAM_NAMES[key] || [key,key,key,key,"⚽"];
  return `${data[4]} ${data[langIndex()].split(" ")[0]}`;
}
function groupLabel(m) { return `${T[currentLang].group} ${m.groupLetter}`; }
function isLocked(start) { return Date.now() >= new Date(start).getTime(); }
function localDayKey(start) { return new Date(start).toLocaleDateString("sv-SE", { timeZone: JAPAN_TIMEZONE }); }
function timeJst(start) {
  return new Date(start).toLocaleTimeString(currentLang === "ja" ? "ja-JP" : "es-ES", {
    hour: "2-digit", minute: "2-digit", timeZone: JAPAN_TIMEZONE
  });
}
function dateShort(start) {
  return new Date(start).toLocaleDateString("es-ES", { day: "2-digit", month: "short", timeZone: JAPAN_TIMEZONE }).replace(".", "");
}
function weekday(start) {
  const loc = currentLang === "ja" ? "ja-JP" : currentLang === "en" ? "en-US" : currentLang === "pt" ? "pt-BR" : "es-ES";
  return new Date(start).toLocaleDateString(loc, { weekday: "short", timeZone: JAPAN_TIMEZONE });
}
function dateLong(start) {
  const loc = currentLang === "ja" ? "ja-JP" : currentLang === "en" ? "en-US" : currentLang === "pt" ? "pt-BR" : "es-ES";
  return new Date(start).toLocaleDateString(loc, {
    weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: JAPAN_TIMEZONE
  });
}
function buildGroups() {
  const sorted = [...matches].sort((a,b) => new Date(a.start) - new Date(b.start));
  const g = {};
  for (const m of sorted) (g[localDayKey(m.start)] ||= []).push(m);
  return g;
}
function selectedMatch() { return matches.find(m => m.id === selectedMatchId) || matches[0]; }

function officialResultFor(match) {
  if (!match) return null;

  const normalizeResult = (r) => {
    if (!resultValuesOk(r)) return null;
    return {
      ...r,
      matchId: String(r.matchId || match.id),
      home: Number(r.home ?? r.homeScore ?? r.finalHome),
      away: Number(r.away ?? r.awayScore ?? r.finalAway)
    };
  };

  const byId = resultsCache[String(match.id)] || resultsCache[match.id];
  const exact = normalizeResult(byId);
  if (exact) return exact;

  const byMatchId = Object.values(resultsCache).find(r => String(r.matchId) === String(match.id));
  const matchedId = normalizeResult(byMatchId);
  if (matchedId) return matchedId;

  const byTeams = Object.values(resultsCache).find(r =>
    (sameTeamName(r.homeKey || r.providerHome, match.homeKey) && sameTeamName(r.awayKey || r.providerAway, match.awayKey)) ||
    (sameTeamName(r.homeKey || r.providerHome, match.awayKey) && sameTeamName(r.awayKey || r.providerAway, match.homeKey))
  );
  const teamResult = normalizeResult(byTeams);
  if (teamResult) {
    const reversed =
      sameTeamName(byTeams.homeKey || byTeams.providerHome, match.awayKey) &&
      sameTeamName(byTeams.awayKey || byTeams.providerAway, match.homeKey);
    if (reversed) return { ...teamResult, home: teamResult.away, away: teamResult.home };
    return teamResult;
  }

  return normalizeResult({ matchId: match.id, home: match.finalHome, away: match.finalAway, source: "static" });
}
function hasOfficialResult(match) {
  return !!officialResultFor(match);
}

function cleanTeamNameForMatch(v) {
  return String(v || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}
function sameTeamName(a, b) {
  const aa = cleanTeamNameForMatch(a);
  const bb = cleanTeamNameForMatch(b);
  return aa && bb && (aa === bb || aa.includes(bb) || bb.includes(aa));
}
function resultValuesOk(r) {
  if (!r) return false;
  const h = r.home ?? r.homeScore ?? r.finalHome;
  const a = r.away ?? r.awayScore ?? r.finalAway;
  return h !== "" && a !== "" && h != null && a != null && !Number.isNaN(Number(h)) && !Number.isNaN(Number(a));
}

function flagOnly(key) {
  const data = TEAM_NAMES[key] || [key,key,key,key,"⚽"];
  return data[4];
}
function tabScoreLabel(match) {
  const res = officialResultFor(match);
  if (!res) return `<span class="match-tab-time">${timeJst(match.start)}</span><span class="match-tab-teams">${teamShort(match.homeKey)} vs ${teamShort(match.awayKey)}</span>`;
  return `<span class="match-tab-time">FT</span><span class="match-tab-teams">${flagOnly(match.homeKey)} ${res.home} - ${res.away} ${flagOnly(match.awayKey)}</span>`;
}

function saveSelectedPosition() {
  if (selectedDayKey) localStorage.setItem("selectedDayKey", selectedDayKey);
  if (selectedMatchId) localStorage.setItem("selectedMatchId", selectedMatchId);
}
function currentPredictionFor(matchId) {
  if (!currentPlayerName) return null;
  const playerId = safeId(currentPlayerName);
  return predictionsCache.find(p => String(p.matchId) === String(matchId) && p.playerId === playerId) || null;
}
function calcPoints(pred, res) {
  if (!res || res.home == null || res.away == null || res.home === "" || res.away === "") return 0;
  const ph = Number(pred.predictedHome), pa = Number(pred.predictedAway), rh = Number(res.home), ra = Number(res.away);
  if (ph === rh && pa === ra) return 5;
  const ps = ph === pa ? "D" : ph > pa ? "H" : "A";
  const rs = rh === ra ? "D" : rh > ra ? "H" : "A";
  return ps === rs ? 3 : 0;
}
function countdownText(start) {
  const diff = new Date(start).getTime() - Date.now();
  if (diff <= 0) return T[currentLang].closed;
  const d = Math.floor(diff/86400000);
  const h = Math.floor((diff%86400000)/3600000);
  const m = Math.floor((diff%3600000)/60000);
  const s = Math.floor((diff%60000)/1000);
  return `${T[currentLang].countdown}: ${d>0?d+"d ":""}${h}h ${m}m ${s}s`;
}

window.syncOpenFootball = function() {
  document.getElementById("dataStatus").textContent = `✅ Vista limpia desde sábado/domingo: ${matches.length} partidos visibles.`;
  ensureVisibleSelection();
  saveSelectedPosition();
  renderAll();
};

window.setLang = function(lang) {
  currentLang = lang;
  document.querySelectorAll(".langs button").forEach(b => b.classList.remove("active"));
  document.getElementById("btn-" + lang).classList.add("active");
  const t = T[lang];
  ["subtitle","nameTitle","enterBtn","potTitle","rulesTitle","ruleTh","pointsTh","matchRankTitle","rankNameTh","rankPredTh","rankPtsTh","predTitle","predHelp","saveBtn"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = t[id];
  });
  document.getElementById("playerName").placeholder = t.placeholder;
  document.getElementById("rulesBody").innerHTML = t.rules.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("");
  if (currentPlayerName) document.getElementById("welcomeText").textContent = `${t.welcome}, ${currentPlayerName}!`;
  renderAll();
};

window.enterGame = async function() {
  const name = document.getElementById("playerName").value.trim();
  const status = document.getElementById("saveStatus");
  if (!name) { status.textContent = T[currentLang].noName; return; }
  try {
    await setDoc(doc(db, "players", safeId(name)), { name, language: currentLang, updatedAt: serverTimestamp() }, { merge: true });
    currentPlayerName = name;
    localStorage.setItem("playerName", name);
    document.getElementById("welcomeText").textContent = `${T[currentLang].welcome}, ${name}!`;
    status.textContent = T[currentLang].saved;
    document.getElementById("playerName").value = "";
    renderAll();
  } catch(e) {
    console.error(e);
    status.textContent = T[currentLang].error;
  }
};

window.selectDateTab = function(dayKey) {
  if (!buildGroups()[dayKey]) return;
  selectedDayKey = dayKey;
  const list = buildGroups()[dayKey] || [];
  selectedMatchId = list[0]?.id || selectedMatchId;
  saveSelectedPosition();
  renderAll();
};
window.selectMatchTab = function(matchId) {
  selectedMatchId = matchId;
  saveSelectedPosition();
  renderAll();
};
window.toggleParticipants = function() {
  participantsOpen = !participantsOpen;
  renderMatchRanking();
};


function ensureVisibleSelection() {
  const groups = buildGroups();
  const keys = Object.keys(groups);
  if (!keys.length) return;
  if (!selectedDayKey || !groups[selectedDayKey]) {
    selectedDayKey = keys[0];
    selectedMatchId = groups[selectedDayKey][0]?.id || null;
  }
  if (!matches.find(m => String(m.id) === String(selectedMatchId))) {
    selectedMatchId = groups[selectedDayKey]?.[0]?.id || matches[0]?.id || null;
  }
  localStorage.setItem("selectedDayKey", selectedDayKey || "");
  localStorage.setItem("selectedMatchId", selectedMatchId || "");
}

function renderAll() {
  ensureVisibleSelection();
  renderTabs();
  renderSelectedMatch();
  renderMatchRanking();
  renderAdminResults();
}
function renderTabs() {
  const groups = buildGroups();
  const keys = Object.keys(groups);
  if (!keys.length) {
    document.getElementById("dateTabs").innerHTML = "<button class='active-date'>Sin partidos visibles</button>";
    document.getElementById("matchTabs").innerHTML = "";
    const box = document.getElementById("selectedMatchBox");
    if (box) box.innerHTML = "<div class='selected-match'>No hay partidos activos desde sábado/domingo.</div>";
    return;
  }
  if (!selectedDayKey || !groups[selectedDayKey]) selectedDayKey = keys[0];
  if (!selectedMatchId || !matches.find(m => m.id === selectedMatchId)) selectedMatchId = groups[selectedDayKey]?.[0]?.id;
  document.getElementById("dateTabs").innerHTML = keys.map(k => {
    const list = groups[k], first = list[0];
    return `<button class="${k===selectedDayKey?"active-date":""}" onclick="selectDateTab('${k}')"><span class="tab-day">${weekday(first.start)}</span><span class="tab-date">${dateShort(first.start)}</span><span class="tab-count">${list.length} ${T[currentLang].matches}</span></button>`;
  }).join("");
  const list = groups[selectedDayKey] || [];
  document.getElementById("matchTabs").innerHTML = list.map(m =>
    `<button class="${m.id===selectedMatchId?"active-match":""}" onclick="selectMatchTab('${m.id}')">${tabScoreLabel(m)}</button>`
  ).join("");
}
function renderSelectedMatch() {
  const m = selectedMatch();
  if (!m) return;
  const res = officialResultFor(m);
  const locked = isLocked(m.start) || hasOfficialResult(m);
  const savedPred = currentPredictionFor(m.id);
  const resultText = res ? `<span class="result-badge">Resultado final: ${res.home} - ${res.away}</span>` : "";
  document.getElementById("selectedMatchBox").innerHTML = `
    <div class="selected-match">
      <div class="teams-line">${teamLabel(m.homeKey)} vs ${teamLabel(m.awayKey)}</div>
      <div class="match-meta">📅 ${dateLong(m.start)} · 🕒 ${timeJst(m.start)} JST<br>${groupLabel(m)} · UTC: ${new Date(m.start).toISOString().replace(".000Z","Z")}</div>
      <div class="countdown" id="countdownBox">${countdownText(m.start)}</div><br>
      ${resultText}
      ${locked ? `<div class="locked">${T[currentLang].closed}</div>` : `<div class="score"><input id="selected_home" type="number" min="0" placeholder="0" value="${savedPred ? savedPred.predictedHome : ""}"><span>-</span><input id="selected_away" type="number" min="0" placeholder="0" value="${savedPred ? savedPred.predictedAway : ""}"></div>`}
    </div>`;
}

window.saveSelectedPrediction = async function() {
  const status = document.getElementById("predictionStatus");
  const m = selectedMatch();
  if (!currentPlayerName) { status.textContent = T[currentLang].noName; return; }
  if (!m || isLocked(m.start)) { status.textContent = T[currentLang].closed; return; }
  const home = document.getElementById("selected_home")?.value;
  const away = document.getElementById("selected_away")?.value;
  if (home === "" || away === "") { status.textContent = "⚠️ Completa el marcador."; return; }
  const playerId = safeId(currentPlayerName);
  await setDoc(doc(db, "predictions", `${playerId}_${m.id}`), {
    playerId,
    playerName: currentPlayerName,
    matchId: m.id,
    homeKey: m.homeKey,
    awayKey: m.awayKey,
    predictedHome: Number(home),
    predictedAway: Number(away),
    points: calcPoints({predictedHome:Number(home), predictedAway:Number(away)}, officialResultFor(m)),
    matchStart: m.start,
    updatedAt: serverTimestamp()
  }, { merge: true });
  status.textContent = T[currentLang].predSaved;
  renderAll();
};

function selectedRows() {
  const m = selectedMatch();
  if (!m) return [];
  return predictionsCache
    .filter(p => String(p.matchId) === String(m.id))
    .map(p => ({ ...p, points: calcPoints(p, officialResultFor(m)) }))
    .sort((a,b) => b.points - a.points);
}
function renderPotAndParticipants(rows) {
  const count = rows.length;
  const total = count * stakeAmount;
  document.getElementById("potBox").innerHTML = `¥${total.toLocaleString()}<span class="pot-detail">${count} ${T[currentLang].participants} × ¥${stakeAmount}</span>`;
  document.getElementById("matchParticipantsSummary").textContent = `${count} ${T[currentLang].participants} · Total ¥${total.toLocaleString()}`;
  document.getElementById("toggleParticipantsBtn").textContent = participantsOpen ? T[currentLang].hideParticipants : T[currentLang].viewParticipants;
  const list = document.getElementById("matchParticipantsList");
  list.className = `participants-scroll ${participantsOpen ? "open" : ""}`;
  if (!rows.length) {
    list.innerHTML = `<div class="participant-empty">${T[currentLang].noPreds}</div>`;
    return;
  }
  list.innerHTML = rows.map((r,i) => `<div class="participant-row"><span class="participant-name">${i+1}. ${r.playerName}</span><span class="participant-score">${r.predictedHome} - ${r.predictedAway}</span></div>`).join("");
}
function renderMatchRanking() {
  const m = selectedMatch();
  const body = document.getElementById("matchRankingBody");
  const box = document.getElementById("winnerBox");
  if (!m) { body.innerHTML = ""; return; }
  const rows = selectedRows();
  renderPotAndParticipants(rows);
  const res = officialResultFor(m);
  if (!res) box.innerHTML = T[currentLang].winnerPending;
  else if (!rows.length) box.innerHTML = T[currentLang].noPreds;
  else {
    const top = rows[0].points;
    const winners = rows.filter(r => r.points === top && top > 0);
    if (winners.length) {
      const names = winners.map(r => r.playerName).join(", ");
      const score = winners[0].predictedHome + " - " + winners[0].predictedAway;
      const key = `${m.id}_${names}_${score}_${top}`;
      box.innerHTML = `🏆 <span class="winner-name">${names}</span><span class="winner-score">${T[currentLang].score}: ${score} · ${top} pts</span>`;
      if (lastWinnerKey !== key) { lastWinnerKey = key; launchConfetti(); }
    } else box.innerHTML = T[currentLang].noPreds;
  }
  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="4">${T[currentLang].noPreds}</td></tr>`;
    return;
  }
  body.innerHTML = rows.map((r,i) => `<tr><td>${i+1}</td><td>${r.playerName}</td><td>${r.predictedHome} - ${r.predictedAway}</td><td>${r.points}</td></tr>`).join("");
}
function renderAdminResults() {
  const panel = document.getElementById("adminPanel");
  if (new URLSearchParams(location.search).get("admin") === "jorge") panel.classList.add("show");
  const stakeInput = document.getElementById("stakeAmount");
  if (stakeInput) stakeInput.value = stakeAmount;
  const box = document.getElementById("adminResults");
  if (!box) return;
  box.innerHTML = matches.map(m => {
    const r = officialResultFor(m) || {};
    return `<div class="admin-match"><strong>${teamLabel(m.homeKey)} vs ${teamLabel(m.awayKey)}</strong><div class="score"><input id="res_${m.id}_home" type="number" min="0" value="${r.home ?? ""}" placeholder="-"><span>-</span><input id="res_${m.id}_away" type="number" min="0" value="${r.away ?? ""}" placeholder="-"></div></div>`;
  }).join("");
}
window.saveStakeAmount = async function() {
  stakeAmount = Number(document.getElementById("stakeAmount").value || 100);
  await setDoc(doc(db, "settings", "stake"), { amount: stakeAmount, updatedAt: serverTimestamp() }, { merge: true });
  renderMatchRanking();
};
window.saveResultsAndCalculate = async function() {
  const adminStatus = document.getElementById("adminStatus");
  try {
    if (adminStatus) adminStatus.textContent = "⏳ Guardando resultados manuales...";
    let saved = 0;
    for (const m of matches) {
      const h = document.getElementById(`res_${m.id}_home`)?.value;
      const a = document.getElementById(`res_${m.id}_away`)?.value;
      if (h === "" || a === "" || h == null || a == null) continue;

      const resultObj = {
        matchId: m.id,
        homeKey: m.homeKey,
        awayKey: m.awayKey,
        home: Number(h),
        away: Number(a),
        status: "MANUAL",
        provider: "manual",
        updatedAt: serverTimestamp()
      };

      // IMPORTANTE: actualiza memoria local antes de recalcular puntos.
      resultsCache[m.id] = { ...resultObj, updatedAt: new Date().toISOString() };

      await setDoc(doc(db, "results", m.id), resultObj, { merge: true });
      saved++;
    }

    await updatePredictionPoints();
    await forceRefreshDataFromFirestore();
    renderAll();
    if (adminStatus) adminStatus.textContent = `✅ Resultados manuales guardados: ${saved}. Ranking actualizado.`;
  } catch (err) {
    console.error(err);
    if (adminStatus) adminStatus.textContent = "❌ Error guardando resultados manuales.";
  }
};
async function updatePredictionPoints() {
  const snap = await getDocs(collection(db, "predictions"));
  const updates = [];
  const newPredictions = [];

  snap.forEach(d => {
    const p = d.data();
    const match = matches.find(m => String(m.id) === String(p.matchId));
    const res = match ? officialResultFor(match) : resultsCache[String(p.matchId)] || resultsCache[p.matchId];
    const points = calcPoints(p, res);
    const updatedPrediction = { ...p, points };
    newPredictions.push(updatedPrediction);
    updates.push(setDoc(doc(db, "predictions", d.id), { points }, { merge: true }));
  });

  await Promise.all(updates);

  // IMPORTANTE: actualiza la memoria local inmediatamente, sin esperar al listener.
  predictionsCache = newPredictions;
}
function launchConfetti() {
  const layer = document.getElementById("confettiLayer");
  const colors = ["#ffd34d","#31d27c","#e9354f","#ffffff","#2aa7ff"];
  for (let i=0;i<80;i++) {
    const el = document.createElement("div");
    el.className = "confetti";
    el.style.left = Math.random()*100 + "vw";
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.animationDelay = Math.random()*0.8 + "s";
    layer.appendChild(el);
    setTimeout(() => el.remove(), 3600);
  }
}
function listenResults() {
  onSnapshot(collection(db, "results"), s => {
    resultsCache = {};
    s.forEach(d => {
      const data = { id: d.id, ...d.data() };
      resultsCache[String(d.id)] = data;
      if (data.matchId != null) resultsCache[String(data.matchId)] = data;
    });
    renderAll();
  });
}
function listenPredictions() { onSnapshot(collection(db, "predictions"), s => { predictionsCache = []; s.forEach(d => predictionsCache.push(d.data())); renderMatchRanking(); renderSelectedMatch(); }); }
function listenSettings() { onSnapshot(doc(db, "settings", "stake"), snap => { if (snap.exists() && snap.data().amount != null) stakeAmount = Number(snap.data().amount); renderMatchRanking(); }); }



async function forceRefreshDataFromFirestore() {
  try {
    const [playersSnap, predictionsSnap, resultsSnap, settingsSnap] = await Promise.all([
      getDocs(collection(db, "players")),
      getDocs(collection(db, "predictions")),
      getDocs(collection(db, "results")),
      getDocs(collection(db, "settings"))
    ]);
    playersCache = [];
    playersSnap.forEach(d => playersCache.push({ id: d.id, ...d.data() }));
    predictionsCache = [];
    predictionsSnap.forEach(d => predictionsCache.push({ id: d.id, ...d.data() }));
    resultsCache = {};
    resultsSnap.forEach(d => {
      const data = { id: d.id, ...d.data() };
      resultsCache[String(d.id)] = data;
      if (data.matchId != null) resultsCache[String(data.matchId)] = data;
    });
    settingsCache = {};
    settingsSnap.forEach(d => settingsCache[d.id] = d.data());
    renderAll();
    return true;
  } catch (err) {
    console.error("forceRefreshDataFromFirestore error", err);
    return false;
  }
}
window.forceRefreshDataFromFirestore = forceRefreshDataFromFirestore;

window.syncResultsFromApi = async function() {
  const adminStatus = document.getElementById("adminStatus");
  const dataStatus = document.getElementById("dataStatus");
  try {
    if (adminStatus) adminStatus.textContent = "⏳ Consultando API de resultados...";
    if (dataStatus) dataStatus.textContent = "⏳ Actualizando resultados...";
    const r = await fetch("/api/sync-results?ts=" + Date.now(), { cache: "no-store" });
    const data = await r.json();

    if (!data.ok) {
      const msg = data.message || "No se pudo sincronizar resultados.";
      if (adminStatus) adminStatus.textContent = "⚠️ " + msg;
      if (dataStatus) dataStatus.textContent = "⚠️ API no configurada o sin resultados. Manual/precargado activo.";
      return;
    }

    const activeIds = new Set(matches.map(m => String(m.id)));
    let saved = 0;
    for (const item of data.results || []) {
      if (!activeIds.has(String(item.matchId))) continue;
      const resultObj = {
        matchId: item.matchId,
        home: Number(item.home),
        away: Number(item.away),
        status: item.status || "FT",
        provider: item.provider || data.provider || "api-football",
        providerFixtureId: item.providerFixtureId || null,
        providerHome: item.providerHome || "",
        providerAway: item.providerAway || "",
        fixtureDate: item.fixtureDate || "",
        apiUpdatedAt: item.updatedAt || new Date().toISOString(),
        updatedAt: serverTimestamp()
      };

      // IMPORTANTE: actualiza memoria local antes de recalcular puntos.
      resultsCache[item.matchId] = { ...resultObj, updatedAt: new Date().toISOString() };

      await setDoc(doc(db, "results", item.matchId), resultObj, { merge: true });
      saved++;
    }

    await updatePredictionPoints();
    await forceRefreshDataFromFirestore();
    renderAll();

    const checked = Array.isArray(data.checkedDates) ? data.checkedDates.join(", ") : "";
    if (adminStatus) adminStatus.textContent = `✅ Football-data sincronizada. ${saved} resultados guardados. Fechas revisadas: ${checked}`;
    if (dataStatus) dataStatus.textContent = `✅ Football-data: ${saved}`;
  } catch (err) {
    console.error(err);
    if (adminStatus) adminStatus.textContent = "❌ Error sincronizando API.";
    if (dataStatus) dataStatus.textContent = "⚠️ No se pudo sincronizar API.";
  }
};


window.recalculateAllWinners = async function() {
  const adminStatus = document.getElementById("adminStatus");
  if (adminStatus) adminStatus.textContent = "⏳ Recalculando puntos y ganadores...";
  await forceRefreshDataFromFirestore();
  await updatePredictionPoints();
  await forceRefreshDataFromFirestore();
  renderAll();
  if (adminStatus) adminStatus.textContent = "✅ Puntos y ganadores recalculados desde Firebase.";
};

setInterval(() => {
  const m = selectedMatch();
  const countdownBox = document.getElementById("countdownBox");
  if (m && countdownBox) countdownBox.textContent = countdownText(m.start);
}, 1000);

if (currentPlayerName) document.getElementById("welcomeText").textContent = `${T[currentLang].welcome}, ${currentPlayerName}!`;
setLang("es");
listenResults();
listenPredictions();
listenSettings();
syncOpenFootball();
setTimeout(() => syncResultsFromApi(), 1500);
setInterval(() => syncResultsFromApi(), 15 * 60 * 1000);

setTimeout(() => {
  const ds = document.getElementById("dataStatus");
  if (ds) ds.textContent = (ds.textContent || "Sistema listo") + " · v8.7";
}, 2000);

setTimeout(() => {
  const ds = document.getElementById("dataStatus");
  if (ds) ds.textContent = `✅ Partidos anteriores ocultos. Mostrando solo desde sábado/domingo · v9.2`;
}, 1800);
