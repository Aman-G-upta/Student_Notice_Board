require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const collegeRoutes = require('./routes/collegeRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const commentRoutes = require('./routes/commentRoutes');

const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
// app.use(cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true
// }));
app.use(helmet());
app.use(express.json({ limit: '100kb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/comments', commentRoutes);

// Error handling
app.use('/api', notFound);
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;

// Database + Server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  });