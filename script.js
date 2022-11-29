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

let tasks = [];
let filterStatus = 'allTodos';
let currentPage = 1;

const addTask = () => {
    let task = {
        id: Date.now(),
        text: inputAdd.value,
        isChecked: false,
    }
    if(inputAdd.value !== ''){
        tasks.push(task);    
        inputAdd.value = '';
    }
    render();
};


const setFilter = () => {
    let filteredTasks = [];
    switch(filterStatus){ 
        case 'activeTodos':
          return filteredTasks = tasks. filter((item) => !item.isChecked);       
        case 'completedTodos':
            return filteredTasks = tasks. filter((item) => item.isChecked);
        default:
            return tasks;
    } 
     
};

const countPages = (data) => {
    let pageCount = Math.ceil(data.length/pageSize);
    let liPage = ''
    for (let i=1; i<= pageCount; i++){
        liPage += `<button id=${i}>${i}</button>`;
    }
    pageList.innerHTML = liPage;
}

const setPage = (event) => {
    currentPage = event.target.id;
    render();
}

const showPageTasks = (data) => {
    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    return data.slice(start, end);
}

const render = () => {
    let li = '';
    const filteredTasks = setFilter();
    // console.log('filteredtasks:', filteredTasks)    
    countPages(filteredTasks);
    const currentTasks = showPageTasks(filteredTasks);
    console.log('tt', filterStatus) 
    console.log('currentasks:', currentTasks) 
    currentTasks.forEach((item) => {
        const checked = item.isChecked ? 'checked' : "";
        li += `<li id=${item.id}>
        <input type="checkbox" ${checked}>
        <span>${item.text}</span>
        <input type="text" id="inputEdit" class="hidden" value="${item.text}">
        <button>X</button></li>`;        
    })
    list.innerHTML = li;
    countTodoTypes();
}

const countTodoTypes = () => {
    allTodos.textContent = `All ${tasks.length}`;

    let activeTasks = tasks.filter((item) => item.isChecked === false);
    activeTodos.textContent = `Active ${activeTasks.length}`;

    completedTodos.textContent = `Completed ${tasks.length - activeTasks.length}`;
}

const checkKey = (event) => {
    if (event.key === enterButton) addTask();
}

const checkAllTasks = (event) => {
    tasks.forEach((item)=> {
        item.isChecked = event.target.checked;
    })
    render();    
}

const checkTask = (event) => {
    let task = tasks.find((item) => item.id === Number(event.target.parentNode.id));
    task.isChecked = !task.isChecked; 
    render ();
}

const renameTask = (event) => {
    if(event.sourceCapabilities !== null){        
        event.target.previousElementSibling.textContent = event.target.value;
        event.target.previousElementSibling.classList.toggle('hidden');
        event.target.classList.toggle('hidden');
        let task = tasks.find((item) => item.id === Number(event.target.parentElement.id));
        if(event.target.value !== ''){
        task.text = event.target.value;}
        render();
    }

}

const handleKeys = (event) => {
    if (event.key === enterButton) {
        renameTask(event);
    } else if (event.key === escapeButton) {
        event.target.previousElementSibling.classList.toggle('hidden');
        event.target.classList.toggle('hidden');
        event.target.value = event.target.previousElementSibling.textContent;
    }

}

const deleteTask = (event) => {
    tasks = tasks.filter((item) => item.id !== Number(event.target.parentNode.id));
    render();
}

const deleteAllDone = () => {
    tasks = tasks.filter((item) => item.isChecked === false);
    render ();
}

const operateTask = (event) => {
    if (event.target.type == 'checkbox') 
       checkTask(event);
    if (event.target.type == 'submit') 
       deleteTask (event);
   if (event.target.localName == 'span' && event.detail == '2') {
       event.target.classList.toggle('hidden');
       event.target.nextElementSibling.classList.toggle('hidden');
       event.target.nextElementSibling.focus();
       }
}

const changeFilterStatus = (event) => {
    filterStatus = event.target.id;
    currentPage = 1;
    render();

}

buttonAdd.addEventListener('click', addTask);
inputAdd.addEventListener('keydown', checkKey);
checkAllBtn.addEventListener('click', checkAllTasks);
list.addEventListener('click', operateTask);
list.addEventListener('keydown', handleKeys);
list.addEventListener('blur', renameTask, true);
deleteAllCompleted.addEventListener('click', deleteAllDone);
filterTodosList.addEventListener('click', changeFilterStatus);
pageList.addEventListener('click', setPage);