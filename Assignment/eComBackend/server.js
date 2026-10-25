require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const productsRoutes = require('./routes/productsRoutes');
const cartRoutes = require('./routes/cartRoutes');
const comboRoutes = require('./routes/comboRoutes');
const orderRoutes = require('./routes/orderRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { sessionId } = require('./middleware/session');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { uploadsDir } = require('./middleware/uploadPicture');
const { seedDatabase } = require('./scripts/seed');

const app = express();
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function corsOrigin() {
  const raw = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  if (raw.trim() === '*') return true;
  const list = raw.split(',').map((item) => item.trim()).filter(Boolean);
  return list.length === 1 ? list[0] : list;
}

app.use(express.json());
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    createParentPath: true,
  })
);
app.use(
  cors({
    origin: corsOrigin(),
    exposedHeaders: ['x-session-id'],
  })
);
app.use(sessionId);
app.use('/uploads', express.static(uploadsDir));
app.use('/api/products', productsRoutes);
app.use('/api/combos', comboRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);
app.get('/api/health', (req, res) => res.json({ ok: true }));

const frontendDist = path.join(__dirname, '..', 'eComFrontend', 'dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4380;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerceStore';

async function connectWithRetry() {
  let lastError;
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB successfully');
      return;
    } catch (err) {
      lastError = err;
      console.error(`MongoDB connect attempt ${attempt}/20 failed: ${err.message}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  throw lastError;
}

async function start() {
  await connectWithRetry();
  if (process.env.SEED_ON_START === 'true') {
    await seedDatabase({ reset: false });
  }
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`server is running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});
