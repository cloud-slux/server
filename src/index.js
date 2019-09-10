require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
// const { sequelize } = require('./modelsbi');
// const config = require('./config/config');
const cors = require('cors');

const app = express();


const server = require('http').Server(app);

// quando usar web socket desconmentar
const io = require('socket.io')(server);

// quando usar web socket desconmentar
app.use((req, res, next) => {
  req.io = io;

  return next();
});

mongoose.connect('mongodb://dbadmin:erp#123@ds163764.mlab.com:63764/erp', {
  useNewUrlParser: true
});

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());

app.use(express.json());
app.use(require('./routes'));

server.listen(process.env.PORT || 8081, () => {
  console.log(`Server started on port ${process.env.PORT || 8081}`);
});

// sequelize.sync().then(() => {
//   server.listen(process.env.PORT || 8081);
//   console.log(`Server started on port ${config.port || 8081}`);
// });
