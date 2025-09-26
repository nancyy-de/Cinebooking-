const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const authRoutes = require('./src/routes/auth');
const movieRoutes = require('./src/routes/movies');
const showRoutes = require('./src/routes/shows');
const bookingRoutes = require('./src/routes/bookings');
const paymentRoutes = require('./src/routes/payments');

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
const adminRoutes = require('./src/routes/admin');
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cinebook')
  .then(()=> {
    app.listen(PORT, ()=> console.log('Backend running on', PORT));
  })
  .catch(err=> { console.error(err); process.exit(1); });
