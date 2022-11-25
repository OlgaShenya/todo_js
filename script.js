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
        li += `<li id=${item.id}><input type="checkbox" ${checked}>${item.text}<button>X</button></li>`;         
    })
    list.innerHTML = li;
}

const checkKey = (event) => {
    if (event.keyCode == 13) addTask();
}

const checkAllTasks = (e) => {
    console.log(e)
    tasks.forEach((item)=> {
        item.isChecked = e.target.checked;
        console.log(item.isChecked);
    })
    render();    
}

const operateTask = (e) => {
 if (e.target.type == 'checkbox') {
    checkTask(e);
 } else if (e.target.type == 'submit') {
    deleteTask (e);
 } else {

 }
}

const checkTask = (e) => {
    let task = tasks.find((item) => item.id === Number(e.target.parentNode.id));
    task.isChecked = !task.isChecked; 
    render ();
}

const deleteTask = (e) => {
    console.log(e.target.parentNode.id);
    tasks = tasks.filter((item) => item.id !== Number(e.target.parentNode.id));
    render();
}

const deleteAllDone = (e) => {
    tasks = tasks.filter((item) => item.isChecked === false);
    render ();
}

buttonAdd.addEventListener('click', addTask);
inputAdd.addEventListener('keydown', checkKey);
checkAllBtn.addEventListener('click', checkAllTasks);
list.addEventListener('click', operateTask);
deleteAllCompleted.addEventListener('click', deleteAllDone);
