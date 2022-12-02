const inputAdd = document.getElementById('inputAdd');
const buttonAdd = document.getElementById('buttonAdd');
const list = document.querySelector('ul');
const checkAllBtn = document.getElementById('checkAll');
const deleteAllCompleted = document.getElementById('deleteAllCompleted');
const enterButton = 'Enter';
const escapeButton = 'Escape';
const allTodos = document.getElementById('allTodos');
const activeTodos = document.getElementById('activeTodos');
const completedTodos = document.getElementById('completedTodos');
const filterTodosList = document.getElementById('filterTodos');
const pageList = document.getElementById('pageList');
const pageSize = 3;
const { _ } = window;

let tasks = [];
let filterStatus = 'allTodos';
let currentPage = 1;

const setFilter = () => {
  let filteredTasks = [];
  switch (filterStatus) {
    case 'activeTodos':
      filteredTasks = tasks.filter((item) => !item.isChecked);
      break;
    case 'completedTodos':
      filteredTasks = tasks.filter((item) => item.isChecked);
      break;
    default:
      filteredTasks = tasks;
  }
  return filteredTasks;
};

const countPages = (data) => {
  const pageCount = Math.ceil(data.length / pageSize);
  let liPage = '';
  for (let i = 1; i <= pageCount; i += 1) {
    liPage += `<button type="button" class="btn btn-warning" id=${i}>${i}</button>`;
  }
  pageList.innerHTML = liPage;
};

const showPageTasks = (data) => {
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
};

const countTodoTypes = () => {
  allTodos.textContent = `All ${tasks.length}`;

  const activeTasks = tasks.filter((item) => item.isChecked === false);
  activeTodos.textContent = `Active ${activeTasks.length}`;

  completedTodos.textContent = `Completed ${tasks.length - activeTasks.length}`;
};

const render = () => {
  let li = '';
  const filteredTasks = setFilter();
  countPages(filteredTasks);
  const currentTasks = showPageTasks(filteredTasks);
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
  const text = _.escape(validateTask(inputAdd.value.trim()));
  if (text) {
    const task = {
      id: Date.now(),
      text,
      isChecked: false,
    };
    tasks.push(task);
    inputAdd.value = '';
  }
  render();
};

const setPage = (event) => {
  currentPage = event.target.id;
  render();
};

const checkKey = (event) => {
  if (event.key === enterButton) addTask();
};

const checkAllTasks = (event) => {
  tasks.forEach((item) => {
    const task = item;
    task.isChecked = event.target.checked;
  });
  render();
};

const checkTask = (event) => {
  const task = tasks.find((item) => item.id === Number(event.target.parentNode.id));
  task.isChecked = !task.isChecked;
  render();
};

const renameTask = (event) => {
  const currentEvent = event;
  if (currentEvent.sourceCapabilities !== null) {
    currentEvent.target.previousElementSibling.textContent = event.target.value;
    currentEvent.target.previousElementSibling.classList.toggle('hidden');
    currentEvent.target.classList.toggle('hidden');
    const task = tasks.find((item) => item.id === Number(event.target.parentElement.id));
    if (currentEvent.target.value !== '') {
      task.text = validateTask(_.escape(event.target.value));
    }
    render();
  }
};

const handleKeys = (event) => {
  if (event.key === enterButton) {
    renameTask(event);
  } else if (event.key === escapeButton) {
    const currentEvent = event;
    currentEvent.target.previousElementSibling.classList.toggle('hidden');
    currentEvent.target.classList.toggle('hidden');
    currentEvent.target.value = event.target.previousElementSibling.textContent;
  }
};

const deleteTask = (event) => {
  tasks = tasks.filter((item) => item.id !== Number(event.target.parentNode.id));
  render();
};

const deleteAllDone = () => {
  tasks = tasks.filter((item) => item.isChecked === false);
  render();
};

const operateTask = (event) => {
  if (event.target.type === 'checkbox') { checkTask(event); }
  if (event.target.type === 'button') { deleteTask(event); }
  if (event.target.localName === 'span' && event.detail === 2) {
    event.target.classList.toggle('hidden');
    event.target.nextElementSibling.classList.toggle('hidden');
    event.target.nextElementSibling.focus();
  }
};

const changeFilterStatus = (event) => {
  filterStatus = event.target.id;
  currentPage = 1;
  render();
};

buttonAdd.addEventListener('click', addTask);
inputAdd.addEventListener('keydown', checkKey);
checkAllBtn.addEventListener('click', checkAllTasks);
list.addEventListener('click', operateTask);
list.addEventListener('keydown', handleKeys);
list.addEventListener('blur', renameTask, true);
deleteAllCompleted.addEventListener('click', deleteAllDone);
filterTodosList.addEventListener('click', changeFilterStatus);
pageList.addEventListener('click', setPage);
