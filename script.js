// 1. Selecionar Elementos do HTML
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate'); // Novo
const taskTime = document.getElementById('taskTime'); // Novo
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage'); // Novo

// 2. FUNÇÕES DE PERSISTÊNCIA
function getTasks() {
    // Agora as tarefas são objetos, então o parse é importante
    const tasks = localStorage.getItem('tasks');
    // Se não houver nada, retorna uma lista vazia
    return tasks ? JSON.parse(tasks) : [];
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 3. FUNÇÕES DE MANIPULAÇÃO DO DOM E LEMBRETE

function createTaskElement(task, taskIndex) {
    const listItem = document.createElement('li');
    
    // Formatação da data e hora para exibição
    let dateTimeText = '';
    
    // Verifica se a data e hora foram preenchidas
    if (task.date) {
        // Converte o formato 'AAAA-MM-DD' para 'DD/MM/AAAA'
        const [year, month, day] = task.date.split('-');
        dateTimeText += ` | Data: ${day}/${month}/${year}`;
    }
    if (task.time) {
        dateTimeText += ` | Hora: ${task.time}`;
    }

    // Adiciona uma classe de lembrete se a data/hora for no futuro
    if (task.date && task.time) {
        const taskDateTime = new Date(`${task.date}T${task.time}`);
        if (taskDateTime > new Date()) {
            dateTimeText += ' (Lembrete ativo)';
        }
    }


    listItem.innerHTML = `
        <div>
            <strong>${task.content}</strong>
            <small style="display: block; color: #666;">${dateTimeText}</small>
        </div>
        <button class="delete-btn" data-index="${taskIndex}">X</button>
    `;
    return listItem;
}

function renderTasks() {
    taskList.innerHTML = ''; 
    const tasks = getTasks();
    
    if (tasks.length === 0) {
        // Se a lista estiver vazia, mostra a mensagem e oculta a lista.
        emptyMessage.textContent = 'Nenhuma tarefa adicionada. Comece a planejar seu dia!';
        taskList.style.display = 'none';
    } else {
        // Se houver tarefas, oculta a mensagem e mostra a lista.
        emptyMessage.textContent = '';
        taskList.style.display = 'block';

        tasks.forEach((task, index) => {
            const listItem = createTaskElement(task, index);
            taskList.appendChild(listItem);
        });
    }
}

// 4. FUNÇÕES DE LÓGICA DO APP

function addTask() {
    const content = taskInput.value.trim();
    const date = taskDate.value;
    const time = taskTime.value;

    if (content === '') {
        alert('Por favor, digite o conteúdo da tarefa!');
        return;
    }

    const newTask = {
        content: content,
        date: date,
        time: time
    };

    const tasks = getTasks();
    tasks.push(newTask); // Adiciona o objeto da nova tarefa
    saveTasks(tasks);     

    // Limpa os campos após adicionar
    taskInput.value = '';
    taskDate.value = '';
    taskTime.value = '';

    renderTasks();        
}

function deleteTask(index) {
    let tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
}


// 5. EVENT LISTENERS
addTaskBtn.addEventListener('click', addTask);

taskList.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.getAttribute('data-index');
        deleteTask(parseInt(index));
    }
});


// 6. INICIALIZAÇÃO
renderTasks();