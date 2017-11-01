/**
 * Created by munveergill on 17/03/2017.
 */
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");

var object = {"username":"test3@lamye.com",
    "allergies":{
        "dairyFree":true,
        "nutAllergy":true,
        "vegan":false,
        "diabetic":false,
        "halal":false,
        "kosher":false,
        "vegetarian":false,
        "other":["UnitTest"]
    }
};
var failObject = {"username":"dsdasdsad"};

describe("post allergies - unit test", function () {
    it("should post allergies to test46", function (done) {
        server.post("/set-user-data/")
            .send(object)
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            });
    });
});