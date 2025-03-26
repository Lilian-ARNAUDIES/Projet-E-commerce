const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');

const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
// const adminImagesRouter = require('./routes/adminImages');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/auth');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.get('/', (req, res) => {
  res.send('API is running and reachable via Cloudflare Tunnel');
});
// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use(fileUpload({
  createParentPath: true,
}));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
// app.use('/admin', adminImagesRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

app.use('/api', authRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error Handling
app.use(errorHandler);


// Lancer le serveur HTTPS
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running securely on ${process.env.SERVER_URL}:${PORT}`);
});
