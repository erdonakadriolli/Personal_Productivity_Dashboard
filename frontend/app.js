const API_URL = '/api/tasks';
let allTasksData = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    setupNavigation();
    
    // Add Task Form Listener
    document.getElementById('add-task-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('task-title');
        const descInput = document.getElementById('task-desc');
        
        await addTask(titleInput.value, descInput.value);
        
        titleInput.value = '';
        descInput.value = '';
    });

    // Filter Buttons Listener
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            e.target.classList.add('active');
            
            currentFilter = e.target.getAttribute('data-filter');
            renderFullTasksList();
        });
    });

    // Delete All Button Listener
    document.getElementById('btn-delete-all').addEventListener('click', async () => {
        if(confirm('Are you absolutely sure you want to delete ALL tasks? This cannot be undone.')){
            try {
                const response = await fetch(API_URL, {
                    method: 'DELETE'
                });
                if(response.ok) {
                    showToast('All tasks have been deleted', 'success');
                    fetchTasks();
                } else {
                    showToast('Failed to delete tasks', 'error');
                }
            } catch (error) {
                showToast('Error deleting tasks', 'error');
            }
        }
    });
});

// Setup sidebar navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-links li');
    const views = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // prevent anchor default
            
            // Highlight active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show target view
            const targetId = item.getAttribute('data-target');
            views.forEach(view => {
                if(view.id === targetId) {
                    view.classList.remove('hidden');
                } else {
                    view.classList.add('hidden');
                }
            });

            // Re-render specifics if entering a new view
            if(targetId === 'view-tasks') {
                renderFullTasksList();
            } else if(targetId === 'view-analytics') {
                updateAnalyticsView();
            }
        });
    });
}

async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        allTasksData = await response.json();
        
        // Update all views
        renderDashboardTasks();
        renderFullTasksList();
        updateStats();
        updateAnalyticsView();
    } catch (error) {
        showToast('Error fetching tasks', 'error');
        console.error('Error:', error);
    }
}

async function addTask(title, description) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, completed: false })
        });
        
        if (response.ok) {
            showToast('Task added successfully!');
            fetchTasks();
        } else {
            throw new Error('Failed to add task');
        }
    } catch (error) {
        showToast('Error adding task', 'error');
        console.error('Error:', error);
    }
}

async function toggleTaskComplete(id, currentStatus) {
    try {
        const task = allTasksData.find(t => t.id === id);
        
        const updateResponse = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: task.title, 
                description: task.description, 
                completed: !currentStatus 
            })
        });
        
        if (updateResponse.ok) {
            fetchTasks();
        }
    } catch (error) {
        showToast('Error updating task', 'error');
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Task deleted!');
            fetchTasks();
        }
    } catch (error) {
        showToast('Error deleting task', 'error');
    }
}

// Render Dashboard View (shows only recent or all but constrained container)
function renderDashboardTasks() {
    const container = document.getElementById('dashboard-tasks-container');
    container.innerHTML = '';
    
    if (allTasksData.length === 0) {
        container.innerHTML = '<p class="loading-spinner">No tasks yet. Create one!</p>';
        return;
    }
    
    let sorted = [...allTasksData].sort((a, b) => {
        if (a.completed === b.completed) return b.id - a.id;
        return a.completed ? 1 : -1;
    });

    // Show up to 10 on dashboard for brevity
    sorted.slice(0, 10).forEach(task => appendTaskElement(container, task));
    
    if (sorted.length > 10) {
        const moreDiv = document.createElement('div');
        moreDiv.style.textAlign = 'center';
        moreDiv.style.marginTop = '10px';
        moreDiv.innerHTML = `<p style="color: var(--text-muted); cursor: pointer;" onclick="document.querySelector('[data-target=\\'view-tasks\\']').click()">View ${sorted.length - 10} more tasks in My Tasks</p>`;
        container.appendChild(moreDiv);
    }
}

// Render Full Tasks View with Filtering
function renderFullTasksList() {
    const container = document.getElementById('full-tasks-container');
    if(!container) return; // if element doesn't exist yet

    container.innerHTML = '';
    
    let filtered = [...allTasksData];
    if (currentFilter === 'pending') {
        filtered = filtered.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    }

    if (filtered.length === 0) {
        let msg = currentFilter === 'all' ? 'No tasks exist.' : `No ${currentFilter} tasks.`;
        container.innerHTML = `<p class="loading-spinner">${msg}</p>`;
        return;
    }
    
    filtered.sort((a, b) => b.id - a.id).forEach(task => appendTaskElement(container, task));
}

// Helper: Append Task to a given container
function appendTaskElement(container, task) {
    const div = document.createElement('div');
    div.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    div.innerHTML = `
        <div class="task-content">
            <h4 class="task-title">${escapeHTML(task.title)}</h4>
            ${task.description ? `<p>${escapeHTML(task.description)}</p>` : ''}
        </div>
        <div class="task-actions">
            <button class="icon-btn complete" onclick="toggleTaskComplete(${task.id}, ${task.completed})" title="Mark as ${task.completed ? 'Pending' : 'Completed'}">
                <i class="fa-solid ${task.completed ? 'fa-rotate-left' : 'fa-check'}"></i>
            </button>
            <button class="icon-btn delete" onclick="deleteTask(${task.id})" title="Delete Task">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    container.appendChild(div);
}

// Update Dashboard Counters
function updateStats() {
    const total = allTasksData.length;
    const completed = allTasksData.filter(t => t.completed).length;
    const pending = total - completed;
    
    animateValue(document.getElementById('stat-total'), parseInt(document.getElementById('stat-total').innerText) || 0, total, 500);
    animateValue(document.getElementById('stat-completed'), parseInt(document.getElementById('stat-completed').innerText) || 0, completed, 500);
    animateValue(document.getElementById('stat-pending'), parseInt(document.getElementById('stat-pending').innerText) || 0, pending, 500);
}

// Update Analytics View Details
function updateAnalyticsView() {
    const total = allTasksData.length;
    const completed = allTasksData.filter(t => t.completed).length;
    const pending = total - completed;
    
    let completionRate = 0;
    if (total > 0) completionRate = Math.round((completed / total) * 100);

    // Update Text Metrics
    document.getElementById('metric-total').innerText = total;
    document.getElementById('metric-completed').innerText = completed;
    document.getElementById('metric-pending').innerText = pending;

    // Animate Circle Chart
    const circleLabel = document.getElementById('completion-percentage');
    animateValue(circleLabel, parseInt(circleLabel.innerText) || 0, completionRate, 800, '%');
    
    const chart = document.getElementById('completion-chart');
    if(chart) {
        chart.style.background = `conic-gradient(var(--success) ${completionRate}%, rgba(255,255,255,0.05) ${completionRate}%)`;
    }

    // Animate Progress Bar
    const progressBar = document.getElementById('analytics-progress-bar');
    if(progressBar) {
        progressBar.style.width = `${completionRate}%`;
    }
}

// Utility: HTML Escape
function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}

// Utility: Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> ${message}`;
    if (type === 'error') {
        toast.style.borderLeft = '4px solid var(--danger)';
    } else {
        toast.style.borderLeft = '4px solid var(--success)';
    }
    
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Utility: Number Counter Animation
function animateValue(obj, start, end, duration, append = '') {
    if(!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + append;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
