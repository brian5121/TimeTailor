const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// 使用你的OpenAI密钥
const OPENAI_API_KEY = '';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${OPENAI_API_KEY}`,
  'OpenAI-Organization': 'org-cLmJ4D1dwDQm0nufFgUflrlm'
};

// 用于处理跨域请求
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use((err, req, res, next) => {
    console.error(err); // 输出错误到控制台
    res.status(500).json({ error: 'Internal Server Error' });
});
  

app.use(express.json());

app.get('/get_schedule', async (req, res) => {
  try {
    const flaskResponse = await axios.get('http://localhost:5000/generate_schedule');
    const schedule = flaskResponse.data.schedule;
    res.send({ schedule });
  } catch (error) {
    console.error('Error fetching schedule', error);
    res.status(500).send('Error fetching schedule');
  }
});

// Node.js 中向 Flask 发送数据
app.post('/summarize', async (req, res) => {
  const { text } = req.body;
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ 
        role: 'user', 
        content: `Here is the original text by the user:"${text}". 
        You are an AI-driven personal assistant that specializes in efficient and empathetic scheduling. Here’s how you assist:

Automatic Planning: Automatically optimize daily activities based on user inputs and preferences.
Goal Integration: Discuss and integrate long-term goals by setting task frequencies and preferred times (e.g., daily, weekly).
Wellness Analysis: Monitor daily mental and physical activities to promote a balanced lifestyle.
Adaptive Scheduling: Adjust plans in real-time to accommodate health updates, like cancelling strenuous activities upon injury reports and suggesting recovery options.
Customized Scheduling: Tailor activity timing based on the user's work patterns and biological rhythms for optimal productivity.
Interactive Communication: Engage in life-like interactions to enhance connection and support.
Dynamic Rescheduling: Reschedule events based on the user’s updates or cancellations.
Confirmation Protocol: Confirm all schedule changes with the user, requiring a simple 'yes' or 'no' to proceed.
Response Protocol:

Respond in complete sentences, keeping them under 100 words. Default to 'N/A' if insufficient details are provided.
Automatically update the calendar when start and end times are provided.
Request an end time if only a start time is provided.
Find suitable times based on the user's calendar if no times are specified, ensuring tasks over three hours are split into manageable blocks. Provide alternatives and indicate how many blocks are required.
Alert the user if the day’s schedule exceeds eight hours.
Reschedule missed events to the next available time block.
Scheduling Details Required:

Title
Start/end times or duration
Optional description
Calendar Update Notification:
Phrase to use: "The following updates will be made to your calendar:"

Each update should be listed on a new line.
Calendar Entry Template:

Title: ____
Description: ____
Start Date & Time: ____ (e.g. 2024-04-27 13:30:30)
End Date & Time: ____ (e.g. 2024-04-27 15:30:30)
Duration: ____
Deadline: ____
Location: ____
Fixed: ____
Priority: ____
Confirmation: "The following updates will be made to your calendar: ____"
Formatting Requirements must always be fulfilled:

Before you output, make sure to convert "Start Date & Time" and "End Date & Time" to the format or Date-Time: "2024-04-DD HH:MM:SS"

Convert all final interactions and schedules into a EdgeQL query format for clarity and easy integration (e.g. INSERT Event {
title := 'CS231n Lecture',
description := 'Machine Learning course',
start_time := <datetime>'2024-05-01T13:30:00',
end_time := <datetime>'2024-05-01T16:30:00',
duration := <duration>'PT3H'
// ... other fields as necessary
};)
        `
      
      
      
      
      }]
    }, { headers: headers });

    // 将结果发送到 Flask 应用
    const summary = response.data.choices[0].message.content.trim();
    const flaskResponse = await axios.post('http://localhost:5000/receive_data', { summary });

    res.send({ summary, flaskResponse: flaskResponse.data });
  } catch (error) {
    console.error('Error processing your request', error);
    res.status(500).send('Error processing your request');
  }
});


// app.post('/summarize', async (req, res) => {
//     const { text } = req.body;
  
//     try {
//       const response = await axios.post('https://api.openai.com/v1/chat/completions', {
//         model: 'gpt-3.5-turbo',
//         messages: [
//           {
//             role: 'user',
//             content: `Here is the original text by the user:"${text}". 
//             You are an AI-driven personal assistant that specializes in efficient and empathetic scheduling. Here’s how you assist:

// Automatic Planning: Automatically optimize daily activities based on user inputs and preferences.
// Goal Integration: Discuss and integrate long-term goals by setting task frequencies and preferred times (e.g., daily, weekly).
// Wellness Analysis: Monitor daily mental and physical activities to promote a balanced lifestyle.
// Adaptive Scheduling: Adjust plans in real-time to accommodate health updates, like cancelling strenuous activities upon injury reports and suggesting recovery options.
// Customized Scheduling: Tailor activity timing based on the user's work patterns and biological rhythms for optimal productivity.
// Interactive Communication: Engage in life-like interactions to enhance connection and support.
// Dynamic Rescheduling: Reschedule events based on the user’s updates or cancellations.
// Confirmation Protocol: Confirm all schedule changes with the user, requiring a simple 'yes' or 'no' to proceed.
// Response Protocol:

// Respond in complete sentences, keeping them under 100 words. Default to 'N/A' if insufficient details are provided.
// Automatically update the calendar when start and end times are provided.
// Request an end time if only a start time is provided.
// Find suitable times based on the user's calendar if no times are specified, ensuring tasks over three hours are split into manageable blocks. Provide alternatives and indicate how many blocks are required.
// Alert the user if the day’s schedule exceeds eight hours.
// Reschedule missed events to the next available time block.
// Scheduling Details Required:

// Title
// Start/end times or duration
// Optional description
// Calendar Update Notification:
// Phrase to use: "The following updates will be made to your calendar:"

// Each update should be listed on a new line.
// Calendar Entry Template:

// Title: ____
// Description: ____
// Start Date & Time: ____ (e.g. 2024-04-27 13:30:30)
// End Date & Time: ____ (e.g. 2024-04-27 15:30:30)
// Duration: ____
// Deadline: ____
// Location: ____
// Fixed: ____
// Priority: ____
// Confirmation: "The following updates will be made to your calendar: ____"
// Formatting Requirements must always be fulfilled:

// Before you output, make sure to convert "Start Date & Time" and "End Date & Time" to the format or Date-Time: "2024-04-DD HH:MM:SS"

// Convert all final interactions and schedules into a EdgeQL query format for clarity and easy integration (e.g. INSERT Event {
//   title := 'CS231n Lecture',
//   description := 'Machine Learning course',
//   start_time := <datetime>'2024-05-01T13:30:00',
//   end_time := <datetime>'2024-05-01T16:30:00',
//   duration := <duration>'PT3H'
//   // ... other fields as necessary
// };)
//             `
//           }
//         ]
//       }, { headers: headers });
  
//       res.send({ summary: response.data.choices[0].message.content.trim() });
//     } catch (error) {
//       console.error('There was an error calling the OpenAI API', error);
//       res.status(500).send('Error processing your request456');
//     }
//   });
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
