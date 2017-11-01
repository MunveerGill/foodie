/**
 * Created by munveergill on 16/03/2017.
 */
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");

var object ={"firstname":"Munveer","oldusername":"new@dude.com","username": "new@email.com", "allergies":[{"other":["Aloo"],"vegetarian":false,"kosher":false,"halal":false,"diabetic":false,"vegan":false,"nutAllergy":true,"dairyFree":false}]};
var fakeUser = {"oldusername":"","username": "", "allergies":[{"other":["Aloo"],"vegetarian":false,"kosher":false,"halal":false,"diabetic":false,"vegan":false,"nutAllergy":true,"dairyFree":false}]};

describe("change settings - unit test", function () {
    it("should change settings for user ", function (done) {
        server.post("/update-settings/")
            .send(object)
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            });
    });
    it("should fail since no json has been passed", function (done) {
        server.post("/update-settings/")
            .send({})
            .expect("Content-type", /json/)
            .end(function (err, res) {
                res.status.should.equal(500);
                done();
            });
    });
    it("should fail since the user does not exist", function (done) {
        server.post("/update-settings/")
            .send(fakeUser)
            .expect("Content-type", /json/)
            .end(function (err, res) {
                res.status.should.equal(500);
                done();
            });
    });
});