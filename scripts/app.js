import { useState, Task } from "./myReact.js";

const storage = localStorage;
const [tasks, setTasks] = useState(JSON.parse(storage.getItem("tasks")) || []);

function startApp() {
    const inputTask = document.getElementById("newTask");

    inputTask.addEventListener("focusout", (ev) => {
        newTask(ev.target.value);
        ev.target.value = "";
    })

    if (tasks().length > 0) {
        tasks().map((task) => document.getElementById("toDoList").appendChild(newItemElement(task)));
    }
}

function newTask(userTask) {
    if (userTask.trim().length > 0) {
        const task = new Task(userTask);
        setTasks([...tasks(), task]); 
        saveData();
        document.querySelector("#toDoList").appendChild(newItemElement(task));
        console.log(tasks());
    }
}

function newItemElement(task) {
    const newItem = document.createElement('li');
    newItem.classList.add('task');
    newItem.appendChild(newCheckTask(task)); 
    newItem.appendChild(newFavoriteButton(task));
    newItem.appendChild(newSpanTask(task));
    newItem.appendChild(newDeleteButton(task));
    newItem.addEventListener("dblclick", (ev) => editTask(ev, task));

    return newItem;
}

function editTask(ev, task) {
    const itemElement = ev.currentTarget;
    const spanElement = itemElement.querySelector("span");
    const spanElementInitialText = spanElement.textContent;
    spanElement.contentEditable = true;
    spanElement.classList.add("editing-task");
    spanElement.focus();

    function finishEditTask(ev) {
    if (ev.type === "blur" || ev.code === "Enter") {
      spanElement.classList.remove("editing-task");
      spanElement.contentEditable = false;
      spanElement.blur();

      const newText = spanElement.textContent.trim();
      if (newText && newText !== task.task) {
        setTasks(tasks().map((t) =>
          t.id === task.id ? { ...t, task: newText } : t
        ));
        saveData();
      } else {
        spanElement.textContent = spanElementInitialText;
      }

      // Remove os listeners após edição
      spanElement.removeEventListener("keydown", finishEditTask);
      spanElement.removeEventListener("blur", finishEditTask);
    }
  }

  spanElement.addEventListener("keydown", finishEditTask);
  spanElement.addEventListener("blur", finishEditTask);
}

function newFavoriteButton(task) {
    const button = document.createElement("button");
    button.innerHTML = "&#9733;";
    button.classList.add("favorite-button");
    task.favorite ? button.classList.add("favorite-active") : null;
    button.setAttribute("data-id", task.id);
    button.setAttribute("type", "button");
    button.addEventListener("click", (ev) => favoriteTask(ev.target ,ev.target.dataset.id));

    return button;
}

function favoriteTask(element ,taskId) {
    setTasks(tasks().map((task) => {
        if (task.id === Number(taskId)) {
            task.favorite = !task.favorite;
        }

        return task;
    }))
    saveData();

    const buttonFavorite = element;
    buttonFavorite.classList.toggle("favorite-active");
}

function newCheckTask(task) {
    const checkBoxElement = document.createElement("input");
    checkBoxElement.setAttribute("type", "checkbox");
    checkBoxElement.setAttribute("id", task.id)
    checkBoxElement.setAttribute("data-id", task.id);
    task.done ? checkBoxElement.checked = true : null;
    checkBoxElement.addEventListener("change", taskDone);

    return checkBoxElement;
}

function newSpanTask(task) {
    const spanElement = document.createElement("span");
    task.done ? spanElement.classList.add("task-done") : null;
    spanElement.textContent = task.task;

    return spanElement;
}

function taskDone(ev) {
    const itemElement = ev.target.parentElement;
    const taskId = Number(ev.target.dataset.id);
    itemElement.querySelector("span").classList.toggle('task-done');
    setTasks(tasks().map((task) => {
        if (task.id === taskId) {
            task.done = !task.done;
        }

        return task;
    }))
    saveData();
}

function newDeleteButton(task) {
    const button = document.createElement("button");
    button.classList.add("delete-button");
    button.setAttribute("data-id", task.id);
    button.textContent = "x";
    button.addEventListener("click", (ev) => deleteTask(ev.target.parentElement, task.id));
    return button;
}

function deleteTask(taskElement, taskId) {
    setTasks(tasks().filter((task) => task.id !== Number(taskId)));
    saveData();
    console.log(tasks());
    taskElement.remove();
}

function saveData() {
    storage.setItem("tasks", JSON.stringify(tasks()));
}

startApp();