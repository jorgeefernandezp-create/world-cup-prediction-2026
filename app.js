const T = {
  es: {
    subtitle:"Polla Mundialista para compañeros de trabajo",
    chooseLang:"Elige tu idioma",
    nameTitle:"👤 Ingresa tu nombre",
    nameText:"Solo necesitas escribir tu nombre para participar.",
    placeholder:"Ejemplo: Jorge",
    enterBtn:"Entrar",
    welcome:"Bienvenido",
    menuTitle:"🏠 Menú principal",
    menuPred:"⚽ Mis pronósticos",
    menuRank:"📊 Tabla de posiciones",
    menuCalendar:"📅 Calendario",
    menuRules:"📖 Reglas",
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
    menuTitle:"🏠 メイン画面",
    menuPred:"⚽ 自分の予想",
    menuRank:"📊 順位表",
    menuCalendar:"📅 試合日程",
    menuRules:"📖 ルール",
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
    menuTitle:"🏠 Main menu",
    menuPred:"⚽ My predictions",
    menuRank:"📊 Leaderboard",
    menuCalendar:"📅 Calendar",
    menuRules:"📖 Rules",
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
    menuTitle:"🏠 Menu principal",
    menuPred:"⚽ Meus palpites",
    menuRank:"📊 Classificação",
    menuCalendar:"📅 Calendário",
    menuRules:"📖 Regras",
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

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll(".langs button").forEach(b => b.classList.remove("active"));
  document.getElementById("btn-" + lang).classList.add("active");
  const t = T[lang];

  const ids = [
    "subtitle","chooseLang","nameTitle","nameText","enterBtn","menuTitle","menuPred","menuRank",
    "menuCalendar","menuRules","rulesTitle","ruleTh","pointsTh","lockInfo","rankingTitle",
    "nameTh","scoreTh","rankInfo","predTitle","startedText","closedText","saveBtn"
  ];

  ids.forEach(id => document.getElementById(id).textContent = t[id]);
  document.getElementById("playerName").placeholder = t.placeholder;

  document.getElementById("rulesBody").innerHTML = t.rules
    .map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`)
    .join("");

  const name = document.getElementById("playerName").value;
  if (name) document.getElementById("welcomeText").textContent = `${t.welcome}, ${name}!`;
}

function enterGame() {
  const name = document.getElementById("playerName").value.trim() || "Jorge";
  document.getElementById("welcomeText").textContent = `${T[currentLang].welcome}, ${name}!`;
}

setLang("es");
