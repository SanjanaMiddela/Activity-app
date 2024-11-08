const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import the path module

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://sanjanamiddela21:Sanjana%401119@cluster1.iwjjmtd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

// Define mongoose schema and model for activities
const activitySchema = new mongoose.Schema({
  title: String,
  deadline: Date,
  status: String,
});
const Activity = mongoose.model('Activity', activitySchema);

// API routes
// Get all activities
app.get('/api/activities', async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Error fetching activities' });
  }
});

// Add a new activity
app.post('/api/activities', async (req, res) => {
  try {
    const newActivity = new Activity(req.body);
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ error: 'Error adding activity' });
  }
});

// Update activity status
app.put('/api/activities/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updatedActivity);
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ error: 'Error updating activity' });
  }
});

// Serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
