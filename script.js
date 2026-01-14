diff --git a/script.js b/script.js
index 8b137891791fe96927ad78e64b0aad7bded08bdc..0651bf44be01ac0bfaab5a3d832d38a600a38144 100644
--- a/script.js
+++ b/script.js
@@ -1 +1,214 @@
+const operacoes = JSON.parse(localStorage.getItem("operacoes")) || [];
+let grafico;
+let tipoGrafico = "pie";
 
+const hojeEl = document.getElementById("hoje");
+const semanaEl = document.getElementById("semana");
+const mesEl = document.getElementById("mes");
+const qtdEl = document.getElementById("qtd");
+const previewEl = document.getElementById("preview");
+const errorEl = document.getElementById("error");
+const listaEl = document.getElementById("lista");
+
+const form = document.getElementById("calcForm");
+const valorInput = document.getElementById("valor");
+const percentualInput = document.getElementById("percentual");
+const quantidadeInput = document.getElementById("quantidade");
+
+const moeda = new Intl.NumberFormat("pt-BR", {
+  style: "currency",
+  currency: "BRL",
+  minimumFractionDigits: 2
+});
+
+function abrirTab(e, id) {
+  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
+  e.target.classList.add("active");
+  document.querySelectorAll(".tabContent").forEach(c => c.classList.add("hidden"));
+  document.getElementById(id).classList.remove("hidden");
+}
+
+function irParaOperacoes() {
+  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
+  document.querySelectorAll(".tab")[1].classList.add("active");
+
+  document.querySelectorAll(".tabContent").forEach(c => c.classList.add("hidden"));
+  document.getElementById("ops").classList.remove("hidden");
+}
+
+function salvar() {
+  localStorage.setItem("operacoes", JSON.stringify(operacoes));
+}
+
+function exibirErro(mensagem) {
+  errorEl.textContent = mensagem;
+  errorEl.classList.remove("hidden");
+}
+
+function limparErro() {
+  errorEl.textContent = "";
+  errorEl.classList.add("hidden");
+}
+
+function executar() {
+  const v = Number(valorInput.value);
+  const p = Number(percentualInput.value);
+  const q = Number(quantidadeInput.value);
+
+  if (!v || !p || !q) {
+    exibirErro("Preencha todos os campos com valores válidos.");
+    return;
+  }
+
+  limparErro();
+
+  let totalAtual = v;
+
+  for (let i = 0; i < q; i += 1) {
+    const ganho = totalAtual * p / 100;
+    const total = totalAtual + ganho;
+
+    operacoes.push({
+      base: totalAtual,
+      perc: p,
+      ganho,
+      total,
+      data: new Date().toISOString(),
+      ok: false
+    });
+
+    totalAtual = total;
+  }
+
+  previewEl.innerText = `Resultado final:\n${moeda.format(totalAtual)}`;
+
+  salvar();
+  renderizar();
+  irParaOperacoes();
+  form.reset();
+}
+
+function renderizar() {
+  listaEl.innerHTML = "";
+
+  let hoje = 0;
+  let semana = 0;
+  let mes = 0;
+  let concluidas = 0;
+  const agora = new Date();
+
+  if (operacoes.length === 0) {
+    listaEl.innerHTML = "<p class=\"helper-text\">Nenhuma operação registrada ainda.</p>";
+  }
+
+  operacoes.forEach((op, i) => {
+    const d = new Date(op.data);
+
+    if (op.ok) {
+      concluidas += 1;
+      hoje += op.ganho;
+      if ((agora - d) / 86400000 <= 7) semana += op.ganho;
+      if (agora.getMonth() === d.getMonth() && agora.getFullYear() === d.getFullYear()) mes += op.ganho;
+    }
+
+    const div = document.createElement("div");
+    div.className = "operacao";
+    div.innerHTML = `
+      <strong>${op.perc}% de ${moeda.format(op.base)} = ${moeda.format(op.ganho)}</strong><br>
+      <small>Total: ${moeda.format(op.total)}</small><br>
+      <label>
+        <input type="checkbox" ${op.ok ? "checked" : ""} onchange="toggle(${i})">
+        Concluída
+      </label>
+      <div class="actions">
+        <button type="button" onclick="editar(${i})">Editar</button>
+        <button type="button" class="del" onclick="excluir(${i})">Excluir</button>
+      </div>
+    `;
+    listaEl.appendChild(div);
+  });
+
+  hojeEl.textContent = moeda.format(hoje);
+  semanaEl.textContent = moeda.format(semana);
+  mesEl.textContent = moeda.format(mes);
+  qtdEl.textContent = concluidas;
+
+  atualizarGrafico(hoje, semana, mes, concluidas);
+}
+
+function toggle(i) {
+  operacoes[i].ok = !operacoes[i].ok;
+  salvar();
+  renderizar();
+}
+
+function excluir(i) {
+  if (confirm("Excluir operação?")) {
+    operacoes.splice(i, 1);
+    salvar();
+    renderizar();
+  }
+}
+
+function editar(i) {
+  const novo = prompt("Novo percentual:", operacoes[i].perc);
+  if (!novo) return;
+
+  operacoes[i].perc = Number(novo);
+  operacoes[i].ganho = operacoes[i].base * Number(novo) / 100;
+  operacoes[i].total = operacoes[i].base + operacoes[i].ganho;
+
+  salvar();
+  renderizar();
+}
+
+function atualizarGrafico(h, s, m, c) {
+  const canvas = document.getElementById("grafico");
+  if (grafico) grafico.destroy();
+
+  grafico = new Chart(canvas, {
+    type: tipoGrafico,
+    data: {
+      labels: ["Hoje", "Semana", "Mês", "Concluídas"],
+      datasets: [{
+        data: [h, s, m, c],
+        backgroundColor: ["#38bdf8", "#6366f1", "#22c55e", "#f97316"]
+      }]
+    },
+    options: {
+      plugins: {
+        legend: {
+          labels: {
+            color: "#e2e8f0"
+          }
+        }
+      },
+      scales: tipoGrafico === "bar" ? {
+        x: { ticks: { color: "#e2e8f0" } },
+        y: { ticks: { color: "#e2e8f0" } }
+      } : {}
+    }
+  });
+}
+
+function alternarGrafico() {
+  tipoGrafico = (tipoGrafico === "pie") ? "bar" : "pie";
+  renderizar();
+}
+
+form.addEventListener("submit", event => {
+  event.preventDefault();
+  executar();
+});
+
+window.abrirTab = abrirTab;
+window.toggle = toggle;
+window.editar = editar;
+window.excluir = excluir;
+window.alternarGrafico = alternarGrafico;
+
+renderizar();
+
+if ("serviceWorker" in navigator) {
+  navigator.serviceWorker.register("./service-worker.js");
+}

