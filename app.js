const { config } = require("./config"),
  express = require("express"),
  bodyParser = require("body-parser"),
  errors = require("./middleware/errors"),
  Sentry = require("@sentry/node"),
  mysql = require("mysql"),
  session = require("express-session"),
  { db } = require("./db"),
  mySQLStore = require("express-mysql-session")(session);

const app = express();

const options = {
  host: "bsisi1zyljeinyiuwh3y-mysql.services.clever-cloud.com",
  port: 3306,
  user: "uo98b4nxwmrwrsgj",
  password: "D5yjwLdtKaOlWMyPAVyq",
  database: "bsisi1zyljeinyiuwh3y"
};

const sessionStore = new mySQLStore(options);

// init and use sentry error tracking
Sentry.init({dsn: "https://3177ea0d38994477a7b76f72d7c44d4b@o396108.ingest.sentry.io/5260616"});

app.use(Sentry.Handlers.requestHandler());

app.use(session({
  key: "session_cookie",
  secret: "very_secret",
  store: sessionStore,
  resave: true,
  saveUninitialized: false
}));

// initialize database
db.init();

// serve static assets
app.use("/static", express.static("public"));
// parse bodies of incoming requestst
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// routes
const routes = require("./routes"); 

app.use(routes);

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
