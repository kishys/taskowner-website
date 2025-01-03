const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask(){
    if(inputBox.value === ''){
    }
    else{
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement("span")
        span.innerHTML = "\u00d7"
        li.appendChild(span);
    }
    inputBox.value = "";
    saveData();
}

listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        saveData();
    }
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveData();
    }
}, false);


function saveData(){
    localStorage.setItem("data",listContainer.innerHTML);
}

function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");
}
showTask();

const timeElement = document.getElementById("clock");


function showTaskDetails(task) {
    const detailsPanel = document.getElementById('task-details');
    const detailTitle = document.getElementById('detail-title');
    const detailTime = document.getElementById('detail-time');
    const detailDescription = document.getElementById('detail-description');

    detailTitle.textContent = task.dataset.title;
    detailTime.textContent = `${task.dataset.timeRange}`;
    detailDescription.textContent = task.dataset.description;
    
    detailsPanel.classList.remove('hidden');
}

function addTimelineTask() {
    const taskTitle = document.getElementById('task-name').value;
    const taskDescription = document.getElementById('task-description').value;
    const startHours = parseInt(document.getElementById('start-hours').value);
    const startMinutes = parseInt(document.getElementById('start-minutes').value);
    const durationHours = parseInt(document.getElementById('duration-hours').value) || 0;
    const durationMinutes = parseInt(document.getElementById('duration-minutes').value) || 0;
    
    if (!taskTitle || isNaN(startHours) || isNaN(startMinutes) || 
        (durationHours === 0 && durationMinutes === 0)) {
        alert('Please fill in all required fields');
        return;
    }

    if (startHours < 0 || startHours > 23 || startMinutes < 0 || startMinutes > 59) {
        alert('Please enter valid time values');
        return;
    }

    // Convert start time to minutes since midnight
    const startInMinutes = startHours * 60 + startMinutes;
    const duration = durationHours * 60 + durationMinutes;
    const endMinutes = startInMinutes + duration;

    if (endMinutes > 24 * 60) {
        alert('Task extends beyond 24 hours');
        return;
    }

    // Check for overlapping tasks
    const existingTasks = document.querySelectorAll('.timeline-task');
    for (let task of existingTasks) {
        const taskStart = parseInt(task.dataset.start);
        const taskEnd = parseInt(task.dataset.end);
        
        if ((startInMinutes >= taskStart && startInMinutes < taskEnd) ||
            (endMinutes > taskStart && endMinutes <= taskEnd) ||
            (startInMinutes <= taskStart && endMinutes >= taskEnd)) {
            alert('This time slot overlaps with an existing task!');
            return;
        }
    }

    // Create task element
    const timeline = document.querySelector('.timeline-track');
    const task = document.createElement('div');
    task.className = 'timeline-task';
    task.textContent = taskTitle;
    
    const timeRange = `${startHours}:${startMinutes.toString().padStart(2, '0')} - ${Math.floor(endMinutes/60)}:${(endMinutes%60).toString().padStart(2, '0')}`;
    
    // Store task data
    task.dataset.title = taskTitle;
    task.dataset.description = taskDescription;
    task.dataset.timeRange = timeRange;
    task.dataset.start = startInMinutes;
    task.dataset.end = endMinutes;
    
    // Position and height calculations
    const top = (startInMinutes / (24 * 60)) * 100;
    const height = (duration / (24 * 60)) * 100;
    
    task.style.top = top + '%';
    task.style.height = height + '%';

    // Add click event to show details
    task.addEventListener('click', () => showTaskDetails(task));

    timeline.appendChild(task);

    // Clear form
    document.getElementById('task-name').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('start-hours').value = '';
    document.getElementById('start-minutes').value = '';
    document.getElementById('duration-hours').value = '';
    document.getElementById('duration-minutes').value = '';
}


// Modify the existing addTask function
function addTask() {
    if(inputBox.value === '') {
        return;
    }
    
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    
    // Get selected priority
    const priority = document.getElementById('task-priority').value;
    li.setAttribute('data-priority', priority);
    
    listContainer.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
    
    inputBox.value = "";
    saveData();
}

// Add priority selector to the row div after the page loads
document.addEventListener('DOMContentLoaded', function() {
    const row = document.querySelector('.row');
    const priorityHTML = `
        <div class="priority-selector">
            <select id="task-priority">
                <option value="p1">P1 - Critical Priority</option>
                <option value="p2">P2 - High Priority</option>
                <option value="p3">P3 - Medium Priority</option>
                <option value="p4">P4 - Low Priority</option>
            </select>
        </div>
    `;
    row.insertAdjacentHTML('afterbegin', priorityHTML);
});