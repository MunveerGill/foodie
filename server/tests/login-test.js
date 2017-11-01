/**
 * Created by munveergill on 27/01/2017.
 */
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");

describe("login endpoint - unit test", function () {
    it("should log me in", function (done) {
        server.post("/login/")
            .send({username:"munveer.gill@gmail.com", password: "me"})
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            });
    });
});