const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

function abrir(id){document.getElementById(id)?.classList.add("open")}
function fechar(id){document.getElementById(id)?.classList.remove("open")}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2500)}

document.addEventListener("click",e=>{
  if(e.target.closest("#continuarGameHub")){
    e.preventDefault();
    fechar("modalSucesso");
    mostrarHome();
    toast("Tudo pronto. Você já pode jogar e comprar!");
    return;
  }
  const open=e.target.closest("[data-open]");
  if(open){
    if(open.dataset.open==="login"){fechar("modalCadastro");abrir("modalLogin")}
    if(open.dataset.open==="cadastro"){fechar("modalLogin");abrir("modalCadastro")}
  }
  const close=e.target.closest("[data-close]");
  if(close)fechar(close.dataset.close);
});

$$(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open")}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")$$(".modal.open").forEach(m=>m.classList.remove("open"))});

$$(".eye").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const input=document.getElementById(btn.dataset.target);
    const show=input.type==="password";
    input.type=show?"text":"password";
    btn.classList.toggle("visible",show);
    btn.setAttribute("aria-label",show?"Ocultar senha":"Mostrar senha");
  });
});

function mostrarHome(){
  $("#secInicio").classList.remove("hidden");
  $("#secExtra").classList.add("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
}
function mostrarExtra(title,icon,text){
  $("#secInicio").classList.add("hidden");
  $("#secExtra").classList.remove("hidden");
  $("#extraTitle").textContent=title;
  $("#extraIcon").textContent=icon;
  $("#extraText").textContent=text;
  window.scrollTo({top:0,behavior:"smooth"});
}
$$(".nav-item").forEach(btn=>btn.addEventListener("click",()=>{
  $$(".nav-item").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
  const n=btn.dataset.nav;
  if(n==="inicio")mostrarHome();
  else if(n==="explorar"){mostrarHome();$("#categorias").scrollIntoView({behavior:"smooth"})}
  else if(n==="biblioteca")mostrarBiblioteca();
  else if(n==="loja")mostrarLoja();
  else if(n==="comunidade")mostrarExtra("Comunidade","👥",usuarioLogado()?"Você está conectado à comunidade GameHub.":"Entre ou crie sua conta para participar da comunidade.");
  else if(n==="conquistas")mostrarExtra("Conquistas","🏆",usuarioLogado()?"Acompanhe suas conquistas e progresso.":"Entre ou crie sua conta para acompanhar suas conquistas.");
  else if(n==="perfil")mostrarExtra("Meu Perfil","●",usuarioLogado()?"Conta de "+getUsuario().nome+".":"Entre ou crie sua conta para configurar seu perfil.");
}));

$("#btnExplorar").addEventListener("click",()=>$("#jogos").scrollIntoView({behavior:"smooth"}));
$("#verCategorias").addEventListener("click",()=>{$$(".categories button").forEach(b=>b.style.display="flex");toast("Todas as categorias estão disponíveis.")});
$("#verJogos").addEventListener("click",()=>{$$(".games article").forEach(c=>c.style.display="block");toast("Todos os jogos estão disponíveis.")});

$$("[data-cat]").forEach(btn=>btn.addEventListener("click",()=>{
  const cat=btn.dataset.cat.toLowerCase();
  let found=0;
  $$(".games article").forEach(card=>{
    const ok=card.dataset.cat.toLowerCase().includes(cat);
    card.style.display=ok?"block":"none";if(ok)found++;
  });
  $("#jogos").scrollIntoView({behavior:"smooth"});
  toast(found?`Categoria: ${btn.dataset.cat}`:"Nenhum jogo encontrado nessa categoria.");
}));

$("#busca").addEventListener("input",e=>{
  const q=e.target.value.trim().toLowerCase();
  let found=0;
  $$(".games article").forEach(card=>{
    const ok=!q||card.dataset.title.toLowerCase().includes(q)||card.dataset.cat.toLowerCase().includes(q);
    card.style.display=ok?"block":"none";if(ok)found++;
  });
  if(q)$("#jogos").scrollIntoView({behavior:"smooth"});
  if(q.length>2&&!found)toast("Nenhum jogo encontrado.");
});

$$("[data-game]").forEach(btn=>btn.addEventListener("click",()=>{
  const game=btn.dataset.game;
  const descriptions={
    "Void Legacy":"Explore terras desconhecidas, enfrente criaturas sombrias e descubra os segredos de um universo em colapso.",
    "Eternal Realms":"Uma aventura de RPG em reinos fantásticos, cheia de exploração e descobertas.",
    "Speed Rush":"Velocidade, competição e corridas intensas em pistas cheias de desafios.",
    "Warzone Elite":"Uma experiência de ação e estratégia com missões e desafios.",
    "Planet Explorer":"Explore planetas e descubra novos mundos.",
    "Pixel Quest":"Uma aventura indie cheia de desafios e descobertas.",
    "Football Legends":"Entre em campo e dispute partidas emocionantes."
  };
  $("#jogoTitulo").textContent=game;
  $("#jogoDescricao").textContent=descriptions[game]||"Conheça este jogo no GameHub.";
  const acao=$("#btnAcaoJogo");
  if(usuarioLogado()){
    acao.textContent="▶ Jogar agora";
    acao.onclick=()=>iniciarJogo(game);
  }else{
    acao.textContent="Criar conta para jogar";
    acao.onclick=()=>{fechar("modalJogo");abrir("modalCadastro")};
  }
  abrir("modalJogo");
}));

$("#tema").addEventListener("click",()=>{
  document.body.classList.toggle("light");
  $("#tema").textContent=document.body.classList.contains("light")?"☾":"☀";
  localStorage.setItem("gamehubTema",document.body.classList.contains("light")?"light":"dark");
});
if(localStorage.getItem("gamehubTema")==="light"){document.body.classList.add("light");$("#tema").textContent="☾"}

function mascaraCPF(v){return v.replace(/\D/g,"").slice(0,11).replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2")}
function mascaraTelefone(v){return v.replace(/\D/g,"").slice(0,11).replace(/^(\d{2})(\d)/,"($1) $2").replace(/(\d{5})(\d)/,"$1-$2")}
function mascaraCEP(v){return v.replace(/\D/g,"").slice(0,8).replace(/^(\d{5})(\d)/,"$1-$2")}
$("#cpf").addEventListener("input",e=>e.target.value=mascaraCPF(e.target.value));
$("#telefone").addEventListener("input",e=>e.target.value=mascaraTelefone(e.target.value));
$("#cep").addEventListener("input",e=>e.target.value=mascaraCEP(e.target.value));

$("#cep").addEventListener("blur",async()=>{
  const cep=$("#cep").value.replace(/\D/g,"");
  if(cep.length!==8){$("#cepStatus").textContent="";return}
  $("#cepStatus").textContent="Consultando CEP...";
  try{
    const r=await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const d=await r.json();
    if(d.erro)throw new Error();
    $("#endereco").value=[d.logradouro,d.bairro].filter(Boolean).join(" - ");
    $("#cidade").value=d.localidade||"";
    $("#estado").value=d.uf||"";
    $("#cepStatus").textContent="✓ Endereço localizado.";
    $("#numero").focus();
  }catch{ $("#cepStatus").textContent="Não foi possível localizar o CEP."; }
});

function getUsuario(){
  return JSON.parse(localStorage.getItem("gamehubUsuario")||"null");
}
function usuarioLogado(){
  return !!getUsuario() && !!localStorage.getItem("gamehubSessao");
}
function atualizarInterface(){
  const usuario=getUsuario();
  const logado=usuarioLogado();
  $("#areaVisitante").classList.toggle("hidden",logado);
  $("#areaUsuario").classList.toggle("hidden",!logado);
  $("#usuarioNome").textContent=logado?usuario.nome:"";
  $(".side-card p").innerHTML=logado?"Olá, "+usuario.nome.split(" ")[0]+"!<br>Divirta-se no GameHub.":"Jogue. Conecte-se.<br>Faça parte.";
  const sideBtn=$(".side-card .btn-primary");
  if(sideBtn){
    sideBtn.textContent=logado?"Meu perfil":"Criar conta";
    sideBtn.dataset.open=logado?"perfil":"cadastro";
  }
}
const shipCatalog=[
  {id:"recruta",name:"RECRUTA",price:0,unlockPhase:1,maxLevel:5,desc:"Nave inicial equilibrada. Ideal para aprender.",speed:5.0,damage:1.0,life:100,shield:60,fire:9,style:"recruta"},
  {id:"falcon",name:"FALCON X",price:990,unlockPhase:2,maxLevel:10,desc:"Caça veloz com dois canhões laterais.",speed:6.2,damage:1.25,life:110,shield:75,fire:8,style:"falcon"},
  {id:"phantom",name:"PHANTOM",price:1990,unlockPhase:4,maxLevel:15,desc:"Caça furtivo de alta cadência.",speed:6.6,damage:1.5,life:115,shield:95,fire:7,style:"phantom"},
  {id:"titan",name:"TITAN",price:3990,unlockPhase:7,maxLevel:20,desc:"Nave pesada para enfrentar chefões.",speed:4.8,damage:2.0,life:155,shield:135,fire:10,style:"titan"},
  {id:"nova",name:"NOVA STRIKE",price:5990,unlockPhase:12,maxLevel:25,desc:"Artilharia orbital de precisão.",speed:5.7,damage:2.25,life:145,shield:120,fire:8,style:"nova"},
  {id:"viper",name:"VIPER",price:7990,unlockPhase:20,maxLevel:30,desc:"Interceptor extremo, rápido e agressivo.",speed:7.0,damage:2.05,life:125,shield:110,fire:6,style:"viper"},
  {id:"guardian",name:"GUARDIAN",price:9990,unlockPhase:35,maxLevel:35,desc:"Fortaleza móvel com escudo colossal.",speed:4.3,damage:2.35,life:210,shield:190,fire:11,style:"guardian"},
  {id:"eclipse",name:"ECLIPSE",price:14990,unlockPhase:50,maxLevel:40,desc:"Nave de elite para as fases avançadas.",speed:6.0,damage:2.8,life:180,shield:165,fire:7,style:"eclipse"}
];

let gameRunning=false;
let gamePaused=false;
let gameAnimation=null;
let gameKeys={};
let gameState=null;
let lastFrame=0;
let selectedShipId="recruta";
let audioCtx=null;
let musicTimer=null;
let engineTimer=null;
let audioEnabled=true;
const galaxyBackgrounds=Array.from({length:5},(_,idx)=>{
  const img=new Image();
  img.src="assets/game/backgrounds/galaxy-"+(idx+1)+".svg";
  return img;
});
const enemyImages=Array.from({length:6},(_,idx)=>{
  const img=new Image();
  img.src="assets/game/enemies/enemy-"+(idx+1)+".svg";
  return img;
});
const bossImages=Array.from({length:5},(_,idx)=>{
  const img=new Image();
  img.src="assets/game/bosses/boss-"+(idx+1)+".svg";
  return img;
});
const missileImage=new Image();
missileImage.src="assets/game/weapons/missile.svg";
const shipImages={};
["recruta","falcon","phantom","titan","nova","viper","guardian","eclipse"].forEach(style=>{
  const img=new Image();
  img.src="assets/game/ships/"+style+".svg";
  shipImages[style]=img;
});
function currentGalaxyIndex(phase){
  return Math.max(0,(phase-1)%galaxyBackgrounds.length);
}

function getShipSave(){
  const base={credits:1500,owned:["recruta"],progress:{},maxPhase:1};
  try{
    const saved=JSON.parse(localStorage.getItem("gamehubNaves")||"null");
    if(saved){
      saved.credits=Number.isFinite(saved.credits)?saved.credits:1500;
      saved.owned=Array.isArray(saved.owned)?saved.owned:["recruta"];
      saved.progress=saved.progress||{};saved.maxPhase=Number.isFinite(saved.maxPhase)?Math.max(1,saved.maxPhase):1;
      if(!saved.owned.includes("recruta"))saved.owned.unshift("recruta");
      return saved;
    }
  }catch(e){}
  localStorage.setItem("gamehubNaves",JSON.stringify(base));
  return base;
}
function saveShipData(data){localStorage.setItem("gamehubNaves",JSON.stringify(data))}
function ensureShipProgress(id){
  const data=getShipSave();
  if(!data.progress[id])data.progress[id]={level:1,xp:0,modules:{weapon:0,shield:0,engine:0,armor:0,cooling:0}};
  data.progress[id].modules=data.progress[id].modules||{weapon:0,shield:0,engine:0,armor:0,cooling:0};
  return data.progress[id];
}
function shipById(id){return shipCatalog.find(s=>s.id===id)||shipCatalog[0]}
function shipProgress(id){
  const data=getShipSave();
  if(!data.progress[id])data.progress[id]={level:1,xp:0,modules:{weapon:0,shield:0,engine:0,armor:0,cooling:0}};
  data.progress[id].modules=data.progress[id].modules||{weapon:0,shield:0,engine:0,armor:0,cooling:0};
  return data.progress[id];
}
function formatCredits(n){return Number(n||0).toLocaleString("pt-BR")}
const moduleCatalog=[
  {id:"weapon",name:"ARMAMENTO",icon:"✦",desc:"+12% dano por nível",base:700},
  {id:"shield",name:"ESCUDO",icon:"◇",desc:"+18 escudo por nível",base:650},
  {id:"engine",name:"MOTOR",icon:"◈",desc:"+0,35 velocidade por nível",base:600},
  {id:"armor",name:"BLINDAGEM",icon:"⬢",desc:"+12 vida por nível",base:750},
  {id:"cooling",name:"REFRIGERAÇÃO",icon:"◎",desc:"-0,6 intervalo do laser",base:800}
];
function comprarUpgrade(shipId,moduleId){
  const ship=shipById(shipId),data=getShipSave(),p=shipProgress(shipId),mod=moduleCatalog.find(m=>m.id===moduleId);
  if(!mod)return;
  const level=p.modules[moduleId]||0;
  if(level>=3){toast("Este módulo já está no nível máximo.");return}
  if(p.level<Math.min(3+level,ship.maxLevel)){toast("Suba o nível da nave para liberar este módulo.");return}
  const cost=mod.base*(level+1);
  if(data.credits<cost){toast("Créditos insuficientes para este módulo.");return}
  data.credits-=cost;
  p.modules[moduleId]=level+1;
  data.progress[shipId]=p;
  saveShipData(data);
  renderShipOptions();
  toast(mod.name+" melhorado para NV. "+(level+1)+".");
}
function comprarNave(id){
  const ship=shipById(id),data=getShipSave();
  if(data.owned.includes(id)){selecionarNave(id);return}
  if(data.maxPhase<ship.unlockPhase){toast("Nave bloqueada. Derrote o chefão da fase "+(ship.unlockPhase-1)+" para desbloqueá-la.");return}
  if(data.credits<ship.price){toast("Créditos insuficientes para comprar esta nave.");return}
  data.credits-=ship.price;
  data.owned.push(id);
  data.progress[id]={level:1,xp:0,modules:{weapon:0,shield:0,engine:0,armor:0,cooling:0}};
  saveShipData(data);
  selecionarNave(id);
  toast(ship.name+" desbloqueada!");
}
function shipById(id){return shipCatalog.find(s=>s.id===id)||shipCatalog[0]}
function shipProgress(id){
  const data=getShipSave();
  if(!data.progress[id])data.progress[id]={level:1,xp:0,modules:{weapon:0,shield:0,engine:0,armor:0,cooling:0}};
  data.progress[id].modules=data.progress[id].modules||{weapon:0,shield:0,engine:0,armor:0,cooling:0};
  return data.progress[id];
}
function formatCredits(n){return Number(n||0).toLocaleString("pt-BR")}
function comprarNave(id){
  const ship=shipById(id),data=getShipSave();
  if(data.owned.includes(id)){selecionarNave(id);return}
  if(data.maxPhase<ship.unlockPhase){toast("Nave bloqueada. Derrote o chefão da fase "+(ship.unlockPhase-1)+" para desbloqueá-la.");return}
  if(data.credits<ship.price){toast("Créditos insuficientes para comprar esta nave.");return}
  data.credits-=ship.price;
  data.owned.push(id);
  data.progress[id]={level:1,xp:0,modules:{weapon:0,shield:0,engine:0,armor:0,cooling:0}};
  saveShipData(data);
  selecionarNave(id);
  toast(ship.name+" desbloqueada!");
}
function renderShipOptions(){
  const wrap=$("#shipOptions");
  if(!wrap)return;
  const data=getShipSave();
  $("#shipCredits").textContent=formatCredits(data.credits);
  wrap.innerHTML=shipCatalog.map(ship=>{
    const owned=data.owned.includes(ship.id),available=data.maxPhase>=ship.unlockPhase;
    const p=shipProgress(ship.id),selected=ship.id===selectedShipId;
    const action=owned?"ABRIR OFICINA":available?"COMPRAR":"BLOQUEADA";
    const price=owned?"NAVE DESBLOQUEADA":available?formatCredits(ship.price)+" CRÉDITOS":"LIBERA NA FASE "+ship.unlockPhase;
    const image="assets/game/ships/"+ship.style+".svg";
    return '<article class="ship-card '+(selected?"selected ":"")+(owned?"owned ":"")+(available?"":"phase-locked")+'" data-ship-card="'+ship.id+'">'+
      '<div class="ship-visual"><img src="'+image+'" alt="'+ship.name+'"></div><h3>'+ship.name+'</h3><p>'+ship.desc+'</p>'+
      '<div class="ship-stats"><span>NV. '+p.level+'/'+ship.maxLevel+'</span><span>⚡ '+ship.speed.toFixed(1)+'</span><span>☄ DANO '+ship.damage.toFixed(2)+'</span><span>🛡 '+ship.shield+'</span></div>'+
      '<div class="ship-combat-stats"><span>LASER</span><b>'+ship.damage.toFixed(2)+'</b><span>MÍSSEIS</span><b>'+Math.round(450+ship.damage*100)+'</b></div>'+
      '<span class="ship-price">'+price+'</span><button type="button" data-ship-action="'+ship.id+'" '+(available?"":"disabled")+'>'+action+'</button></article>';
  }).join("");
  $$(".ship-card").forEach(card=>card.addEventListener("click",()=>{if(!card.classList.contains("phase-locked"))selecionarNave(card.dataset.shipCard)}));
  $$("[data-ship-action]").forEach(btn=>btn.addEventListener("click",e=>{e.stopPropagation();const id=btn.dataset.shipAction;const d=getShipSave();d.owned.includes(id)?selecionarNave(id):comprarNave(id)}));
  atualizarSelecaoNave();
  renderUpgradePanel();
}
function renderUpgradePanel(){
  const panel=$("#shipUpgradePanel");
  if(!panel)return;
  const ship=shipById(selectedShipId),p=shipProgress(selectedShipId);
  const data=getShipSave();
  panel.innerHTML='<div class="upgrade-head"><strong>OFICINA DA NAVE</strong><span>'+formatCredits(data.credits)+' CRÉDITOS</span></div>'+
    '<div class="upgrade-grid">'+moduleCatalog.map(m=>{
      const lv=p.modules[m.id]||0,locked=lv>=3, cost=m.base*(lv+1),need=3+lv;
      return '<div class="upgrade-card '+(locked?"max":"")+'"><div class="upgrade-title"><b>'+m.icon+' '+m.name+'</b><span>NV. '+lv+'/3</span></div>'+
        '<small>'+m.desc+'</small><button type="button" data-upgrade="'+m.id+'" '+(locked?"disabled":"")+'>'+
        (locked?"MÁXIMO":"COMPRAR · "+formatCredits(cost)+" CR")+'</button></div>';
    }).join("")+'</div><p class="upgrade-note">Cada nave tem limite próprio de evolução. Depois do limite, os módulos comprados na oficina são necessários para continuar fortalecendo a nave.</p>';
  $$("[data-upgrade]").forEach(btn=>btn.addEventListener("click",()=>comprarUpgrade(ship.id,btn.dataset.upgrade)));
}
function selecionarNave(id){
  const data=getShipSave(),ship=shipById(id);
  if(data.maxPhase<ship.unlockPhase){toast("Esta nave será desbloqueada após o chefão da fase "+(ship.unlockPhase-1)+".");return}
  if(!data.owned.includes(id)){comprarNave(id);return}
  selectedShipId=id;
  localStorage.setItem("gamehubNaveSelecionada",id);
  renderShipOptions();
  abrirOficinaNave(id);
}
function abrirOficinaNave(id){
  selectedShipId=id;
  localStorage.setItem("gamehubNaveSelecionada",id);
  const ship=shipById(id);
  const p=shipProgress(id);
  const data=getShipSave();
  $("#gameStartOverlay").classList.add("hidden");
  $("#shipWorkshopOverlay").classList.remove("hidden");
  $("#workshopShipName").textContent=ship.name;
  $("#workshopShipDesc").textContent=ship.desc;
  $("#workshopShipImage").src="assets/game/ships/"+ship.style+".svg";
  $("#workshopCredits").textContent=formatCredits(data.credits);
  const values=[
    ["LASER",ship.damage+(p.level-1)*.09+(p.modules.weapon||0)*.12,Math.min(100,(ship.damage/3+(p.modules.weapon||0)*.12)*100)],
    ["ESCUDO",ship.shield+(p.level-1)*5+(p.modules.shield||0)*18,Math.min(100,(ship.shield/210+(p.modules.shield||0)*.08)*100)],
    ["VIDA",ship.life+(p.level-1)*7+(p.modules.armor||0)*12,Math.min(100,(ship.life/210+(p.modules.armor||0)*.06)*100)],
    ["VELOCIDADE",(ship.speed+(p.level-1)*.06+(p.modules.engine||0)*.35).toFixed(1),Math.min(100,(ship.speed/7+(p.modules.engine||0)*.05)*100)],
    ["CADÊNCIA",Math.max(3,ship.fire-Math.floor((p.level-1)/4)-(p.modules.cooling||0)*.6).toFixed(1)+" s",Math.max(20,100-ship.fire*8+(p.modules.cooling||0)*15)],
    ["MÍSSIL",Math.round(450+ship.damage*100+(p.modules.weapon||0)*55),Math.min(100,45+ship.damage*18+(p.modules.weapon||0)*8)]
  ];
  $("#workshopShipStats").innerHTML=values.map(v=>'<div class="workshop-stat"><small>'+v[0]+'</small><strong>'+v[1]+'</strong><div class="bar"><i style="width:'+v[2]+'%"></i></div></div>').join("");
  $("#workshopUpgrades").innerHTML=moduleCatalog.map(m=>{
    const lv=p.modules[m.id]||0,cost=m.base*(lv+1),locked=lv>=3,need=3+lv,canLevel=p.level>=Math.min(need,ship.maxLevel),canBuy=data.credits>=cost&&canLevel&&!locked;
    return '<div class="workshop-upgrade"><b>'+m.icon+' '+m.name+' · NV. '+lv+'/3</b><small>'+m.desc+(canLevel?"":" · requer nível "+need)+'</small><button type="button" data-workshop-upgrade="'+m.id+'" '+(canBuy?"":"disabled")+'>'+ (locked?"MÁXIMO":canBuy?"MELHORAR · "+formatCredits(cost)+" CR":"BLOQUEADO") +'</button></div>';
  }).join("");
  $$("[data-workshop-upgrade]").forEach(btn=>btn.addEventListener("click",()=>{comprarUpgrade(ship.id,btn.dataset.workshopUpgrade);setTimeout(()=>abrirOficinaNave(ship.id),0)}));
}
function fecharOficina(){
  $("#shipWorkshopOverlay").classList.add("hidden");
  $("#gameStartOverlay").classList.remove("hidden");
  renderShipOptions();
}
function atualizarSelecaoNave(){
  const ship=shipById(selectedShipId),p=shipProgress(ship.id),info=$("#selectedShipInfo");
  if(info)info.textContent=ship.name+" selecionada · Nível "+p.level+"/"+ship.maxLevel+" · XP "+p.xp+" · "+ship.desc;
  $$(".ship-card").forEach(c=>c.classList.toggle("selected",c.dataset.shipCard===selectedShipId));
}

function audioStart(){
  if(!audioEnabled)return;
  try{
    if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==="suspended")audioCtx.resume();
    if(!musicTimer){
      const notes=[220,277.18,329.63,246.94,196,246.94,293.66,369.99];
      let n=0;
      musicTimer=setInterval(()=>{
        if(!audioEnabled||!audioCtx||gamePaused)return;
        const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
        osc.type="sine";osc.frequency.value=notes[n++%notes.length];
        gain.gain.setValueAtTime(.0001,audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(.025,audioCtx.currentTime+.04);
        gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.48);
        osc.connect(gain).connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+.5);
      },520);
    }
    if(!engineTimer){
      engineTimer=setInterval(()=>{if(!audioEnabled||!audioCtx||gamePaused)return;audioTone(78,.18,"triangle",.012,58)},230);
    }
  }catch(e){}
}
function audioTone(freq,duration,type="sine",volume=.06,endFreq=freq){
  if(!audioEnabled)return;
  try{
    if(!audioCtx)audioStart();
    if(!audioCtx)return;
    const o=audioCtx.createOscillator(),g=audioCtx.createGain(),now=audioCtx.currentTime;
    o.type=type;o.frequency.setValueAtTime(freq,now);o.frequency.exponentialRampToValueAtTime(Math.max(30,endFreq),now+duration);
    g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(volume,now+.008);g.gain.exponentialRampToValueAtTime(.0001,now+duration);
    o.connect(g).connect(audioCtx.destination);o.start(now);o.stop(now+duration+.02);
  }catch(e){}
}
function sfxShoot(){audioTone(760,.09,"square",.035,340)}
function sfxEnemyShot(){audioTone(170,.16,"sawtooth",.025,90)}
function sfxExplosion(){audioTone(110,.32,"sawtooth",.09,35);setTimeout(()=>audioTone(55,.38,"triangle",.07,28),55)}
function sfxBossExplosion(){audioTone(180,.75,"sawtooth",.13,28);setTimeout(()=>audioTone(70,.9,"square",.09,22),120)}
function sfxHit(){audioTone(95,.18,"square",.05,55)}
function toggleAudio(){
  audioEnabled=!audioEnabled;
  $("#btnAudioJogo").textContent=audioEnabled?"🔊":"🔇";
  if(audioEnabled)audioStart();
  toast(audioEnabled?"Som ativado.":"Som desativado.");
}

function abrirJogo(game){
  if(!usuarioLogado()){abrir("modalLogin");toast("Entre na sua conta para jogar.");return}
  fechar("modalJogo");
  $("#secInicio").classList.add("hidden");$("#secExtra").classList.add("hidden");$("#gameScreen").classList.remove("hidden");
  $("#gameStartOverlay").classList.remove("hidden");$("#gamePauseOverlay").classList.add("hidden");$("#gameOverOverlay").classList.add("hidden");$("#gameBossOverlay").classList.add("hidden");$("#gameUnlockOverlay").classList.add("hidden");
  selectedShipId=localStorage.getItem("gamehubNaveSelecionada")||"recruta";
  if(!getShipSave().owned.includes(selectedShipId))selectedShipId="recruta";
  renderShipOptions();
  $("#bossTitle").textContent="FASE 1 — ETAPA 1/5";
  window.scrollTo({top:0,behavior:"smooth"});
}
function iniciarJogo(game){abrirJogo(game)}

function iniciarPartida(){
  const ship=shipById(selectedShipId),prog=shipProgress(selectedShipId);
  const stars=[];
  for(let i=0;i<75;i++)stars.push({x:Math.random()*960,y:Math.random()*540,r:.5+Math.random()*1.4,s:.08+Math.random()*.55,a:.25+Math.random()*.55});
  const mods=prog.modules||{weapon:0,shield:0,engine:0,armor:0,cooling:0};
  gameState={
    phase:1,maxPhase:1000,stage:1,stageTotal:5,stageKills:0,stageTarget:12,phaseKills:0,targetKills:60,
    score:0,life:ship.life+(prog.level-1)*7+mods.armor*12,
    shield:ship.shield+(prog.level-1)*5+mods.shield*18,bombs:3,multiplier:1,
    waveNumber:0,waveCooldown:25,stageTransition:0,
    player:{
      x:480,y:470,speed:ship.speed+(prog.level-1)*.06+mods.engine*.35,
      cooldown:0,inv:0,damage:ship.damage+(prog.level-1)*.09+(mods.weapon*.12),
      fire:Math.max(3,ship.fire-Math.floor((prog.level-1)/4)-mods.cooling*.6)
    },
    shipId:ship.id,shipLevel:prog.level,shipMaxLevel:ship.maxLevel,
    bullets:[],missiles:[],enemyBullets:[],enemies:[],particles:[],stars,
    spawnTimer:15,boss:null,bossActive:false,phaseTransition:0,
    startTime:performance.now(),elapsed:0
  };
  gameRunning=true;gamePaused=false;lastFrame=performance.now();
  $("#gameStartOverlay").classList.add("hidden");$("#shipWorkshopOverlay").classList.add("hidden");
  $("#gamePauseOverlay").classList.add("hidden");$("#gameOverOverlay").classList.add("hidden");
  $("#gameBossOverlay").classList.add("hidden");$("#gameUnlockOverlay").classList.add("hidden");
  audioStart();atualizarHUD();cancelarAnimacao();renderGame(lastFrame);gameAnimation=requestAnimationFrame(gameLoop);
}
function cancelarAnimacao(){if(gameAnimation)cancelAnimationFrame(gameAnimation);gameAnimation=null}
function renderGame(now){
  if(!gameState)return;
  const canvas=$("#gameCanvas"),ctx=canvas.getContext("2d");
  if(!ctx)return;
  drawBackground(ctx,now);
  for(const q of gameState.particles)drawParticle(ctx,q);
  for(const b of gameState.bullets)drawLaser(ctx,b);
  for(const m of gameState.missiles)drawMissile(ctx,m);
  for(const b of gameState.enemyBullets)drawEnemyShot(ctx,b);
  for(const e of gameState.enemies)drawEnemy(ctx,e);
  if(gameState.boss)drawBoss(ctx,gameState.boss);
  drawPlayer(ctx,gameState.player,shipById(gameState.shipId));
}
function prepararEtapa(){
  gameState.stageKills=0;
  gameState.stageTarget=Math.min(12+Math.floor(gameState.phase/5),18);
  gameState.waveCooldown=38;
  gameState.spawnTimer=24;
}
function iniciarNovaEtapa(){
  if(gameState.stage<gameState.stageTotal){
    gameState.stage++;
    prepararEtapa();
    toast("ETAPA "+gameState.stage+"/"+gameState.stageTotal+" · NOVA FORMAÇÃO");
  }else{
    gameState.waveCooldown=70;
    iniciarChefe();
  }
}
function iniciarNovaFase(){
  if(gameState.phase>=gameState.maxPhase){fimDeJogo(true);return}
  gameState.phase++;
  gameState.stage=1;
  gameState.phaseKills=0;
  gameState.waveNumber=0;
  gameState.boss=null;gameState.bossActive=false;
  gameState.stageTransition=0;gameState.phaseTransition=0;
  prepararEtapa();
  $("#gameBossOverlay").classList.add("hidden");
  $("#bossTitle").textContent="FASE "+gameState.phase+" — ETAPA 1/"+gameState.stageTotal;
  toast("FASE "+gameState.phase+" · ETAPA 1/"+gameState.stageTotal);
}
function iniciarChefe(){
  gameState.bossActive=true;
  const hp=2400+gameState.phase*260;
  gameState.boss={
    x:480,y:85,hp,maxHp:hp,w:190,h:120,
    speed:1.15+gameState.phase*.01,dir:1,cooldown:42,
    shield:700+gameState.phase*65,maxShield:700+gameState.phase*65,
    imageIndex:(gameState.phase-1)%bossImages.length
  };
  gameState.enemies=[];
  gameState.missiles=[];
  $("#bossTitle").textContent="CHEFÃO — CLASSE "+(gameState.boss.imageIndex+1);
  $("#gameBossOverlay").classList.remove("hidden");
  setTimeout(()=>$("#gameBossOverlay").classList.add("hidden"),1400);
  sfxBossExplosion();
}
function atualizarHUD(){
  if(!gameState)return;
  $("#gameScore").textContent=gameState.score.toLocaleString("pt-BR");
  $("#gamePhase").textContent=gameState.phase+" / "+gameState.maxPhase;
  $("#gameEnemies").textContent=gameState.bossActive?"CHEFÃO":gameState.enemies.length;
  const progressEl=$("#gameWaveProgress");
  if(progressEl)progressEl.textContent=gameState.bossActive
    ?"BATALHA DO CHEFÃO"
    :"ETAPA "+gameState.stage+"/"+gameState.stageTotal+" · "+gameState.stageKills+"/"+gameState.stageTarget+" · ONDA "+gameState.waveNumber;
  $("#gameBombs").textContent=gameState.bombs;
  $("#gameMultiplier").textContent="x"+gameState.multiplier;
  $("#gameShipLevel").textContent=shipById(gameState.shipId).name+" · "+gameState.shipLevel+"/"+gameState.shipMaxLevel;
  const secs=Math.floor(gameState.elapsed/1000),m=String(Math.floor(secs/60)).padStart(2,"0"),ss=String(secs%60).padStart(2,"0");
  $("#gameTime").textContent=m+":"+ss;
  const lifeBars=$$(".warzone-panel.left .bars:first-of-type i"),shieldBars=$$(".warzone-panel.left .shield i");
  lifeBars.forEach((b,i)=>b.classList.toggle("off",i>=Math.ceil(gameState.life/12.5)));
  shieldBars.forEach((b,i)=>b.classList.toggle("off",i>=Math.ceil(gameState.shield/10)));
  $("#bossBarFill").style.width=gameState.boss?Math.max(0,gameState.boss.hp/gameState.boss.maxHp*100)+"%":"0%";
  const bossShield=$("#bossShieldFill");
  if(bossShield)bossShield.style.width=gameState.boss?Math.max(0,gameState.boss.shield/gameState.boss.maxShield*100)+"%":"0%";
}
function spawnEnemy(){
  const level=gameState.phase,roll=Math.random();
  const type=roll<.48?"scout":roll<.82?"fighter":"hunter";
  const hp=type==="fighter"?2+Math.floor(level/10):type==="hunter"?3+Math.floor(level/8):1+Math.floor(level/20);
  gameState.enemies.push({x:35+Math.random()*890,y:-45,targetY:90+Math.random()*120,w:38,h:32,speed:1.0+Math.random()*1.1+level*.012,life:hp,maxLife:hp,type,shoot:60+Math.random()*100,phase:Math.random()*6.28,formation:false,imageIndex:Math.floor(Math.random()*enemyImages.length)});
}
function spawnFormation(){
  const count=4+Math.floor(Math.random()*2);
  const gapX=118,startX=480-(count-1)*gapX/2,startY=-55;
  const level=gameState.phase;
  gameState.waveNumber++;
  for(let n=0;n<count;n++){
    const roll=Math.random(),type=roll<.58?"scout":roll<.88?"fighter":"hunter";
    const hp=type==="fighter"?2+Math.floor(level/12):type==="hunter"?3+Math.floor(level/10):1+Math.floor(level/20);
    gameState.enemies.push({
      x:startX+n*gapX,y:startY,targetY:88,w:42,h:34,
      speed:.9+Math.random()*.35+level*.006,life:hp,maxLife:hp,type,
      shoot:105+Math.random()*110,phase:n*.8,formation:true,formationX:startX+n*gapX,
      imageIndex:(level+gameState.waveNumber+n)%enemyImages.length
    });
  }
}
function addParticle(x,y,color,count=10){
  for(let i=0;i<count;i++){
    if(gameState.particles.length>260)break;
    const a=Math.random()*Math.PI*2,sp=.7+Math.random()*4;
    gameState.particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:24+Math.random()*35,max:55,color,size:1+Math.random()*3});
  }
}
function atirar(){
  if(!gameRunning||gamePaused||!gameState||gameState.player.cooldown>0)return;
  const p=gameState.player;
  gameState.bullets.push({x:p.x-10,y:p.y-28,v:11,damage:p.damage},{x:p.x+10,y:p.y-28,v:11,damage:p.damage});
  p.cooldown=p.fire;sfxShoot();
}
function usarBomba(){
  if(!gameRunning||gamePaused||!gameState||gameState.bombs<=0)return;
  const p=gameState.player;
  const target=gameState.boss||gameState.enemies
    .filter(e=>e.life>0)
    .sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];
  if(!target){toast("Nenhum alvo disponível para o míssil.");return}
  gameState.bombs--;
  gameState.missiles.push({x:p.x,y:p.y-34,target,vx:0,vy:-2.8,age:0,damage:360+Math.round(shipById(gameState.shipId).damage*80)+gameState.phase*8});
  audioTone(120,.18,"sawtooth",.08,420);
  atualizarHUD();
}
function updateMissiles(){
  for(const m of gameState.missiles){
    m.age++;
    const target=m.target;
    if(target&&(!target.life||target.hp!==undefined&&target.hp<=0)){m.target=null}
    if(m.target){
      const dx=m.target.x-m.x,dy=m.target.y-m.y,len=Math.hypot(dx,dy)||1;
      m.vx+=(dx/len*5.2-m.vx)*.12;
      m.vy+=(dy/len*5.2-m.vy)*.12;
    }else{
      m.vx*=.99;m.vy=-5.2;
    }
    m.x+=m.vx;m.y+=m.vy;
    if(m.target&&Math.hypot(m.x-m.target.x,m.y-m.target.y)<34){
      const t=m.target;
      if(t.hp!==undefined){
        if(t.shield>0)t.shield=Math.max(0,t.shield-m.damage);else t.hp=Math.max(0,t.hp-m.damage);
        addParticle(t.x,t.y,"#ffcf66",16);toast("MÍSSIL ACERTOU O CHEFÃO · -"+m.damage);
      }else{
        t.life-=m.damage; if(t.life<=0)explodeEnemy(t);
        addParticle(t.x,t.y,"#ffcf66",14);toast("MÍSSIL ACERTOU UM INIMIGO");
      }
      m.y=-999;sfxExplosion();
    }
  }
  gameState.missiles=gameState.missiles.filter(m=>m.y>-40&&m.y<580);
}
function enemyShoot(e){
  const p=gameState.player,dx=p.x-e.x,dy=p.y-e.y,len=Math.hypot(dx,dy)||1,speed=2.4+gameState.phase*.012;
  gameState.enemyBullets.push({x:e.x,y:e.y+18,vx:dx/len*speed,vy:dy/len*speed,r:4});sfxEnemyShot();
}
function bossShoot(){
  const b=gameState.boss,p=gameState.player,base=Math.atan2(p.y-b.y,p.x-b.x),count=gameState.phase<15?3:5;
  for(let k=0;k<count;k++){const off=(k-(count-1)/2)*.16,a=base+off;gameState.enemyBullets.push({x:b.x,y:b.y+35,vx:Math.cos(a)*3.3,vy:Math.sin(a)*3.3,r:5})}
  sfxEnemyShot();
}
function hitPlayer(dmg){
  const p=gameState.player;if(p.inv>0)return;p.inv=38;
  if(gameState.shield>0){gameState.shield=Math.max(0,gameState.shield-dmg);if(gameState.shield===0)gameState.life-=Math.ceil(dmg*.35)}else gameState.life-=dmg;
  addParticle(p.x,p.y,"#64c9ff",15);sfxHit();
}
function gainXP(amount){
  const data=getShipSave(),p=data.progress[gameState.shipId]||{level:1,xp:0,modules:{}},ship=shipById(gameState.shipId);
  if(p.level>=ship.maxLevel){p.xp=0;data.progress[gameState.shipId]=p;saveShipData(data);return}
  p.xp+=amount;
  let leveled=false;
  while(p.level<ship.maxLevel&&p.xp>=100+p.level*45){p.xp-=100+p.level*45;p.level++;leveled=true}
  data.progress[gameState.shipId]=p;saveShipData(data);gameState.shipLevel=p.level;
  if(leveled){gameState.life=Math.min(100+gameState.shipLevel*7,gameState.life+25);gameState.shield+=18;toast("Nave evoluiu para o nível "+p.level+"!");audioTone(660,.35,"triangle",.08,990)}
}
function explodeEnemy(e){
  e.life=0;gameState.score+=15*gameState.multiplier;gameState.phaseKills++;gameState.stageKills++;gainXP(8+Math.floor(gameState.phase/10));addParticle(e.x,e.y,e.type==="hunter"?"#b85cff":"#ff4058",20);sfxExplosion();
  if(gameState.phaseKills%5===0)gameState.multiplier=Math.min(8,gameState.multiplier+1);
}
function drawBackground(ctx,now){
  const w=960,h=540,idx=currentGalaxyIndex(gameState.phase),img=galaxyBackgrounds[idx];
  ctx.clearRect(0,0,w,h);
  if(img&&img.complete&&img.naturalWidth){
    ctx.drawImage(img,0,0,w,h);
  }else{
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"#02030e");g.addColorStop(.5,"#07142d");g.addColorStop(1,"#020714");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  }
  // profundidade adicional: estrelas leves sobre a arte, sem pesar no computador
  for(const st of gameState.stars){st.y+=st.s;if(st.y>h)st.y=0;ctx.globalAlpha=st.a;ctx.fillStyle="#e6f5ff";ctx.fillRect(st.x,st.y,st.r,st.r)}
  ctx.globalAlpha=1;
  ctx.fillStyle="rgba(0,4,15,.12)";ctx.fillRect(0,0,w,h);
}
function drawPlayer(ctx,p,ship){
  if(p.inv>0&&Math.floor(p.inv/4)%2===0)return;
  const img=shipImages[ship.style];
  ctx.save();ctx.translate(p.x,p.y);
  if(img&&img.complete&&img.naturalWidth){ctx.drawImage(img,-58,-42,116,84)}
  else{ctx.fillStyle="#18baff";ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(28,24);ctx.lineTo(0,14);ctx.lineTo(-28,24);ctx.closePath();ctx.fill()}
  ctx.restore();
}
function drawEnemy(ctx,e){
  const img=enemyImages[e.imageIndex%enemyImages.length];
  ctx.save();ctx.translate(e.x,e.y);
  if(img&&img.complete&&img.naturalWidth){ctx.drawImage(img,-38,-25,76,50)}
  else{ctx.fillStyle="#ff4058";ctx.fillRect(-24,-12,48,24)}
  ctx.restore();
}
function drawBoss(ctx,b){
  const img=bossImages[b.imageIndex%bossImages.length];
  ctx.save();ctx.translate(b.x,b.y);
  if(img&&img.complete&&img.naturalWidth){ctx.drawImage(img,-140,-84,280,168)}
  else{ctx.fillStyle="#ff3158";ctx.fillRect(-100,-40,200,80)}
  ctx.restore();
}
function drawLaser(ctx,b){
  ctx.save();ctx.strokeStyle="#67ddff";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(b.x,b.y+10);ctx.lineTo(b.x,b.y-15);ctx.stroke();ctx.restore();
}
function drawMissile(ctx,m){
  ctx.save();
  const angle=Math.atan2(m.vy,m.vx)+Math.PI/2;
  ctx.translate(m.x,m.y);ctx.rotate(angle);
  if(missileImage.complete&&missileImage.naturalWidth)ctx.drawImage(missileImage,-9,-22,18,44);
  else{ctx.fillStyle="#ffd166";ctx.fillRect(-3,-14,6,28)}
  ctx.restore();
}

function drawEnemyShot(ctx,b){
  ctx.save();ctx.fillStyle="#ff3e59";ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();ctx.restore();
}
function drawParticle(ctx,q){
  ctx.globalAlpha=Math.max(0,q.life/q.max);ctx.fillStyle=q.color;ctx.fillRect(q.x,q.y,q.size,q.size);ctx.globalAlpha=1;
}
function gameLoop(now){
  if(!gameRunning)return;
  if(gamePaused){gameAnimation=requestAnimationFrame(gameLoop);return}
  const dt=Math.min(34,now-lastFrame);lastFrame=now;gameState.elapsed=now-gameState.startTime;
  const canvas=$("#gameCanvas"),p=gameState.player;
  if(!canvas||!canvas.getContext("2d"))return;
  const speed=p.speed*(dt/16.67);
  if(gameKeys.KeyW||gameKeys.ArrowUp)p.y-=speed;if(gameKeys.KeyS||gameKeys.ArrowDown)p.y+=speed;if(gameKeys.KeyA||gameKeys.ArrowLeft)p.x-=speed;if(gameKeys.KeyD||gameKeys.ArrowRight)p.x+=speed;
  p.x=Math.max(32,Math.min(928,p.x));p.y=Math.max(50,Math.min(500,p.y));
  if(gameKeys.Space||gameState.fire)atirar();if(p.cooldown>0)p.cooldown--;if(p.inv>0)p.inv--;

  if(!gameState.bossActive){
    gameState.spawnTimer--;
    if(gameState.stageKills<gameState.stageTarget&&gameState.enemies.length===0&&gameState.spawnTimer<=0){
      spawnFormation();
      gameState.spawnTimer=Math.max(42,62-gameState.phase*.015);
    }
    if(gameState.stageKills>=gameState.stageTarget&&gameState.enemies.length===0&&gameState.waveCooldown<=0){
      iniciarNovaEtapa();
    }
    if(gameState.waveCooldown>0)gameState.waveCooldown--;
  }else if(gameState.boss){
    const b=gameState.boss;b.x+=b.speed*b.dir;if(b.x<110||b.x>850)b.dir*=-1;b.cooldown--;if(b.cooldown<=0){bossShoot();b.cooldown=Math.max(15,48-gameState.phase*.02)}
  }

  for(const b of gameState.bullets)b.y-=b.v;
  gameState.bullets=gameState.bullets.filter(b=>b.y>-30);
  updateMissiles();
  for(const e of gameState.enemies){
    if(e.y<e.targetY)e.y+=e.speed;else{e.phase+=.025;e.x=e.formation?e.formationX+Math.sin(e.phase)*42:e.x+Math.sin(e.phase)*.5}
    e.shoot--;
    if(e.shoot<=0){enemyShoot(e);e.shoot=Math.max(34,100-gameState.phase*.025)}
    if(e.y>570){e.life=0;hitPlayer(5)}
  }
  gameState.enemies=gameState.enemies.filter(e=>e.life>0);
  for(const b of gameState.enemyBullets){b.x+=b.vx;b.y+=b.vy}
  gameState.enemyBullets=gameState.enemyBullets.filter(b=>b.x>-40&&b.x<1000&&b.y>-40&&b.y<580);

  for(const b of gameState.bullets){
    if(b.y<-20)continue;
    for(const e of gameState.enemies){
      if(e.life>0&&Math.abs(b.x-e.x)<28&&Math.abs(b.y-e.y)<30){b.y=-100;e.life-=b.damage;if(e.life<=0)explodeEnemy(e);break}
    }
    if(gameState.boss&&Math.abs(b.x-gameState.boss.x)<110&&Math.abs(b.y-gameState.boss.y)<78){
      b.y=-100;
      if(gameState.boss.shield>0)gameState.boss.shield=Math.max(0,gameState.boss.shield-b.damage*1.25);
      else gameState.boss.hp-=b.damage;
      addParticle(b.x,b.y,"#8ee8ff",3);
    }
  }
  gameState.enemies=gameState.enemies.filter(e=>e.life>0);
  for(const b of gameState.enemyBullets){if(Math.abs(b.x-p.x)<20&&Math.abs(b.y-p.y)<28){b.x=-100;hitPlayer(8)}}
  for(const e of gameState.enemies){if(Math.abs(e.x-p.x)<30&&Math.abs(e.y-p.y)<30){e.life=0;hitPlayer(18);addParticle(e.x,e.y,"#ff334d",22);sfxExplosion()}}
  gameState.enemies=gameState.enemies.filter(e=>e.life>0);

  if(gameState.boss&&gameState.boss.hp<=0){
    const defeatedPhase=gameState.phase,bx=gameState.boss.x,by=gameState.boss.y;
    gameState.score+=1000*gameState.multiplier;gainXP(45+gameState.phase*3);addParticle(bx,by,"#ff7048",120);sfxBossExplosion();
    gameState.boss=null;gameState.bossActive=false;
    const data=getShipSave();
    data.maxPhase=Math.max(data.maxPhase,defeatedPhase+1);
    data.credits+=(600+defeatedPhase*120);
    saveShipData(data);
    const unlocked=shipCatalog.filter(sh=>sh.unlockPhase===defeatedPhase+1&&!data.owned.includes(sh.id));
    if(unlocked.length){
      unlocked.forEach(sh=>{data.owned.push(sh.id);data.progress[sh.id]={level:1,xp:0,modules:{weapon:0,shield:0,engine:0,armor:0,cooling:0}}});
      saveShipData(data);
      mostrarDesbloqueioNave(unlocked[0],600+defeatedPhase*120);
      gameState.phaseTransition=0;gamePaused=true;return;
    }
    if(gameState.phase>=gameState.maxPhase){fimDeJogo(true);return}
    gameState.phaseTransition=120;
  }
  if(gameState.phaseTransition>0){gameState.phaseTransition--;if(gameState.phaseTransition===1)iniciarNovaFase()}
  for(const q of gameState.particles){q.x+=q.vx;q.y+=q.vy;q.vx*=.985;q.vy*=.985;q.life--}
  gameState.particles=gameState.particles.filter(q=>q.life>0);
  renderGame(now);atualizarHUD();
  if(gameState.life<=0){fimDeJogo(false);return}
  gameAnimation=requestAnimationFrame(gameLoop);
}
function mostrarDesbloqueioNave(ship,reward){
  const overlay=$("#gameUnlockOverlay");if(!overlay)return;
  $("#unlockShipName").textContent=ship.name;
  $("#unlockShipImage").src="assets/game/ships/"+ship.style+".svg";
  $("#unlockShipText").textContent="Parabéns pela conquista! Você derrotou o chefão e acabou de desbloquear a "+ship.name+".";
  $("#unlockShipStats").textContent="LASER "+ship.damage.toFixed(2)+" · ESCUDO "+ship.shield+" · MÍSSEIS "+Math.round(450+ship.damage*100)+" · RECOMPENSA +"+formatCredits(reward)+" CRÉDITOS";
  overlay.classList.remove("hidden");
}
function continuarAposDesbloqueio(){
  $("#gameUnlockOverlay").classList.add("hidden");
  gamePaused=false;iniciarNovaFase();
}
function fimDeJogo(vitoria){
  gameRunning=false;cancelarAnimacao();
  $("#finalScore").textContent=gameState?gameState.score.toLocaleString("pt-BR"):"0";
  $("#gameEndTitle").textContent=vitoria?"MISSÃO CONCLUÍDA":"NAVE DESTRUÍDA";
  $("#gameOverOverlay").classList.remove("hidden");
}
function alternarPausa(){
  if(!gameRunning)return;
  gamePaused=!gamePaused;$("#gamePauseOverlay").classList.toggle("hidden",!gamePaused);
  if(!gamePaused){lastFrame=performance.now();cancelarAnimacao();gameAnimation=requestAnimationFrame(gameLoop)}
}
function comprarProduto(nome,preco){
  if(!usuarioLogado()){abrir("modalLogin");toast("Entre na sua conta para comprar.");return}
  const compras=JSON.parse(localStorage.getItem("gamehubCompras")||"[]");
  if(compras.some(x=>x.nome===nome)){toast("Este item já está na sua conta.");return}
  compras.push({nome,preco,data:new Date().toISOString()});
  localStorage.setItem("gamehubCompras",JSON.stringify(compras));
  toast("Compra concluída: "+nome);
}
function mostrarLoja(){
  if(!usuarioLogado()){mostrarExtra("Loja","🛒","Entre ou crie sua conta para fazer compras e adicionar jogos à sua biblioteca.");return}
  $("#secInicio").classList.add("hidden");
  $("#secExtra").classList.remove("hidden");
  $("#extraIcon").textContent="🛒";
  $("#extraTitle").textContent="Loja GameHub";
  $("#extraText").textContent="Olá, "+getUsuario().nome.split(" ")[0]+". Escolha um conteúdo para adicionar à sua conta.";
  const produtos=[["Eternal Realms","RPG · Aventura","R$ 49,90"],["Speed Rush","Corrida · Esportes","R$ 39,90"],["Warzone Elite","Ação · Estratégia","R$ 59,90"]];
  const old=$("#extraText").nextElementSibling;
  if(old&&(old.classList.contains("store-grid")||old.classList.contains("library-list")))old.remove();
  $("#extraText").insertAdjacentHTML("afterend",'<div class="store-grid">'+produtos.map(p=>'<article class="store-card"><h3>'+p[0]+'</h3><p>'+p[1]+'</p><span class="price">'+p[2]+'</span><button class="btn-primary" type="button" data-buy="'+p[0]+'" data-price="'+p[2]+'">Comprar</button></article>').join("")+"</div>");
  $$("[data-buy]").forEach(b=>b.onclick=()=>comprarProduto(b.dataset.buy,b.dataset.price));
  window.scrollTo({top:0,behavior:"smooth"});
}
function mostrarBiblioteca(){
  if(!usuarioLogado()){mostrarExtra("Biblioteca","🎮","Entre ou crie sua conta para guardar os jogos que você comprar.");return}
  $("#secInicio").classList.add("hidden");
  $("#secExtra").classList.remove("hidden");
  $("#extraIcon").textContent="🎮";
  $("#extraTitle").textContent="Minha Biblioteca";
  const compras=JSON.parse(localStorage.getItem("gamehubCompras")||"[]");
  $("#extraText").textContent=compras.length?"Seus jogos e conteúdos estão aqui.":"Sua biblioteca está vazia. Visite a Loja para adicionar um jogo.";
  const old=$("#extraText").nextElementSibling;
  if(old&&(old.classList.contains("store-grid")||old.classList.contains("library-list")))old.remove();
  if(compras.length){
    $("#extraText").insertAdjacentHTML("afterend",'<div class="library-list">'+compras.map(p=>'<div class="library-item"><strong>'+p.nome+'</strong><p>'+p.preco+'</p><button class="btn-primary" type="button" data-library-game="'+p.nome+'">Jogar</button></div>').join("")+"</div>");
    $$("[data-library-game]").forEach(b=>b.onclick=()=>iniciarJogo(b.dataset.libraryGame));
  }
  window.scrollTo({top:0,behavior:"smooth"});
}

$("#btnCadastrar").addEventListener("click",()=>{
  const nome=$("#nome").value.trim(),cpf=$("#cpf").value.trim(),nascimento=$("#nascimento").value,email=$("#email").value.trim(),telefone=$("#telefone").value.trim(),senha=$("#senha").value,confirmar=$("#confirmarSenha").value;
  $("#cadastroErro").textContent="";
  if(!nome||!cpf||!nascimento||!email||!telefone||!senha||!confirmar){$("#cadastroErro").textContent="Preencha os campos obrigatórios.";return}
  if(senha!==confirmar){$("#cadastroErro").textContent="As senhas não são iguais.";return}
  const usuario={nome,cpf,nascimento,email,telefone,cep:$("#cep").value,endereco:$("#endereco").value,numero:$("#numero").value,complemento:$("#complemento").value,quadra:$("#quadra").value,lote:$("#lote").value,cidade:$("#cidade").value,estado:$("#estado").value,senha};
  localStorage.setItem("gamehubUsuario",JSON.stringify(usuario));
  localStorage.setItem("gamehubSessao",usuario.email);
  atualizarInterface();
  fechar("modalCadastro");
  abrir("modalSucesso");
  toast("Conta criada e login realizado.");
});

$("#continuarGameHub").addEventListener("click",()=>{fechar("modalSucesso");mostrarHome();toast("Tudo pronto. Você já pode jogar e comprar!");});

$("#btnLogin").addEventListener("click",()=>{
  const usuario=getUsuario();
  const email=$("#loginEmail").value.trim(),senha=$("#loginSenha").value;
  $("#loginErro").textContent="";
  if(!usuario){$("#loginErro").textContent="Nenhuma conta foi cadastrada neste navegador.";return}
  if(email!==usuario.email||senha!==usuario.senha){$("#loginErro").textContent="E-mail ou senha incorretos.";return}
  localStorage.setItem("gamehubSessao",usuario.email);
  atualizarInterface();
  fechar("modalLogin");
  mostrarExtra("Bem-vindo ao GameHub!","🎮","Olá, "+usuario.nome+". Sua conta está ativa. Você já pode jogar, comprar e usar a plataforma.");
  toast("Login realizado com sucesso.");
});

$("#btnSair").addEventListener("click",()=>{
  localStorage.removeItem("gamehubSessao");
  atualizarInterface();
  mostrarHome();
  toast("Você saiu da conta.");
});

if(localStorage.getItem("gamehubUsuario")&&!localStorage.getItem("gamehubSessao")){}

atualizarInterface();

$("#btnComecarPartida").addEventListener("click",iniciarPartida);
$("#btnVoltarHangar").addEventListener("click",fecharOficina);
$("#btnIniciarDaOficina").addEventListener("click",iniciarPartida);
$("#btnReiniciarPartida").addEventListener("click",iniciarPartida);
$("#btnPausaJogo").addEventListener("click",alternarPausa);
$("#btnContinuarPartida").addEventListener("click",alternarPausa);
$("#btnAudioJogo").addEventListener("click",toggleAudio);
$("#btnContinuarDesbloqueio").addEventListener("click",continuarAposDesbloqueio);
$("#touchBomb").addEventListener("click",usarBomba);
$("#btnVoltarJogo").addEventListener("click",()=>{gameRunning=false;gamePaused=false;cancelarAnimacao();$("#gameScreen").classList.add("hidden");mostrarHome()});
document.addEventListener("keydown",e=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code))e.preventDefault();gameKeys[e.code]=true});
document.addEventListener("keyup",e=>{gameKeys[e.code]=false});
document.addEventListener("keydown",e=>{if(e.code==="KeyB")usarBomba()});
$("#touchFire").addEventListener("pointerdown",()=>{if(gameState)gameState.fire=true});
["pointerup","pointercancel","pointerleave"].forEach(ev=>$("#touchFire").addEventListener(ev,()=>{if(gameState)gameState.fire=false}));
$$(".dpad [data-key]").forEach(b=>{const k=b.dataset.key;["pointerdown"].forEach(ev=>b.addEventListener(ev,()=>gameKeys[k]=true));["pointerup","pointercancel","pointerleave"].forEach(ev=>b.addEventListener(ev,()=>gameKeys[k]=false))});
