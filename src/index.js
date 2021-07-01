const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const httpLogger = require('http-logger');

const camelCaseReq = require('./middlewares/camelCaseReq');
const omitReq = require('./middlewares/omitReq');
const snakeCaseRes = require('./middlewares/snakeCaseRes');
const errorHandler = require('./middlewares/errorHandler');

require('dotenv').config();

const { PORT } = require('./configs');

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(httpLogger());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(camelCaseReq);
app.use(omitReq);
app.use(snakeCaseRes());
app.use(express.static(path.join(__dirname, '..', 'public')));

require('./routes')(app);
require('./services/init');

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Catch unhandled event
process.on('unhandledRejection', (reason) => {
  console.log('[Unhandled Rejection]', reason);
});

process.on('uncaughtException', (err) => {
  console.log('[Uncaught Exception]', err);
});
