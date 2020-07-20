const { config } = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const errors = require('./midware/errors');
const Sentry = require('@sentry/node');
const path = require('path');
const app = express();

// init and use sentry error tracking
Sentry.init({dsn: 'https://3177ea0d38994477a7b76f72d7c44d4b@o396108.ingest.sentry.io/5260616'});

app.use(Sentry.Handlers.requestHandler());

// serve static assets
app.use('/static', express.static('public'));
// setup view engine
//app.set('view engine', 'ejs');
// parse incoming requestst
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// routes
const mainRoutes = require('./routes'); 

app.use(mainRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

// error handling
app.use(Sentry.Handlers.errorHandler());

app.use(errors.notFound);
app.use(errors.catchEmAll);

// use process.env.PORT as port if defined
let port;
if (typeof process.env.PORT !== "undefined" && process.env.PORT !== null) {
    port = process.env.PORT;
} else port = config.port;

app.listen(port, console.log(`Server listens at port ${port}`));
