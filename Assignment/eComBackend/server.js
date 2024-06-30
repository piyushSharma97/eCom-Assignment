const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const productsRoutes = require('./routes/productsRoutes')
const cartRoutes = require('./routes/cartRoutes')
const comboRoutes=require('./routes/comboRoutes')

const app = express()
app.use(express.json())
app.use(cors())
mongoose.connect('mongodb://0.0.0.0:27017/ecommerceStore');
// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// Bind connection to open event (to get notification of a successful connection)
db.once('open', function() {
  console.log('Connected to MongoDB successfully');
});
//qMUUWZ2bhYdnJKst
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/products', productsRoutes);
app.use('/api/combos', comboRoutes);
app.use('/api/cart', cartRoutes);
const PORT = process.env.port||4380;

app.listen(PORT,()=>{
  console.log(`server is running on port ${PORT}`)
})



//mongodb+srv://piyush2107:qMUUWZ2bhYdnJKst@cluster0.9l44xip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0