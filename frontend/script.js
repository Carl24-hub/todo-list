const apiUrl = 'https://todo-flask-api-fh6q.onrender.com';

// Global variables for filtering and pagination
let allTasks = [];
let currentFilter = 'all';
let currentPage = 1;
const tasksPerPage = 3;

// Dynamic suggestions pool
const suggestionsPool = [
    { text: 'Complete project presentation', subtitle: 'Get ready for the meeting', icon: 'fas fa-presentation', color: 'text-blue-500' },
    { text: 'Review weekly goals', subtitle: 'Track your progress', icon: 'fas fa-target', color: 'text-green-500' },
    { text: 'Schedule team meeting', subtitle: 'Coordinate with colleagues', icon: 'fas fa-users', color: 'text-purple-500' },
    { text: 'Update project documentation', subtitle: 'Keep records current', icon: 'fas fa-file-alt', color: 'text-indigo-500' },
    { text: 'Review budget reports', subtitle: 'Financial planning', icon: 'fas fa-chart-line', color: 'text-green-600' },
    { text: 'Prepare client proposal', subtitle: 'Business development', icon: 'fas fa-handshake', color: 'text-blue-600' },
    { text: 'Organize workspace', subtitle: 'Boost productivity', icon: 'fas fa-tools', color: 'text-gray-600' },
    { text: 'Backup important files', subtitle: 'Data security', icon: 'fas fa-shield-alt', color: 'text-red-500' },
    { text: 'Plan next week agenda', subtitle: 'Strategic planning', icon: 'fas fa-calendar-alt', color: 'text-orange-500' },
    { text: 'Review performance metrics', subtitle: 'Analytics and insights', icon: 'fas fa-chart-bar', color: 'text-teal-500' },
    { text: 'Update professional skills', subtitle: 'Continuous learning', icon: 'fas fa-graduation-cap', color: 'text-purple-600' },
    { text: 'Network with industry peers', subtitle: 'Professional growth', icon: 'fas fa-network-wired', color: 'text-cyan-500' }
];

// Show loading state
function showLoading() {
    Swal.fire({
        title: 'Loading...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}

// Show success notification
function showSuccess(message, icon = 'success') {
    Swal.fire({
        icon: icon,
        title: 'Success!',
        text: message,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
    });
}

// Show error notification
function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
        confirmButtonColor: '#2d3748'
    });
}

// Show confirmation dialog
async function showConfirmation(title, text, icon = 'question') {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: '#2d3748',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!',
        cancelButtonText: 'Cancel'
    });
    return result.isConfirmed;
}

// Load random suggestions
function loadRandomSuggestions() {
    const shuffled = [...suggestionsPool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
    const container = document.getElementById('suggestionsContainer');
    container.innerHTML = '';
    
    selected.forEach(suggestion => {
        const card = document.createElement('div');
        card.className = 'suggestion-card p-3 rounded-lg cursor-pointer fade-in';
        card.onclick = () => addSuggestion(suggestion.text);
        
        card.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <i class="${suggestion.icon} ${suggestion.color} text-lg mb-1"></i>
                    <p class="text-gray-700 font-medium text-sm">${suggestion.text}</p>
                    <p class="text-gray-500 text-xs">${suggestion.subtitle}</p>
                </div>
                <i class="fas fa-plus text-gray-400 hover:text-gray-600 transition-colors text-sm"></i>
            </div>
        `;
        container.appendChild(card);
    });
}

// Refresh suggestions
function refreshSuggestions() {
    loadRandomSuggestions();
    showSuccess('Suggestions refreshed!', 'success');
}

// Add suggestion as task
async function addSuggestion(suggestionText) {
    // Check if task already exists
    const existingTask = allTasks.find(task => 
        task.text.toLowerCase().trim() === suggestionText.toLowerCase().trim()
    );
    
    if (existingTask) {
        Swal.fire({
            title: 'Task Already Exists!',
            text: `"${suggestionText}" is already in your todo list.`,
            icon: 'warning',
            confirmButtonText: 'Got it!',
            confirmButtonColor: '#2d3748',
            width: '400px'
        });
        return;
    }
    
    const input = document.getElementById('taskInput');
    input.value = suggestionText;
    await addTask();
}

// Filter tasks based on current filter
function getFilteredTasks() {
    switch (currentFilter) {
        case 'done':
            return allTasks.filter(task => task.done);
        case 'undone':
            return allTasks.filter(task => !task.done);
        default:
            return allTasks;
    }
}

// Set filter and update display
function setFilter(filter) {
    currentFilter = filter;
    currentPage = 1; // Reset to first page when changing filter
    
    // Update filter button states
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`filter-${filter}`).classList.add('active');
    
    // Update display
    updateTaskDisplay();
}

// Update task count display
function updateTaskCount() {
    const filteredTasks = getFilteredTasks();
    const totalTasks = allTasks.length;
    const doneTasks = allTasks.filter(task => task.done).length;
    const undoneTasks = allTasks.filter(task => !task.done).length;
    
    let countText = '';
    switch (currentFilter) {
        case 'done':
            countText = `Showing ${filteredTasks.length} completed task${filteredTasks.length !== 1 ? 's' : ''} (${doneTasks} of ${totalTasks} total)`;
            break;
        case 'undone':
            countText = `Showing ${filteredTasks.length} pending task${filteredTasks.length !== 1 ? 's' : ''} (${undoneTasks} of ${totalTasks} total)`;
            break;
        default:
            countText = `Showing ${filteredTasks.length} task${filteredTasks.length !== 1 ? 's' : ''} (${doneTasks} done, ${undoneTasks} pending)`;
    }
    
    document.getElementById('taskCount').textContent = countText;
}

// Generate pagination buttons
function generatePagination() {
    const filteredTasks = getFilteredTasks();
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    const container = document.getElementById('paginationContainer');
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" 
                class="pagination-btn px-3 py-2 rounded-lg text-gray-700 ${prevDisabled}"
                ${prevDisabled}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `
            <button onclick="changePage(${i})" 
                    class="pagination-btn px-3 py-2 rounded-lg text-gray-700 ${activeClass}">
                ${i}
            </button>
        `;
    }
    
    // Next button
    const nextDisabled = currentPage === totalPages ? 'disabled' : '';
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" 
                class="pagination-btn px-3 py-2 rounded-lg text-gray-700 ${nextDisabled}"
                ${nextDisabled}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    container.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const filteredTasks = getFilteredTasks();
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        updateTaskDisplay();
    }
}

// Update task display with filtering and pagination
function updateTaskDisplay() {
    const filteredTasks = getFilteredTasks();
    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    const tasksToShow = filteredTasks.slice(startIndex, endIndex);
    
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    if (filteredTasks.length === 0) {
        let emptyMessage = '';
        switch (currentFilter) {
            case 'done':
                emptyMessage = 'No completed tasks yet!';
                break;
            case 'undone':
                emptyMessage = 'No pending tasks!';
                break;
            default:
                emptyMessage = 'No tasks yet!';
        }
        
        list.innerHTML = `
            <div class="empty-state text-center py-8 rounded-xl fade-in">
                <i class="fas fa-clipboard-list text-4xl mb-4 text-gray-400"></i>
                <p class="text-lg text-gray-600 font-medium mb-2">${emptyMessage}</p>
                <p class="text-gray-500 text-sm">Add your first task to get started</p>
            </div>
        `;
    } else {
        tasksToShow.forEach((task, index) => {
            const li = document.createElement('div');
            li.className = `task-item glass-effect p-4 rounded-xl flex justify-between items-center ${task.done ? 'opacity-75' : ''}`;
            li.style.animationDelay = `${index * 0.1}s`;
            li.classList.add('fade-in');
            
            li.innerHTML = `
                <div class="flex items-center space-x-3 flex-1">
                    <div class="flex-shrink-0">
                        <div class="task-checkbox w-5 h-5 rounded-full border-2 ${task.done ? 'bg-green-500 border-green-500' : 'border-gray-300'} flex items-center justify-center cursor-pointer">
                            ${task.done ? '<i class="fas fa-check text-white text-xs"></i>' : ''}
                        </div>
                    </div>
                    <span class="text-gray-700 ${task.done ? 'line-through text-gray-500' : ''} flex-1 text-sm font-medium">
                        ${task.text}
                    </span>
                </div>
                <div class="flex space-x-2 ml-4">
                    <button onclick="editTask(${task.id}, '${task.text.replace(/'/g, "\\'")}')" 
                            class="btn-warning text-white p-2 rounded-lg"
                            title="Edit task">
                        <i class="fas fa-edit text-sm"></i>
                    </button>
                    <button onclick="markDone(${task.id})" 
                            class="btn-success text-white p-2 rounded-lg ${task.done ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${task.done ? 'disabled' : ''}
                            title="${task.done ? 'Already completed' : 'Mark as done'}">
                        <i class="fas fa-check text-sm"></i>
                    </button>
                    <button onclick="deleteTask(${task.id})" 
                            class="btn-danger text-white p-2 rounded-lg"
                            title="Delete task">
                        <i class="fas fa-trash text-sm"></i>
                    </button>
                </div>
            `;
            list.appendChild(li);
        });
    }
    
    updateTaskCount();
    generatePagination();
}

// Edit task functionality
async function editTask(id, currentText) {
    const { value: newText } = await Swal.fire({
        title: 'Edit Task',
        input: 'text',
        inputValue: currentText,
        inputPlaceholder: 'Enter new task text...',
        showCancelButton: true,
        confirmButtonColor: '#2d3748',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
            if (!value || value.trim() === '') {
                return 'Task text cannot be empty!';
            }
        }
    });

    if (newText && newText.trim() !== currentText) {
        try {
            const res = await fetch(`${apiUrl}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newText.trim() })
            });

            if (!res.ok) throw new Error('Failed to update task');

            showSuccess('Task updated successfully!', 'success');
            await fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
            showError('Failed to update task. Please try again.');
        }
    }
}

async function fetchTasks() {
    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        
        const response = await res.json();
        allTasks = response.data || response; // Store all tasks globally
        
        updateTaskDisplay();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        showError('Failed to load tasks. Please try again.');
    }
}

async function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (!text) {
        showError('Please enter a task description');
        input.focus();
        return;
    }

    try {
        showLoading();
        
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!res.ok) throw new Error('Failed to add task');

        Swal.close();
        showSuccess('Task added successfully!', 'success');
        
        input.value = '';
        await fetchTasks();
        
        // Reset to "All" filter and first page when adding new task
        setFilter('all');
    } catch (error) {
        console.error('Error adding task:', error);
        Swal.close();
        showError('Failed to add task. Please try again.');
    }
}

async function markDone(id) {
    try {
        const res = await fetch(`${apiUrl}/${id}`, { method: 'PUT' });
        
        if (!res.ok) throw new Error('Failed to mark task as done');

        showSuccess('Task completed! 🎉', 'success');
        await fetchTasks();
    } catch (error) {
        console.error('Error marking task as done:', error);
        showError('Failed to mark task as done. Please try again.');
    }
}

async function deleteTask(id) {
    const confirmed = await showConfirmation(
        'Delete Task?',
        'Are you sure you want to delete this task? This action cannot be undone.',
        'warning'
    );

    if (!confirmed) return;

    try {
        showLoading();
        
        const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        
        if (!res.ok) throw new Error('Failed to delete task');

        Swal.close();
        showSuccess('Task deleted successfully!', 'success');
        await fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        Swal.close();
        showError('Failed to delete task. Please try again.');
    }
}

// Handle Enter key in input
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('taskInput');
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Load initial suggestions
    loadRandomSuggestions();
});

// Initialize the app
window.onload = async function() {
    showLoading();
    await fetchTasks();
    Swal.close();
};
