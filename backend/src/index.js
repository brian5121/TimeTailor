const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const eventRoutes = require('./routes/eventRoutes');
const path = require('path');

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.static(path.join(__dirname, '../../frontend'))); // Serve static files from the frontend folder
// app.use('/', eventRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


