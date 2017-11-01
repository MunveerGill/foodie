/**
 * Created by munveergill on 17/03/2017.
 */
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");

var object = {"username":"test3@lamye.com", "likes":"Coq au vin"};
var failObject = {"username":"dsdasdsad"};

describe("post like - unit test", function () {
    it("should post like", function (done) {
        server.post("/likes/")
            .send(object)
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            });
    });
    it("should not post like", function (done) {
        server.post("/likes/")
            .send(failObject)
            .expect("Content-type", /json/)
            .end(function (err, res) {
                res.status.should.equal(500);
                done();
            });
    });
});