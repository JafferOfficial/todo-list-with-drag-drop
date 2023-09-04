const taskList = document.getElementById('taskList');
const newTaskInput = document.getElementById('new-task');
let draggedItem;

function createTaskElement(taskText) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task-container');
    taskElement.setAttribute('draggable', true);

    taskElement.addEventListener('dragstart', (event) => {
        draggedItem = event.target;
        event.dataTransfer.setData("text/plain", "");
    });

    taskElement.addEventListener('dragover', (event) => {
        event.preventDefault();
        const afterElement = getDragAfterElement(taskList, event.clientY);
        if (afterElement == null) {
            taskList.appendChild(draggedItem);
        } else {
            taskList.insertBefore(draggedItem, afterElement);
        }
    });

    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.id = 'myCheckbox';

    const label = document.createElement('label');
    label.setAttribute('for', 'myCheckbox');
    label.classList.add('task');
    label.innerHTML = taskText;
    label.addEventListener('click', () => {
        taskElement.classList.toggle('complete');
    });

    taskElement.appendChild(checkbox);
    taskElement.appendChild(label);

    return taskElement;
}

newTaskInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && newTaskInput.value.trim() !== '') {
        const taskText = newTaskInput.value.trim();
        const taskElement = createTaskElement(taskText);
        taskList.appendChild(taskElement);
        newTaskInput.value = '';
    }
});

function getDragAfterElement(container, y) {
    const dragElements = [...container.querySelectorAll(".task-container:not(.dragging)")];
    return dragElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}