/**
 * Created by munveergill on 16/03/2017.
 */
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");

describe("logout endpoint - unit test", function () {
    it("should logout the user", function (done) {
        server.get("/logout")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            });
    });
});