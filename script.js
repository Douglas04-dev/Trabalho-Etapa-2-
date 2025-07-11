
const menuItems = document.querySelectorAll('nav ul li.barra-tarefas');
const views = document.querySelectorAll('.view');

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    const viewToShow = item.getAttribute('data-view');
    if (item.classList.contains('active')) return;
    menuItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    views.forEach(view => {
      view.classList.toggle('active', view.id === viewToShow);
    });
  });
});

function janela() {
  document.getElementById("abrir").style.display = "flex";
}
function fechar() {
  document.getElementById("abrir").style.display = "none";
}

// Calendário
const diasContainer = document.getElementById('dias');
const mesAno = document.getElementById('mesAno');
const btnPrev = document.getElementById('prev');
const btnNext = document.getElementById('next');
const nomesMeses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
let dataAtual = new Date();

function renderizarCalendario() {
  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();
  mesAno.textContent = `${nomesMeses[mes]} ${ano}`;
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  diasContainer.innerHTML = '';
  for (let i = 0; i < primeiroDia; i++) diasContainer.innerHTML += '<div></div>';
  for (let dia = 1; dia <= ultimoDia; dia++) diasContainer.innerHTML += `<div>${dia}</div>`;
}

btnPrev.addEventListener('click', () => {
  dataAtual.setMonth(dataAtual.getMonth() - 1);
  renderizarCalendario();
});
btnNext.addEventListener('click', () => {
  dataAtual.setMonth(dataAtual.getMonth() + 1);
  renderizarCalendario();
});

diasContainer.addEventListener('click', (e) => {
  if (e.target.tagName === 'DIV' && e.target.textContent.trim() !== '') {
    const dia = e.target.textContent.trim().padStart(2, '0');
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const dataSelecionada = `${ano}-${mes}-${dia}`;
    document.getElementById('data').value = dataSelecionada;

    const tarefasDoDia = tarefas.filter(t => t.data === dataSelecionada);
    const container = document.getElementById('tarefas-do-dia');
    container.innerHTML = '';

    if (tarefasDoDia.length === 0) {
      container.innerHTML = `<p style="color: #666;">Nenhuma tarefa para este dia.</p>`;
    } else {
      container.innerHTML = `<h4>Tarefas deste dia:</h4>`;
      tarefasDoDia.forEach(t => {
        container.innerHTML += `
          <div class="tarefa-listada" style="border: 1px solid #ccc; padding: 6px; margin-top: 5px; border-radius: 5px;">
            <strong>${t.titulo}</strong><br />
            <small>${t.descricao || ''}</small><br />
            <em>Prioridade: ${t.prioridade}</em>
          </div>
        `;
      });
    }

    janela();
  }
});

renderizarCalendario();

let tarefas = [];
let tarefaEditando = null;

function salvarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}
function carregarTarefas() {
  try {
    const salvas = localStorage.getItem('tarefas');
    if (salvas) tarefas = JSON.parse(salvas);
  } catch (e) {
    tarefas = [];
    localStorage.removeItem('tarefas');
  }
}

document.querySelector('.btn-salvar').addEventListener('click', function (e) {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;
  const data = document.getElementById('data').value;
  const horario = document.getElementById('horario').value;
  const prioridade = document.getElementById('prioridade').value;
  if (!titulo || !data) return alert('Preencha o título e a data.');

  const novaTarefa = { titulo, descricao, data, horario, prioridade, concluida: false };

  if (tarefaEditando !== null) {
    tarefas[tarefaEditando] = { ...tarefas[tarefaEditando], ...novaTarefa };
    tarefaEditando = null;
  } else {
    tarefas.push(novaTarefa);
  }

  salvarTarefas();
  fechar();
  document.querySelector('form').reset();
  renderizarTarefas(document.getElementById('filtro-tarefas').value);
});

function toggleStatus(index) {
  tarefas[index].concluida = !tarefas[index].concluida;
  salvarTarefas();
  renderizarTarefas(document.getElementById('filtro-tarefas').value);
}

function editarTarefa(index) {
  const tarefa = tarefas[index];
  document.getElementById('titulo').value = tarefa.titulo;
  document.getElementById('descricao').value = tarefa.descricao;
  document.getElementById('data').value = tarefa.data;
  document.getElementById('horario').value = tarefa.horario || '';
  document.getElementById('prioridade').value = tarefa.prioridade;
  tarefaEditando = index;
  janela();
}

function excluirTarefa(index) {
  if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
    tarefas.splice(index, 1);
    salvarTarefas();
    renderizarTarefas(document.getElementById('filtro-tarefas').value);
  }
}

// Paginação numerada
let paginaAtual = 1;
const porPagina = 5;
let tarefasFiltradas = [];

function renderizarTarefas(filtro = 'todas', resetar = true) {
  const lista = document.getElementById('lista-tarefas');
  const hoje = new Date().toISOString().split('T')[0];
  const filtroNome = document.getElementById('filtro-nome').value.toLowerCase();
  const filtroPrioridade = document.getElementById('filtro-prioridade').value;

  if (resetar) {
    lista.innerHTML = '';
    paginaAtual = 1; // resetar pagina para 1
  }

  tarefasFiltradas = tarefas.filter(t => {
    if (filtro === 'concluidas' && !t.concluida) return false;
    if (filtro === 'pendentes' && t.concluida) return false;
    if (filtro === 'hoje' && t.data !== hoje) return false;
    if (filtroNome && !t.titulo.toLowerCase().includes(filtroNome)) return false;
    if (filtroPrioridade && t.prioridade !== filtroPrioridade) return false;
    return true;
  });

  if (filtro === 'hoje') {
    tarefasFiltradas.sort((a, b) => (a.horario || '').localeCompare(b.horario || ''));
  }

  const totalPaginas = Math.ceil(tarefasFiltradas.length / porPagina);
  if (paginaAtual > totalPaginas) paginaAtual = totalPaginas || 1;

  const inicio = (paginaAtual - 1) * porPagina;
  const fim = inicio + porPagina;
  const paginaTarefas = tarefasFiltradas.slice(inicio, fim);

  lista.innerHTML = '';

  if (paginaTarefas.length === 0) {
    lista.innerHTML = '<p>Nenhuma tarefa encontrada.</p>';
    document.getElementById('paginacao').innerHTML = '';
    return;
  }

  paginaTarefas.forEach((t, i) => {
    const indexReal = tarefas.indexOf(t);
    const el = document.createElement('div');
    el.className = 'tarefa';
    el.innerHTML = `
      <h3>${t.titulo}</h3>
      <p>${t.descricao}</p>
      <p><strong>Data:</strong> ${t.data}</p>
      <p><strong>Horário:</strong> ${t.horario || 'Não informado'}</p>
      <p><strong>Prioridade:</strong> ${t.prioridade}</p>
      <p><strong>Status:</strong> ${t.concluida ? 'Concluída' : 'Pendente'}</p>
      <button onclick="toggleStatus(${indexReal})">${t.concluida ? 'Marcar como Pendente' : 'Concluir'}</button>
      <button onclick="editarTarefa(${indexReal})">Editar</button>
      <button onclick="excluirTarefa(${indexReal})">Excluir</button>
    `;
    lista.appendChild(el);
  });

  renderizarPaginacao(totalPaginas);
}

function renderizarPaginacao(totalPaginas) {
  const paginacao = document.getElementById('paginacao');
  paginacao.innerHTML = '';

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.disabled = (i === paginaAtual);
    btn.style.margin = '0 5px';
    btn.style.padding = '5px 10px';
    btn.style.cursor = (i === paginaAtual) ? 'default' : 'pointer';

  btn.addEventListener('click', () => {
  if (i === paginaAtual) return; 
  paginaAtual = i; 
  renderizarTarefas(document.getElementById('filtro-tarefas').value, false);
});

    paginacao.appendChild(btn);
  }
}


// Eventos dos filtros — resetam páginaAtual pra 1 e re-renderizam
document.getElementById('filtro-tarefas').addEventListener('change', e => {
  paginaAtual = 1;
  renderizarTarefas(e.target.value);
});
document.getElementById('filtro-nome').addEventListener('input', () => {
  paginaAtual = 1;
  renderizarTarefas(document.getElementById('filtro-tarefas').value);
});
document.getElementById('filtro-prioridade').addEventListener('change', () => {
  paginaAtual = 1;
  renderizarTarefas(document.getElementById('filtro-tarefas').value);
});

// Botão limpar filtros
function limparFiltros() {
  document.getElementById('filtro-nome').value = '';
  document.getElementById('filtro-prioridade').value = '';
  document.getElementById('filtro-tarefas').value = 'todas';
  paginaAtual = 1;
  renderizarTarefas('todas');
}
// Inicialização
carregarTarefas();
renderizarTarefas();
