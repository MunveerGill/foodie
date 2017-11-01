/**
 * Created by munveergill on 27/01/2017.
 */
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");

describe("recipe search endpoint - unit test", function () {
    it("should return results for chicken", function (done) {
        server.get("/recipes/chicken")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                if (res.status === 200) {
                    res.body.length.should.be.above(4);
                }
                done();
            });
    });

    it("should return results for beef and onion", function (done) {
        server.get("/recipes/beef+onion")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                if (res.status === 200) {
                    res.body.length.should.be.above(4);
                }
                done();
            });
    });

    it("should return nothing", function (done) {
        server.get("/recipes/sdasdadsfwe")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                if (res.status === 200) {
                    res.body.length.should.equal(0);
                }
                done();
            });
    });
});

