const express = require('express');
const dotenv = require('dotenv');
const config = dotenv.config({
  path: './config/config.env'
});

const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
const AWS = require('aws-sdk');
const cors = require('cors');
const bodyParser = require('body-parser');
const requestIp = require('request-ip');
const expressip = require('express-ip');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/dbConnect');
const http = require('http');

const mongoSanitizer = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');

//--------------------------------

// Connect to MongoDB database

connectDB();

const customer = require('./routes/customer');
const vendor = require('./routes/vendor');

const app = express();

app.use(express.json({'limit': '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(mongoSanitizer());
app.use(helmet());
app.use(xss());
app.use(requestIp.mw());
app.use(expressip().getIpInfoMiddleware);
app.use(cors());
app.use(express.static('public'));
app.use(fileUpload({
  limits: {
    fileSize: 50 * 1024 * 1024
  }
}))

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use('/api/customer', customer);
app.use('/api/vendor', vendor);

app.use(errorHandler);

app.get('/', async (req, res, next) => {
  res.status(200).send('Welcome to the Email Broker api');
});
//
const expressSwagger = require('express-swagger-generator')(app);

let options = {
  swaggerDefinition: {
    info: {
      description: 'Email Broker API server',
      title: 'Email Broker',
      version: '1.0.0',
    },
    host: 'localhost:4200',
    basePath: '/api',
    produces: [
      "application/json",
      // "application/xml"
    ],
    schemes: [
      'http',
      // 'https'
    ],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'userToken',
        description: "",
      }
    }
  },
  basedir: __dirname, //app absolute path
  files: ['./Controllers/*.js'] //Path to the API handle folder
};
expressSwagger(options);


const port = process.env.PORT || 80;

http.createServer(app).listen(port,
  function() {
    console.log(
      `App running in ${process.env.NODE_ENV} mode on port ${port}`.blue.bold
    );
  });

process.on('unhandledRejection', (err, promise) => {
  console.log(`UnhandledRejection: ${err.message}`.red.bold);
  // Close App
  if (process.env.NODE_ENV !== 'production') {
    //server.close(() => process.exit(1));
  }
});
