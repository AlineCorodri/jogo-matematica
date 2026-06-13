/* ================= VARIÁVEIS GLOBAIS ================= */

/* Números da conta */
let num1, num2;

/* Resposta correta da pergunta */
let respostaCorreta;

/* Pontuação do jogador */
let pontos = 0;
let acertos = 0;
let erros = 0;

/* Operação escolhida (+, -, *, /) */
let operacaoEscolhida = "+";

/* Nível de dificuldade */
let nivel = "facil";

/* Tempo restante */
let tempo = 10;

/* Controle do intervalo do tempo */
let intervalo;


/* ================= NÍVEL ================= */

/* Define o nível escolhido pelo usuário */
function setNivel(n) {
  nivel = n;          // atualiza o nível
  novaPergunta();     // gera nova pergunta com base no nível
}


/* ================= LOGIN ================= */

/* Função chamada ao clicar em "Entrar" */
function entrar() {

  /* Captura os dados digitados */
  let nome = document.getElementById("nome").value;
  if(nome.trim() === ""){
  alert("Por favor, digite seu nome.");
  return;
  }

  /* Cria objeto com os dados */
  let usuario = { nome };

  let acessos = JSON.parse(localStorage.getItem("acessos")) || [];

  acessos.push({
  nome: nome,
  dataHora: new Date().toLocaleString("pt-BR")
  });

  localStorage.setItem("acessos", JSON.stringify(acessos));

  /* Salva no navegador (localStorage) */
  localStorage.setItem("usuario", JSON.stringify(usuario));

  /* Esconde tela de login */
  document.getElementById("login").style.display = "none";

  /* Mostra tela do jogo */
  document.getElementById("jogo").style.display = "block";

  /* Exibe usuário na tela */
  mostrarUsuario();

  /* Inicia o jogo */
  novaPergunta();

  /* Atualiza ranking */
  atualizarRanking();
}


/* Mostra dados do usuário no topo */
function mostrarUsuario() {

  let usuario = JSON.parse(localStorage.getItem("usuario"));

  document.getElementById("usuario").innerText =
    `👤 ${usuario.nome}`;
}


/* ================= PERGUNTAS ================= */

/* Gera uma nova pergunta */
function novaPergunta() {

  /* Para o tempo anterior */
  clearInterval(intervalo);

  /* Define números e tempo conforme o nível */
  if (nivel === "facil") {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
    tempo = 10;
  }

  if (nivel === "medio") {
    num1 = Math.floor(Math.random() * 20) + 1;
    num2 = Math.floor(Math.random() * 20) + 1;
    tempo = 8;
  }

  if (nivel === "dificil") {
    num1 = Math.floor(Math.random() * 50) + 1;
    num2 = Math.floor(Math.random() * 50) + 1;
    tempo = 5;
  }

  /* Define a operação matemática */
  if (operacaoEscolhida === "+") {
    respostaCorreta = num1 + num2;
  }

  if (operacaoEscolhida === "-") {

    /* Evita resultado negativo */
    if (num1 < num2) [num1, num2] = [num2, num1];

    respostaCorreta = num1 - num2;
  }

  if (operacaoEscolhida === "*") {
    respostaCorreta = num1 * num2;
  }

  if (operacaoEscolhida === "/") {

    /* Evita números quebrados */
    respostaCorreta = num1;
    num1 = num1 * num2;
  }

  /* Mostra a pergunta na tela */
  document.getElementById("pergunta").innerText =
    `${num1} ${operacaoEscolhida} ${num2}`;

  /* Inicia o tempo */
  iniciarTempo();
}


/* ================= TEMPO ================= */

/* Controla o contador regressivo */
function iniciarTempo() {

  /* Mostra tempo inicial */
  document.getElementById("tempo").innerText = tempo;

  intervalo = setInterval(() => {

    tempo--;

    document.getElementById("tempo").innerText = tempo;

    /* Quando o tempo acaba */
    if (tempo <= 0) {
      clearInterval(intervalo);

      document.getElementById("resultado").innerText =
        "⏱️ Tempo acabou!";

      novaPergunta();
    }

  }, 1000);
}


/* ================= OPERAÇÃO ================= */

/* Define a operação escolhida */
function setOperacao(op) {
  operacaoEscolhida = op;
  novaPergunta();
}


/* ================= VERIFICAR RESPOSTA ================= */

function verificar() {

  /* Pega a resposta do usuário */
  let resposta = Number(document.getElementById("resposta").value);

  /* Verifica se acertou */
  if (resposta === respostaCorreta) {

    pontos++;
    acertos++;

   document.getElementById("acertos").innerText = acertos;

   document.getElementById("resultado").innerText =
     "🎉 Muito bem!";

  } else {

    erros++;

    document.getElementById("erros").innerText = erros;

    document.getElementById("resultado").innerText =
      "😢 Tente novamente!";

  }

  /* Atualiza pontuação */
  document.getElementById("pontos").innerText = pontos;

  /* Limpa campo */
  document.getElementById("resposta").value = "";

  /* Nova pergunta */
  novaPergunta();
}


/* ================= SALVAR RESULTADO ================= */

function salvarResultado() {

  let usuario = JSON.parse(localStorage.getItem("usuario"));

  /* Recupera ranking ou cria novo */
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

  /* Adiciona novo resultado */
  ranking.push({
    nome: usuario.nome,
    pontos: pontos
  });

  /* Ordena do maior para o menor */
  ranking.sort((a, b) => b.pontos - a.pontos);

  /* Salva no navegador */
  localStorage.setItem("ranking", JSON.stringify(ranking));

  /* Atualiza na tela */
  atualizarRanking();

  alert("Resultado salvo com sucesso! 🎉");
  
}


/* ================= ATUALIZAR RANKING ================= */

function atualizarRanking() {

  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

  let html = "";

  /* Mostra top 5 jogadores */
  ranking.slice(0, 5).forEach((r, i) => {
    html += `<p>${i + 1}º 🏆 ${r.nome} - ${r.pontos} pontos</p>`;
  });

  document.getElementById("ranking").innerHTML = html;
}


/* ================= SAIR / TROCAR USUÁRIO ================= */

function sair() {

  /* Remove usuário atual */
  localStorage.removeItem("usuario");

  /* Volta para login */
  document.getElementById("jogo").style.display = "none";
  document.getElementById("login").style.display = "block";

  /* Limpa campos */
  document.getElementById("nome").value = "";

  /* Reseta pontuação */
  pontos = 0;
  document.getElementById("pontos").innerText = 0;

  document.getElementById("resultado").innerText = "";
}

function verAcessos() {

  let acessos =
    JSON.parse(localStorage.getItem("acessos")) || [];

  let html = "";

  acessos.forEach((a, i) => {

    html += `
      <p>
        ${i + 1}. ${a.nome}
        <br>
        🕒 ${a.dataHora}
      </p>
    `;

  });

  document.getElementById("acessos").innerHTML = html;
}