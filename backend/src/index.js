import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import apartmentRoutes from './routes/apartmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import imageRoutes from './routes/imageRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

app.use(express.json());

app.use('/api/v1/apartments', apartmentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/images', imageRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Apartment Rental API is running',
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('=================================');
    console.log('✅ Connected to MongoDB');
    console.log('📦 Database:', mongoose.connection.name);

    const count = await mongoose.connection.db
      .collection('apartments')
      .countDocuments();

    console.log('📊 Apartments:', count);
    console.log('=================================');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });