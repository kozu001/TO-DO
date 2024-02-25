const taskInput = document.querySelector("input");
const taskAddButton = document.querySelector(".add-button");
const taskListHtml = document.querySelector(".todos");
const noTaskImage = document.querySelector(".empty-image");
let taskListJson = JSON.parse(localStorage.getItem("todos")) || [];
const removeAllButton = document.querySelector(".delete-all");
const taskFilters = document.querySelectorAll(".filter");
let currentFilter = '';

displayTasks();

function generateTaskHtml(task, index) {
  if (currentFilter && currentFilter != task.status) {
    return '';
  }
  let isChecked = task.status == "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="toggleStatus(this)" type="checkbox" ${isChecked}>
        <span class="${isChecked}">${task.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="deleteTask(this)"><i class="fa fa-times"></i></button>
    </li>
  `; 
}

function displayTasks() {
  if (taskListJson.length == 0) {
    taskListHtml.innerHTML = '';
    noTaskImage.style.display = 'block';
  } else {
    taskListHtml.innerHTML = taskListJson.map(generateTaskHtml).join('');
    noTaskImage.style.display = 'none';
  }
}

function addTask(task)  {
  taskInput.value = "";
  taskListJson.unshift({ name: task, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(taskListJson));
  displayTasks();
}

taskInput.addEventListener("keyup", e => {
  let task = taskInput.value.trim();
  if (!task || e.key != "Enter") {
    return;
  }
  addTask(task);
});

taskAddButton.addEventListener("click", () => {
  let task = taskInput.value.trim();
  if (!task) {
    return;
  }
  addTask(task);
});

function toggleStatus(task) {
  let taskName = task.parentElement.lastElementChild;
  if (task.checked) {
    taskName.classList.add("checked");
    taskListJson[task.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    taskListJson[task.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(taskListJson));
}

function deleteTask(task) {
  const index = task.dataset.index;
  taskListJson.splice(index, 1);
  displayTasks();
  localStorage.setItem("todos", JSON.stringify(taskListJson));
}

taskFilters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      currentFilter = '';
    } else {
      taskFilters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      currentFilter = e.target.dataset.filter;
    }
    displayTasks();
  });
});

removeAllButton.addEventListener("click", () => {
  taskListJson = [];
  localStorage.setItem("todos", JSON.stringify(taskListJson));
  displayTasks();
});
