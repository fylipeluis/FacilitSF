(function () {
  async function carregarClientes() {
    try {
      const response = await fetch("https://6chlgdafv.localto.net/webhook-forms");
      if (!response.ok)
        throw new Error("Network response was not ok: " + response.statusText);
      const clientes = await response.json();

      const tbody = document.getElementById("clientesBody");

      if (!tbody) {
        console.error("Elemento 'clientesBody' não encontrado no DOM.");
        return;
      }

      tbody.innerHTML = "";

      clientes.forEach(function (cliente) {
        var tr = document.createElement("tr");
        var statusClass =
          cliente.status_cliente === "ATIVO"
            ? "status-ativo"
            : "status-inativo";
        tr.innerHTML =
          "\n                <td>" +
          (cliente.nome_completo || "") +
          "</td>\n                <td>" +
          (cliente.documento || "") +
          "</td>\n                <td>" +
          (cliente.telefone || "") +
          '</td>\n                <td class="' +
          statusClass +
          '">\n                    ' +
          (cliente.status_cliente || "") +
          "\n                </td>\n            ";
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  }
  window.addEventListener("load", function () {
    carregarClientes();
  });
})();

function buscarCliente() {
    const input = document.getElementById("searchInput");
    const filtro = input.value.toLowerCase();
    const tabela = document.getElementById("clientesTable");
    const linhas = tabela.getElementsByTagName("tr");

    for (let i = 1; i < linhas.length; i++) {
        const td = linhas[i].getElementsByTagName("td")[0];
        if (td) {
            const texto = td.textContent || td.innerText;
            linhas[i].style.display =
                texto.toLowerCase().indexOf(filtro) > -1 ? "" : "none";
        }
    }
}

function abrirModal(){
    document.getElementById("modalCliente").style.display = "flex";
}

function fecharModal(){
    document.getElementById("modalCliente").style.display = "none";
}