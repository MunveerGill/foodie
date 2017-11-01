var express = require('express');
var router = express.Router();
//var Recipe     = require('../models/recipe');

router.get('/', function(req, res) {
    res.json({ message: 'Here are some recipes!!!!!' });
});

module.exports = router;
