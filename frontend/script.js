

const API_URL = "http://localhost:5000/api/tasks";

// Form & UI elements
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const statusSelect = document.getElementById("status");

const submitBtn = taskForm.querySelector("button");

// Used to track whether we are editing a task or creating a new one
let editingTaskId = null;




// Load tasks when page loads
window.onload = fetchTasks;


// FETCH & DISPLAY TASKS

async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();

  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    // Apply completed styling if task is completed
    li.className = `task ${task.status === "completed" ? "completed" : ""}`;

    li.innerHTML = `
      <strong>${task.title}</strong>
      <p>${task.description}</p>
      <small>Status: ${task.status}</small>

      <div class="actions">
        <button class="btn-update"
          onclick="startEditTask(
            '${task._id}',
            '${task.title}',
            '${task.description}',
            '${task.status}'
          )">
          Update
        </button>

        <button class="btn-status"
          onclick="toggleStatus('${task._id}', '${task.status}')">
          ${task.status === "pending" ? "Mark as Completed" : "Mark as Pending"}
        </button>

        <button class="btn-delete"
          onclick="deleteTask('${task._id}')">
          Delete
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });
}


// CREATE & UPDATE TASK

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const taskData = {
    title: titleInput.value,
    description: descriptionInput.value,
    status: statusSelect.value
  };

  // If editingTaskId exists → UPDATE
  if (editingTaskId) {
    await fetch(`${API_URL}/${editingTaskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData)
    });
  }
  // Else → CREATE
  else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData)
    });
  }

  // Reset form back to add mode
  taskForm.reset();
  editingTaskId = null;
  submitBtn.textContent = "Add Task";

  fetchTasks();
});


// EDIT TASK (FORM PREFILL)

function startEditTask(id, title, description, status) {
  titleInput.value = title;
  descriptionInput.value = description;
  statusSelect.value = status;

  editingTaskId = id;
  submitBtn.textContent = "Update Task";
}

// Update TASK STATUS

async function toggleStatus(id, currentStatus) {
  const newStatus =
    currentStatus === "pending" ? "completed" : "pending";

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus })
  });

  fetchTasks();
}



// DELETE TASK
 

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  fetchTasks();
}
