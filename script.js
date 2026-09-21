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
let gameAnimation=null;
let gameKeys={};
let gameState=null;
function abrirJogo(game){
  if(!usuarioLogado()){abrir("modalLogin");toast("Entre na sua conta para jogar.");return}
  fechar("modalJogo");
  $("#secInicio").classList.add("hidden");
  $("#secExtra").classList.add("hidden");
  $("#gameScreen").classList.remove("hidden");
  $("#gameScreenTitle").textContent=game;
  $("#gameStatus").textContent="Destrua os inimigos e sobreviva.";
  $("#gameStartOverlay").classList.remove("hidden");
  $("#gameOverOverlay").classList.add("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
}
function iniciarJogo(game){abrirJogo(game)}
function iniciarPartida(){
  const canvas=$("#gameCanvas");
  gameState={player:{x:canvas.width/2,y:canvas.height-75,w:28,h:28,speed:4.2,life:100,cooldown:0},bullets:[],enemies:[],score:0,spawn:0,fire:false};
  gameRunning=true;$("#gameStartOverlay").classList.add("hidden");$("#gameOverOverlay").classList.add("hidden");atualizarHUD();cancelarAnimacao();gameLoop();
}
function cancelarAnimacao(){if(gameAnimation)cancelAnimationFrame(gameAnimation);gameAnimation=null}
function atualizarHUD(){if(!gameState)return;$("#gameLife").textContent=Math.max(0,Math.floor(gameState.player.life));$("#gameScore").textContent=gameState.score}
function atirar(){if(!gameRunning||!gameState||gameState.player.cooldown>0)return;gameState.bullets.push({x:gameState.player.x,y:gameState.player.y-18,w:5,h:15,speed:8});gameState.player.cooldown=10}
function gameLoop(){
  if(!gameRunning)return;
  const canvas=$("#gameCanvas"),ctx=canvas.getContext("2d"),p=gameState.player;
  ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#020914";ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle="rgba(30,120,190,.12)";
  for(let x=0;x<canvas.width;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke()}
  for(let y=0;y<canvas.height;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke()}
  if(gameKeys["KeyW"]||gameKeys["ArrowUp"])p.y-=p.speed;if(gameKeys["KeyS"]||gameKeys["ArrowDown"])p.y+=p.speed;if(gameKeys["KeyA"]||gameKeys["ArrowLeft"])p.x-=p.speed;if(gameKeys["KeyD"]||gameKeys["ArrowRight"])p.x+=p.speed;
  p.x=Math.max(18,Math.min(canvas.width-18,p.x));p.y=Math.max(18,Math.min(canvas.height-18,p.y));
  if(gameKeys["Space"]||gameState.fire)atirar();if(p.cooldown>0)p.cooldown--;
  gameState.spawn--;if(gameState.spawn<=0){gameState.enemies.push({x:30+Math.random()*(canvas.width-60),y:-25,w:25,h:25,speed:1.1+Math.random()*1.5,life:1});gameState.spawn=35}
  for(const b of gameState.bullets)b.y-=b.speed;gameState.bullets=gameState.bullets.filter(b=>b.y>-30);
  for(const e of gameState.enemies)e.y+=e.speed;
  for(const b of gameState.bullets){for(const e of gameState.enemies){if(e.life>0&&Math.abs(b.x-e.x)<18&&Math.abs(b.y-e.y)<20){e.life=0;b.y=-100;gameState.score+=10}}}
  for(const e of gameState.enemies){if(e.life>0&&Math.abs(p.x-e.x)<24&&Math.abs(p.y-e.y)<24){e.life=0;p.life-=20}if(e.y>canvas.height+30&&e.life>0){e.life=0;p.life-=5}}
  gameState.enemies=gameState.enemies.filter(e=>e.life>0);
  ctx.fillStyle="#1599ff";ctx.shadowBlur=18;ctx.shadowColor="#1599ff";ctx.fillRect(p.x-14,p.y-14,p.w,p.h);ctx.shadowBlur=0;
  ctx.fillStyle="#75d1ff";for(const b of gameState.bullets)ctx.fillRect(b.x-2.5,b.y-8,b.w,b.h);
  for(const e of gameState.enemies){ctx.fillStyle="#ff4757";ctx.shadowBlur=14;ctx.shadowColor="#ff3344";ctx.fillRect(e.x-12,e.y-12,e.w,e.h);ctx.shadowBlur=0}
  atualizarHUD();if(p.life<=0){gameRunning=false;$("#finalScore").textContent=gameState.score;$("#gameOverOverlay").classList.remove("hidden");return}
  gameAnimation=requestAnimationFrame(gameLoop);
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
