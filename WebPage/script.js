let currentWeekStart = new Date(new Date().setDate(new Date().getDate() - new Date().getDay()));

function updateWeekLabel() {
    const weekLabel = document.getElementById('weekLabel');
    weekLabel.textContent = `Week of ${currentWeekStart.toDateString()}`;
}

function createCalendar(weekStart) {
    const calendarElement = document.getElementById('calendar');
    calendarElement.innerHTML = ''; // Clear previous calendar

    for (let i = 0; i < 6; i++) { // Only 6 days for a 2x3 layout
        const day = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i);
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.innerHTML = `<strong>${day.getDate()}</strong>/${day.getMonth()+1}<div class="task"><input type="text" placeholder="Add task..."></div>`;

        if (day.toDateString() === new Date().toDateString()) {
            dayElement.classList.add('today');
        }

        calendarElement.appendChild(dayElement);
    }
}

function adjustWeek(days) {
    currentWeekStart.setDate(currentWeekStart.getDate() + days);
    createCalendar(currentWeekStart);
}

document.getElementById('prevWeek').addEventListener('click', function() {
    adjustWeek(-7);
});

document.getElementById('nextWeek').addEventListener('click', function() {
    adjustWeek(7);
});

window.onload = function() {
    updateWeekLabel();
    createCalendar(currentWeekStart); // Start with the current week
}

// comment
