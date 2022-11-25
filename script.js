const inputAdd = document.getElementById('inputAdd');
const buttonAdd = document.getElementById('buttonAdd');
const list = document.querySelector('ul');
const checkAllBtn = document.getElementById('checkAll');
const deleteAllCompleted = document.getElementById('deleteAllCompleted');

let tasks = [];

const addTask = () => {
    let task = {
        id: Date.now(),
        text: inputAdd.value,
        isChecked: false,
    }
    tasks.push(task);    
    inputAdd.value = '';
    render();
};

const render = () => {
    let li = '';
    tasks.forEach((item) => {
        const checked = item.isChecked ? 'checked' : "";
        li += `<li id=${item.id}>
        <input type="checkbox" ${checked}>
        <span>${item.text}</span>
        <input type="text" id="inputEdit" class="hidden" value="${item.text}">
        <button>X</button></li>`;         
    })
    list.innerHTML = li;
}

const checkKey = (event) => {
    if (event.keyCode == 13) addTask();
}

const checkAllTasks = (event) => {
    console.log(event)
    tasks.forEach((item)=> {
        item.isChecked = event.target.checked;
        console.log(item.isChecked);
    })
    render();    
}

const operateTask = (event) => {
 if (event.target.type == 'checkbox') {
    checkTask(event);
 } else if (event.target.type == 'submit') {
    deleteTask (event);
 } else {
    console.log(event);
    if(event.target.localName == 'span' && event.detail == '2'){
        event.target.classList.toggle('hidden'); 
        event.target.nextElementSibling.classList.toggle('hidden');
        // event.target.nextElementSibling.addEventListener('keydown', keyActions);
        // event.target.nextElementSibling.addEventListener('blur', blurAction);
    }
 }
}

const checkTask = (event) => {
    let task = tasks.find((item) => item.id === Number(event.target.parentNode.id));
    task.isChecked = !task.isChecked; 
    render ();
}

const deleteTask = (event) => {
    tasks = tasks.filter((item) => item.id !== Number(event.target.parentNode.id));
    render();
}

const deleteAllDone = () => {
    tasks = tasks.filter((item) => item.isChecked === false);
    render ();
}

buttonAdd.addEventListener('click', addTask);
inputAdd.addEventListener('keydown', checkKey);
checkAllBtn.addEventListener('click', checkAllTasks);
list.addEventListener('click', operateTask);
deleteAllCompleted.addEventListener('click', deleteAllDone);
