import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore, collection, serverTimestamp, query, orderBy, onSnapshot,
  doc, setDoc, getDoc, getDocs
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
  { id:"m3", group:"Grupo C", home:"🇦🇷 Argentina", away:"🇫🇷 Francia", start:"2026-06-13T20:00:00+09:00" }
];

const T = {
  es:{subtitle:"Polla Mundialista por partido",nameTitle:"👤 Ingresa tu nombre",nameText:"Solo necesitas escribir tu nombre para participar.",placeholder:"Ejemplo: Jorge",enterBtn:"Entrar",welcome:"Bienvenido",saved:"✅ Participante guardado.",error:"❌ Error. Revisa Firebase.",potTitle:"💰 Pozo del partido",potInfo:"Fase de grupos: ¥100 por participante.",rulesTitle:"📖 Reglas",ruleTh:"Acierto",pointsTh:"Pts",rules:[["Marcador exacto","+5"],["Ganador/empate correcto","+3"],["Fallo","0"]],lockInfo:"Cada partido tiene su propio ganador.",matchRankTitle:"🏆 Ganador del partido",rankNameTh:"Nombre",rankPredTh:"Score",rankPtsTh:"Pts",predTitle:"📅 Fechas y partidos",predHelp:"Elige la fecha, luego el partido. Solo se muestra ese partido.",saveBtn:"Guardar pronóstico de este partido",predSaved:"✅ Pronóstico guardado.",noName:"⚠️ Primero ingresa tu nombre.",closed:"🔒 Cerrado",matches:"partidos",winnerPending:"Aún no hay resultado final.",noPreds:"Aún no hay pronósticos para este partido.",winner:"Ganador",score:"Score",countdown:"Cierra en"},
  ja:{subtitle:"試合ごとのワールドカップ予想",nameTitle:"👤 お名前を入力してください",nameText:"参加するには、お名前の入力だけで完了です。",placeholder:"例：田中",enterBtn:"参加する",welcome:"ようこそ",saved:"✅ 参加者が登録されました。",error:"❌ エラー。Firebaseを確認してください。",potTitle:"💰 この試合の合計",potInfo:"グループステージ：参加者1人につき100円。",rulesTitle:"📖 ルール",ruleTh:"内容",pointsTh:"点",rules:[["スコア完全的中","5点"],["勝敗・引き分け的中","3点"],["不的中","0"]],lockInfo:"各試合ごとに勝者が決まります。",matchRankTitle:"🏆 この試合の勝者",rankNameTh:"名前",rankPredTh:"予想",rankPtsTh:"点",predTitle:"📅 日付と試合",predHelp:"日付を選び、次に試合を選んでください。",saveBtn:"この試合の予想を保存する",predSaved:"✅ 予想が保存されました。",noName:"⚠️ 先にお名前を入力してください。",closed:"🔒 受付終了",matches:"試合",winnerPending:"まだ試合結果がありません。",noPreds:"この試合の予想はまだありません。",winner:"勝者",score:"スコア",countdown:"締切まで"},
  en:{subtitle:"Prediction pool by match",nameTitle:"👤 Enter your name",nameText:"You only need to enter your name to join.",placeholder:"Example: Jorge",enterBtn:"Join",welcome:"Welcome",saved:"✅ Participant saved.",error:"❌ Error. Check Firebase.",potTitle:"💰 Match pot",potInfo:"Group stage: ¥100 per participant.",rulesTitle:"📖 Rules",ruleTh:"Prediction",pointsTh:"Pts",rules:[["Exact score","+5"],["Correct winner/draw","+3"],["Wrong","0"]],lockInfo:"Each match has its own winner.",matchRankTitle:"🏆 Match winner",rankNameTh:"Name",rankPredTh:"Score",rankPtsTh:"Pts",predTitle:"📅 Dates and matches",predHelp:"Choose a date, then choose a match.",saveBtn:"Save prediction for this match",predSaved:"✅ Prediction saved.",noName:"⚠️ Enter your name first.",closed:"🔒 Closed",matches:"matches",winnerPending:"No final result yet.",noPreds:"No predictions for this match yet.",winner:"Winner",score:"Score",countdown:"Closes in"},
  pt:{subtitle:"Bolão por partida",nameTitle:"👤 Digite seu nome",nameText:"Você só precisa digitar seu nome para participar.",placeholder:"Exemplo: Jorge",enterBtn:"Entrar",welcome:"Bem-vindo",saved:"✅ Participante salvo.",error:"❌ Erro. Verifique o Firebase.",potTitle:"💰 Prêmio da partida",potInfo:"Fase de grupos: ¥100 por participante.",rulesTitle:"📖 Regras",ruleTh:"Acerto",pointsTh:"Pts",rules:[["Placar exato","+5"],["Vencedor/empate correto","+3"],["Erro","0"]],lockInfo:"Cada partida tem seu próprio vencedor.",matchRankTitle:"🏆 Vencedor da partida",rankNameTh:"Nome",rankPredTh:"Score",rankPtsTh:"Pts",predTitle:"📅 Datas e partidas",predHelp:"Escolha a data e depois a partida.",saveBtn:"Salvar palpite desta partida",predSaved:"✅ Palpite salvo.",noName:"⚠️ Primeiro digite seu nome.",closed:"🔒 Encerrado",matches:"partidas",winnerPending:"Ainda não há resultado final.",noPreds:"Ainda não há palpites para esta partida.",winner:"Vencedor",score:"Score",countdown:"Fecha em"}
};

let currentLang = "es";
let currentPlayerName = localStorage.getItem("playerName") || "";
let resultsCache = {};
let predictionsCache = [];
let selectedDayKey = null;
let selectedMatchId = null;
let stakeAmount = 100;
let lastWinnerKey = "";

function isLocked(start){ return new Date() >= new Date(start); }
function safeId(name){ return name.toLowerCase().trim().replace(/[^a-z0-9áéíóúñãõç一-龯ぁ-んァ-ン]/gi,"_"); }
function localDayKey(start){ return new Date(start).toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" }); }
function timeJst(start){ return new Date(start).toLocaleTimeString(currentLang==="ja"?"ja-JP":"es-ES", {hour:"2-digit", minute:"2-digit", timeZone:"Asia/Tokyo"}); }
function dateShort(start){ return new Date(start).toLocaleDateString("es-ES",{day:"2-digit",month:"short",timeZone:"Asia/Tokyo"}).replace(".",""); }
function weekday(start){ const loc=currentLang==="ja"?"ja-JP":currentLang==="en"?"en-US":currentLang==="pt"?"pt-BR":"es-ES"; return new Date(start).toLocaleDateString(loc,{weekday:"short",timeZone:"Asia/Tokyo"}); }
function dateLong(start){ const loc=currentLang==="ja"?"ja-JP":currentLang==="en"?"en-US":currentLang==="pt"?"pt-BR":"es-ES"; return new Date(start).toLocaleDateString(loc,{weekday:"long",year:"numeric",month:"long",day:"numeric",timeZone:"Asia/Tokyo"}); }
function flagFor(team){ const map={"Japan":"🇯🇵","Peru":"🇵🇪","Brazil":"🇧🇷","Germany":"🇩🇪","Argentina":"🇦🇷","France":"🇫🇷","Spain":"🇪🇸","England":"🏴","Mexico":"🇲🇽","South Africa":"🇿🇦","South Korea":"🇰🇷","Czechia":"🇨🇿","United States":"🇺🇸","Canada":"🇨🇦","Portugal":"🇵🇹","Netherlands":"🇳🇱","Morocco":"🇲🇦","Uruguay":"🇺🇾","Colombia":"🇨🇴","Ecuador":"🇪🇨"}; return `${map[team]||"⚽"} ${team}`; }
function parseOpenFootballDate(date,time){ const parsed=new Date(`${date} ${(time||"00:00").replace(" UTC"," GMT")}`); return !isNaN(parsed.getTime()) ? parsed.toISOString() : `${date}T00:00:00Z`; }
function buildGroups(){ const sorted=[...matches].sort((a,b)=>new Date(a.start)-new Date(b.start)); const g={}; for(const m of sorted){(g[localDayKey(m.start)] ||= []).push(m)} return g; }
function selectedMatch(){ return matches.find(m=>m.id===selectedMatchId) || matches[0]; }
function calcPoints(pred,res){
  if(!res || res.home==null || res.away==null || res.home==="" || res.away==="") return 0;
  const ph=Number(pred.predictedHome), pa=Number(pred.predictedAway), rh=Number(res.home), ra=Number(res.away);
  if(ph===rh && pa===ra) return 5;
  const ps=ph===pa?"D":ph>pa?"H":"A", rs=rh===ra?"D":rh>ra?"H":"A";
  return ps===rs ? 3 : 0;
}
function countdownText(start){
  const diff = new Date(start).getTime() - Date.now();
  if(diff <= 0) return T[currentLang].closed;
  const d=Math.floor(diff/86400000);
  const h=Math.floor((diff%86400000)/3600000);
  const m=Math.floor((diff%3600000)/60000);
  const s=Math.floor((diff%60000)/1000);
  return `${T[currentLang].countdown}: ${d>0?d+"d ":""}${h}h ${m}m ${s}s`;
}

window.syncOpenFootball = async function(){
  const status=document.getElementById("dataStatus");
  try{
    status.textContent="Sincronizando calendario gratuito...";
    const r=await fetch(OPENFOOTBALL_URL,{cache:"no-store"});
    if(!r.ok) throw new Error("openfootball error");
    const data=await r.json();
    if(!Array.isArray(data.matches)) throw new Error("bad format");
    matches=data.matches.map((m,i)=>{
      const id=`wc2026_${i+1}`;
      if(m.score?.ft){
        resultsCache[id]={matchId:id,home:Number(m.score.ft[0]),away:Number(m.score.ft[1]),homeTeam:flagFor(m.team1),awayTeam:flagFor(m.team2)};
        setDoc(doc(db,"results",id),resultsCache[id],{merge:true});
      }
      return {id,group:m.group||m.round||"",home:flagFor(m.team1||"TBD"),away:flagFor(m.team2||"TBD"),start:parseOpenFootballDate(m.date,m.time),ground:m.ground||""};
    }).sort((a,b)=>new Date(a.start)-new Date(b.start));
    selectedDayKey=localDayKey(matches[0].start);
    selectedMatchId=matches[0].id;
    renderAll();
    status.textContent=`✅ Calendario automático cargado: ${matches.length} partidos.`;
  }catch(e){
    if(!selectedDayKey){selectedDayKey=localDayKey(matches[0].start);selectedMatchId=matches[0].id;}
    renderAll();
    status.textContent="⚠️ Usando partidos de respaldo.";
  }
};

window.setLang=function(lang){
  currentLang=lang;
  document.querySelectorAll(".langs button").forEach(b=>b.classList.remove("active"));
  document.getElementById("btn-"+lang).classList.add("active");
  const t=T[lang];
  ["subtitle","nameTitle","nameText","enterBtn","potTitle","potInfo","rulesTitle","ruleTh","pointsTh","lockInfo","matchRankTitle","rankNameTh","rankPredTh","rankPtsTh","predTitle","predHelp","saveBtn"].forEach(id=>document.getElementById(id).textContent=t[id]);
  document.getElementById("playerName").placeholder=t.placeholder;
  document.getElementById("rulesBody").innerHTML=t.rules.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("");
  if(currentPlayerName) document.getElementById("welcomeText").textContent=`${t.welcome}, ${currentPlayerName}!`;
  renderAll();
};

window.enterGame=async function(){
  const name=document.getElementById("playerName").value.trim();
  const status=document.getElementById("saveStatus");
  if(!name){status.textContent=T[currentLang].noName;return;}
  try{
    await setDoc(doc(db,"players",safeId(name)),{name,language:currentLang,updatedAt:serverTimestamp()},{merge:true});
    currentPlayerName=name; localStorage.setItem("playerName",name);
    document.getElementById("welcomeText").textContent=`${T[currentLang].welcome}, ${name}!`;
    status.textContent=T[currentLang].saved; document.getElementById("playerName").value="";
  }catch(e){status.textContent=T[currentLang].error;}
};

window.selectDateTab=function(dayKey){
  selectedDayKey=dayKey;
  const list=buildGroups()[dayKey]||[];
  selectedMatchId=list[0]?.id || selectedMatchId;
  renderAll();
};
window.selectMatchTab=function(matchId){ selectedMatchId=matchId; renderAll(); };

function renderAll(){ renderTabs(); renderSelectedMatch(); renderMatchRanking(); renderAdminResults(); }

function renderTabs(){
  const groups=buildGroups();
  const keys=Object.keys(groups);
  if(!selectedDayKey || !groups[selectedDayKey]) selectedDayKey=keys[0];
  if(!selectedMatchId) selectedMatchId=groups[selectedDayKey]?.[0]?.id;
  document.getElementById("dateTabs").innerHTML=keys.map(k=>{
    const list=groups[k], first=list[0];
    return `<button class="${k===selectedDayKey?"active-date":""}" onclick="selectDateTab('${k}')"><span class="tab-day">${weekday(first.start)}</span><span class="tab-date">${dateShort(first.start)}</span><span class="tab-count">${list.length} ${T[currentLang].matches}</span></button>`;
  }).join("");
  const list=groups[selectedDayKey]||[];
  document.getElementById("matchTabs").innerHTML=list.map(m=>{
    return `<button class="${m.id===selectedMatchId?"active-match":""}" onclick="selectMatchTab('${m.id}')"><span class="match-tab-time">${timeJst(m.start)}</span><span class="match-tab-teams">${m.home.split(" ").slice(0,2).join(" ")} vs ${m.away.split(" ").slice(0,2).join(" ")}</span></button>`;
  }).join("");
}

function renderSelectedMatch(){
  const m=selectedMatch(); if(!m) return;
  const res=resultsCache[m.id];
  const locked=isLocked(m.start);
  const resultText=res?`<span class="result-badge">Resultado final: ${res.home} - ${res.away}</span>`:"";
  document.getElementById("selectedMatchBox").innerHTML=`
    <div class="selected-match">
      <div class="teams-line">${m.home} vs ${m.away}</div>
      <div class="match-meta">📅 ${dateLong(m.start)} · 🕒 ${timeJst(m.start)} JST<br>${m.group} ${m.ground? "· "+m.ground:""}</div>
      <div class="countdown">${countdownText(m.start)}</div><br>
      ${resultText}
      ${locked ? `<div class="locked">${T[currentLang].closed}</div>` : `<div class="score"><input id="selected_home" type="number" min="0" placeholder="0"><span>-</span><input id="selected_away" type="number" min="0" placeholder="0"></div>`}
    </div>`;
}

window.saveSelectedPrediction=async function(){
  const status=document.getElementById("predictionStatus");
  const m=selectedMatch();
  if(!currentPlayerName){status.textContent=T[currentLang].noName;return;}
  if(!m || isLocked(m.start)){status.textContent=T[currentLang].closed;return;}
  const home=document.getElementById("selected_home")?.value;
  const away=document.getElementById("selected_away")?.value;
  if(home==="" || away===""){status.textContent="⚠️ Completa el marcador.";return;}
  const playerId=safeId(currentPlayerName);
  await setDoc(doc(db,"predictions",`${playerId}_${m.id}`),{
    playerId,playerName:currentPlayerName,matchId:m.id,homeTeam:m.home,awayTeam:m.away,
    predictedHome:Number(home),predictedAway:Number(away),
    points:calcPoints({predictedHome:Number(home),predictedAway:Number(away)},resultsCache[m.id]),
    matchStart:m.start,updatedAt:serverTimestamp()
  },{merge:true});
  status.textContent=T[currentLang].predSaved;
};

function renderPot(rows){
  const count = rows.length;
  const total = count * stakeAmount;
  document.getElementById("potBox").innerHTML = `¥${total.toLocaleString()}<span class="pot-detail">${count} participantes × ¥${stakeAmount}</span>`;
}

function renderMatchRanking(){
  const m=selectedMatch();
  const body=document.getElementById("matchRankingBody");
  const box=document.getElementById("winnerBox");
  if(!m){body.innerHTML="";return;}
  const rows=predictionsCache.filter(p=>p.matchId===m.id).map(p=>({...p,points:calcPoints(p,resultsCache[m.id])})).sort((a,b)=>b.points-a.points);
  renderPot(rows);
  const res=resultsCache[m.id];
  if(!res){ box.innerHTML=T[currentLang].winnerPending; }
  else if(!rows.length){ box.innerHTML=T[currentLang].noPreds; }
  else{
    const top=rows[0].points;
    const winners=rows.filter(r=>r.points===top && top>0);
    if(winners.length){
      const names=winners.map(r=>r.playerName).join(", ");
      const score=winners[0].predictedHome+" - "+winners[0].predictedAway;
      const key = `${m.id}_${names}_${score}_${top}`;
      box.innerHTML=`🏆 <span class="winner-name">${names}</span><span class="winner-score">${T[currentLang].score}: ${score} · ${top} pts</span>`;
      if(lastWinnerKey !== key){ lastWinnerKey = key; launchConfetti(); }
    } else { box.innerHTML=T[currentLang].noPreds; }
  }
  if(!rows.length){body.innerHTML=`<tr><td colspan="4">${T[currentLang].noPreds}</td></tr>`;return;}
  body.innerHTML=rows.map((r,i)=>`<tr><td>${i+1}</td><td>${r.playerName}</td><td>${r.predictedHome} - ${r.predictedAway}</td><td>${r.points}</td></tr>`).join("");
}

function renderAdminResults(){
  const panel=document.getElementById("adminPanel");
  if(new URLSearchParams(location.search).get("admin")==="jorge") panel.classList.add("show");
  const stakeInput=document.getElementById("stakeAmount");
  if(stakeInput) stakeInput.value = stakeAmount;
  const box=document.getElementById("adminResults"); if(!box) return;
  box.innerHTML=matches.map(m=>{
    const r=resultsCache[m.id]||{};
    return `<div class="admin-match"><div><strong>${m.home} vs ${m.away}</strong><small>${m.group}<br>${m.start}</small></div><div class="score"><input id="res_${m.id}_home" type="number" min="0" value="${r.home??""}" placeholder="-"><span>-</span><input id="res_${m.id}_away" type="number" min="0" value="${r.away??""}" placeholder="-"></div></div>`;
  }).join("");
}

window.saveStakeAmount = async function(){
  const val = Number(document.getElementById("stakeAmount").value || 100);
  stakeAmount = val;
  await setDoc(doc(db,"settings","stake"),{amount:stakeAmount,updatedAt:serverTimestamp()},{merge:true});
  renderMatchRanking();
};

window.saveResultsAndCalculate=async function(){
  const status=document.getElementById("adminStatus");
  for(const m of matches){
    const h=document.getElementById(`res_${m.id}_home`)?.value;
    const a=document.getElementById(`res_${m.id}_away`)?.value;
    if(h===""||a===""||h==null||a==null) continue;
    await setDoc(doc(db,"results",m.id),{matchId:m.id,homeTeam:m.home,awayTeam:m.away,home:Number(h),away:Number(a),updatedAt:serverTimestamp()},{merge:true});
  }
  await updatePredictionPoints();
  status.textContent="✅ Resultados guardados. Ganadores actualizados.";
};

async function updatePredictionPoints(){
  const snap=await getDocs(collection(db,"predictions"));
  const updates=[];
  snap.forEach(d=>{
    const p=d.data();
    updates.push(setDoc(doc(db,"predictions",d.id),{points:calcPoints(p,resultsCache[p.matchId])},{merge:true}));
  });
  await Promise.all(updates);
}

function launchConfetti(){
  const layer=document.getElementById("confettiLayer");
  const colors=["#ffd34d","#31d27c","#e9354f","#ffffff","#2aa7ff"];
  for(let i=0;i<80;i++){
    const el=document.createElement("div");
    el.className="confetti";
    el.style.left=Math.random()*100+"vw";
    el.style.background=colors[Math.floor(Math.random()*colors.length)];
    el.style.animationDelay=(Math.random()*0.8)+"s";
    el.style.transform=`rotate(${Math.random()*360}deg)`;
    layer.appendChild(el);
    setTimeout(()=>el.remove(),3600);
  }
}

function listenPlayers(){
  onSnapshot(query(collection(db,"players"),orderBy("updatedAt","desc")),(s)=>{
    const ul=document.getElementById("playersList"); if(!ul) return;
    ul.innerHTML="";
    if(s.empty){ul.innerHTML=`<li>${T[currentLang].emptyPlayers}</li>`;return;}
    s.forEach(d=>{const li=document.createElement("li");li.textContent=d.data().name;ul.appendChild(li);});
  });
}
function listenResults(){ onSnapshot(collection(db,"results"),s=>{s.forEach(d=>resultsCache[d.id]=d.data());renderAll();}); }
function listenPredictions(){ onSnapshot(collection(db,"predictions"),s=>{predictionsCache=[];s.forEach(d=>predictionsCache.push(d.data()));renderMatchRanking();}); }
function listenSettings(){
  onSnapshot(doc(db,"settings","stake"),(snap)=>{
    if(snap.exists() && snap.data().amount != null) stakeAmount = Number(snap.data().amount);
    renderMatchRanking();
  });
}

setInterval(()=>renderSelectedMatch(),1000);

if(currentPlayerName){document.getElementById("welcomeText").textContent=`${T[currentLang].welcome}, ${currentPlayerName}!`;}
setLang("es"); listenPlayers(); listenResults(); listenPredictions(); listenSettings(); syncOpenFootball();
