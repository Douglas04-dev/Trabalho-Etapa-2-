 // Seleciona os itens do menu e as views
    const menuItems = document.querySelectorAll('nav ul li.barra-tarefas');
    const views = document.querySelectorAll('.view');

    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        const viewToShow = item.getAttribute('data-view');

        // Se já está ativo, não faz nada
        if (item.classList.contains('active')) return;

        // Remove active dos menus e adiciona no clicado
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Troca as views com fade
        views.forEach(view => {
          if (view.id === viewToShow) {
            view.classList.add('active');
          } else {
            view.classList.remove('active');
          }
        });
      });
    }); 