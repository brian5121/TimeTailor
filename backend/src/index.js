const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const eventRoutes = require('./routes/eventRoutes');  // Import event routes

app.use(cors());
app.use(express.json());  // Middleware to parse JSON bodies
app.use(express.text());  // Middleware to parse raw text as text

app.use('/api/events', eventRoutes);  // Use event routes for event-related API calls

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
