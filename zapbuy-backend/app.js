const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const userRoutes = require('./modules/user/routes/user.routes');
const productRoutes = require('./modules/product/routes/product.routes');
const cartRoutes = require('./modules/cart/routes/cart.routes');
const orderRoutes = require('./modules/order/routes/order.routes');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

dotenv.config();
// DB connection
connectDB();

// Route binding
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
