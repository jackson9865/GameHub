const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

function abrir(id){document.getElementById(id)?.classList.add("open")}
function fechar(id){document.getElementById(id)?.classList.remove("open")}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2500)}

document.addEventListener("click",e=>{
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
  else if(n==="biblioteca")mostrarExtra("Biblioteca","🎮","Crie uma conta para guardar seus jogos e acompanhar seu progresso.");
  else if(n==="loja")mostrarExtra("Loja","🛒","Novos jogos e conteúdos estarão disponíveis aqui.");
  else if(n==="comunidade")mostrarExtra("Comunidade","👥","Conecte-se com outros jogadores e acompanhe novidades.");
  else if(n==="conquistas")mostrarExtra("Conquistas","🏆","Entre na sua conta para acompanhar suas conquistas.");
  else if(n==="perfil")mostrarExtra("Meu Perfil","●","Entre ou crie sua conta para configurar seu perfil.");
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

$("#btnCadastrar").addEventListener("click",()=>{
  const nome=$("#nome").value.trim(),cpf=$("#cpf").value.trim(),nascimento=$("#nascimento").value,email=$("#email").value.trim(),telefone=$("#telefone").value.trim(),senha=$("#senha").value,confirmar=$("#confirmarSenha").value;
  $("#cadastroErro").textContent="";
  if(!nome||!cpf||!nascimento||!email||!telefone||!senha||!confirmar){$("#cadastroErro").textContent="Preencha os campos obrigatórios.";return}
  if(senha!==confirmar){$("#cadastroErro").textContent="As senhas não são iguais.";return}
  const usuario={nome,cpf,nascimento,email,telefone,cep:$("#cep").value,endereco:$("#endereco").value,numero:$("#numero").value,complemento:$("#complemento").value,quadra:$("#quadra").value,lote:$("#lote").value,cidade:$("#cidade").value,estado:$("#estado").value,senha};
  localStorage.setItem("gamehubUsuario",JSON.stringify(usuario));
  fechar("modalCadastro");abrir("modalSucesso");
});

$("#irLogin").addEventListener("click",()=>{fechar("modalSucesso");abrir("modalLogin");$("#loginEmail").focus()});

$("#btnLogin").addEventListener("click",()=>{
  const usuario=JSON.parse(localStorage.getItem("gamehubUsuario")||"null");
  const email=$("#loginEmail").value.trim(),senha=$("#loginSenha").value;
  if(!usuario){$("#loginErro").textContent="Nenhuma conta foi cadastrada neste navegador.";return}
  if(email!==usuario.email||senha!==usuario.senha){$("#loginErro").textContent="E-mail ou senha incorretos.";return}
  fechar("modalLogin");
  mostrarExtra("Bem-vindo ao GameHub!","🎮",`Olá, ${usuario.nome}. Sua conta foi acessada com sucesso.`);
  toast("Login realizado com sucesso.");
});

if(localStorage.getItem("gamehubUsuario"))$(".side-card p").innerHTML="Sua conta está pronta.<br>Entre e jogue.";