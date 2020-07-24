const chai = require("chai"),
  { expect } = require("chai");

  chaiHttp = require("chai-http");

chai.use(chaiHttp);

const app = "http://localhost:3000";

// helper function to generate random strings of desired length
function utf8SymCodes() {
  return Math.floor(Math.random() * 2147483647) + 21;
}
function rndStr(ln) {
  let str = '';
  while (str.length < ln) {
    str += String.fromCharCode(utf8SymCodes());
  }
  return str;
}

describe("sign up, sign out and sign in", (done) => {
  const name = rndStr(5); // generate random name, 5 characters long
  const pass = rndStr(3); // generate random password, 3 characters long

  it("should be able to sign up", (done) => {
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

  it("should be able to sign out", (done) => {
    chai.request(app)
      .get("/signout")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should be able to sign in", (done) => {
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
});
