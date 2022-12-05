(() => {
  const addInput = document.getElementById('inputAdd');
  const addButton = document.getElementById('buttonAdd');
  const list = document.querySelector('ul');
  const checkAllButton = document.getElementById('checkAll');
  const deleteAllCompleted = document.getElementById('deleteAllCompleted');
  const ENTER_BUTTON = 'Enter';
  const ESCAPE_BUTTON = 'Escape';
  const allTodos = document.getElementById('allTodos');
  const activeTodos = document.getElementById('activeTodos');
  const completedTodos = document.getElementById('completedTodos');
  const filterTodosList = document.getElementById('filterTodos');
  const pageList = document.getElementById('pageList');
  const PAGE_SIZE = 3;
  const { _ } = window;

  let tasks = [];
  let filterStatus = 'allTodos';
  let currentPage = 1;

  const setFilter = () => {
    allTodos.classList.remove('btn-light');
    completedTodos.classList.remove('btn-light');
    activeTodos.classList.remove('btn-light');
    let filteredTasks = [];
    switch (filterStatus) {
      case 'activeTodos':
        filteredTasks = tasks.filter((item) => !item.isChecked);
        activeTodos.classList.add('btn-light');
        break;
      case 'completedTodos':
        filteredTasks = tasks.filter((item) => item.isChecked);
        completedTodos.classList.add('btn-light');
        break;
      default:
        filteredTasks = tasks;
        allTodos.classList.add('btn-light');
    }
    return filteredTasks;
  };

  const countPages = (data) => {
    const pageCount = Math.ceil(data.length / PAGE_SIZE);
    let liPage = '';
    for (let i = 1; i <= pageCount; i += 1) {
      liPage += `<button type="button" class="btn ${currentPage !== i ? 'btn-warning' : 'btn-light'}" id=${i}>${i}</button>`;
    }
    pageList.innerHTML = liPage;
  };

  const showPageTasks = (data) => {
    currentPage = (currentPage < 1) ? Math.ceil(data.length / PAGE_SIZE) : currentPage;
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return data.slice(start, end);
  };

  const countTodoTypes = () => {
    allTodos.textContent = `All ${tasks.length}`;
    const activeTasks = tasks.filter((item) => !item.isChecked);
    activeTodos.textContent = `Active ${activeTasks.length}`;

    completedTodos.textContent = `Completed ${tasks.length - activeTasks.length}`;
  };

  const render = () => {
    let li = '';
    const filteredTasks = setFilter();
    const currentTasks = showPageTasks(filteredTasks);
    countPages(filteredTasks);
    currentTasks.forEach((item) => {
      const checked = item.isChecked ? 'checked' : '';
      li += `<li id=${item.id}>
          <input type="checkbox" ${checked}>
          <span>${item.text}</span>
          <input type="text" id="inputEdit" class="hidden" value="${item.text}">
          <button id="myBtnStyle" type="button" class="btn btn-success">X</button></li>`;
    });
    list.innerHTML = li;
    countTodoTypes();
  };

  const validateTask = (text) => {
    text
      .replaceAll('?', 'U+003F')
      .replaceAll('№', 'U+2116')
      .replaceAll(':', 'U+003A')
      .replaceAll('%', 'U+0025')
      .replaceAll(';', 'U+003B')
      .replaceAll('*', 'U+002A')
      .replaceAll('.', 'U+002E')
      .replaceAll('"', 'U+0022')
      .replaceAll('\'', 'U+0027')
      .replace(/ +/g, ' ');

    return text;
  };

  const addTask = () => {
    const TEXT = _.escape(validateTask(addInput.value.trim()));
    if (TEXT) {
      const task = {
        id: Date.now(),
        text: TEXT,
        isChecked: false,
      };
      tasks.push(task);
      addInput.value = '';
      currentPage = 0;
    }
    render();
  };

  const setPage = (event) => {
    currentPage = event.target.id;
    render();
  };

  const checkKey = (event) => {
    if (event.key === ENTER_BUTTON) addTask();
  };

  const checkAllTasks = (event) => {
    tasks.forEach((item) => {
      item.isChecked = event.target.checked;
    });
    render();
  };

  const allChecked = () => {
    let checkValue = true;
    tasks.forEach((item) => {
      if (!item.isChecked) checkValue = false;
    });
    return checkValue;
  };

  const checkTask = (event) => {
    const task = tasks.find((item) => item.id === Number(event.target.parentNode.id));
    task.isChecked = !task.isChecked;
    checkAllButton.checked = allChecked();
  };

  const renameTask = (event) => {
    const {
      previousElementSibling,
      classList,
      value,
      parentElement,
    } = event.target;
    if (event.sourceCapabilities) {
      console.log('poop', event);
      previousElementSibling.textContent = event.target.value;
      previousElementSibling.classList.toggle('hidden');
      classList.toggle('hidden');
      const task = tasks.find((item) => item.id === Number(parentElement.id));
      if (value) {
        task.text = validateTask(_.escape(event.target.value));
      }
      render();
    }
  };

  const handleKeys = (event) => {
    if (event.key === ENTER_BUTTON) {
      renameTask(event);
    } else if (event.key === ESCAPE_BUTTON) {
      render();
    }
  };

  const deleteTask = (event) => {
    tasks = tasks.filter((item) => item.id !== Number(event.target.parentNode.id));
    render();
  };

  const deleteAllDone = () => {
    tasks = tasks.filter((item) => !item.isChecked);
    checkAllButton.checked = false;
    render();
  };

  const operateTask = (event) => {
    const {
      type,
      localName,
      classList,
      nextElementSibling,
    } = event.target;
    if (type === 'checkbox') { checkTask(event); }
    if (type === 'button') { deleteTask(event); }
    if (localName === 'span' && event.detail === 2) {
      classList.toggle('hidden');
      nextElementSibling.classList.toggle('hidden');
      nextElementSibling.focus();
    }
  };

  const changeFilterStatus = (event) => {
    filterStatus = event.target.id;
    currentPage = 1;
    render();
  };

  addButton.addEventListener('click', addTask);
  addInput.addEventListener('keydown', checkKey);
  checkAllButton.addEventListener('click', checkAllTasks);
  list.addEventListener('click', operateTask);
  list.addEventListener('keydown', handleKeys);
  list.addEventListener('blur', renameTask, true);
  deleteAllCompleted.addEventListener('click', deleteAllDone);
  filterTodosList.addEventListener('click', changeFilterStatus);
  pageList.addEventListener('click', setPage);
})();
