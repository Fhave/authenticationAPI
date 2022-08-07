const express = require ('express');
const connectDB = require('./db');
const dotenv = require('dotenv').config();
const routes = require('./routes/user')
const { PORT } = process.env;

connectDB();

const app = express();

const { seedAdmin } = require('./seeders/admin');
console.log(seedAdmin());

const { seedManager } = require('./seeders/manager');
console.log(seedManager());

const { seedStaff } = require('./seeders/staff');
console.log(seedStaff());

app.use(express.json({extended: false}));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({msg: 'ffffffff'})
});

app.use('/', routes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(port))