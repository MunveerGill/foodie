/**
 * Created by munveergill on 17/03/2017.
 */
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");

describe("get user endpoint - unit test", function () {
    it("should return user", function (done) {
        server.get("/get-user/test49@lamye.com")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                if (res.status === 200) {
                    res.body[0].username.should.equal("test49@lamye.com");
                    res.body[0].firstname.should.equal("test");
                }
                done();
            });
    });
    it("Cannot GET user", function (done) {
        server.get("/get-user/")
            .expect("Content-type", /json/)
            .end(function (err, res) {
                res.status.should.equal(404);
                done();
            });
    });
    it("should not find user", function (done) {
        server.get("/get-user/notgonnawork@gmail.com")
            .expect("Content-type", /json/)
            .end(function (err, res) {
                res.body.should.have.length(0);
                done();
            });
    });

});