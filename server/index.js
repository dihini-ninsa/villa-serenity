const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const requiredEnvs = ['MONGO_URI', 'PORT', 'JWT_SECRET'];
const missingEnvs = requiredEnvs.filter((key) => !process.env[key]);
if (missingEnvs.length) {
  console.error(`Missing required env vars: ${missingEnvs.join(', ')}`);
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/rooms',    require('./routes/rooms'));
app.use('/api/bookings', require('./routes/bookings'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error(err));