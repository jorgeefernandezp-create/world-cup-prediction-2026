const APP_VERSION = "11.1-loading-fix";
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
    "id": "66457014",
    "group": "Grupo I",
    "homeKey": "Norway",
    "awayKey": "France",
    "homeCode": "NO",
    "awayCode": "FR",
    "startUtc": "2026-06-26T19:00:00Z"
  },
  {
    "id": "66457016",
    "group": "Grupo I",
    "homeKey": "Senegal",
    "awayKey": "Iraq",
    "homeCode": "SN",
    "awayCode": "IQ",
    "startUtc": "2026-06-26T19:00:00Z"
  },
  {
    "id": "66457002",
    "group": "Grupo H",
    "homeKey": "Uruguay",
    "awayKey": "Spain",
    "homeCode": "UY",
    "awayCode": "ES",
    "startUtc": "2026-06-27T00:00:00Z"
  },
  {
    "id": "66457004",
    "group": "Grupo H",
    "homeKey": "Cape Verde",
    "awayKey": "Saudi Arabia",
    "homeCode": "CV",
    "awayCode": "SA",
    "startUtc": "2026-06-27T00:00:00Z"
  },
  {
    "id": "66456990",
    "group": "Grupo G",
    "homeKey": "New Zealand",
    "awayKey": "Belgium",
    "homeCode": "NZ",
    "awayCode": "BE",
    "startUtc": "2026-06-27T03:00:00Z"
  },
  {
    "id": "66456992",
    "group": "Grupo G",
    "homeKey": "Egypt",
    "awayKey": "Iran",
    "homeCode": "EG",
    "awayCode": "IR",
    "startUtc": "2026-06-27T03:00:00Z"
  },
  {
    "id": "66457050",
    "group": "Grupo L",
    "homeKey": "Panama",
    "awayKey": "England",
    "homeCode": "PA",
    "awayCode": "GB",
    "startUtc": "2026-06-27T21:00:00Z"
  },
  {
    "id": "66457052",
    "group": "Grupo L",
    "homeKey": "Croatia",
    "awayKey": "Ghana",
    "homeCode": "HR",
    "awayCode": "GH",
    "startUtc": "2026-06-27T21:00:00Z"
  },
  {
    "id": "66457038",
    "group": "Grupo K",
    "homeKey": "Colombia",
    "awayKey": "Portugal",
    "homeCode": "CO",
    "awayCode": "PT",
    "startUtc": "2026-06-27T23:30:00Z"
  },
  {
    "id": "66457040",
    "group": "Grupo K",
    "homeKey": "DR Congo",
    "awayKey": "Uzbekistan",
    "homeCode": "CD",
    "awayCode": "UZ",
    "startUtc": "2026-06-27T23:30:00Z"
  },
  {
    "id": "66457026",
    "group": "Grupo J",
    "homeKey": "Jordan",
    "awayKey": "Argentina",
    "homeCode": "JO",
    "awayCode": "AR",
    "startUtc": "2026-06-28T02:00:00Z"
  },
  {
    "id": "66457028",
    "group": "Grupo J",
    "homeKey": "Algeria",
    "awayKey": "Austria",
    "homeCode": "DZ",
    "awayCode": "AT",
    "startUtc": "2026-06-28T02:00:00Z"
  },
  {
    "id": "53452545",
    "group": "Ronda de 32",
    "homeKey": "South Africa",
    "awayKey": "Canada",
    "homeCode": "ZA",
    "awayCode": "CA",
    "startUtc": "2026-06-28T19:00:00Z",
    "nextMatchId": "53452511",
    "nextSlot": "home"
  },
  {
    "id": "53452557",
    "group": "Ronda de 32",
    "homeKey": "Brazil",
    "awayKey": "Japan",
    "homeCode": "BR",
    "awayCode": "JP",
    "startUtc": "2026-06-29T17:00:00Z",
    "nextMatchId": "53452517",
    "nextSlot": "home"
  },
  {
    "id": "53452541",
    "group": "Ronda de 32",
    "homeKey": "Germany",
    "awayKey": "3.º mejor A/B/C/D/F",
    "homeCode": "DE",
    "awayCode": "TBD",
    "startUtc": "2026-06-29T20:30:00Z",
    "nextMatchId": "53452509",
    "nextSlot": "home"
  },
  {
    "id": "53452547",
    "group": "Ronda de 32",
    "homeKey": "Netherlands",
    "awayKey": "Morocco",
    "homeCode": "NL",
    "awayCode": "MA",
    "startUtc": "2026-06-30T01:00:00Z",
    "nextMatchId": "53452511",
    "nextSlot": "away"
  },
  {
    "id": "53452561",
    "group": "Ronda de 32",
    "homeKey": "Ivory Coast",
    "awayKey": "2.º Grupo I",
    "homeCode": "CI",
    "awayCode": "TBD",
    "startUtc": "2026-06-30T17:00:00Z",
    "nextMatchId": "53452517",
    "nextSlot": "away"
  },
  {
    "id": "53452543",
    "group": "Ronda de 32",
    "homeKey": "1.º Grupo I",
    "awayKey": "3.º mejor C/D/F/G/H",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-06-30T21:00:00Z",
    "nextMatchId": "53452509",
    "nextSlot": "away"
  },
  {
    "id": "53452563",
    "group": "Ronda de 32",
    "homeKey": "Mexico",
    "awayKey": "3.º mejor C/E/F/H/I",
    "homeCode": "MX",
    "awayCode": "TBD",
    "startUtc": "2026-07-01T01:00:00Z",
    "nextMatchId": "53452519",
    "nextSlot": "home"
  },
  {
    "id": "53452565",
    "group": "Ronda de 32",
    "homeKey": "1.º Grupo L",
    "awayKey": "3.º mejor E/H/I/J/K",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-01T16:00:00Z",
    "nextMatchId": "53452519",
    "nextSlot": "away"
  },
  {
    "id": "53452555",
    "group": "Ronda de 32",
    "homeKey": "1.º Grupo G",
    "awayKey": "3.º mejor A/E/H/I/J",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-01T20:00:00Z",
    "nextMatchId": "53452515",
    "nextSlot": "home"
  },
  {
    "id": "53452553",
    "group": "Ronda de 32",
    "homeKey": "United States",
    "awayKey": "Bosnia and Herzegovina",
    "homeCode": "US",
    "awayCode": "BA",
    "startUtc": "2026-07-02T00:00:00Z",
    "nextMatchId": "53452515",
    "nextSlot": "away"
  },
  {
    "id": "53452551",
    "group": "Ronda de 32",
    "homeKey": "1.º Grupo H",
    "awayKey": "2.º Grupo J",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-02T19:00:00Z",
    "nextMatchId": "53452513",
    "nextSlot": "home"
  },
  {
    "id": "53452549",
    "group": "Ronda de 32",
    "homeKey": "2.º Grupo K",
    "awayKey": "2.º Grupo L",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-02T23:00:00Z",
    "nextMatchId": "53452513",
    "nextSlot": "away"
  },
  {
    "id": "53452505",
    "group": "Ronda de 32",
    "homeKey": "Switzerland",
    "awayKey": "3.º mejor E/F/G/I/J",
    "homeCode": "CH",
    "awayCode": "TBD",
    "startUtc": "2026-07-03T03:00:00Z",
    "nextMatchId": "53452523",
    "nextSlot": "home"
  },
  {
    "id": "53452503",
    "group": "Ronda de 32",
    "homeKey": "Australia",
    "awayKey": "2.º Grupo G",
    "homeCode": "AU",
    "awayCode": "TBD",
    "startUtc": "2026-07-03T18:00:00Z",
    "nextMatchId": "53452521",
    "nextSlot": "home"
  },
  {
    "id": "53452569",
    "group": "Ronda de 32",
    "homeKey": "Argentina",
    "awayKey": "2.º Grupo H",
    "homeCode": "AR",
    "awayCode": "TBD",
    "startUtc": "2026-07-03T22:00:00Z",
    "nextMatchId": "53452521",
    "nextSlot": "away"
  },
  {
    "id": "53452507",
    "group": "Ronda de 32",
    "homeKey": "1.º Grupo K",
    "awayKey": "3.º mejor D/E/I/J/L",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-04T01:30:00Z",
    "nextMatchId": "53452523",
    "nextSlot": "away"
  },
  {
    "id": "53452511",
    "group": "Octavos",
    "homeKey": "Ganador RSA-CAN",
    "awayKey": "Ganador NED-MAR",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-04T17:00:00Z",
    "nextMatchId": "53452525",
    "nextSlot": "home"
  },
  {
    "id": "53452509",
    "group": "Octavos",
    "homeKey": "Ganador GER-3.º",
    "awayKey": "Ganador Grupo I-3.º",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-04T21:00:00Z",
    "nextMatchId": "53452525",
    "nextSlot": "away"
  },
  {
    "id": "53452517",
    "group": "Octavos",
    "homeKey": "Ganador BRA-JPN",
    "awayKey": "Ganador CIV-2.º I",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-05T17:00:00Z",
    "nextMatchId": "53452527",
    "nextSlot": "home"
  },
  {
    "id": "53452519",
    "group": "Octavos",
    "homeKey": "Ganador MEX-3.º",
    "awayKey": "Ganador 1.º L-3.º",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-05T21:00:00Z",
    "nextMatchId": "53452527",
    "nextSlot": "away"
  },
  {
    "id": "53452515",
    "group": "Octavos",
    "homeKey": "Ganador 1.º G-3.º",
    "awayKey": "Ganador USA-BIH",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-06T17:00:00Z",
    "nextMatchId": "53452529",
    "nextSlot": "home"
  },
  {
    "id": "53452513",
    "group": "Octavos",
    "homeKey": "Ganador 1.º H-2.º J",
    "awayKey": "Ganador 2.º K-2.º L",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-06T21:00:00Z",
    "nextMatchId": "53452529",
    "nextSlot": "away"
  },
  {
    "id": "53452521",
    "group": "Octavos",
    "homeKey": "Ganador AUS-2.º G",
    "awayKey": "Ganador ARG-2.º H",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-07T17:00:00Z",
    "nextMatchId": "53452531",
    "nextSlot": "home"
  },
  {
    "id": "53452523",
    "group": "Octavos",
    "homeKey": "Ganador SUI-3.º",
    "awayKey": "Ganador 1.º K-3.º",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-07T21:00:00Z",
    "nextMatchId": "53452531",
    "nextSlot": "away"
  },
  {
    "id": "53452525",
    "group": "Cuartos",
    "homeKey": "Ganador Octavos 1",
    "awayKey": "Ganador Octavos 2",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-09T19:00:00Z",
    "nextMatchId": "53452533",
    "nextSlot": "home"
  },
  {
    "id": "53452527",
    "group": "Cuartos",
    "homeKey": "Ganador Octavos 3",
    "awayKey": "Ganador Octavos 4",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-10T19:00:00Z",
    "nextMatchId": "53452533",
    "nextSlot": "away"
  },
  {
    "id": "53452529",
    "group": "Cuartos",
    "homeKey": "Ganador Octavos 5",
    "awayKey": "Ganador Octavos 6",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-11T19:00:00Z",
    "nextMatchId": "53452535",
    "nextSlot": "home"
  },
  {
    "id": "53452531",
    "group": "Cuartos",
    "homeKey": "Ganador Octavos 7",
    "awayKey": "Ganador Octavos 8",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-12T19:00:00Z",
    "nextMatchId": "53452535",
    "nextSlot": "away"
  },
  {
    "id": "53452533",
    "group": "Semifinal",
    "homeKey": "Ganador Cuartos 1",
    "awayKey": "Ganador Cuartos 2",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-14T19:00:00Z",
    "nextMatchId": "53452539",
    "nextSlot": "home"
  },
  {
    "id": "53452535",
    "group": "Semifinal",
    "homeKey": "Ganador Cuartos 3",
    "awayKey": "Ganador Cuartos 4",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-15T19:00:00Z",
    "nextMatchId": "53452539",
    "nextSlot": "away"
  },
  {
    "id": "53452537",
    "group": "Tercer puesto",
    "homeKey": "Perdedor Semifinal 1",
    "awayKey": "Perdedor Semifinal 2",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-18T19:00:00Z"
  },
  {
    "id": "53452539",
    "group": "Final",
    "homeKey": "Ganador Semifinal 1",
    "awayKey": "Ganador Semifinal 2",
    "homeCode": "TBD",
    "awayCode": "TBD",
    "startUtc": "2026-07-19T19:00:00Z"
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
  groupLetter: m.group || "",
  roundName: m.group || "",
  homeKey: m.homeKey,
  awayKey: m.awayKey,
  homeCode: m.homeCode,
  awayCode: m.awayCode,
  start: m.startUtc,
  finalHome: m.finalHome,
  finalAway: m.finalAway,
  status: m.status || "scheduled",
  nextMatchId: m.nextMatchId || "",
  nextSlot: m.nextSlot || ""
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

// ===== V11 OVERRIDES: mostrar todas las fechas de eliminatorias en la sección Partido =====
function v11IsPlaceholder(name) {
  return /Ganador|Perdedor|Por definir|Grupo|3.º|2.º|1.º/i.test(String(name || ""));
}
function v11TeamText(name) {
  return v11IsPlaceholder(name) ? String(name || "Por definir") : teamShort(name);
}
function v11GroupLabel(m) {
  return m.roundName || m.groupLetter || "";
}

function groupLabel(m) { return v11GroupLabel(m); }
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

function renderFullKnockoutCalendar() {
  const target = document.getElementById("fullKnockoutCalendar");
  if (!target) return;
  const rounds = ["Grupo I","Grupo H","Grupo G","Grupo L","Grupo K","Grupo J","Ronda de 32","Octavos","Cuartos","Semifinal","Tercer puesto","Final"];
  const visible = allMatches.filter(m => isVisibleMatchByJst(m.start)).sort((a,b)=>new Date(a.start)-new Date(b.start));
  target.innerHTML = rounds.map(round => {
    const list = visible.filter(m => m.roundName === round);
    if (!list.length) return "";
    return `<div class="full-round"><h3>🏆 ${round}</h3>` + list.map(m => {
      const r = officialResultFor(m);
      const date = new Date(m.start).toLocaleDateString("es-ES", {weekday:"short", day:"2-digit", month:"short", timeZone:JAPAN_TIMEZONE}).replace(".", "");
      const status = r ? `<strong class="ft-badge">FT ${r.home} - ${r.away}</strong>` : `<span class="time-badge">${date} · ${timeJst(m.start)} JST</span>`;
      return `<div class="full-game"><div class="full-teams">${v11TeamText(m.homeKey)} <span>vs</span> ${v11TeamText(m.awayKey)}</div><div>${status}</div></div>`;
    }).join("") + `</div>`;
  }).join("");
}

function buildGroups() {
  const sorted = [...matches].sort((a,b) => new Date(a.start) - new Date(b.start));
  const g = {};
  for (const m of sorted) (g[localDayKey(m.start)] ||= []).push(m);
  return g;
}
function selectedMatch() { return matches.find(m => String(m.id) === String(selectedMatchId)) || matches[0]; }

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
  renderFullKnockoutCalendar();
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
  renderFullKnockoutCalendar();
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
  if (!selectedMatchId || !matches.find(m => String(m.id) === String(selectedMatchId))) selectedMatchId = groups[selectedDayKey]?.[0]?.id;
  document.getElementById("dateTabs").innerHTML = keys.map(k => {
    const list = groups[k], first = list[0];
    return `<button class="${k===selectedDayKey?"active-date":""}" onclick="selectDateTab('${k}')"><span class="tab-day">${weekday(first.start)}</span><span class="tab-date">${dateShort(first.start)}</span><span class="tab-count">${list.length} ${T[currentLang].matches}</span></button>`;
  }).join("");
  const list = groups[selectedDayKey] || [];
  document.getElementById("matchTabs").innerHTML = list.map(m =>
    `<button class="${String(m.id)===String(selectedMatchId)?"active-match":""}" onclick="selectMatchTab('${m.id}')">${tabScoreLabel(m)}</button>`
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
    if (adminStatus) adminStatus.textContent = `✅ Football-data sincronizada. Calendario completo cargado. ${saved} resultados guardados. Fechas revisadas: ${checked}`;
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
window.setLang("es");
listenResults();
listenPredictions();
listenSettings();
window.syncOpenFootball();
setTimeout(() => window.syncResultsFromApi(), 1500);
setInterval(() => window.syncResultsFromApi(), 15 * 60 * 1000);

setTimeout(() => {
  const ds = document.getElementById("dataStatus");
  if (ds) ds.textContent = (ds.textContent || "Sistema listo") + " · v8.7";
}, 2000);

setTimeout(() => {
  const ds = document.getElementById("dataStatus");
  if (ds) ds.textContent = `✅ Calendario completo: grupos finales, Ronda de 32, Octavos, Cuartos, Semifinal y Final · v11`;
}, 1800);
