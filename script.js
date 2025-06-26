
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

//Modal
function janela() {
  document.getElementById("abrir").style.display = "flex";
}

function fechar() {
  document.getElementById("abrir").style.display = "none";
}

//Calendário
const diasContainer = document.getElementById('dias');
const mesAno = document.getElementById('mesAno');
const btnPrev = document.getElementById('prev');
const btnNext = document.getElementById('next');
const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
let dataAtual = new Date();

function renderizarCalendario() {
  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();
  mesAno.textContent = `${nomesMeses[mes]} ${ano}`;
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  diasContainer.innerHTML = '';
  for (let i = 0; i < primeiroDia; i++) diasContainer.innerHTML += `<div></div>`;
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

//Chamar Modal no calendário
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


//Filtro
let tarefas = [];
let tarefaEditando = null;

function salvarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}
function carregarTarefas() {
  const salvas = localStorage.getItem('tarefas');
  if (salvas) tarefas = JSON.parse(salvas);
}

document.querySelector('.btn-salvar').addEventListener('click', function (e) {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;
  const data = document.getElementById('data').value;
  const prioridade = document.getElementById('prioridade').value;
  if (!titulo || !data) return alert('Preencha o título e a data.');

  const novaTarefa = { titulo, descricao, data, prioridade, concluida: false };

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

function renderizarTarefas(filtro = 'todas') {
  const lista = document.getElementById('lista-tarefas');
  lista.innerHTML = '';
  const hoje = new Date().toISOString().split('T')[0];

  const filtradas = tarefas.filter(t => {
    if (filtro === 'concluidas') return t.concluida;
    if (filtro === 'pendentes') return !t.concluida;
    if (filtro === 'hoje') return t.data === hoje;
    return true;
  });

  if (filtradas.length === 0) {
    lista.innerHTML = '<p>Nenhuma tarefa encontrada.</p>';
    return;
  }

  filtradas.forEach((t, i) => {
    const el = document.createElement('div');
    el.className = 'tarefa';
    el.innerHTML = `
      <h3>${t.titulo}</h3>
      <p>${t.descricao}</p>
      <p><strong>Data:</strong> ${t.data}</p>
      <p><strong>Prioridade:</strong> ${t.prioridade}</p>
      <p><strong>Status:</strong> ${t.concluida ? 'Concluída' : 'Pendente'}</p>
      <button onclick="toggleStatus(${i})">${t.concluida ? 'Marcar como Pendente' : 'Concluir'}</button>
      <button onclick="editarTarefa(${i})">Editar</button>
      <button onclick="excluirTarefa(${i})">Excluir</button>
    `;
    lista.appendChild(el);
  });
}

document.getElementById('filtro-tarefas').addEventListener('change', e => {
  renderizarTarefas(e.target.value);
});

carregarTarefas();
renderizarTarefas();
