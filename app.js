import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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

const T = {
  es: {
    subtitle:"Polla Mundialista para compañeros de trabajo",
    chooseLang:"Elige tu idioma",
    nameTitle:"👤 Ingresa tu nombre",
    nameText:"Solo necesitas escribir tu nombre para participar.",
    placeholder:"Ejemplo: Jorge",
    enterBtn:"Entrar",
    welcome:"Bienvenido",
    saved:"✅ Participante guardado correctamente.",
    error:"❌ No se pudo guardar. Revisa Firebase.",
    playersTitle:"👥 Participantes registrados",
    emptyPlayers:"Todavía no hay participantes.",
    rulesTitle:"📖 Reglas de puntos",
    ruleTh:"Acierto",
    pointsTh:"Puntos",
    rules:[
      ["Ganador o empate correcto","+3"],
      ["Marcador exacto","+5"],
      ["Campeón del Mundial","+10"],
      ["Máximo goleador","+5"]
    ],
    lockInfo:"Los pronósticos se bloquean automáticamente cuando empieza el partido.",
    rankingTitle:"📊 Tabla de posiciones",
    nameTh:"Nombre",
    scoreTh:"Puntos",
    rankInfo:"El ranking se actualizará después de cada partido.",
    predTitle:"⚽ Mis pronósticos",
    startedText:"Partido iniciado",
    closedText:"🔒 Pronóstico cerrado. El partido ya comenzó.",
    saveBtn:"Guardar pronósticos"
  },
  ja: {
    subtitle:"職場の仲間で楽しむワールドカップ予想大会",
    chooseLang:"言語を選択してください",
    nameTitle:"👤 お名前を入力してください",
    nameText:"参加するには、お名前の入力だけで完了です。",
    placeholder:"例：田中",
    enterBtn:"参加する",
    welcome:"ようこそ",
    saved:"✅ 参加者が正常に登録されました。",
    error:"❌ 保存できませんでした。Firebaseを確認してください。",
    playersTitle:"👥 登録済み参加者",
    emptyPlayers:"まだ参加者はいません。",
    rulesTitle:"📖 得点ルール",
    ruleTh:"内容",
    pointsTh:"ポイント",
    rules:[
      ["勝敗（勝ち・引き分け）を的中","3ポイント"],
      ["スコアを完全的中","5ポイント"],
      ["ワールドカップ優勝国を的中","10ポイント"],
      ["大会得点王を的中","5ポイント"]
    ],
    lockInfo:"試合開始時刻を過ぎると、その試合の予想は自動的に締め切られます。",
    rankingTitle:"📊 順位表",
    nameTh:"名前",
    scoreTh:"ポイント",
    rankInfo:"順位表は試合終了後に自動更新されます。",
    predTitle:"⚽ 自分の予想",
    startedText:"試合開始済み",
    closedText:"🔒 受付終了：試合が開始されたため、この試合の予想は変更できません。",
    saveBtn:"予想を保存する"
  },
  en: {
    subtitle:"Prediction game for coworkers",
    chooseLang:"Choose your language",
    nameTitle:"👤 Enter your name",
    nameText:"You only need to enter your name to join.",
    placeholder:"Example: Jorge",
    enterBtn:"Join",
    welcome:"Welcome",
    saved:"✅ Participant saved successfully.",
    error:"❌ Could not save. Check Firebase.",
    playersTitle:"👥 Registered participants",
    emptyPlayers:"There are no participants yet.",
    rulesTitle:"📖 Scoring rules",
    ruleTh:"Prediction",
    pointsTh:"Points",
    rules:[
      ["Correct winner or draw","+3"],
      ["Exact score","+5"],
      ["Correct World Cup champion","+10"],
      ["Correct top scorer","+5"]
    ],
    lockInfo:"Predictions are automatically locked when the match starts.",
    rankingTitle:"📊 Leaderboard",
    nameTh:"Name",
    scoreTh:"Points",
    rankInfo:"The leaderboard updates after each match.",
    predTitle:"⚽ My predictions",
    startedText:"Match started",
    closedText:"🔒 Prediction closed. This match has already started.",
    saveBtn:"Save predictions"
  },
  pt: {
    subtitle:"Bolão de palpites para colegas de trabalho",
    chooseLang:"Escolha seu idioma",
    nameTitle:"👤 Digite seu nome",
    nameText:"Você só precisa digitar seu nome para participar.",
    placeholder:"Exemplo: Jorge",
    enterBtn:"Entrar",
    welcome:"Bem-vindo",
    saved:"✅ Participante salvo com sucesso.",
    error:"❌ Não foi possível salvar. Verifique o Firebase.",
    playersTitle:"👥 Participantes registrados",
    emptyPlayers:"Ainda não há participantes.",
    rulesTitle:"📖 Regras de pontuação",
    ruleTh:"Acerto",
    pointsTh:"Pontos",
    rules:[
      ["Acertar vencedor ou empate","+3"],
      ["Acertar o placar exato","+5"],
      ["Acertar o campeão da Copa","+10"],
      ["Acertar o artilheiro","+5"]
    ],
    lockInfo:"Os palpites são bloqueados automaticamente quando a partida começa.",
    rankingTitle:"📊 Classificação",
    nameTh:"Nome",
    scoreTh:"Pontos",
    rankInfo:"A classificação será atualizada após cada partida.",
    predTitle:"⚽ Meus palpites",
    startedText:"Partida iniciada",
    closedText:"🔒 Palpite encerrado. A partida já começou.",
    saveBtn:"Salvar palpites"
  }
};

let currentLang = "es";

window.setLang = function(lang) {
  currentLang = lang;
  document.querySelectorAll(".langs button").forEach(b => b.classList.remove("active"));
  document.getElementById("btn-" + lang).classList.add("active");
  const t = T[lang];

  const ids = [
    "subtitle","chooseLang","nameTitle","nameText","enterBtn","playersTitle",
    "rulesTitle","ruleTh","pointsTh","lockInfo","rankingTitle","nameTh","scoreTh",
    "rankInfo","predTitle","startedText","closedText","saveBtn"
  ];

  ids.forEach(id => document.getElementById(id).textContent = t[id]);
  document.getElementById("playerName").placeholder = t.placeholder;

  document.getElementById("rulesBody").innerHTML = t.rules
    .map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`)
    .join("");

  const name = document.getElementById("playerName").value.trim();
  if (name) document.getElementById("welcomeText").textContent = `${t.welcome}, ${name}!`;
};

window.enterGame = async function() {
  const nameInput = document.getElementById("playerName");
  const status = document.getElementById("saveStatus");
  const name = nameInput.value.trim();

  if (!name) {
    status.textContent = "⚠️ Escribe tu nombre.";
    return;
  }

  try {
    await addDoc(collection(db, "players"), {
      name,
      language: currentLang,
      points: 0,
      createdAt: serverTimestamp()
    });

    document.getElementById("welcomeText").textContent = `${T[currentLang].welcome}, ${name}!`;
    status.textContent = T[currentLang].saved;
    nameInput.value = "";
  } catch (error) {
    console.error(error);
    status.textContent = T[currentLang].error;
  }
};

function listenPlayers() {
  const playersList = document.getElementById("playersList");
  const q = query(collection(db, "players"), orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    playersList.innerHTML = "";

    if (snapshot.empty) {
      playersList.innerHTML = `<li>${T[currentLang].emptyPlayers}</li>`;
      return;
    }

    snapshot.forEach((doc) => {
      const player = doc.data();
      const li = document.createElement("li");
      li.textContent = player.name;
      playersList.appendChild(li);
    });
  }, (error) => {
    console.error(error);
    playersList.innerHTML = "<li>Error al cargar participantes.</li>";
  });
}

setLang("es");
listenPlayers();
