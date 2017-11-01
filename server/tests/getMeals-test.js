/**
 * Created by munveergill on 16/03/2017.
 */
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");

describe("get meals endpoint - unit test", function () {
    it("should return recommended meals for user ", function (done) {
        server.get("/get-meals/munveer.gill@gmail.com")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                if (res.status === 200) {
                    res.body.length.should.be.above(0);
                }
                done();
            });
    });
    it("should return 404 for user not found", function (done) {
        server.get("/get-meals/")
            .expect("Content-type", /json/)
            //.expect(200)
            .end(function (err, res) {
                res.status.should.equal(404);
                done();
            });
    });
    it("should return an empty array since no meals planned", function (done) {
        server.get("/get-meals/test3@lamye.com")
            .expect("Content-type", /json/)
            //.expect(200)
            .end(function (err, res) {
                //console.log(res.body);
                res.body.should.have.length(0);
                done();
            });
    });
});