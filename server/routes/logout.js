/**
 * Created by munveergill on 24/01/2017.
 */
var express = require('express');
var router = express.Router();
var user = require('../lib/user');

router.get('/logout', function(req, res) {

    req.session.destroy();
    console.log("Logged out");
    return res.status(200).send();

});

module.exports = router;
