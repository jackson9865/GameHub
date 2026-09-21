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
  {id:"recruta",name:"RECRUTA",icon:"🚀",price:0,maxLevel:5,desc:"Nave inicial equilibrada. Ideal para aprender.",speed:5.0,damage:1,life:100,shield:60,fire:9},
  {id:"falcon",name:"FALCON X",icon:"🛸",price:990,maxLevel:10,desc:"Mais rápida e com laser reforçado.",speed:6.1,damage:1.35,life:110,shield:75,fire:8},
  {id:"phantom",name:"PHANTOM",icon:"👾",price:1990,maxLevel:20,desc:"Alta cadência e excelente escudo.",speed:6.5,damage:1.65,life:120,shield:95,fire:7},
  {id:"titan",name:"TITAN",icon:"🚀",price:3990,maxLevel:30,desc:"A nave pesada para as fases avançadas.",speed:4.8,damage:2.2,life:155,shield:130,fire:10}
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

function getShipSave(){
  const base={credits:1500,owned:["recruta"],progress:{}};
  try{
    const saved=JSON.parse(localStorage.getItem("gamehubNaves")||"null");
    if(saved){
      saved.credits=Number.isFinite(saved.credits)?saved.credits:1500;
      saved.owned=Array.isArray(saved.owned)?saved.owned:["recruta"];
      saved.progress=saved.progress||{};
      if(!saved.owned.includes("recruta"))saved.owned.unshift("recruta");
      return saved;
    }
  }catch(e){}
  localStorage.setItem("gamehubNaves",JSON.stringify(base));
  return base;
}
function saveShipData(data){localStorage.setItem("gamehubNaves",JSON.stringify(data))}
function shipById(id){return shipCatalog.find(s=>s.id===id)||shipCatalog[0]}
function shipProgress(id){
  const data=getShipSave();
  if(!data.progress[id])data.progress[id]={level:1,xp:0};
  return data.progress[id];
}
function formatCredits(n){return Number(n||0).toLocaleString("pt-BR")}
function comprarNave(id){
  const ship=shipById(id),data=getShipSave();
  if(data.owned.includes(id)){selecionarNave(id);return}
  if(data.credits<ship.price){toast("Créditos insuficientes para esta nave.");return}
  data.credits-=ship.price;
  data.owned.push(id);
  data.progress[id]={level:1,xp:0};
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
    const owned=data.owned.includes(ship.id),p=shipProgress(ship.id),selected=ship.id===selectedShipId;
    const action=owned?"Selecionar":"Comprar";
    const price=owned?"NAVE DESBLOQUEADA":formatCredits(ship.price)+" CRÉDITOS";
    return '<article class="ship-card '+(selected?"selected ":"")+(owned?"owned":"locked")+'" data-ship-card="'+ship.id+'">'+
      '<div class="ship-visual">'+ship.icon+'</div><h3>'+ship.name+'</h3><p>'+ship.desc+'</p>'+
      '<div class="ship-stats"><span>NV. '+p.level+'/'+ship.maxLevel+'</span><span>⚡ '+ship.speed.toFixed(1)+'</span><span>🛡 '+ship.shield+'</span></div>'+
      '<span class="ship-price">'+price+'</span><button type="button" data-ship-action="'+ship.id+'">'+action+'</button></article>';
  }).join("");
  $$("[data-ship-card]").forEach(card=>card.addEventListener("click",()=>selecionarNave(card.dataset.shipCard)));
  $$("[data-ship-action]").forEach(btn=>btn.addEventListener("click",e=>{e.stopPropagation();const id=btn.dataset.shipAction;const d=getShipSave();d.owned.includes(id)?selecionarNave(id):comprarNave(id)}));
  atualizarSelecaoNave();
}
function selecionarNave(id){
  const data=getShipSave();
  if(!data.owned.includes(id)){comprarNave(id);return}
  selectedShipId=id;
  localStorage.setItem("gamehubNaveSelecionada",id);
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
  $("#gameStartOverlay").classList.remove("hidden");$("#gamePauseOverlay").classList.add("hidden");$("#gameOverOverlay").classList.add("hidden");$("#gameBossOverlay").classList.add("hidden");
  selectedShipId=localStorage.getItem("gamehubNaveSelecionada")||"recruta";
  if(!getShipSave().owned.includes(selectedShipId))selectedShipId="recruta";
  renderShipOptions();
  $("#bossTitle").textContent="ESCOLHA SUA NAVE";
  window.scrollTo({top:0,behavior:"smooth"});
}
function iniciarJogo(game){abrirJogo(game)}

function iniciarPartida(){
  const canvas=$("#gameCanvas"),ship=shipById(selectedShipId),prog=shipProgress(selectedShipId);
  const stars=[];
  for(let i=0;i<110;i++)stars.push({x:Math.random()*960,y:Math.random()*540,r:.5+Math.random()*1.8,s:.15+Math.random()*1.2,a:.3+Math.random()*.7});
  gameState={
    phase:1,maxPhase:1000,phaseKills:0,targetKills:Math.min(5+Math.floor(1*1.2),18),score:0,life:ship.life+(prog.level-1)*7,shield:ship.shield+(prog.level-1)*5,bombs:3,multiplier:1,
    player:{x:480,y:470,speed:ship.speed+(prog.level-1)*.06,cooldown:0,inv:0,damage:ship.damage+(prog.level-1)*.09,fire:Math.max(4,ship.fire-Math.floor((prog.level-1)/4))},
    shipId:ship.id,shipLevel:prog.level,shipMaxLevel:ship.maxLevel,bullets:[],enemyBullets:[],enemies:[],particles:[],stars,
    spawnTimer:8,boss:null,bossActive:false,phaseTransition:0,startTime:performance.now(),elapsed:0
  };
  gameRunning=true;gamePaused=false;lastFrame=performance.now();
  $("#gameStartOverlay").classList.add("hidden");$("#gamePauseOverlay").classList.add("hidden");$("#gameOverOverlay").classList.add("hidden");$("#gameBossOverlay").classList.add("hidden");
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
  for(const b of gameState.enemyBullets)drawEnemyShot(ctx,b);
  for(const e of gameState.enemies)drawEnemy(ctx,e);
  if(gameState.boss)drawBoss(ctx,gameState.boss);
  drawPlayer(ctx,gameState.player,shipById(gameState.shipId));
}
function iniciarNovaFase(){
  if(gameState.phase>=gameState.maxPhase){fimDeJogo(true);return}
  gameState.phase++;gameState.phaseKills=0;gameState.targetKills=Math.min(5+Math.floor(gameState.phase*1.2),28);
  gameState.boss=null;gameState.bossActive=false;gameState.spawnTimer=Math.max(8,32-gameState.phase*.025);
  $("#gameBossOverlay").classList.add("hidden");$("#bossTitle").textContent="FASE "+gameState.phase+" / "+gameState.maxPhase;
}
function iniciarChefe(){
  gameState.bossActive=true;
  const hp=130+gameState.phase*24;
  gameState.boss={x:480,y:85,hp,maxHp:hp,w:150,h:90,speed:1.25+gameState.phase*.012,dir:1,cooldown:35};
  gameState.enemies=[];
  $("#bossTitle").textContent="CHEFÃO — TITAN ENEMY";
  $("#gameBossOverlay").classList.remove("hidden");
  setTimeout(()=>$("#gameBossOverlay").classList.add("hidden"),1000);
  sfxBossExplosion();
}
function atualizarHUD(){
  if(!gameState)return;
  $("#gameScore").textContent=gameState.score.toLocaleString("pt-BR");
  $("#gamePhase").textContent=gameState.phase+" / "+gameState.maxPhase;
  $("#gameEnemies").textContent=gameState.bossActive?"CHEFÃO":Math.max(0,gameState.targetKills-gameState.phaseKills);
  $("#gameBombs").textContent=gameState.bombs;
  $("#gameMultiplier").textContent="x"+gameState.multiplier;
  $("#gameShipLevel").textContent=shipById(gameState.shipId).name+" · "+gameState.shipLevel+"/"+gameState.shipMaxLevel;
  const secs=Math.floor(gameState.elapsed/1000),m=String(Math.floor(secs/60)).padStart(2,"0"),ss=String(secs%60).padStart(2,"0");
  $("#gameTime").textContent=m+":"+ss;
  const lifeBars=$$(".warzone-panel.left .bars:first-of-type i"),shieldBars=$$(".warzone-panel.left .shield i");
  lifeBars.forEach((b,i)=>b.classList.toggle("off",i>=Math.ceil(gameState.life/12.5)));
  shieldBars.forEach((b,i)=>b.classList.toggle("off",i>=Math.ceil(gameState.shield/10)));
  $("#bossBarFill").style.width=gameState.boss?Math.max(0,gameState.boss.hp/gameState.boss.maxHp*100)+"%":"0%";
}
function spawnEnemy(){
  const level=gameState.phase,roll=Math.random();
  const type=roll<.55?"scout":roll<.88?"fighter":"hunter";
  const hp=type==="fighter"?2+Math.floor(level/18):type==="hunter"?3+Math.floor(level/12):1+Math.floor(level/35);
  gameState.enemies.push({x:35+Math.random()*890,y:-45,w:34,h:30,speed:1.1+Math.random()*1.4+level*.018,life:hp,maxLife:hp,type,shoot:45+Math.random()*80,phase:Math.random()*6.28});
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
  gameState.bombs--;addParticle(480,270,"#72d8ff",65);audioTone(90,.6,"sawtooth",.12,25);
  for(const e of gameState.enemies){e.life=0;gameState.score+=35*gameState.multiplier;sfxExplosion()}
  if(gameState.boss)gameState.boss.hp=Math.max(0,gameState.boss.hp-(35+gameState.phase*2));
  atualizarHUD();
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
  const data=getShipSave(),p=data.progress[gameState.shipId]||{level:1,xp:0},ship=shipById(gameState.shipId);
  if(p.level>=ship.maxLevel){p.xp=0;data.progress[gameState.shipId]=p;saveShipData(data);return}
  p.xp+=amount;
  let leveled=false;
  while(p.level<ship.maxLevel&&p.xp>=100+p.level*45){p.xp-=100+p.level*45;p.level++;leveled=true}
  data.progress[gameState.shipId]=p;saveShipData(data);gameState.shipLevel=p.level;
  if(leveled){gameState.life=Math.min(100+gameState.shipLevel*7,gameState.life+25);gameState.shield+=18;toast("Nave evoluiu para o nível "+p.level+"!");audioTone(660,.35,"triangle",.08,990)}
}
function explodeEnemy(e){
  e.life=0;gameState.score+=15*gameState.multiplier;gameState.phaseKills++;gainXP(8+Math.floor(gameState.phase/10));addParticle(e.x,e.y,e.type==="hunter"?"#b85cff":"#ff4058",20);sfxExplosion();
  if(gameState.phaseKills%5===0)gameState.multiplier=Math.min(8,gameState.multiplier+1);
}
function drawBackground(ctx,now){
  const w=960,h=540;
  ctx.clearRect(0,0,w,h);
  const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,"#010714");g.addColorStop(.55,"#03152a");g.addColorStop(1,"#010811");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  const neb=ctx.createRadialGradient(690,155,15,690,155,360);neb.addColorStop(0,"rgba(33,111,190,.25)");neb.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=neb;ctx.fillRect(0,0,w,h);
  for(const st of gameState.stars){st.y+=st.s;if(st.y>h)st.y=0;ctx.globalAlpha=st.a;ctx.fillStyle="#d8efff";ctx.fillRect(st.x,st.y,st.r,st.r)}
  ctx.globalAlpha=1;ctx.strokeStyle="rgba(40,126,200,.10)";ctx.lineWidth=1;
  for(let x=0;x<w;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
  ctx.fillStyle="rgba(14,43,77,.5)";ctx.beginPath();ctx.arc(115,475,120,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="rgba(78,161,222,.15)";ctx.beginPath();ctx.arc(115,475,125,0,Math.PI*2);ctx.stroke();
}
function drawPlayer(ctx,p,ship){
  if(p.inv>0&&Math.floor(p.inv/4)%2===0)return;
  ctx.save();ctx.translate(p.x,p.y);ctx.shadowBlur=22;ctx.shadowColor="#1cb5ff";
  ctx.fillStyle="#0b72b9";ctx.beginPath();ctx.moveTo(0,-30);ctx.lineTo(25,21);ctx.lineTo(8,15);ctx.lineTo(0,27);ctx.lineTo(-8,15);ctx.lineTo(-25,21);ctx.closePath();ctx.fill();
  ctx.fillStyle="#6be2ff";ctx.beginPath();ctx.moveTo(0,-21);ctx.lineTo(9,11);ctx.lineTo(0,17);ctx.lineTo(-9,11);ctx.closePath();ctx.fill();
  ctx.fillStyle="#e7fbff";ctx.fillRect(-3,-5,6,13);ctx.fillStyle="#18c7ff";
  ctx.beginPath();ctx.moveTo(-8,20);ctx.lineTo(-3,39+Math.random()*8);ctx.lineTo(0,20);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(8,20);ctx.lineTo(3,39+Math.random()*8);ctx.lineTo(0,20);ctx.closePath();ctx.fill();ctx.restore();
}
function drawEnemy(ctx,e){
  const color=e.type==="hunter"?"#b34dff":e.type==="fighter"?"#ff8a3d":"#ff3e59";
  ctx.save();ctx.translate(e.x,e.y);ctx.shadowBlur=18;ctx.shadowColor=color;ctx.fillStyle=color;
  ctx.beginPath();ctx.moveTo(0,28);ctx.lineTo(-26,-10);ctx.lineTo(-9,-7);ctx.lineTo(0,-24);ctx.lineTo(9,-7);ctx.lineTo(26,-10);ctx.closePath();ctx.fill();
  ctx.fillStyle="#ffd6df";ctx.fillRect(-4,-5,8,10);ctx.fillStyle=color;ctx.fillRect(-18,5,36,5);ctx.restore();
}
function drawBoss(ctx,b){
  ctx.save();ctx.translate(b.x,b.y);ctx.shadowBlur=35;ctx.shadowColor="#ff263f";ctx.fillStyle="#65152c";
  ctx.beginPath();ctx.moveTo(0,-48);ctx.lineTo(85,18);ctx.lineTo(52,40);ctx.lineTo(0,28);ctx.lineTo(-52,40);ctx.lineTo(-85,18);ctx.closePath();ctx.fill();
  ctx.fillStyle="#ff3b58";ctx.beginPath();ctx.arc(0,0,19,0,Math.PI*2);ctx.fill();ctx.fillStyle="#ffe4ea";ctx.fillRect(-6,-7,12,14);ctx.strokeStyle="#ff6d7d";ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,57,0,Math.PI*2);ctx.stroke();ctx.restore();
}
function drawLaser(ctx,b){
  ctx.save();ctx.strokeStyle="#67ddff";ctx.shadowBlur=16;ctx.shadowColor="#20b9ff";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(b.x,b.y+10);ctx.lineTo(b.x,b.y-15);ctx.stroke();ctx.restore();
}
function drawEnemyShot(ctx,b){
  ctx.save();ctx.fillStyle="#ff3e59";ctx.shadowBlur=14;ctx.shadowColor="#ff263f";ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();ctx.restore();
}
function drawParticle(ctx,q){
  ctx.globalAlpha=Math.max(0,q.life/q.max);ctx.fillStyle=q.color;ctx.shadowBlur=10;ctx.shadowColor=q.color;ctx.fillRect(q.x,q.y,q.size,q.size);ctx.globalAlpha=1;ctx.shadowBlur=0;
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
    if(gameState.phaseKills<gameState.targetKills&&gameState.spawnTimer<=0){spawnEnemy();gameState.spawnTimer=Math.max(12,38-gameState.phase*.02)}
    if(gameState.phaseKills>=gameState.targetKills&&gameState.enemies.length===0)iniciarChefe();
  }else if(gameState.boss){
    const b=gameState.boss;b.x+=b.speed*b.dir;if(b.x<110||b.x>850)b.dir*=-1;b.cooldown--;if(b.cooldown<=0){bossShoot();b.cooldown=Math.max(15,48-gameState.phase*.02)}
  }

  for(const b of gameState.bullets)b.y-=b.v;
  gameState.bullets=gameState.bullets.filter(b=>b.y>-30);
  for(const e of gameState.enemies){
    e.y+=e.speed;e.phase+=.04;e.x+=Math.sin(e.phase)*.85;e.shoot--;
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
    if(gameState.boss&&Math.abs(b.x-gameState.boss.x)<90&&Math.abs(b.y-gameState.boss.y)<65){b.y=-100;gameState.boss.hp-=b.damage;addParticle(b.x,b.y,"#8ee8ff",3)}
  }
  gameState.enemies=gameState.enemies.filter(e=>e.life>0);
  for(const b of gameState.enemyBullets){if(Math.abs(b.x-p.x)<20&&Math.abs(b.y-p.y)<28){b.x=-100;hitPlayer(8)}}
  for(const e of gameState.enemies){if(Math.abs(e.x-p.x)<30&&Math.abs(e.y-p.y)<30){e.life=0;hitPlayer(18);addParticle(e.x,e.y,"#ff334d",22);sfxExplosion()}}
  gameState.enemies=gameState.enemies.filter(e=>e.life>0);

  if(gameState.boss&&gameState.boss.hp<=0){
    const bx=gameState.boss.x,by=gameState.boss.y;gameState.score+=1000*gameState.multiplier;gainXP(45+gameState.phase*3);addParticle(bx,by,"#ff7048",90);sfxBossExplosion();
    gameState.boss=null;gameState.bossActive=false;
    if(gameState.phase>=gameState.maxPhase){fimDeJogo(true);return}
    gameState.phaseTransition=85;
  }
  if(gameState.phaseTransition>0){gameState.phaseTransition--;if(gameState.phaseTransition===1)iniciarNovaFase()}
  for(const q of gameState.particles){q.x+=q.vx;q.y+=q.vy;q.vx*=.985;q.vy*=.985;q.life--}
  gameState.particles=gameState.particles.filter(q=>q.life>0);
  renderGame(now);atualizarHUD();
  if(gameState.life<=0){fimDeJogo(false);return}
  gameAnimation=requestAnimationFrame(gameLoop);
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
$("#btnReiniciarPartida").addEventListener("click",iniciarPartida);
$("#btnPausaJogo").addEventListener("click",alternarPausa);
$("#btnContinuarPartida").addEventListener("click",alternarPausa);
$("#btnAudioJogo").addEventListener("click",toggleAudio);
$("#touchBomb").addEventListener("click",usarBomba);
$("#btnVoltarJogo").addEventListener("click",()=>{gameRunning=false;gamePaused=false;cancelarAnimacao();$("#gameScreen").classList.add("hidden");mostrarHome()});
document.addEventListener("keydown",e=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code))e.preventDefault();gameKeys[e.code]=true});
document.addEventListener("keyup",e=>{gameKeys[e.code]=false});
$("#touchFire").addEventListener("pointerdown",()=>{if(gameState)gameState.fire=true});
["pointerup","pointercancel","pointerleave"].forEach(ev=>$("#touchFire").addEventListener(ev,()=>{if(gameState)gameState.fire=false}));
$$(".dpad [data-key]").forEach(b=>{const k=b.dataset.key;["pointerdown"].forEach(ev=>b.addEventListener(ev,()=>gameKeys[k]=true));["pointerup","pointercancel","pointerleave"].forEach(ev=>b.addEventListener(ev,()=>gameKeys[k]=false))});
