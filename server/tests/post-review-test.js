/**
 * Created by munveergill on 19/03/2017.
 */
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");

var object = {"username": "test3@lamye.com", "liked":true, "desc": "Description unit test", "recipeName":"Parmesan Hasselback Sweet Potatoes with Balsamic Glaze"};
var failObject = {"username":"dsdasdsad"};

describe("post review - unit test", function () {
    it("should post review", function (done) {
        server.post("/post-review/")
            .send(object)
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            });
    });

});