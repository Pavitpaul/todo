var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')):{
  todo: [],
  completed: []
};

// Available categories
var categories = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];
var currentFilter = 'all'; // Track current category filter

// Remove and complete icons in SVG format
var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

console.log('Script loaded successfully');

initializeCategoryFilters();
renderTodoList();

// Initialize category filter buttons
function initializeCategoryFilters() {
  var filterContainer = document.getElementById('category-filters');
  if (!filterContainer) return;

  // Add "All" filter
  var allBtn = document.createElement('button');
  allBtn.textContent = 'All';
  allBtn.classList.add('filter-btn', 'active');
  allBtn.addEventListener('click', function() {
    filterByCategory('all');
  });
  filterContainer.appendChild(allBtn);

  // Add category filters
  categories.forEach(function(category) {
    var btn = document.createElement('button');
    btn.textContent = category;
    btn.classList.add('filter-btn');
    btn.setAttribute('data-category', category);
    btn.addEventListener('click', function() {
      filterByCategory(category);
    });
    filterContainer.appendChild(btn);
  });
}

// Filter tasks by category
function filterByCategory(category) {
  currentFilter = category;
  
  // Update active filter button
  var filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(function(btn) {
    btn.classList.remove('active');
    if ((category === 'all' && btn.textContent === 'All') || 
        btn.getAttribute('data-category') === category) {
      btn.classList.add('active');
    }
  });

  // Show/hide tasks based on category
  var todoItems = document.querySelectorAll('#todo li');
  var completedItems = document.querySelectorAll('#completed li');
  
  var allItems = Array.prototype.slice.call(todoItems).concat(Array.prototype.slice.call(completedItems));
  
  allItems.forEach(function(item) {
    var categorySelect = item.querySelector('.category-select');
    if (!categorySelect) return;
    
    if (category === 'all' || categorySelect.value === category) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// User clicked on the add button
document.getElementById('add').addEventListener('click', function() {
  console.log('Add button clicked');
  var value = document.getElementById('item').value;
  var priorityEl = document.getElementById('priority');
  var dueDateEl = document.getElementById('dueDate');
  var categoryEl = document.getElementById('category');
  
  var priority = priorityEl ? priorityEl.value : 'medium';
  var dueDate = dueDateEl ? dueDateEl.value : '';
  var category = categoryEl ? categoryEl.value : 'Personal';
  
  console.log('Values:', value, priority, dueDate, category);
  
  if (value) {
    addItem(value, priority, dueDate, category);
  } else {
    console.log('No value entered');
  }
});

document.getElementById('item').addEventListener('keydown', function (e) {
  var value = this.value;
  var priorityEl = document.getElementById('priority');
  var dueDateEl = document.getElementById('dueDate');
  var categoryEl = document.getElementById('category');
  
  var priority = priorityEl ? priorityEl.value : 'medium';
  var dueDate = dueDateEl ? dueDateEl.value : '';
  var category = categoryEl ? categoryEl.value : 'Personal';
  
  if ((e.code === 'Enter' || e.code === 'NumpadEnter') && value) {
    addItem(value, priority, dueDate, category);
  }
});

function addItem (value, priority, dueDate, category) {
  console.log('addItem called with:', value, priority, dueDate, category);
  priority = priority || 'medium';
  category = category || 'Personal';
  
  var taskObj = {
    text: value,
    priority: priority,
    dueDate: dueDate || null,
    category: category
  };
  
  console.log('Creating task:', taskObj);
  
  addItemToDOM(taskObj);
  document.getElementById('item').value = '';
  var priorityEl = document.getElementById('priority');
  var dueDateEl = document.getElementById('dueDate');
  var categoryEl = document.getElementById('category');
  
  if (priorityEl) priorityEl.value = 'medium';
  if (dueDateEl) dueDateEl.value = '';
  if (categoryEl) categoryEl.value = 'Personal';

  data.todo.push(taskObj);
  dataObjectUpdated();
  console.log('Task added successfully');
}

function renderTodoList() {
  if (!data.todo.length && !data.completed.length) return;

  for (var i = 0; i < data.todo.length; i++) {
    var task = data.todo[i];
    // Handle old data format (strings) and convert to objects
    if (typeof task === 'string') {
      task = { text: task, priority: 'medium', dueDate: null, category: 'Personal' };
      data.todo[i] = task;
    } else {
      // Add missing properties to existing objects
      if (!task.hasOwnProperty('dueDate')) task.dueDate = null;
      if (!task.hasOwnProperty('category')) task.category = 'Personal';
      data.todo[i] = task;
    }
    addItemToDOM(task);
  }

  for (var j = 0; j < data.completed.length; j++) {
    var task = data.completed[j];
    // Handle old data format (strings) and convert to objects
    if (typeof task === 'string') {
      task = { text: task, priority: 'medium', dueDate: null, category: 'Personal' };
      data.completed[j] = task;
    } else {
      // Add missing properties to existing objects
      if (!task.hasOwnProperty('dueDate')) task.dueDate = null;
      if (!task.hasOwnProperty('category')) task.category = 'Personal';
      data.completed[j] = task;
    }
    addItemToDOM(task, true);
  }
  
  // Save converted data if any old format was found
  dataObjectUpdated();
}

function dataObjectUpdated() {
  localStorage.setItem('todoList', JSON.stringify(data));
  console.log('Data saved to localStorage:', data);
}

function removeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.querySelector('.task-text').innerText;

  if (id === 'todo') {
    data.todo = data.todo.filter(function(task) {
      return task.text !== value;
    });
  } else {
    data.completed = data.completed.filter(function(task) {
      return task.text !== value;
    });
  }
  dataObjectUpdated();

  parent.removeChild(item);
}

function completeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.querySelector('.task-text').innerText;

  if (id === 'todo') {
    var taskIndex = data.todo.findIndex(function(task) {
      return task.text === value;
    });
    if (taskIndex !== -1) {
      var task = data.todo[taskIndex];
      data.todo.splice(taskIndex, 1);
      data.completed.push(task);
    }
  } else {
    var taskIndex = data.completed.findIndex(function(task) {
      return task.text === value;
    });
    if (taskIndex !== -1) {
      var task = data.completed[taskIndex];
      data.completed.splice(taskIndex, 1);
      data.todo.push(task);
    }
  }
  dataObjectUpdated();

  var target = (id === 'todo') ? document.getElementById('completed'):document.getElementById('todo');

  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[0]);
}

function changePriority() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.querySelector('.task-text').innerText;
  var newPriority = this.value;

  var taskList = (id === 'todo') ? data.todo : data.completed;
  var taskIndex = taskList.findIndex(function(task) {
    return task.text === value;
  });
  
  if (taskIndex !== -1) {
    taskList[taskIndex].priority = newPriority;
    dataObjectUpdated();
  }

  item.classList.remove('priority-high', 'priority-medium', 'priority-low');
  item.classList.add('priority-' + newPriority);
}

function changeDueDate() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.querySelector('.task-text').innerText;
  var newDueDate = this.value;

  var taskList = (id === 'todo') ? data.todo : data.completed;
  var taskIndex = taskList.findIndex(function(task) {
    return task.text === value;
  });
  
  if (taskIndex !== -1) {
    taskList[taskIndex].dueDate = newDueDate || null;
    dataObjectUpdated();
  }

  updateOverdueStatus(item, newDueDate);
}

function changeCategory() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.querySelector('.task-text').innerText;
  var newCategory = this.value;

  var taskList = (id === 'todo') ? data.todo : data.completed;
  var taskIndex = taskList.findIndex(function(task) {
    return task.text === value;
  });
  
  if (taskIndex !== -1) {
    taskList[taskIndex].category = newCategory;
    dataObjectUpdated();
  }

  // Update category badge color
  var badge = item.querySelector('.category-badge');
  if (badge) {
    badge.className = 'category-badge category-' + newCategory.toLowerCase();
    badge.textContent = newCategory;
  }
}

function isOverdue(dueDate) {
  if (!dueDate) return false;
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

function updateOverdueStatus(item, dueDate) {
  if (isOverdue(dueDate)) {
    item.classList.add('overdue');
  } else {
    item.classList.remove('overdue');
  }
}

function addItemToDOM(taskObj, completed) {
  console.log('addItemToDOM called with:', taskObj);
  var list = (completed) ? document.getElementById('completed'):document.getElementById('todo');

  var item = document.createElement('li');
  item.classList.add('priority-' + taskObj.priority);
  
  if (isOverdue(taskObj.dueDate)) {
    item.classList.add('overdue');
  }

  var taskText = document.createElement('span');
  taskText.classList.add('task-text');
  taskText.innerText = taskObj.text;
  item.appendChild(taskText);

  // Create category badge
  var categoryBadge = document.createElement('span');
  categoryBadge.classList.add('category-badge', 'category-' + taskObj.category.toLowerCase());
  categoryBadge.textContent = taskObj.category;
  item.appendChild(categoryBadge);

  // Create task metadata container
  var taskMeta = document.createElement('div');
  taskMeta.classList.add('task-meta');

  // Create category dropdown
  var categorySelect = document.createElement('select');
  categorySelect.classList.add('category-select');
  var categoryOptions = '';
  categories.forEach(function(cat) {
    categoryOptions += '<option value="' + cat + '">' + cat + '</option>';
  });
  categorySelect.innerHTML = categoryOptions;
  categorySelect.value = taskObj.category;
  categorySelect.addEventListener('change', changeCategory);
  taskMeta.appendChild(categorySelect);

  // Create due date input
  var dueDateInput = document.createElement('input');
  dueDateInput.type = 'date';
  dueDateInput.classList.add('due-date-input');
  dueDateInput.value = taskObj.dueDate || '';
  dueDateInput.addEventListener('change', changeDueDate);
  taskMeta.appendChild(dueDateInput);

  // Create priority dropdown
  var prioritySelect = document.createElement('select');
  prioritySelect.classList.add('priority-select');
  prioritySelect.innerHTML = '<option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>';
  prioritySelect.value = taskObj.priority;
  prioritySelect.addEventListener('change', changePriority);
  taskMeta.appendChild(prioritySelect);

  item.appendChild(taskMeta);

  var buttons = document.createElement('div');
  buttons.classList.add('buttons');

  var remove = document.createElement('button');
  remove.classList.add('remove');
  remove.innerHTML = removeSVG;
  remove.addEventListener('click', removeItem);

  var complete = document.createElement('button');
  complete.classList.add('complete');
  complete.innerHTML = completeSVG;
  complete.addEventListener('click', completeItem);

  buttons.appendChild(remove);
  buttons.appendChild(complete);
  item.appendChild(buttons);

  list.insertBefore(item, list.childNodes[0]);
  console.log('Item added to DOM');
  
  // Apply current filter if active
  if (currentFilter !== 'all' && taskObj.category !== currentFilter) {
    item.style.display = 'none';
  }
}
