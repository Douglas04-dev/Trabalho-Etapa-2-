
    const menuItems = document.querySelectorAll('nav ul li.barra-tarefas');
    const views = document.querySelectorAll('.view');

    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        const viewToShow = item.getAttribute('data-view');

       
        if (item.classList.contains('active')) return;

        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

      
        views.forEach(view => {
          if (view.id === viewToShow) {
            view.classList.add('active');
          } else {
            view.classList.remove('active');
          }
        });
      });
    }); 

    //Janela 

    function janela(){

      document.getElementById("abrir").style.display = "flex";


    };
    //fechar
    function fechar(){
      document.getElementById("abrir").style.display = "none";
    };

    //calendário

    
const diasContainer = document.getElementById('dias');
const mesAno = document.getElementById('mesAno');
const btnPrev = document.getElementById('prev');
const btnNext = document.getElementById('next');

const nomesMeses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

let dataAtual = new Date();

function renderizarCalendario() {
  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();

  mesAno.textContent = `${nomesMeses[mes]} ${ano}`;

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();

  diasContainer.innerHTML = '';

  for (let i = 0; i < primeiroDia; i++) {
    diasContainer.innerHTML += `<div></div>`;
  }

  for (let dia = 1; dia <= ultimoDia; dia++) {
    diasContainer.innerHTML += `<div>${dia}</div>`;
  }
}

btnPrev.addEventListener('click', () => {
  dataAtual.setMonth(dataAtual.getMonth() - 1);
  renderizarCalendario();
});

btnNext.addEventListener('click', () => {
  dataAtual.setMonth(dataAtual.getMonth() + 1);
  renderizarCalendario();
});



// Inicialização
renderizarCalendario();

// parte da tarefa
diasContainer.addEventListener('click', (e) => {
  
  if(e.target.tagName === 'DIV' && e.target.textContent.trim() !== '') {
    const dia = e.target.textContent.trim();
    const mes = dataAtual.getMonth() + 1;  
    const ano = dataAtual.getFullYear();

  
    const diaFormatado = dia.padStart(2, '0');
    const mesFormatado = mes.toString().padStart(2, '0');
    const dataFormatada = `${ano}-${mesFormatado}-${diaFormatado}`;

  
    janela();

  
    document.getElementById('data').value = dataFormatada;
  }
});

