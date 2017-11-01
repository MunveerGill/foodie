/**
 * Created by munveergill on 17/03/2017.
 */
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");

describe("get initial recommendations endpoint - unit test", function () {
    it("should return initial recommendations", function (done) {
        server.get("/initial-rec/test49@lamye.com")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.body.length.should.be.above(0);
                done();
            });
    });
    it("should return error 404 not found", function (done) {
        server.get("/initial-rec/")
            .expect("Content-type", /json/)
            .end(function (err, res) {
                res.status.should.equal(404);
                done();
            });
    });
});