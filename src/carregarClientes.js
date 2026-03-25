let listaClientes = [];

(function () {
  async function carregarClientes() {
    try {
      const response = await fetch("http://127.0.0.1:8000/clientes");

      if (!response.ok)
        throw new Error("Erro na requisição: " + response.statusText);

      const clientes = await response.json();

      // 🔥 GUARDA OS CLIENTES
      listaClientes = clientes;

      const tbody = document.getElementById("clientesBody");

      if (!tbody) {
        console.error("Elemento 'clientesBody' não encontrado.");
        return;
      }

      tbody.innerHTML = "";

      clientes.forEach(function (cliente) {
        const tr = document.createElement("tr");

        const statusClass =
          cliente.status_cliente === "ATIVO"
            ? "status-ativo"
            : "status-inativo";

        tr.innerHTML = `
          <td>${cliente.nome_completo || ""}</td>
          <td>${cliente.documento || ""}</td>
          <td>${cliente.telefone || ""}</td>
          
          <td>
            <span class="${statusClass}">
              ${cliente.status_cliente || ""}
            </span>
          </td>

          <td class="btn-actions">
            <button class="btn-edit" data-id="${cliente.id_cliente}">Editar</button>
            <button class="btn-delete" data-id="${cliente.id_cliente}">Excluir</button>
          </td>
        `;

        tbody.appendChild(tr);
        console.log(cliente);
      });
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  }

  window.addEventListener("load", carregarClientes);
})();

document.getElementById("clientesBody").addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    const id = e.target.dataset.id;
    abrirModal(id);
  }
});

document.getElementById("clientesBody").addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    const id = e.target.dataset.id;
    abrirModal(id);
  }

  if (e.target.classList.contains("btn-delete")) {
    mostrarConfirmacao(e.target);
  }

  if (e.target.classList.contains("btn-confirmar-delete")) {
    confirmarExclusao(e.target);
  }

  if (e.target.classList.contains("btn-cancelar-delete")) {
    cancelarExclusao(e.target);
  }
});

function abrirModal(id) {
  const modal = document.getElementById("modalCliente");

  const cliente = listaClientes.find((c) => c.id_cliente == id);

  if (!cliente) {
    console.error("Cliente não encontrado:", id);
    return;
  }

  document.getElementById("inputNome").value = cliente.nome_completo || "";
  document.getElementById("inputCPF").value = cliente.documento || "";
  document.getElementById("inputTelefone").value = cliente.telefone || "";
  document.getElementById("inputStatus").value =
    cliente.status_cliente || "PENDENTE";

  modal.dataset.id = id;

  modal.style.display = "flex";
}

async function salvarCliente() {
  const modal = document.getElementById("modalCliente");
  const id = modal.dataset.id;

  const dadosAtualizados = {
    nome_completo: document.getElementById("inputNome").value,
    documento: document.getElementById("inputCPF").value,
    telefone: document.getElementById("inputTelefone").value,
    status_cliente: document.getElementById("inputStatus").value,
  };

  try {
    const response = await fetch(`http://127.0.0.1:8000/clientes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosAtualizados),
    });

    if (!response.ok) throw new Error("Erro ao atualizar");

    // 🔥 ATUALIZA TABELA
    location.reload(); // simples por enquanto

    // (se quiser depois fazemos sem reload)
  } catch (error) {
    console.error(error);
    alert("Erro ao salvar cliente");
  }
}

function fecharModal() {
  document.getElementById("modalCliente").style.display = "none";
}

function mostrarConfirmacao(btn) {
  const td = btn.parentElement;
  
  td.dataset.original = td.innerHTML;

  const id = btn.dataset.id;

  td.innerHTML = `
    <span style="margin-right:10px;">Confirmar?</span>
    <button class="btn-confirmar-delete" data-id="${id}">Sim</button>
    <button class="btn-cancelar-delete" data-id="${id}">Cancelar</button>
  `;
}

async function confirmarExclusao(btn) {
  const id = btn.dataset.id;
  const tr = btn.closest("tr");

  try {
    const response = await fetch(`http://127.0.0.1:8000/clientes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao excluir");

    // ✨ animação suave
    tr.style.transition = "0.3s";
    tr.style.opacity = "0";
    tr.style.transform = "translateX(50px)";

    setTimeout(() => {
      tr.remove();
    }, 300);

  } catch (error) {
    console.error(error);
    alert("Erro ao excluir cliente");
  }
}

function cancelarExclusao(btn) {
  const td = btn.parentElement;

  td.innerHTML = td.dataset.original;
}