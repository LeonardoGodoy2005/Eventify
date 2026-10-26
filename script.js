
const $ = (seletor) => document.querySelector(seletor);
const $$ = (seletor) => [...document.querySelectorAll(seletor)];

const formulario = $("#eventForm");
const convite = $("#invitation");
const mensagem = $("#formMessage");
const toast = $("#toast");

let corPrincipal = "#42e6a4";
let temaAtual = "moderno";
let modoConvite = "light";
let imagemCapa = "";

function mostrarToast(texto) {
  toast.textContent = texto;
  toast.classList.add("show");

  clearTimeout(mostrarToast.timer);

  mostrarToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function valor(id) {
  return $(`#${id}`).value.trim();
}

function escaparHTML(texto) {
  return String(texto).replace(/[&<>"']/g, caractere => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[caractere]);
}

function formatarData(data) {
  if (!data) return "Data a definir";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(`${data}T12:00:00`));
}

function formatarDataCurta(data) {
  if (!data) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${data}T12:00:00`));
}

function atualizarConvite() {
  const titulo = valor("title") || "Seu evento começa aqui";
  const tituloMaiusculo = titulo.toLocaleUpperCase("pt-BR");
  const palavras = tituloMaiusculo.split(/\s+/);

  let primeiraLinha = "";
  let segundaLinha = "";

  // Divide títulos longos em duas linhas.
  if (palavras.length > 2) {
    const metade = Math.ceil(palavras.length / 2);
    primeiraLinha = palavras.slice(0, metade).join(" ");
    segundaLinha = palavras.slice(metade).join(" ");
  } else {
    primeiraLinha = tituloMaiusculo;
  }

  $("#previewTitle").innerHTML = escaparHTML(primeiraLinha) +
    (segundaLinha
      ? `<br><span>${escaparHTML(segundaLinha)}</span>`
      : "");

  $("#previewSubtitle").textContent =
    "Uma experiência especial espera por você!";

  const inicio = valor("startDate");
  const fim = valor("endDate");

  $("#previewDate").textContent = inicio
    ? formatarData(inicio)
    : "Data do evento";

  $("#previewTime").textContent =
    fim && inicio && fim !== inicio
      ? `Até ${formatarDataCurta(fim)}`
      : "Confira os detalhes";

  const tipo = $('input[name="eventType"]:checked').value;
  const local = valor("location");

  $("#previewLocation").textContent = tipo === "online"
    ? "Evento online"
    : local || "Local do evento";

  $("#previewCity").textContent = tipo === "online"
    ? "Link enviado aos inscritos"
    : "Esperamos por você!";

  $("#previewDescription").textContent =
    valor("description") || "A descrição aparecerá aqui.";

  $("#previewEmail").textContent =
    valor("email") || "contato@evento.com";

  $("#previewPhone").textContent =
    valor("phone") || "(61) 99999-9999";

  convite.style.setProperty("--accent", corPrincipal);

  convite.classList.remove(
    "theme-moderno",
    "theme-minimalista",
    "theme-elegante"
  );

  convite.classList.add(`theme-${temaAtual}`);
  convite.classList.toggle("mode-dark", modoConvite === "dark");

  atualizarCodigo();
}

function atualizarCodigo() {
  const titulo = escaparHTML(valor("title") || "Seu evento");
  const data = escaparHTML(formatarData(valor("startDate")));
  const descricao = escaparHTML(valor("description") || "Descrição do evento");

  const tipo = $('input[name="eventType"]:checked').value;

  const local = escaparHTML(
    tipo === "online" ? "Evento online" : valor("location") || "Local do evento"
  );

  const codigo = `<article class="convite" style="--cor-principal: ${corPrincipal}">
  <header>
    <p>CONVITE ESPECIAL</p>
    <h1>${titulo}</h1>
  </header>

  <section>
    <p><strong>Data:</strong> ${data}</p>
    <p><strong>Local:</strong> ${local}</p>
    <p>${descricao}</p>
  </section>
</article>`;

  $("#htmlCode").textContent = codigo;
}

// Atualiza a pré-visualização enquanto o usuário digita.
["title", "startDate", "endDate", "location",
 "description", "email", "phone"].forEach(id => {
  $(`#${id}`).addEventListener("input", () => {
    atualizarConvite();

    const campo = $(`#${id}`).closest(".field");

    if (campo.classList.contains("invalid")) {
      campo.classList.remove("invalid");
      campo.querySelector(".error").textContent = "";
    }
  });
});

// Seleção do tipo de evento.
$$('input[name="eventType"]').forEach(radio => {
  radio.addEventListener("change", () => {
    $$(".choice").forEach(opcao => {
      opcao.classList.toggle(
        "selected",
        opcao.querySelector("input").checked
      );
    });

    const online = radio.value === "online" && radio.checked;
    const campoLocal = $("#location");

    campoLocal.placeholder = online
      ? "Plataforma ou link do evento"
      : "Endereço do evento";

    atualizarConvite();
  });
});

// Escolha da cor principal.
$$(".color").forEach(botao => {
  botao.addEventListener("click", () => {
    corPrincipal = botao.dataset.color;

    const valores = corPrincipal.match(/[a-f\d]{2}/gi)
      .map(valor => parseInt(valor, 16));

    document.documentElement.style.setProperty("--accent", corPrincipal);
    document.documentElement.style.setProperty(
      "--accent-rgb",
      valores.join(", ")
    );

    $$(".color").forEach(cor => {
      cor.classList.toggle("active", cor === botao);
    });

    atualizarConvite();
  });
});

// Escolha do tema.
$$(".theme-option").forEach(botao => {
  botao.addEventListener("click", () => {
    temaAtual = botao.dataset.theme;

    $$(".theme-option").forEach(opcao => {
      opcao.classList.toggle("active", opcao === botao);
    });

    atualizarConvite();
  });
});

// Modo claro ou escuro do convite.
$$(".style-option").forEach(botao => {
  botao.addEventListener("click", () => {
    modoConvite = botao.dataset.mode;

    $$(".style-option").forEach(opcao => {
      opcao.classList.toggle("active", opcao === botao);
    });

    atualizarConvite();
  });
});

// Upload da imagem de capa.
$("#cover").addEventListener("change", evento => {
  const arquivo = evento.target.files[0];
  const erro = $("#coverError");

  erro.textContent = "";

  if (!arquivo) return;

  const tiposPermitidos = [
    "image/png",
    "image/jpeg",
    "image/webp"
  ];

  if (!tiposPermitidos.includes(arquivo.type)) {
    erro.textContent = "Escolha uma imagem PNG, JPG ou WEBP.";
    evento.target.value = "";
    return;
  }

  if (arquivo.size > 5 * 1024 * 1024) {
    erro.textContent = "A imagem deve ter no máximo 5 MB.";
    evento.target.value = "";
    return;
  }

  const leitor = new FileReader();

  leitor.onload = resultado => {
    imagemCapa = resultado.target.result;

    $("#inviteCover").style.backgroundImage =
      `url("${imagemCapa}")`;

    $("#inviteCover").classList.add("has-image");

    $("#uploadText").textContent = arquivo.name;

    mostrarToast("Imagem de capa adicionada!");
  };

  leitor.readAsDataURL(arquivo);
});

// Alternância da aparência geral da página.
$("#themeToggle").addEventListener("click", () => {
  const claro = document.body.classList.toggle("light-ui");

  $("#themeToggle").setAttribute("aria-pressed", String(claro));
  $("#themeToggle .toggle-track").style.justifyContent =
    claro ? "flex-start" : "flex-end";
});

// Validação dos campos obrigatórios.
function validarFormulario() {
  let valido = true;

  $$(".field.invalid").forEach(campo => {
    campo.classList.remove("invalid");
  });

  $$(".field .error").forEach(erro => {
    erro.textContent = "";
  });

  const obrigatorios = [
    "title",
    "startDate",
    "endDate",
    "location",
    "description",
    "email",
    "phone"
  ];

  obrigatorios.forEach(id => {
    const campo = $(`#${id}`);
    const grupo = campo.closest(".field");
    let erro = "";

    if (!campo.value.trim()) {
      erro = "Este campo é obrigatório.";
    } else if (id === "email" && !campo.validity.valid) {
      erro = "Digite um e-mail válido.";
    } else if (
      id === "phone" &&
      campo.value.replace(/\D/g, "").length < 10
    ) {
      erro = "Digite um telefone válido.";
    }

    if (erro) {
      valido = false;
      grupo.classList.add("invalid");
      grupo.querySelector(".error").textContent = erro;
    }
  });

  const inicio = valor("startDate");
  const fim = valor("endDate");

  if (inicio && fim && fim < inicio) {
    valido = false;

    const grupo = $("#endDate").closest(".field");
    grupo.classList.add("invalid");
    grupo.querySelector(".error").textContent =
      "A data final deve ser igual ou posterior à inicial.";
  }

  return valido;
}

// Botão para gerar o convite.
formulario.addEventListener("submit", evento => {
  evento.preventDefault();

  if (!validarFormulario()) {
    mensagem.textContent = "Revise os campos destacados.";

    const primeiroErro = $(".field.invalid input, .field.invalid textarea");

    if (primeiroErro) primeiroErro.focus();

    return;
  }

  atualizarConvite();

  mensagem.textContent = "Convite gerado com sucesso!";
  mostrarToast("Seu convite está pronto!");

  $("#invitation").scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
});

// Alternância entre pré-visualização e código.
$$(".tab").forEach(botao => {
  botao.addEventListener("click", () => {
    const mostrarCodigo = botao.dataset.view === "code";

    $$(".tab").forEach(aba => {
      aba.classList.toggle("active", aba === botao);
    });

    $("#invitation").hidden = mostrarCodigo;
    $("#codePanel").hidden = !mostrarCodigo;

    atualizarCodigo();
  });
});

// Copiar o código de exemplo.
$("#copyCode").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("#htmlCode").textContent);
    mostrarToast("Código copiado!");
  } catch {
    mostrarToast("Selecione o código e copie manualmente.");
  }
});

// Botão ilustrativo de confirmação de presença.
$("#confirmButton").addEventListener("click", () => {
  mostrarToast("Este é um convite de demonstração!");
});

// Inicialização.
atualizarConvite();
