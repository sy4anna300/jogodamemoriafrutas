const todasFrutas = ["🍎","🍌","🍇","🍉","🍓","🍒","🍍","🥝","🥭","🍑","🍋","🍐","🍊","🥥","🍈","🍏","🥕","🌽","🍅","🍆","🥔","🥦","🥬","🫑","🧄","🧅","🍄","🌶️","🥜","🌰","🍯","🥖","🥨","🧀","🍗","🥩","🍖","🍤","🍣","🥟","🍕","🍔","🌭","🥪","🌮","🌯","🥙","🥗","🍝","🍜","🍲","🍛"];
let cartas = [];
let primeiraCarta = null;
let bloqueio = false;
let score = 0;
let pontosNivel = 0;
let tempo = 60;
let timer;
let nivel = 1;
const NIVEL_MAX = 100;

function iniciarJogo() {
  document.getElementById("telaInicio").style.display = "none";
  document.getElementById("jogo").style.display = "flex";

  score = 0;
  nivel = 1;
  iniciarNivel();
}

function iniciarNivel() {
  if (nivel > NIVEL_MAX) {
    fimJogo(true, true);
    return;
  }

  // reset variáveis
  pontosNivel = 0;
  primeiraCarta = null;
  bloqueio = false;

  // tempo diminui até no mínimo 10s
  tempo = 60 - (nivel - 1) * 0.5;
  if (tempo < 10) tempo = 10;

  document.getElementById("score").textContent = score;
  document.getElementById("tempo").textContent = Math.floor(tempo);
  document.getElementById("nivel").textContent = nivel;

  // quantidade de frutas aumenta conforme o nível
  let frutasAtuais = todasFrutas.slice(0, Math.min(4 + nivel, todasFrutas.length));
  cartas = [...frutasAtuais, ...frutasAtuais].sort(() => Math.random() - 0.5);

  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  cartas.forEach((fruta) => {
    const carta = document.createElement("div");
    carta.classList.add("carta");
    carta.dataset.valor = fruta;
    carta.innerHTML = `
      <div class="carta-inner">
        <div class="carta-front">${fruta}</div>
        <div class="carta-back">❓</div>
      </div>
    `;
    carta.addEventListener("click", () => virarCarta(carta));
    grid.appendChild(carta);
  });

  // limpar timer anterior
  clearInterval(timer);
  timer = setInterval(() => {
    tempo--;
    document.getElementById("tempo").textContent = tempo;
    if (tempo <= 0) fimJogo(false);
  }, 1000);
}

function virarCarta(carta) {
  if (bloqueio || carta.classList.contains("virada")) return;

  carta.classList.add("virada");

  if (!primeiraCarta) {
    primeiraCarta = carta;
  } else {
    if (primeiraCarta.dataset.valor === carta.dataset.valor) {
      score += 10;
      pontosNivel++;
      document.getElementById("score").textContent = score;
      primeiraCarta = null;

      if (pontosNivel === cartas.length / 2) {
        clearInterval(timer);
        nivel++;
        setTimeout(() => {
          if (nivel <= NIVEL_MAX) {
            alert(`🎉 Você passou para o nível ${nivel}!`);
            iniciarNivel();
          } else {
            fimJogo(true, true);
          }
        }, 800);
      }
    } else {
      bloqueio = true;
      setTimeout(() => {
        carta.classList.remove("virada");
        primeiraCarta.classList.remove("virada");
        primeiraCarta = null;
        bloqueio = false;
      }, 1000);
    }
  }
}

function fimJogo(venceu, campeao = false) {
  clearInterval(timer);
  document.getElementById("jogo").style.display = "none";
  document.getElementById("telaFim").style.display = "block";

  if (campeao) {
    document.getElementById("mensagemFinal").textContent =
      `🏆 Parabéns! Você completou os 100 níveis!!! Score final: ${score}`;
  } else {
    document.getElementById("mensagemFinal").textContent = venceu
      ? `🎉 Você venceu! Score final: ${score}, chegou ao nível ${nivel}`
      : `⏳ Tempo esgotado! Score final: ${score}, chegou ao nível ${nivel}`;
  }
}

function reiniciar() {
  document.getElementById("telaFim").style.display = "none";
  iniciarJogo();
}
