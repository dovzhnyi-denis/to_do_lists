const mysql = require("mysql"),
  bcrypt = require("bcrypt");

const saltRounds = 10;
const pool = mysql.createPool({
  connectionLimit: 3,
  host: "bsisi1zyljeinyiuwh3y-mysql.services.clever-cloud.com",
  port: 3306,
  user: "uo98b4nxwmrwrsgj",
  password: "D5yjwLdtKaOlWMyPAVyq",
  database: "bsisi1zyljeinyiuwh3y"
});

function errHandler(cb) {
  return (err, result) => {
    try {
      cb(err, result);
    } catch (err) {
      console.log(err);
    }
  };
}

function initUsers() {
  pool.query("SELECT * FROM users", (err, res) => { 
    if (err) {
      if (err.code === "ER_NO_SUCH_TABLE") {
        const users = "CREATE TABLE users (id BIGINT(15), name VARCHAR(20), password VARCHAR(255))";
        pool.query(users, (err, res) => {
          if (err) throw err;
//          console.log("table users(id, name, password) created");
        });
      } else throw err;
    }
  });
}

function initProjects(){
  pool.query("SELECT * FROM projects", (err, res) => {
    if (err) {
      if (err.code === "ER_NO_SUCH_TABLE") {
        const projects = "CREATE TABLE projects (id BIGINT(15), name VARCHAR(20))";
        pool.query(projects, (err, res) => {
          if (err) throw err;
//          console.log("table projects(id, name) created");
        });
      } else throw err;
    }
  });
}

function initTasks(){
  pool.query("SELECT * FROM tasks", (err, res) => {
    if (err) {
      if (err.code === "ER_NO_SUCH_TABLE") {
        const tasks = "CREATE TABLE tasks (id BIGINT(15), name VARCHAR(20), status VARCHAR(20), project_id BIGINT(15))";
        pool.query(tasks, (err, res) => {
          if (err) throw err;
//          console.log("table tasks(id, name, status, project_id) created");
        });
      } else throw err;
    }
  });
}

function insertUser(name, pass, srvRes, session){
  let id = new Date().getTime();
  session.id = id;

  bcrypt.hash(pass, saltRounds, (err, hash) => {
    const sql = `INSERT INTO users (id, name, password) VALUES ("${id}", "${name}", "${hash}")`;
    pool.query(sql, (err, res) => {
      if (err) throw err;
      srvRes.status(201).json({message: "User created"});
    });
  });
}

exports.db = {
  init(){
      errHandler(initUsers());
      errHandler(initProjects());
      errHandler(initTasks());
  },

  signUp(user, srvRes, session) {
    try {
      if (!user) throw new Error("signUp: user is undefined!");

      const { name, pass } = user;
      
      pool.query("SELECT name FROM users", (err, res) => {
        if (err) throw err;
        // if user name is unique create new entry in the database
        if (!res.find(q => q.name === name)) {
          insertUser(name, pass, srvRes, session);
        } else {
          srvRes.status(409).json({message: "User already exist."});
        }
      });
      
    } catch(err) {
      console.log(err);
      srvRes.status(500).json({error: "internal server error"});
    }
  },

  signIn(user, srvRes, session){
    try {
      if (!user) throw new Error("signin: user is undefined!");

      const { name, pass } = user;
      const sql = `SELECT id, name, password FROM users`;

      pool.query(sql, (err, res) => {
        if (err) throw err;
        
        const userExists = res.find(u =>
          u.name === name
        );
        let auth = {message: "User does not exist"},
          s = 401;

        if (userExists) {
          bcrypt.compare(pass, userExists.password, errHandler((err, result) => {
            if (err) throw err;

            if (result) {
              auth = {message: "Signed in"};
              s = 200;
              // create session
              session.userId = userExists.id;
            } else auth = {message: "Incorrect password"};
          
          srvRes.status(s).json(auth);
          }));
        }
      });

    } catch (err) {
      console.log(err);
      srvRes.status(500).json({error: "internal server error"});
    }
  }
};
