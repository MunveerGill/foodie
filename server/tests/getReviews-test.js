/**
 * Created by munveergill on 17/03/2017.
 */
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");

describe("get reviews endpoint - unit test", function () {
    it("should return review for 3-Bean Turkey Chilli ", function (done) {
        server.get("/get-reviews/Slow Cooker 3-Bean Turkey Chili")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.body.length.should.equal(0);
                done();
            });
    });
    it("should return reviews for Cedar Plank Spice-Rubbed Salmon", function (done) {
        server.get("/get-reviews/Cedar Plank Spice-Rubbed Salmon")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.body.length.should.be.above(0);
                done();
            });
    });
    it("should return nothing", function (done) {
        server.get("/get-reviews/Cedar Plank Spice-Rubbed Salmonfsadfsdaf")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.body.length.should.equal(0);
                done();
            });
    });
    it("should return an error", function (done) {
        server.get("/get-reviews/")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(404);
                done();
            });
    });

});