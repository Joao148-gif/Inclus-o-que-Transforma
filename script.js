const contraste = document.getElementById("contraste");

contraste.addEventListener("click", () => {
  const ativo = document.body.classList.toggle("high-contrast");
  contraste.setAttribute("aria-pressed", String(ativo));
});

let tamanhoTexto = 16;

function atualizarTexto() {
  document.documentElement.style.fontSize = `${tamanhoTexto}px`;
}

document.getElementById("aumentar").addEventListener("click", () => {
  tamanhoTexto = Math.min(24, tamanhoTexto + 2);
  atualizarTexto();
});

document.getElementById("diminuir").addEventListener("click", () => {
  tamanhoTexto = Math.max(12, tamanhoTexto - 2);
  atualizarTexto();
});

document.getElementById("normalizar").addEventListener("click", () => {
  tamanhoTexto = 16;
  atualizarTexto();
});

const estadoVoz = document.getElementById("estado-voz");

document.getElementById("ler").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) {
    estadoVoz.textContent = "A leitura por voz não é suportada neste navegador.";
    return;
  }

  window.speechSynthesis.cancel();

  const texto = [
    document.querySelector("#inicio h1").innerText,
    document.querySelector("#inicio p").innerText,
    document.querySelector("#sobre p").innerText
  ].join(". ");

  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = "pt-BR";
  fala.onstart = () => estadoVoz.textContent = "Leitura em andamento.";
  fala.onend = () => estadoVoz.textContent = "Leitura concluída.";
  fala.onerror = () => estadoVoz.textContent = "Não foi possível concluir a leitura.";

  window.speechSynthesis.speak(fala);
});

document.getElementById("parar").addEventListener("click", () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  estadoVoz.textContent = "Leitura interrompida.";
});

const informacoes = {
  visual: "O protótipo oferece alto contraste e ajuste de tamanho do texto. Um produto completo também deve testar legibilidade, foco e compatibilidade com leitores de ecrã.",
  auditiva: "Legendas e transcrição ajudam na comunicação. O reconhecimento de voz em tempo real exige uma API ou serviço adicional.",
  voz: "A leitura por voz utiliza a síntese de fala disponível no navegador. O suporte e as vozes variam conforme o dispositivo.",
  daltonismo: "Não dependas apenas de cores para comunicar estados. Utiliza também rótulos, ícones, padrões e formas."
};

const painel = document.getElementById("info-recurso");

document.querySelectorAll("[data-info]").forEach((botao) => {
  botao.addEventListener("click", () => {
    painel.textContent = informacoes[botao.dataset.info];
    painel.hidden = false;
  });
});

const colunas = ["backlog", "progresso", "teste", "concluido"];
const formulario = document.getElementById("form-tarefa");
const entrada = document.getElementById("nova-tarefa");
const responsavel = document.getElementById("responsavel");
const estadoTarefas = document.getElementById("estado-tarefas");

const nomesColunas = {
  backlog: "Backlog",
  progresso: "Em progresso",
  teste: "Em teste",
  concluido: "Concluído"
};

const tarefas = [];
let proximoId = 1;

function renderizarTarefas() {
  colunas.forEach((coluna) => {
    document.getElementById(coluna).replaceChildren();
  });

  tarefas.forEach((tarefa) => {
    const cartao = document.createElement("article");
    cartao.className = "task";

    const titulo = document.createElement("p");
    titulo.textContent = tarefa.titulo;

    const pessoa = document.createElement("small");
    pessoa.textContent = `Responsável: ${tarefa.responsavel}`;

    const seletor = document.createElement("select");
    seletor.setAttribute("aria-label", `Estado da tarefa: ${tarefa.titulo}`);

    colunas.forEach((coluna) => {
      const opcao = document.createElement("option");
      opcao.value = coluna;
      opcao.textContent = nomesColunas[coluna];
      opcao.selected = tarefa.estado === coluna;
      seletor.appendChild(opcao);
    });

    seletor.addEventListener("change", () => {
      tarefa.estado = seletor.value;
      renderizarTarefas();
      estadoTarefas.textContent =
        `Tarefa movida para ${nomesColunas[tarefa.estado]}.`;
    });

    const apagar = document.createElement("button");
    apagar.className = "task-delete";
    apagar.textContent = "Eliminar tarefa";
    apagar.addEventListener("click", () => {
      const indice = tarefas.findIndex((item) => item.id === tarefa.id);
      if (indice !== -1) tarefas.splice(indice, 1);
      renderizarTarefas();
      estadoTarefas.textContent = "Tarefa eliminada.";
    });

    cartao.append(titulo, pessoa, seletor, apagar);
    document.getElementById(tarefa.estado).appendChild(cartao);
  });

  colunas.forEach((coluna) => {
    const quantidade = tarefas.filter(
      (tarefa) => tarefa.estado === coluna
    ).length;

    document.getElementById(`count-${coluna}`).textContent = quantidade;
  });
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const titulo = entrada.value.trim();
  if (!titulo) {
    entrada.focus();
    return;
  }

   tarefas.push({
    id: proximoId++,
    titulo,
    responsavel: responsavel.value,
    estado: "backlog"
  });

  renderizarTarefas();
  formulario.reset();
  entrada.focus();
  estadoTarefas.textContent = "Nova tarefa adicionada ao Backlog.";
});

renderizarTarefas();