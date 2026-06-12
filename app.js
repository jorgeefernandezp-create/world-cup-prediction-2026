import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore, collection, serverTimestamp, query, orderBy, onSnapshot,
  doc, setDoc, getDocs, updateDoc
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

const OPENFOOTBALL_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

let matches = [
  { id:"m1", group:"Grupo A", home:"🇯🇵 Japón", away:"🇵🇪 Perú", start:"2026-06-12T19:00:00+09:00" },
  { id:"m2", group:"Grupo B", home:"🇧🇷 Brasil", away:"🇩🇪 Alemania", start:"2026-06-12T22:00:00+09:00" },
  { id:"m3", group:"Grupo C", home:"🇦🇷 Argentina", away:"🇫🇷 Francia", start:"2026-06-13T20:00:00+09:00" },
  { id:"m4", group:"Grupo D", home:"🇪🇸 España", away:"🇬🇧 Inglaterra", start:"2026-06-14T21:00:00+09:00" }
];

const T = {
  es:{subtitle:"Polla Mundialista para compañeros de trabajo",chooseLang:"Elige tu idioma",nameTitle:"👤 Ingresa tu nombre",nameText:"Solo necesitas escribir tu nombre para participar.",placeholder:"Ejemplo: Jorge",enterBtn:"Entrar",welcome:"Bienvenido",saved:"✅ Participante guardado correctamente.",error:"❌ No se pudo guardar. Revisa Firebase.",playersTitle:"👥 Participantes registrados",emptyPlayers:"Todavía no hay participantes.",rulesTitle:"📖 Reglas de puntos",ruleTh:"Acierto",pointsTh:"Puntos",rules:[["Ganador o empate correcto","+3"],["Marcador exacto","+5"],["Campeón del Mundial","+10"],["Máximo goleador","+5"]],lockInfo:"Los pronósticos se bloquean automáticamente cuando empieza el partido.",rankingTitle:"📊 Tabla de posiciones",nameTh:"Nombre",scoreTh:"Puntos",rankInfo:"El ranking se actualiza con los resultados automáticos disponibles.",predTitle:"⚽ Mis pronósticos",predHelp:"Primero ingresa tu nombre. Luego coloca tus marcadores y guarda.",saveBtn:"Guardar pronósticos",predSaved:"✅ Pronósticos guardados correctamente.",noName:"⚠️ Primero ingresa tu nombre.",closed:"🔒 Cerrado"},
  ja:{subtitle:"職場の仲間で楽しむワールドカップ予想大会",chooseLang:"言語を選択してください",nameTitle:"👤 お名前を入力してください",nameText:"参加するには、お名前の入力だけで完了です。",placeholder:"例：田中",enterBtn:"参加する",welcome:"ようこそ",saved:"✅ 参加者が正常に登録されました。",error:"❌ 保存できませんでした。Firebaseを確認してください。",playersTitle:"👥 登録済み参加者",emptyPlayers:"まだ参加者はいません。",rulesTitle:"📖 得点ルール",ruleTh:"内容",pointsTh:"ポイント",rules:[["勝敗（勝ち・引き分け）を的中","3ポイント"],["スコアを完全的中","5ポイント"],["ワールドカップ優勝国を的中","10ポイント"],["大会得点王を的中","5ポイント"]],lockInfo:"試合開始時刻を過ぎると、その試合の予想は自動的に締め切られます。",rankingTitle:"📊 順位表",nameTh:"名前",scoreTh:"ポイント",rankInfo:"順位表は自動取得された結果に基づいて更新されます。",predTitle:"⚽ 自分の予想",predHelp:"最初にお名前を入力してください。その後、スコアを入力して保存します。",saveBtn:"予想を保存する",predSaved:"✅ 予想が正常に保存されました。",noName:"⚠️ 先にお名前を入力してください。",closed:"🔒 受付終了"},
  en:{subtitle:"Prediction game for coworkers",chooseLang:"Choose your language",nameTitle:"👤 Enter your name",nameText:"You only need to enter your name to join.",placeholder:"Example: Jorge",enterBtn:"Join",welcome:"Welcome",saved:"✅ Participant saved successfully.",error:"❌ Could not save. Check Firebase.",playersTitle:"👥 Registered participants",emptyPlayers:"There are no participants yet.",rulesTitle:"📖 Scoring rules",ruleTh:"Prediction",pointsTh:"Points",rules:[["Correct winner or draw","+3"],["Exact score","+5"],["Correct World Cup champion","+10"],["Correct top scorer","+5"]],lockInfo:"Predictions are automatically locked when the match starts.",rankingTitle:"📊 Leaderboard",nameTh:"Name",scoreTh:"Points",rankInfo:"The ranking updates with available automatic results.",predTitle:"⚽ My predictions",predHelp:"First enter your name. Then enter your scores and save.",saveBtn:"Save predictions",predSaved:"✅ Predictions saved successfully.",noName:"⚠️ Enter your name first.",closed:"🔒 Closed"},
  pt:{subtitle:"Bolão de palpites para colegas de trabalho",chooseLang:"Escolha seu idioma",nameTitle:"👤 Digite seu nome",nameText:"Você só precisa digitar seu nome para participar.",placeholder:"Exemplo: Jorge",enterBtn:"Entrar",welcome:"Bem-vindo",saved:"✅ Participante salvo com sucesso.",error:"❌ Não foi possível salvar. Verifique o Firebase.",playersTitle:"👥 Participantes registrados",emptyPlayers:"Ainda não há participantes.",rulesTitle:"📖 Regras de pontuação",ruleTh:"Acerto",pointsTh:"Pontos",rules:[["Acertar vencedor ou empate","+3"],["Acertar o placar exato","+5"],["Acertar o campeão da Copa","+10"],["Acertar o artilheiro","+5"]],lockInfo:"Os palpites são bloqueados automaticamente quando a partida começa.",rankingTitle:"📊 Classificação",nameTh:"Nome",scoreTh:"Pontos",rankInfo:"A classificação é atualizada com os resultados automáticos disponíveis.",predTitle:"⚽ Meus palpites",predHelp:"Primeiro digite seu nome. Depois coloque os placares e salve.",saveBtn:"Salvar palpites",predSaved:"✅ Palpites salvos com sucesso.",noName:"⚠️ Primeiro digite seu nome.",closed:"🔒 Encerrado"}
};

let currentLang = "es";
let currentPlayerName = localStorage.getItem("playerName") || "";
let resultsCache = {};
let predictionsCache = [];

function isLocked(start){ return new Date() >= new Date(start); }
function safeId(name){ return name.toLowerCase().trim().replace(/[^a-z0-9áéíóúñãõç一-龯ぁ-んァ-ン]/gi,"_"); }
function matchLabel(id){ const m=matches.find(x=>x.id===id); return m ? `${m.home} vs ${m.away}` : id; }

function parseOpenFootballDate(date, time){
  const cleanTime = (time || "00:00").replace(" UTC", " GMT");
  const text = `${date} ${cleanTime}`;
  const parsed = new Date(text);
  if(!isNaN(parsed.getTime())) return parsed.toISOString();
  return `${date}T00:00:00Z`;
}

function flagFor(team){
  const map = {
    "Japan":"🇯🇵","Peru":"🇵🇪","Brazil":"🇧🇷","Germany":"🇩🇪","Argentina":"🇦🇷","France":"🇫🇷","Spain":"🇪🇸","England":"🏴",
    "Mexico":"🇲🇽","South Africa":"🇿🇦","South Korea":"🇰🇷","Czech Republic":"🇨🇿","United States":"🇺🇸","Canada":"🇨🇦",
    "Portugal":"🇵🇹","Netherlands":"🇳🇱","Morocco":"🇲🇦","Uruguay":"🇺🇾","Colombia":"🇨🇴","Ecuador":"🇪🇨","Chile":"🇨🇱"
  };
  return `${map[team] || "⚽"} ${team}`;
}

function calcPoints(pred, res){
  if(!res || res.home === "" || res.away === "" || res.home == null || res.away == null) return 0;
  const ph = Number(pred.predictedHome), pa = Number(pred.predictedAway);
  const rh = Number(res.home), ra = Number(res.away);
  if(ph === rh && pa === ra) return 5;
  const predSign = ph === pa ? "D" : ph > pa ? "H" : "A";
  const realSign = rh === ra ? "D" : rh > ra ? "H" : "A";
  return predSign === realSign ? 3 : 0;
}

window.syncOpenFootball = async function(){
  const status = document.getElementById("dataStatus");
  const adminStatus = document.getElementById("adminStatus");
  try{
    if(status) status.textContent = "Sincronizando calendario gratuito...";
    const res = await fetch(OPENFOOTBALL_URL, { cache: "no-store" });
    if(!res.ok) throw new Error("No se pudo leer OpenFootball");
    const data = await res.json();
    if(!data.matches || !Array.isArray(data.matches)) throw new Error("Formato no válido");

    matches = data.matches.map((m, index) => {
      const id = `wc2026_${index+1}`;
      if(m.score?.ft){
        resultsCache[id] = { matchId:id, home:Number(m.score.ft[0]), away:Number(m.score.ft[1]), homeTeam:flagFor(m.team1), awayTeam:flagFor(m.team2) };
        setDoc(doc(db,"results",id), resultsCache[id], {merge:true});
      }
      return {
        id,
        group: m.group || m.round || "",
        home: flagFor(m.team1 || "TBD"),
        away: flagFor(m.team2 || "TBD"),
        start: parseOpenFootballDate(m.date, m.time),
        ground: m.ground || ""
      };
    });

    localStorage.setItem("autoMatchesLoaded","yes");
    renderMatches();
    renderAdminResults();
    await recalculateRanking();
    if(status) status.textContent = `✅ Calendario automático cargado: ${matches.length} partidos.`;
    if(adminStatus) adminStatus.textContent = `✅ Sincronizado: ${matches.length} partidos.`;
  }catch(e){
    console.error(e);
    if(status) status.textContent = "⚠️ No se pudo cargar la fuente gratuita. Usando partidos de respaldo.";
    if(adminStatus) adminStatus.textContent = "⚠️ No se pudo sincronizar. Usando respaldo.";
  }
};

window.setLang = function(lang){
  currentLang = lang;
  document.querySelectorAll(".langs button").forEach(b=>b.classList.remove("active"));
  document.getElementById("btn-"+lang).classList.add("active");
  const t=T[lang];
  ["subtitle","chooseLang","nameTitle","nameText","enterBtn","playersTitle","rulesTitle","ruleTh","pointsTh","lockInfo","rankingTitle","nameTh","scoreTh","rankInfo","predTitle","predHelp","saveBtn"].forEach(id=>document.getElementById(id).textContent=t[id]);
  document.getElementById("playerName").placeholder=t.placeholder;
  document.getElementById("rulesBody").innerHTML=t.rules.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("");
  renderMatches();
  if(currentPlayerName) document.getElementById("welcomeText").textContent=`${t.welcome}, ${currentPlayerName}!`;
};

window.enterGame = async function(){
  const input=document.getElementById("playerName");
  const status=document.getElementById("saveStatus");
  const name=input.value.trim();
  if(!name){ status.textContent=T[currentLang].noName; return; }
  try{
    await setDoc(doc(db,"players",safeId(name)),{name,language:currentLang,points:0,updatedAt:serverTimestamp()},{merge:true});
    currentPlayerName=name;
    localStorage.setItem("playerName",name);
    document.getElementById("welcomeText").textContent=`${T[currentLang].welcome}, ${name}!`;
    status.textContent=T[currentLang].saved;
    input.value="";
  }catch(e){ console.error(e); status.textContent=T[currentLang].error; }
};

function renderMatches(){
  const box=document.getElementById("matchesContainer");
  if(!box) return;
  box.innerHTML=matches.map(m=>{
    const locked=isLocked(m.start);
    const date=new Date(m.start).toLocaleString();
    const res = resultsCache[m.id];
    const resultText = res ? `<small>Resultado: ${res.home} - ${res.away}</small>` : "";
    if(locked){
      return `<div class="match"><div><strong>${m.home}</strong><small>${m.group}<br>${date}<br>${m.ground || ""}</small>${resultText}</div><div class="locked">${T[currentLang].closed}</div><div><strong>${m.away}</strong></div></div>`;
    }
    return `<div class="match" data-match="${m.id}">
      <div><strong>${m.home}</strong><small>${m.group}<br>${date}<br>${m.ground || ""}</small>${resultText}</div>
      <div class="score">
        <input id="${m.id}_home" type="number" min="0" placeholder="0">
        <span>-</span>
        <input id="${m.id}_away" type="number" min="0" placeholder="0">
      </div>
      <div><strong>${m.away}</strong></div>
    </div>`;
  }).join("");
}

window.savePredictions = async function(){
  const status=document.getElementById("predictionStatus");
  if(!currentPlayerName){ status.textContent=T[currentLang].noName; return; }
  try{
    const playerId=safeId(currentPlayerName);
    for(const m of matches){
      if(isLocked(m.start)) continue;
      const home=document.getElementById(`${m.id}_home`)?.value;
      const away=document.getElementById(`${m.id}_away`)?.value;
      if(home==="" || away==="") continue;
      await setDoc(doc(db,"predictions",`${playerId}_${m.id}`),{
        playerId, playerName:currentPlayerName, matchId:m.id,
        homeTeam:m.home, awayTeam:m.away,
        predictedHome:Number(home), predictedAway:Number(away),
        points: calcPoints({predictedHome:Number(home), predictedAway:Number(away)}, resultsCache[m.id]),
        matchStart:m.start, updatedAt:serverTimestamp()
      },{merge:true});
    }
    status.textContent=T[currentLang].predSaved;
  }catch(e){ console.error(e); status.textContent=T[currentLang].error; }
};

function renderAdminResults(){
  const panel = document.getElementById("adminPanel");
  const isAdmin = new URLSearchParams(location.search).get("admin") === "jorge";
  if(isAdmin) panel.classList.add("show");
  const box=document.getElementById("adminResults");
  if(!box) return;
  box.innerHTML = matches.map(m=>{
    const r = resultsCache[m.id] || {};
    return `<div class="admin-match">
      <div><strong>${m.home}</strong><small>${m.group}<br>${m.start}<br>${m.ground || ""}</small></div>
      <div class="score">
        <input id="res_${m.id}_home" type="number" min="0" placeholder="-" value="${r.home ?? ""}">
        <span>-</span>
        <input id="res_${m.id}_away" type="number" min="0" placeholder="-" value="${r.away ?? ""}">
      </div>
      <div><strong>${m.away}</strong></div>
    </div>`;
  }).join("");
}

window.saveResultsAndCalculate = async function(){
  const status = document.getElementById("adminStatus");
  try{
    for(const m of matches){
      const h = document.getElementById(`res_${m.id}_home`)?.value;
      const a = document.getElementById(`res_${m.id}_away`)?.value;
      if(h === "" || a === "" || h == null || a == null) continue;
      await setDoc(doc(db,"results",m.id),{
        matchId:m.id, homeTeam:m.home, awayTeam:m.away,
        home:Number(h), away:Number(a), updatedAt:serverTimestamp()
      },{merge:true});
    }
    await recalculateRanking();
    status.textContent = "✅ Resultados guardados y ranking recalculado.";
  }catch(e){ console.error(e); status.textContent = "❌ Error al guardar resultados."; }
};

async function recalculateRanking(){
  const predictionsSnap = await getDocs(collection(db,"predictions"));
  const scores = {};
  const updates = [];
  predictionsSnap.forEach(d=>{
    const p = d.data();
    const pts = calcPoints(p, resultsCache[p.matchId]);
    scores[p.playerId] = (scores[p.playerId] || 0) + pts;
    updates.push(setDoc(doc(db,"predictions",d.id),{points:pts},{merge:true}));
  });
  await Promise.all(updates);

  const playersSnap = await getDocs(collection(db,"players"));
  const playerUpdates = [];
  playersSnap.forEach(d=>{
    playerUpdates.push(updateDoc(doc(db,"players",d.id),{points:scores[d.id] || 0, updatedAt:serverTimestamp()}));
  });
  await Promise.all(playerUpdates);
}

function listenPlayers(){
  const playersList=document.getElementById("playersList");
  const rankingBody=document.getElementById("rankingBody");
  const q=query(collection(db,"players"),orderBy("points","desc"));
  onSnapshot(q,(snapshot)=>{
    playersList.innerHTML="";
    rankingBody.innerHTML="";
    if(snapshot.empty){
      playersList.innerHTML=`<li>${T[currentLang].emptyPlayers}</li>`;
      rankingBody.innerHTML=`<tr><td>-</td><td>${T[currentLang].emptyPlayers}</td><td>0</td></tr>`;
      return;
    }
    let i=1;
    snapshot.forEach(d=>{
      const p=d.data();
      const li=document.createElement("li");
      li.textContent=p.name;
      playersList.appendChild(li);
      rankingBody.innerHTML += `<tr><td>${i}</td><td>${p.name}</td><td>${p.points || 0}</td></tr>`;
      i++;
    });
  });
}

function listenResults(){
  onSnapshot(collection(db,"results"),(snapshot)=>{
    snapshot.forEach(d=>{ resultsCache[d.id] = d.data(); });
    renderMatches();
    renderAdminResults();
    renderAdminPredictions();
  });
}

function listenPredictions(){
  onSnapshot(collection(db,"predictions"),(snapshot)=>{
    predictionsCache = [];
    snapshot.forEach(d=> predictionsCache.push(d.data()));
    renderAdminPredictions();
  });
}

function renderAdminPredictions(){
  const body = document.getElementById("adminPredictionsBody");
  if(!body) return;
  if(!predictionsCache.length){
    body.innerHTML = `<tr><td colspan="4">Aún no hay pronósticos.</td></tr>`;
    return;
  }
  body.innerHTML = predictionsCache.map(p=>{
    const pts = calcPoints(p, resultsCache[p.matchId]);
    return `<tr><td>${p.playerName}</td><td>${matchLabel(p.matchId)}</td><td>${p.predictedHome} - ${p.predictedAway}</td><td>${pts}</td></tr>`;
  }).join("");
}

if(currentPlayerName){
  document.getElementById("welcomeText").textContent=`${T[currentLang].welcome}, ${currentPlayerName}!`;
}
setLang("es");
listenPlayers();
listenResults();
listenPredictions();
syncOpenFootball();
