const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressJWT = require('express-jwt');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const morgan = require('morgan');
const config = require('./config/config');
const apiRouter  = require('./config/apiRoutes');
const webRouter  = require('./config/webRoutes');

const app = express();

mongoose.connect(config.databaseURL, console.log(`DB is connected: ${config.databaseURL}`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(`${__dirname}/public`));
app.use(morgan('dev'));

app.use('/api', expressJWT({ secret: config.secret })
  .unless({
    path: [
      { url: '/api/register', methods: ['POST'] },
      { url: '/api/login',    methods: ['POST'] }
    ]
  }));
app.use(jwtErrorHandler);
function jwtErrorHandler(err, req, res, next){
  if (err.name !== 'UnauthorizedError') return next();
  return res.status(401).json({ message: 'Unauthorized request.' });
}

app.use('/', webRouter);
app.use('/api', apiRouter);

app.listen(config.port, console.log(`App has started on port: ${config.port}`));
