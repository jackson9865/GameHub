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
let gameRunning=false;
let gamePaused=false;
let gameAnimation=null;
let gameKeys={};
let gameState=null;
let lastFrame=0;

function abrirJogo(game){
  if(!usuarioLogado()){abrir("modalLogin");toast("Entre na sua conta para jogar.");return}
  fechar("modalJogo");
  $("#secInicio").classList.add("hidden");
  $("#secExtra").classList.add("hidden");
  $("#gameScreen").classList.remove("hidden");
  $("#gameStartOverlay").classList.remove("hidden");
  $("#gamePauseOverlay").classList.add("hidden");
  $("#gameOverOverlay").classList.add("hidden");
  $("#gameBossOverlay").classList.add("hidden");
  $("#bossTitle").textContent="FASE 1 — PREPARE-SE";
  $("#gameScreenTitle")?.textContent=game;
  window.scrollTo({top:0,behavior:"smooth"});
}
function iniciarJogo(game){abrirJogo(game)}

function iniciarPartida(){
  const canvas=$("#gameCanvas");
  const stars=[];
  for(let i=0;i<95;i++)stars.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:.5+Math.random()*1.8,s:.15+Math.random()*1.1,a:.25+Math.random()*.65});
  gameState={
    phase:1,maxPhase:1000,phaseKills:0,targetKills:6,score:0,life:100,shield:60,bombs:3,multiplier:1,
    player:{x:canvas.width/2,y:canvas.height-78,speed:5,cooldown:0,inv:0},
    bullets:[],enemyBullets:[],enemies:[],particles:[],stars,
    spawnTimer:0,boss:null,bossActive:false,phaseTransition:0,startTime:performance.now(),elapsed:0
  };
  gameRunning=true;gamePaused=false;lastFrame=performance.now();
  $("#gameStartOverlay").classList.add("hidden");$("#gamePauseOverlay").classList.add("hidden");$("#gameOverOverlay").classList.add("hidden");
  $("#gameBossOverlay").classList.add("hidden");atualizarHUD();cancelarAnimacao();gameLoop(lastFrame);
}
function cancelarAnimacao(){if(gameAnimation)cancelAnimationFrame(gameAnimation);gameAnimation=null}
function iniciarNovaFase(){
  if(gameState.phase>=gameState.maxPhase){fimDeJogo(true);return}
  gameState.phase++;
  gameState.phaseKills=0;
  gameState.targetKills=Math.min(6+Math.floor(gameState.phase*1.8),28);
  gameState.boss=null;gameState.bossActive=false;gameState.spawnTimer=20;
  $("#gameBossOverlay").classList.add("hidden");
  $("#bossTitle").textContent="FASE "+gameState.phase+" / "+gameState.maxPhase;
}
function iniciarChefe(){
  gameState.bossActive=true;
  const hp=80+gameState.phase*18;
  gameState.boss={x:480,y:90,hp,maxHp:hp,w:130,h:75,speed:1.4+gameState.phase*.015,dir:1,cooldown:50};
  gameState.enemies=[];
  $("#bossTitle").textContent="CHEFÃO — NAVE TITAN";
  $("#gameBossOverlay").classList.remove("hidden");
  setTimeout(()=>$("#gameBossOverlay").classList.add("hidden"),1100);
}
function atualizarHUD(){
  if(!gameState)return;
  $("#gameScore").textContent=gameState.score.toLocaleString("pt-BR");
  $("#gamePhase").textContent=gameState.phase+" / "+gameState.maxPhase;
  $("#gameEnemies").textContent=gameState.bossActive?"CHEFÃO":Math.max(0,gameState.targetKills-gameState.phaseKills);
  $("#gameBombs").textContent=gameState.bombs;
  $("#gameMultiplier").textContent="x"+gameState.multiplier;
  const secs=Math.floor(gameState.elapsed/1000),m=String(Math.floor(secs/60)).padStart(2,"0"),s=String(secs%60).padStart(2,"0");
  $("#gameTime").textContent=m+":"+s;
  const bars=$$(".warzone-panel.left:first-child .bars:first-of-type i");
  bars.forEach((b,i)=>b.classList.toggle("off",i>=Math.ceil(gameState.life/12.5)));
  const shields=$$(".warzone-panel.left:first-child .shield i");
  shields.forEach((b,i)=>b.classList.toggle("off",i>=Math.ceil(gameState.shield/10)));
  if(gameState.boss){$("#bossBarFill").style.width=Math.max(0,gameState.boss.hp/gameState.boss.maxHp*100)+"%"}else $("#bossBarFill").style.width="0%";
}
function spawnEnemy(){
  const level=gameState.phase;
  const types=["scout","fighter","interceptor"];
  const type=types[Math.floor(Math.random()*types.length)];
  gameState.enemies.push({
    x:45+Math.random()*870,y:-55,w:type==="fighter"?38:30,h:type==="fighter"?28:25,
    speed:1.0+Math.random()*1.2+level*.025,life:type==="fighter"?2:1,type,
    shoot:45+Math.random()*100,phase:Math.random()*Math.PI*2
  });
}
function addParticle(x,y,color,count=8){
  for(let i=0;i<count;i++){
    if(gameState.particles.length>180)break;
    const a=Math.random()*Math.PI*2,sp=.5+Math.random()*3;
    gameState.particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:25+Math.random()*25,color});
  }
}
function atirar(){
  if(!gameRunning||gamePaused||!gameState||gameState.player.cooldown>0)return;
  const p=gameState.player;
  gameState.bullets.push({x:p.x-9,y:p.y-27,v:10,damage:1},{x:p.x+9,y:p.y-27,v:10,damage:1});
  p.cooldown=Math.max(5,9-Math.floor(gameState.phase/80));
}
function usarBomba(){
  if(!gameRunning||gamePaused||!gameState||gameState.bombs<=0)return;
  gameState.bombs--;
  addParticle(480,270,"#56c7ff",45);
  for(const e of gameState.enemies){e.life=0;gameState.score+=30*gameState.multiplier}
  if(gameState.boss)gameState.boss.hp=Math.max(0,gameState.boss.hp-25-gameState.phase*2);
  atualizarHUD();
}
function enemyShoot(e){
  const p=gameState.player;
  const dx=p.x-e.x,dy=p.y-e.y,len=Math.hypot(dx,dy)||1;
  const speed=2.5+gameState.phase*.012;
  gameState.enemyBullets.push({x:e.x,y:e.y+15,vx:dx/len*speed,vy:dy/len*speed,r:4});
}
function bossShoot(){
  const b=gameState.boss,p=gameState.player;
  const base=Math.atan2(p.y-b.y,p.x-b.x);
  for(let k=-1;k<=1;k++){const a=base+k*.18;gameState.enemyBullets.push({x:b.x,y:b.y+30,vx:Math.cos(a)*3.3,vy:Math.sin(a)*3.3,r:5})}
}
function hitPlayer(dmg){
  const p=gameState.player;
  if(p.inv>0)return;
  p.inv=40;
  if(gameState.shield>0){gameState.shield=Math.max(0,gameState.shield-dmg);if(gameState.shield===0)gameState.life-=Math.ceil(dmg*.35)}
  else gameState.life-=dmg;
  addParticle(p.x,p.y,"#66bfff",12);
}
function explodeEnemy(e){
  e.life=0;gameState.score+=10*gameState.multiplier;gameState.phaseKills++;
  if(gameState.phaseKills%5===0)gameState.multiplier=Math.min(8,gameState.multiplier+1);
  addParticle(e.x,e.y,"#ff4258",15);
}
function drawBackground(ctx){
  const c=$("#gameCanvas"),w=c.width,h=c.height;
  const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,"#010713");g.addColorStop(.5,"#031226");g.addColorStop(1,"#020811");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  const neb=ctx.createRadialGradient(700,180,20,700,180,390);neb.addColorStop(0,"rgba(35,70,160,.24)");neb.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=neb;ctx.fillRect(0,0,w,h);
  const planet=ctx.createRadialGradient(105,445,10,105,445,155);planet.addColorStop(0,"#547ba9");planet.addColorStop(.45,"#18345c");planet.addColorStop(1,"#030b18");ctx.fillStyle=planet;ctx.beginPath();ctx.arc(105,445,155,0,Math.PI*2);ctx.fill();
  for(const st of gameState.stars){st.y+=st.s;if(st.y>h)st.y=0;ctx.globalAlpha=st.a;ctx.fillStyle="#cbe8ff";ctx.beginPath();ctx.arc(st.x,st.y,st.r,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
  ctx.strokeStyle="rgba(34,115,190,.10)";ctx.lineWidth=1;
  for(let x=0;x<w;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
}
function drawShip(ctx,x,y,scale=1,enemy=false,boss=false){
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  ctx.shadowBlur=boss?28:16;ctx.shadowColor=enemy?"#ff334d":"#18a8ff";
  ctx.fillStyle=enemy?"#a92239":"#0d72ba";
  ctx.beginPath();ctx.moveTo(0,-28);ctx.lineTo(20,18);ctx.lineTo(8,13);ctx.lineTo(0,25);ctx.lineTo(-8,13);ctx.lineTo(-20,18);ctx.closePath();ctx.fill();
  ctx.fillStyle=enemy?"#ff4058":"#63d7ff";ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(7,9);ctx.lineTo(0,15);ctx.lineTo(-7,9);ctx.closePath();ctx.fill();
  ctx.fillStyle=enemy?"#ff9a9a":"#b8efff";ctx.fillRect(-3,-5,6,12);
  ctx.fillStyle=enemy?"#ff334d":"#17baff";ctx.beginPath();ctx.moveTo(-7,20);ctx.lineTo(-2,35+Math.random()*8);ctx.lineTo(0,20);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(7,20);ctx.lineTo(2,35+Math.random()*8);ctx.lineTo(0,20);ctx.closePath();ctx.fill();
  if(boss){ctx.strokeStyle="#ff4058";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,32,0,Math.PI*2);ctx.stroke()}
  ctx.restore();
}
function drawPlayer(ctx,p){if(p.inv>0&&Math.floor(p.inv/4)%2===0)return;drawShip(ctx,p.x,p.y,1,false,false)}
function drawBoss(ctx,b){drawShip(ctx,b.x,b.y,2.3,true,true);ctx.fillStyle="#ff344d";ctx.shadowBlur=20;ctx.shadowColor="#ff334d";ctx.beginPath();ctx.arc(b.x,b.y,10,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
function gameLoop(now){
  if(!gameRunning)return;
  if(gamePaused){gameAnimation=requestAnimationFrame(gameLoop);return}
  const dt=Math.min(32,now-lastFrame);lastFrame=now;gameState.elapsed=now-gameState.startTime;
  const canvas=$("#gameCanvas"),ctx=canvas.getContext("2d"),p=gameState.player;
  drawBackground(ctx);
  const speed=p.speed*(dt/16.67);
  if(gameKeys["KeyW"]||gameKeys["ArrowUp"])p.y-=speed;if(gameKeys["KeyS"]||gameKeys["ArrowDown"])p.y+=speed;if(gameKeys["KeyA"]||gameKeys["ArrowLeft"])p.x-=speed;if(gameKeys["KeyD"]||gameKeys["ArrowRight"])p.x+=speed;
  p.x=Math.max(35,Math.min(canvas.width-35,p.x));p.y=Math.max(55,Math.min(canvas.height-45,p.y));
  if(gameKeys["Space"]||gameState.fire)atirar();if(p.cooldown>0)p.cooldown--;if(p.inv>0)p.inv--;

  if(!gameState.bossActive){
    gameState.spawnTimer--;
    if(gameState.phaseKills<gameState.targetKills&&gameState.spawnTimer<=0){spawnEnemy();gameState.spawnTimer=Math.max(14,42-gameState.phase*.03)}
    if(gameState.phaseKills>=gameState.targetKills&&gameState.enemies.length===0)iniciarChefe();
  }else if(gameState.boss){
    const b=gameState.boss;b.x+=b.speed*b.dir;if(b.x<110||b.x>850)b.dir*=-1;b.cooldown--;
    if(b.cooldown<=0){bossShoot();b.cooldown=Math.max(18,52-gameState.phase*.035)}
  }

  for(const b of gameState.bullets)b.y-=b.v;
  gameState.bullets=gameState.bullets.filter(b=>b.y>-30);

  for(const e of gameState.enemies){
    e.y+=e.speed;e.phase+=.035;e.x+=Math.sin(e.phase)*.8;e.shoot--;
    if(e.shoot<=0){enemyShoot(e);e.shoot=Math.max(40,110-gameState.phase*.04)}
    if(e.y>canvas.height+50){e.life=0;hitPlayer(4)}
  }

  for(const b of gameState.enemyBullets){b.x+=b.vx;b.y+=b.vy}
  gameState.enemyBullets=gameState.enemyBullets.filter(b=>b.x>-30&&b.x<990&&b.y>-30&&b.y<570);

  for(const b of gameState.bullets){
    for(const e of gameState.enemies){
      if(e.life>0&&Math.abs(b.x-e.x)<25&&Math.abs(b.y-e.y)<28){b.y=-100;e.life--;if(e.life<=0)explodeEnemy(e)}
    }
    if(gameState.boss&&Math.abs(b.x-gameState.boss.x)<85&&Math.abs(b.y-gameState.boss.y)<65){b.y=-100;gameState.boss.hp-=b.damage;addParticle(b.x,b.y,"#7ed8ff",3)}
  }
  gameState.enemies=gameState.enemies.filter(e=>e.life>0);

  for(const b of gameState.enemyBullets){if(Math.abs(b.x-p.x)<18&&Math.abs(b.y-p.y)<25){b.x=-100;hitPlayer(7)}}
  for(const e of gameState.enemies){if(Math.abs(e.x-p.x)<28&&Math.abs(e.y-p.y)<30){e.life=0;hitPlayer(15);addParticle(e.x,e.y,"#ff334d",18)}}

  if(gameState.boss&&gameState.boss.hp<=0){
    gameState.score+=1000*gameState.multiplier;gameState.multiplier=Math.min(8,gameState.multiplier+1);
    addParticle(gameState.boss.x,gameState.boss.y,"#ff7a45",55);gameState.boss=null;gameState.bossActive=false;
    if(gameState.phase>=gameState.maxPhase){fimDeJogo(true);return}
    gameState.phaseTransition=100;
  }
  if(gameState.phaseTransition>0){
    gameState.phaseTransition--;
    if(gameState.phaseTransition===1)iniciarNovaFase();
  }

  for(const q of gameState.particles){q.x+=q.vx;q.y+=q.vy;q.vx*=.98;q.vy*=.98;q.life--}
  gameState.particles=gameState.particles.filter(q=>q.life>0);

  for(const q of gameState.particles){ctx.globalAlpha=Math.max(0,q.life/45);ctx.fillStyle=q.color;ctx.fillRect(q.x,q.y,3,3)}ctx.globalAlpha=1;
  for(const b of gameState.bullets){ctx.fillStyle="#72d8ff";ctx.shadowBlur=14;ctx.shadowColor="#27b8ff";ctx.fillRect(b.x-2,b.y-10,4,18)}ctx.shadowBlur=0;
  for(const b of gameState.enemyBullets){ctx.fillStyle="#ff4058";ctx.shadowBlur=12;ctx.shadowColor="#ff304d";ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill()}ctx.shadowBlur=0;
  for(const e of gameState.enemies)drawShip(ctx,e.x,e.y,e.type==="fighter"?1.0:.82,true,false);
  if(gameState.boss)drawBoss(ctx,gameState.boss);
  drawPlayer(ctx,p);

  if(gameState.phaseTransition>0){
    ctx.fillStyle="rgba(0,10,25,.72)";ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#67cfff";ctx.font="900 34px Arial";ctx.textAlign="center";ctx.fillText("FASE "+gameState.phase+" CONCLUÍDA",canvas.width/2,canvas.height/2);
    ctx.font="16px Arial";ctx.fillStyle="#d9efff";ctx.fillText("Preparando a próxima batalha...",canvas.width/2,canvas.height/2+32);
  }

  atualizarHUD();
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
  gamePaused=!gamePaused;
  $("#gamePauseOverlay").classList.toggle("hidden",!gamePaused);
  if(!gamePaused){lastFrame=performance.now();gameAnimation=requestAnimationFrame(gameLoop)}
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
$("#btnVoltarJogo").addEventListener("click",()=>{gameRunning=false;cancelarAnimacao();$("#gameScreen").classList.add("hidden");mostrarHome()});
document.addEventListener("keydown",e=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code))e.preventDefault();gameKeys[e.code]=true});
document.addEventListener("keyup",e=>{gameKeys[e.code]=false});
$("#touchFire").addEventListener("pointerdown",()=>{if(gameState)gameState.fire=true});
["pointerup","pointercancel","pointerleave"].forEach(ev=>$("#touchFire").addEventListener(ev,()=>{if(gameState)gameState.fire=false}));
$$(".dpad [data-key]").forEach(b=>{const k=b.dataset.key;["pointerdown"].forEach(ev=>b.addEventListener(ev,()=>gameKeys[k]=true));["pointerup","pointercancel","pointerleave"].forEach(ev=>b.addEventListener(ev,()=>gameKeys[k]=false))});
