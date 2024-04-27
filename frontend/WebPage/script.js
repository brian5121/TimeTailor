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
  

  document.getElementById('microphone-btn').addEventListener('click', function() {
    startDictation();
  });
  
  function startDictation() {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Sorry, your browser doesn't support speech recognition.");
      return;
    }
  
    let recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // Set to false for single-shot recognition
    recognition.interimResults = true; // We want results even if they are not final
    recognition.lang = 'en-US'; // Set the language of the recognition
  
    recognition.onstart = function() {
      document.getElementById('transcription').textContent = 'Listening...';
    };
  
    recognition.onresult = function(event) {
      let final_transcript = '';
      let interim_transcript = '';
    
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        // 判断当前识别的文字是否是最终结果
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      // 仅当最终结果确定时才更新显示的文字，临时结果会实时更新但不会追加到最终文字中
      document.getElementById('transcription').innerHTML = final_transcript;
      document.getElementById('transcription').innerHTML += '<i style="color:#ddd;">' + interim_transcript + '</i>';
    };
  
    recognition.onerror = function(event) {
      console.error('Speech recognition error', event.error);
    };
  
    recognition.start();
  }
  