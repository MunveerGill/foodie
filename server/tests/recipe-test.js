/**
 * Created by munveergill on 27/01/2017.
 */
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");

describe("recipe endpoint - unit test", function () {
    it("should return information on Cedar Plank Spice-Rubbed Salmon", function (done) {
        server.get("/getrecipe/58ba090beec0dd12fe3753be")
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
});

