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
        });
      } else throw err;
    }
  });
}

function initLists(){
  pool.query("SELECT * FROM todo_lists", (err, res) => {
    if (err) {
      if (err.code === "ER_NO_SUCH_TABLE") {
        const todo_lists = "CREATE TABLE todo_lists (id BIGINT(15), name VARCHAR(80), user_id BIGINT(15))";
        pool.query(todo_lists, (err, res) => {
          if (err) throw err;
        });
      } else throw err;
    }
  });
}

function initTasks(){
  pool.query("SELECT * FROM tasks", (err, res) => {
    if (err) {
      if (err.code === "ER_NO_SUCH_TABLE") {
        const tasks = "CREATE TABLE tasks (id BIGINT(15), name VARCHAR(255), status INT(1), todo_list_id BIGINT(15), priority BIGINT(2))";
        pool.query(tasks, (err, res) => {
          if (err) throw err;
        });
      } else throw err;
    }
  });
}

function insertUser(name, pass, srvRes, session){
  let id = new Date().getTime();
  session.userId = id;

  bcrypt.hash(pass, saltRounds, (err, hash) => {
    const sql = `INSERT INTO users (id, name, password) VALUES ("${id}", "${name}", "${hash}")`;
    pool.query(sql, (err, res) => {
      if (err) throw err;
      srvRes.status(201).json({message: "User created"});
    });
  });
}

function validUserId(userId, srvRes, cb) {
  pool.query("SELECT id FROM users", (err, res) => {
    if (err) throw err;

    const matchedId = res.find(q => q.id === userId);

    if (matchedId) {
      cb();
    } else {
      srvRes.status(401).json({});
    }
  });
}

exports.db = {
  init(){
      errHandler(initUsers());
      errHandler(initLists());
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
      srvRes.status(500).json({message: "database error"});
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
      srvRes.status(500).json({message: "database error"});
    }
  },

  profile(userId, srvRes){
    try {
      validUserId(userId, srvRes, () => { 
        const sql = `SELECT id, name FROM todo_lists WHERE user_id = '${userId}'`;

        pool.query(sql, (err, res) => {
          if (err) throw err;

          srvRes.status(200).json(res)
        });
      });

    } catch(err) {
      if (err.message === "unauthorized") {
        srvRes.status(401).json({message: err.message});
      } else srvRes.status(500).json({message: "database error"});
    }
  },

  insertList(listData, srvRes) {
    try {
      const { name, id, userId } = listData;      
      const sql = `INSERT INTO todo_lists (id, name, user_id) VALUES ('${id}', '${name}', '${userId}')`;

      pool.query(sql, (err, res) => {
        if (err) throw err;
        srvRes.status(201).json({});
      })
    } catch (err) {
      srvRes.status(500).json(err);
    }
  },

  updateListName(userId, listData, srvRes) {
    try {
      validUserId(userId, srvRes, () => {
        const { id,
          name
        } = listData;
        const sql = `UPDATE todo_lists SET name = '${name}' WHERE id = '${id}'`;

        pool.query(sql, (err, res) => {
          if (err) throw err;

          srvRes.status(200).json({});
        });
      });
    } catch (err) {
        console.log(err);
        srvRes.status(500).json({message: "database error"});
    }
  },

  removeList(userId, listData, srvRes) {
    try {
      validUserId(userId, srvRes, () => {
        const sql = `DELETE FROM todo_lists where id = '${listData.id}'`;

        pool.query(sql, (err, res) => {
          if (err) throw err;

          srvRes.status(200).json({});
        });
      });
    } catch (err) {
        console.log(err);
        srvRes.status(500).json({message: "database error"});
    }
  },

  insertTask(userId, taskData, srvRes) {
    try {
      validUserId(userId, srvRes, () => {
        const { id,
          name,
          todo_list_id,
          priority,
          status
        } = taskData;
        const sql = `INSERT INTO tasks (id, name, status, todo_list_id, priority) VALUES ('${id}', '${name}', '${status}', '${todo_list_id}', '${priority}')`;
  
        pool.query(sql, (err, res) => {
          if (err) throw err;
          srvRes.status(201).json({message: "task inserted"});
        });
      });
    } catch (err) {
      console.log(err)
      srvRes.status(500).json({message: "database error"});
    }
  },

  getTasks(userId, listId, srvRes) {
    try {
      validUserId(userId, srvRes, () => {
        const sql = `SELECT id, name, priority FROM tasks where todo_list_id = '${listId}'`;

        pool.query(sql, (err, res) => {
          if (err) throw err;

          srvRes.status(200).json(res);
        });
      });
    } catch (err) {
      console.log(err);
      srvRes.status(500).json({message: "database error"});
    }
  },

  updTask(userId, taskData, srvRes) {
    try {
      validUserId(userId, srvRes, () => {
        const { id,
          name,
          priority
        } = taskData;
        const sql = `UPDATE tasks SET name = '${name}', priority = '${priority}' WHERE id = '${id}'`;

        pool.query(sql, (err, res) => {
          if (err) throw err;

          srvRes.status(200).json({message: "task name updated"});
        });
      });
    } catch (err) {
      console.log(err);
      srvRes.status(500).json({message: "database error"});
    }
  },

  remTask(userId, taskData, srvRes) {
    try {
      validUserId(userId, srvRes, () => {
        const { id } = taskData;
        const sql = `DELETE FROM tasks WHERE id = '${id}'`;

        pool.query(sql, (err, res) => {
          if (err) throw err;

          srvRes.status(200).json({message: "task entry removed"});
        });
      });
    } catch (err) {
      console.log(err);
      srvRes.status(500).json({message: "database error"});
    }
  }
};
