/**
 * Created by munveergill on 13/03/2017.
 */
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");

describe("meals endpoint - unit test", function () {
    it("should return a list of meals", function (done) {
        server.get("/meals/munveer.gill@gmail.com")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            });
    });
});