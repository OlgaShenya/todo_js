(function runScript() {
  const INPUT_ADD = document.getElementById('inputAdd');
  const BUTTON_ADD = document.getElementById('buttonAdd');
  const LIST = document.querySelector('ul');
  const CHECK_ALL_BTN = document.getElementById('checkAll');
  const DELETE_ALL_COMPLETED = document.getElementById('deleteAllCompleted');
  const ENTER_BUTTON = 'Enter';
  const ESCAPE_BUTTON = 'Escape';
  const ALL_TODOS = document.getElementById('allTodos');
  const ACTIVE_TODOS = document.getElementById('activeTodos');
  const COMPLETED_TODOS = document.getElementById('completedTodos');
  const FILTER_TODOS_LIST = document.getElementById('filterTodos');
  const PAGE_LIST = document.getElementById('pageList');
  const PAGE_SIZE = 3;
  const { _ } = window;

  let tasks = [];
  let filterStatus = 'allTodos';
  let currentPage = 1;

  const SET_FILTER = () => {
    ALL_TODOS.classList.remove("btn-light");
    COMPLETED_TODOS.classList.remove("btn-light");
    ACTIVE_TODOS.classList.remove("btn-light");
    let filteredTasks = [];
    switch (filterStatus) {
      case 'activeTodos':
        filteredTasks = tasks.filter((item) => !item.isChecked);
        ACTIVE_TODOS.classList.add("btn-light");
        break;
      case 'completedTodos':
        filteredTasks = tasks.filter((item) => item.isChecked);
        COMPLETED_TODOS.classList.add("btn-light");
        break;
      default:
        filteredTasks = tasks;
        ALL_TODOS.classList.add("btn-light");
    }
    return filteredTasks;
  };

  const COUNT_PAGES = (data) => {
    const PAGE_COUNT = Math.ceil(data.length / PAGE_SIZE);
    let liPage = '';
    for (let i = 1; i <= PAGE_COUNT; i += 1) {
      liPage += `<button type="button" class="btn ${currentPage != i ? "btn-warning" : "btn-light"}" id=${i}>${i}</button>`;
    }
    PAGE_LIST.innerHTML = liPage;
  };

  const SHOW_PAGE_TASKS = (data) => {
    const START = (currentPage - 1) * PAGE_SIZE;
    const END = START + PAGE_SIZE;
    return data.slice(START, END);
  };

  const COUNT_TODO_TYPES = () => {
    ALL_TODOS.textContent = `All ${tasks.length}`;
    const ACTIVE_TASKS = tasks.filter((item) => !item.isChecked);
    ACTIVE_TODOS.textContent = `Active ${ACTIVE_TASKS.length}`;

    COMPLETED_TODOS.textContent = `Completed ${tasks.length - ACTIVE_TASKS.length}`;
  };

  const RENDER = () => {
    let li = '';
    const FILTERED_TASKS = SET_FILTER();
    COUNT_PAGES(FILTERED_TASKS);
    const CURRENT_TASKS = SHOW_PAGE_TASKS(FILTERED_TASKS);
    CURRENT_TASKS.forEach((item) => {
      const CHECKED = item.isChecked ? 'checked' : '';
      li += `<li id=${item.id}>
          <input type="checkbox" ${CHECKED}>
          <span>${item.text}</span>
          <input type="text" id="inputEdit" class="hidden" value="${item.text}">
          <button id="myBtnStyle" type="button" class="btn btn-success">X</button></li>`;
    });
    LIST.innerHTML = li;
    COUNT_TODO_TYPES();
  };

  const VALIDATE_TASK = (text) => {
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

  const ADD_TASK = () => {
    const TEXT = _.escape(VALIDATE_TASK(INPUT_ADD.value.trim()));
    if (TEXT) {
      const TASK = {
        id: Date.now(),
        text: TEXT,
        isChecked: false,
      };
      tasks.push(TASK);
      INPUT_ADD.value = '';
    }
    RENDER();
  };

  const SET_PAGE = (event) => {
    currentPage = event.target.id;
    RENDER();
  };

  const CHECK_KEY = (event) => {
    if (event.key === ENTER_BUTTON) ADD_TASK();
  };

  const CHECK_ALL_TASKS = (event) => {
    tasks.forEach((item) => {
      const TASK = item;
      TASK.isChecked = event.target.checked;
    });
    RENDER();
  };

  const CHECK_TASK = (event) => {
    const TASK = tasks.find((item) => item.id === Number(event.target.parentNode.id));
    TASK.isChecked = !TASK.isChecked;
    RENDER();
  };

  const RENAME_TASK = (event) => {
    const CURRENT_EVENT = event;
    if (CURRENT_EVENT.sourceCapabilities !== null) {
      CURRENT_EVENT.target.previousElementSibling.textContent = event.target.value;
      CURRENT_EVENT.target.previousElementSibling.classList.toggle('hidden');
      CURRENT_EVENT.target.classList.toggle('hidden');
      const TASK = tasks.find((item) => item.id === Number(event.target.parentElement.id));
      if (!CURRENT_EVENT.target.value) {
        TASK.text = VALIDATE_TASK(_.escape(event.target.value));
      }
      RENDER();
    }
  };

  const HANDLE_KEYS = (event) => {
    if (event.key === ENTER_BUTTON) {
      RENAME_TASK(event);
    } else if (event.key === ESCAPE_BUTTON) {
      const CURRENT_EVENT = event;
      CURRENT_EVENT.target.previousElementSibling.classList.toggle('hidden');
      CURRENT_EVENT.target.classList.toggle('hidden');
      CURRENT_EVENT.target.value = event.target.previousElementSibling.textContent;
    }
  };

  const DELETE_TASK = (event) => {
    tasks = tasks.filter((item) => item.id !== Number(event.target.parentNode.id));
    RENDER();
  };

  const DELETE_ALL_DONE = () => {
    tasks = tasks.filter((item) => !item.isChecked);
    RENDER();
  };

  const OPERATE_TASK = (event) => {
    if (event.target.type === 'checkbox') { CHECK_TASK(event); }
    if (event.target.type === 'button') { DELETE_TASK(event); }
    if (event.target.localName === 'span' && event.detail === 2) {
      event.target.classList.toggle('hidden');
      event.target.nextElementSibling.classList.toggle('hidden');
      event.target.nextElementSibling.focus();
    }
  };

  const CHANGE_FILTER_STATUS = (event) => {
    filterStatus = event.target.id;
    currentPage = 1;
    RENDER();
  };

  BUTTON_ADD.addEventListener('click', ADD_TASK);
  INPUT_ADD.addEventListener('keydown', CHECK_KEY);
  CHECK_ALL_BTN.addEventListener('click', CHECK_ALL_TASKS);
  LIST.addEventListener('click', OPERATE_TASK);
  LIST.addEventListener('keydown', HANDLE_KEYS);
  LIST.addEventListener('blur', RENAME_TASK, true);
  DELETE_ALL_COMPLETED.addEventListener('click', DELETE_ALL_DONE);
  FILTER_TODOS_LIST.addEventListener('click', CHANGE_FILTER_STATUS);
  PAGE_LIST.addEventListener('click', SET_PAGE);
}());
