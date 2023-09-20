const express = require('express');
require('dotenv').config();
const cors = require('cors');
const logger = require('./utils/logger');
const connectDB = require('./utils/connectDB');
const route = require('./routes');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));
app.use(cors());
route(app);
connectDB();

app.listen(port, () => {
  logger.info(`App listen at ${port}`);
});
