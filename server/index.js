const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');

const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors({ origin: 'https://localhost:3000', credentials: true }));
app.use(express.json());

app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// Error Handling
app.use(errorHandler);

// Charger les certificats SSL
const sslOptions = {
  key: fs.readFileSync('./certs/server.key'), // Clé privée
  cert: fs.readFileSync('./certs/server.crt'), // Certificat public
};

// Lancer le serveur HTTPS
const PORT = process.env.PORT;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Server running securely on https://localhost:${PORT}`);
});