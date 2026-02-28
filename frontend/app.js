const API_URL = "http://localhost:3000/todos";

// --- State ---
let todos = [];
let currentFilter = "all";

// --- DOM Elements ---
const createForm = document.getElementById("create-form");
const inputTitle = document.getElementById("input-title");
const inputDescription = document.getElementById("input-description");
const todoListEl = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const loadingEl = document.getElementById("loading");
const toastEl = document.getElementById("toast");
const todoCountEl = document.getElementById("todo-count");

const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-form");
const editIdInput = document.getElementById("edit-id");
const editTitleInput = document.getElementById("edit-title");
const editDescriptionInput = document.getElementById("edit-description");
const cancelEditBtn = document.getElementById("cancel-edit");

// --- API Helpers ---
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || `Request failed (${res.status})`);
  }

  if (res.status === 204) return null;
  return res.json();
}

async function fetchTodos() {
  return apiFetch(API_URL);
}

async function createTodo(data) {
  return apiFetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function updateTodo(id, data) {
  return apiFetch(`${API_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

async function deleteTodo(id) {
  return apiFetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}

// --- Rendering ---
function getFilteredTodos() {
  if (currentFilter === "active") return todos.filter((t) => !t.isCompleted);
  if (currentFilter === "completed") return todos.filter((t) => t.isCompleted);
  return todos;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderTodos() {
  const filtered = getFilteredTodos();

  loadingEl.classList.add("hidden");

  if (filtered.length === 0) {
    todoListEl.innerHTML = "";
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    todoListEl.innerHTML = filtered.map((todo) => todoItemHTML(todo)).join("");
    attachTodoListeners();
  }

  // Update count
  const active = todos.filter((t) => !t.isCompleted).length;
  todoCountEl.textContent = `${active} item${active !== 1 ? "s" : ""} left`;
}

function todoItemHTML(todo) {
  const completedClass = todo.isCompleted ? "completed" : "";
  const description = todo.description
    ? `<div class="todo-description">${escapeHTML(todo.description)}</div>`
    : "";

  return `
    <li class="todo-item ${completedClass}" data-id="${todo.id}">
      <label class="todo-checkbox">
        <input type="checkbox" ${todo.isCompleted ? "checked" : ""} data-action="toggle" />
        <span class="checkmark"></span>
      </label>
      <div class="todo-content">
        <div class="todo-title">${escapeHTML(todo.title)}</div>
        ${description}
        <div class="todo-meta">Created ${formatDate(todo.createdAt)}</div>
      </div>
      <div class="todo-actions">
        <button class="btn-icon edit" data-action="edit" title="Edit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn-icon delete" data-action="delete" title="Delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </div>
    </li>
  `;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// --- Event Listeners ---
function attachTodoListeners() {
  todoListEl.querySelectorAll("[data-action]").forEach((el) => {
    const item = el.closest(".todo-item");
    const id = item.dataset.id;
    const action = el.dataset.action;

    if (action === "toggle") {
      el.addEventListener("change", () => handleToggle(id, el.checked));
    } else if (action === "edit") {
      el.addEventListener("click", () => openEditModal(id));
    } else if (action === "delete") {
      el.addEventListener("click", () => handleDelete(id));
    }
  });
}

// Filter buttons
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

// Create form
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = inputTitle.value.trim();
  const description = inputDescription.value.trim();

  if (!title) return;

  try {
    const data = { title };
    if (description) data.description = description;
    const newTodo = await createTodo(data);
    todos.unshift(newTodo);
    renderTodos();
    createForm.reset();
    inputTitle.focus();
    showToast("Todo added");
  } catch (err) {
    showToast(err.message, true);
  }
});

// --- Handlers ---
async function handleToggle(id, isCompleted) {
  try {
    const updated = await updateTodo(id, { isCompleted });
    todos = todos.map((t) => (t.id === id ? updated : t));
    renderTodos();
  } catch (err) {
    showToast(err.message, true);
    renderTodos(); // revert checkbox visually
  }
}

async function handleDelete(id) {
  try {
    await deleteTodo(id);
    todos = todos.filter((t) => t.id !== id);
    renderTodos();
    showToast("Todo deleted");
  } catch (err) {
    showToast(err.message, true);
  }
}

// --- Edit Modal ---
function openEditModal(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  editIdInput.value = todo.id;
  editTitleInput.value = todo.title;
  editDescriptionInput.value = todo.description || "";
  editModal.classList.remove("hidden");
  editTitleInput.focus();
}

function closeEditModal() {
  editModal.classList.add("hidden");
}

cancelEditBtn.addEventListener("click", closeEditModal);

editModal.querySelector(".modal-backdrop").addEventListener("click", closeEditModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !editModal.classList.contains("hidden")) {
    closeEditModal();
  }
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = editIdInput.value;
  const title = editTitleInput.value.trim();
  const description = editDescriptionInput.value.trim();

  if (!title) return;

  try {
    const updated = await updateTodo(id, { title, description });
    todos = todos.map((t) => (t.id === id ? updated : t));
    renderTodos();
    closeEditModal();
    showToast("Todo updated");
  } catch (err) {
    showToast(err.message, true);
  }
});

// --- Toast ---
let toastTimer;
function showToast(message, isError = false) {
  clearTimeout(toastTimer);
  toastEl.textContent = message;
  toastEl.className = `toast ${isError ? "error" : ""}`;
  toastTimer = setTimeout(() => {
    toastEl.classList.add("hidden");
  }, 2500);
}

// --- Init ---
async function init() {
  try {
    todos = await fetchTodos();
    renderTodos();
  } catch (err) {
    loadingEl.textContent = "Failed to load todos. Is the server running?";
    showToast(err.message, true);
  }
}

init();
