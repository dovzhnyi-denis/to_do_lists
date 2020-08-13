const chai = require("chai"),
  chaiHttp = require("chai-http"),
  { expect } = require("chai");

chai.use(chaiHttp);

const app = "http://localhost:3000";
const agent = chai.request.agent(app);
// return random utf8 symbol code 
function utf8SymCodes() {
  return Math.floor(Math.random() * 10175) + 21;
}
// helper function to generate random strings of desired length
function rndStr(ln) {
  let str = '';
  while (str.length < ln) {
    str += String.fromCharCode(utf8SymCodes());
  }
  return str;
}

const name = rndStr(5); // generate random name, 5 characters long
const pass = rndStr(3); // generate random password, 3 characters long

const listName = "test list",
  listId = 12345,
  taskName = "test task",
  taskId = 123456,
  priority = 0,
  status = 0;

describe("/signup, /signin and authorized routes", (done) => {

  // sign out is tested implicitly
  afterEach((done) => {
    chai.request(app)
      .get("/signout")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });


  it("/signup should return status 201", (done) => {
    chai.request(app)
      .post("/signup")
      .set("Content-Type", "application/json")
      .send({name: name, pass: pass})
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
    });
  });

  it("/signin should return status 200", (done) => {
    chai.request(app)
      .post("/signin")
      .set("Content-Type", "application/json")
      .send({name: name, pass: pass})
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it("/profile should return status 200", (done) => {
    agent.post("/signin")
      .send({name, pass})
      .then((res) => {
        expect(res).to.have.cookie("session_cookie");
        return agent.get("/profile")
          .then((res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
  });

  it("/insertlist should return status 201", (done) => {
    const body = {
      name: listName,
      id: listId
    };

    agent.post("/signin")
      .send({name, pass})
      .then((res) => {
        return agent.post("/insertlist")
          .send(body)
          .then((res) => {
            expect(res).to.have.status(201);
            done();
          });
      });
  });

  it("/updlist should return status 200", (done) => {
    const body = {
      name: `${listName}q`,
      id: listId
    };

    agent.post("/signin")
      .send({name, pass})
      .then((res) => {
        return agent.post("/updlist")
          .send(body)
          .then((res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
  });

  it("/inserttask should return status 201", (done) => {
    const body = {
      id:  taskId,
      name: taskName,
      listId,
      priority,
      status
    };

    agent.post("/signin")
      .send({name, pass})
      .then((res) => {
        return agent.post("/inserttask")
          .send(body)
          .then((res) => {
            expect(res).to.have.status(201);
            done();
          });
      });
  });

  it("/gettasks should return status 200", (done) => {
    const body = {
      listId,
    };

    agent.post("/signin")
      .send({name, pass})
      .then((res) => {
        return agent.post("/gettasks")
          .send(body)
          .then(async (res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
  });

  it("/updtask should return status 200", (done) => {
    const body = {
      taskName: taskName + 'q',
      taskId,
      priority,
      status
    };

    agent.post("/signin")
      .send({name, pass})
      .then((res) => {
        return agent.post("/updtask")
          .send(body)
          .then(async (res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
  });

  it("/removetask should return status 200", (done) => {
    const body = {
      taskId,
    };

    agent.post("/signin")
      .send({name, pass})
      .then((res) => {
        return agent.post("/removetask")
          .send(body)
          .then(async (res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
  });

  it("/removelist should return status 200", (done) => {
    const body = {
      id: listId
    };

    agent.post("/signin")
      .send({name, pass})
      .then((res) => {
        return agent.post("/removelist")
          .send(body)
          .then((res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
  });
});
