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
        span.innerHTML = "X"
        span.style.transition = "color 0.2s"; // Add transition for smooth color change
        span.addEventListener("mouseover", () => {
            span.style.color = "red";
        });
        span.addEventListener("mouseout", () => {
            span.style.color = ""; // Reset to default color
        });
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

    // Create close button if it doesn't exist
    if (!document.getElementById('close-task-details')) {
        const closeButton = document.createElement('button');
        closeButton.id = 'close-task-details';
        closeButton.innerHTML = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.right = '10px';
        closeButton.style.top = '10px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#666';
        closeButton.style.transition = "color 0.2s"; // Add transition for smooth color change
        
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.color = 'red';
        });
        
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.color = '#666';
        });
        
        closeButton.addEventListener('click', () => {
            const taskElement = document.querySelector(`.timeline-task[data-title="${task.dataset.title}"][data-time-range="${task.dataset.timeRange}"]`);
            if (taskElement) {
                taskElement.remove();
                saveTimelineData();
            }
            detailsPanel.classList.add('hidden');
        });
        
        detailsPanel.insertBefore(closeButton, detailsPanel.firstChild);
    }

    detailTitle.textContent = task.dataset.title;
    detailTime.textContent = `${task.dataset.timeRange}`;
    detailDescription.textContent = task.dataset.description;
    
    detailsPanel.classList.remove('hidden');
}

function saveTimelineData() {
    const timeline = document.querySelector('.timeline-track');
    localStorage.setItem("timelineData", timeline.innerHTML);
}

function loadTimelineData() {
    const timeline = document.querySelector('.timeline-track');
    const savedData = localStorage.getItem("timelineData");
    if (savedData) {
        timeline.innerHTML = savedData;
        // Reattach event listeners to loaded tasks
        const tasks = timeline.querySelectorAll('.timeline-task');
        tasks.forEach(task => {
            task.addEventListener('click', () => showTaskDetails(task));
        });
    }
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
    saveTimelineData(); // Save timeline data after adding new task

    // Clear form
    document.getElementById('task-name').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('start-hours').value = '';
    document.getElementById('start-minutes').value = '';
    document.getElementById('duration-hours').value = '';
    document.getElementById('duration-minutes').value = '';
}

// Load timeline data when page loads
document.addEventListener('DOMContentLoaded', loadTimelineData);

let landingHrs = document.getElementById("landing-hrs");
let landingMin = document.getElementById("landing-min");
let landingSec = document.getElementById("landing-sec");

setInterval(()=>{
    let currentTime = new Date();
    landingHrs.innerHTML = (currentTime.getHours()<10?"0":"") + currentTime.getHours();
    landingMin.innerHTML = (currentTime.getMinutes()<10?"0":"") + currentTime.getMinutes();
    landingSec.innerHTML = (currentTime.getSeconds()<10?"0":"") + currentTime.getSeconds();
},1000)

let hrs = document.getElementById("hrs");
let min = document.getElementById("min");
let sec = document.getElementById("sec");

setInterval(()=>{
    let currentTime = new Date();

    hrs.innerHTML = (currentTime.getHours()<10?"0":"") + currentTime.getHours();
    min.innerHTML = (currentTime.getMinutes()<10?"0":"") + currentTime.getMinutes();
    sec.innerHTML = (currentTime.getSeconds()<10?"0":"") + currentTime.getSeconds();

},1000)


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
    span.innerHTML = "X";
    span.style.transition = "color 0.2s"; // Add transition for smooth color change
    span.addEventListener("mouseover", () => {
        span.style.color = "red";
    });
    span.addEventListener("mouseout", () => {
        span.style.color = ""; // Reset to default color
    });
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
