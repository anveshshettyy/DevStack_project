const { connectDB } = require('./lib/db');
const path = require('path');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');
const Category = require('./models/category');
const Projects = require('./models/projects');
const authRoutes = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');


require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());


app.get('/api', (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.use('/api/auth', authRoutes);



//-------------RUN SERVER--------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});


// async function insert() {
//   await User.create({
//     username: "anvesh86",
//     name: "Anvesh Shetty",
//     email: "anvesh@email.com",
//     password: "23$@##2#$@34293333dsnfs",
//   });
// }

// insert();



//---------PRODUCTION----------
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}
