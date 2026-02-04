const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
// require('dotenv').config();

const { testConnection } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { seedData } = require('./scripts/seedData');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const likeRoutes = require('./routes/likes');
const favoriteRoutes = require('./routes/favorites');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const boxRoutes = require('./routes/boxes');
const contactRoutes = require('./routes/contact');
const reportRoutes = require('./routes/reports');
const bannerRoutes = require('./routes/banners');

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/boxes', boxRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/banners', bannerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود'
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection with retry logic
    const MAX_RETRIES = 10;
    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        await testConnection();
        console.log('✅ Database connected successfully');
        break;
      } catch (err) {
        retries++;
        console.log(`⏳ Database not ready yet... retrying (${retries}/${MAX_RETRIES})`);
        await new Promise(res => setTimeout(res, 5000));
      }
    }
    if (retries === MAX_RETRIES) throw new Error('Database connection timeout');

    // Seed data if AUTO_SEED is enabled
    if (process.env.AUTO_SEED === 'true') {
      console.log('\n🌱 Auto-seeding enabled...');
      try {
        await seedData();
      } catch (error) {
        console.log('ℹ️  Seeding skipped (data may already exist)');
      }
    }

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
