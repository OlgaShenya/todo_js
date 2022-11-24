const inputAdd = document.getElementById('inputAdd');
const buttonAdd = document.getElementById('buttonAdd');
const list = document.querySelector('ul');

let tasks = [];



const addTask = () => {
    let task = {
        id: Date.now(),
        text: inputAdd.value,
        isChecked: false,
    }
    tasks.push(task);    
    inputAdd.value = '';
    showTask();
};

const showTask = () => {
    let li = '';
    tasks.forEach((item) => {
        li += `<li><input type="checkbox">${item.text}</li>`;
        list.innerHTML = li; 

    })
}


const checkKey = (event) => {
    if (event.keyCode == 13) addTask();
}

buttonAdd.addEventListener('click', addTask);
inputAdd.addEventListener('keydown', checkKey);