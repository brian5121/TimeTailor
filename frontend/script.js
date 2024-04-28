function sendMessage() {
  const chatOutput = document.getElementById('chatOutput');
  const scheduleChat = document.querySelector('.schedule-chat');
  const chatInput = document.getElementById('chatInput');
  
  if (chatInput.value.trim() !== '') {
      // Add to chat output
      const newChatMessage = document.createElement('div');
      newChatMessage.textContent = 'You: ' + chatInput.value;
      chatOutput.appendChild(newChatMessage);

      // Add to schedule
      const newScheduleItem = document.createElement('div');
      newScheduleItem.classList.add('message');
      newScheduleItem.textContent = chatInput.value; // For simplicity, using the same text as the chat
      scheduleChat.appendChild(newScheduleItem);

      // Scroll to the latest message
      chatOutput.scrollTop = chatOutput.scrollHeight;

      // Clear the input
      chatInput.value = '';
  }
}
// You can enhance this with real-time chat features using WebSockets or similar technology
document.addEventListener('DOMContentLoaded', () => {
  const dateSpan = document.querySelector('.date');
  let currentDate = new Date(); // This will store the current displayed date

  // Function to format the date as "Month day, year"
  function formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
  }

  // Function to update the date in the date span
  function updateDateDisplay() {
      dateSpan.textContent = formatDate(currentDate);
  }

  // Initial display of the current date
  updateDateDisplay();

  // Event listeners for the buttons
  document.querySelector('.prev').addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() - 1); // Decrement the date by one day
      updateDateDisplay();
  });

  document.querySelector('.next').addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() + 1); // Increment the date by one day
      updateDateDisplay();
  });
});

function convertTo24HourFormat(time12h) {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
      hours = '00';
  }
  if (modifier === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
  }
  return `${hours.padStart(2, '0')}:${minutes}`;
}
function addTimeBlock(startTime, endTime, blockContent) {
  // Define the color palette array
  const colorPalette = ['C4DFDF', 'D2E9E9', 'AAD7D9', '9BB8CD', 'D2E0FB'];

  // Select a random color from the palette
  const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];

  // Find the container element for the start time
  var startElement = document.querySelector(`.time-slot[data-time="${startTime}"]`);

  // Find the container element for the end time
  var endElement = document.querySelector(`.time-slot[data-time="${endTime}"]`);

  // Create the new block element
  var newBlock = document.createElement('div');
  newBlock.className = 'time-block';
  newBlock.textContent = blockContent;

  // Calculate the height of the block. Assuming 60px height for each .time-slot
  var startTimeIndex = Array.from(startElement.parentNode.children).indexOf(startElement);
  var endTimeIndex = Array.from(endElement.parentNode.children).indexOf(endElement);
  var blockHeight = (endTimeIndex - startTimeIndex) * 60; // This assumes 60px height per hour.

  // Set the style of the new block element
  newBlock.style.position = 'absolute';
  newBlock.style.width = '100%';
  newBlock.style.height = `${blockHeight}px`;
  newBlock.style.top = `${startElement.offsetTop}px`; // Position at the top of the start element
  newBlock.style.left = '0';
  newBlock.style.backgroundColor = `#${randomColor}`; // Set the random background color

  // Append the new block to the schedule container
  startElement.parentNode.appendChild(newBlock);
}


// Function to handle sending messages or scheduling events
function sendMessage() {
  // Retrieve message input
  const chatInput = document.getElementById('chatInput').value;
  
  // You would have additional logic here to decide if the input is for adding an event
  // For this example, let's say we simply add an event if there is a time in the message
  if (chatInput.includes('9 AM')) { // Example condition, this should be more robust
      addTimeBlock('9 AM', '11 AM', chatInput);
  }

  // Clear the input after sending the message
  document.getElementById('chatInput').value = '';
}

// You may also want to attach the sendMessage function to the 'Send' button via an event listener
document.querySelector('.chat-send').addEventListener('click', sendMessage);







// Example usage
addTimeBlock('9 AM', '11 AM', 'Meeting with Team');
addTimeBlock('1 PM', '3 PM', 'CS 231n Lecture');