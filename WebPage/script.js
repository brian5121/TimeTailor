document.addEventListener('DOMContentLoaded', (event) => {
    let currentDate = new Date();
  
    // Load initial schedule
    loadSchedule(currentDate);
  
    document.getElementById('prev-day').addEventListener('click', function() {
      currentDate.setDate(currentDate.getDate() - 1);
      loadSchedule(currentDate);
    });
  
    document.getElementById('next-day').addEventListener('click', function() {
      currentDate.setDate(currentDate.getDate() + 1);
      loadSchedule(currentDate);
    });
  });
  
  function loadSchedule(date) {
    // Placeholder for loading schedule data
    document.getElementById('date-display').innerText = date.toDateString();
    document.getElementById('schedule-board').innerHTML = ''; // Clear the board
  
    // Here you would actually load schedule data for the given date
    // For now, let's create some dummy blocks
    for (let i = 0; i < 5; i++) {
      let block = document.createElement('div');
      block.className = 'editable-block';
      block.contentEditable = true;
      block.innerText = 'Edit me...';
      document.getElementById('schedule-board').appendChild(block);
    }
  }
  