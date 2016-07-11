var express = require('express');
var commodity = express.Router();

/* load commodity with ca */


/* GET users listing. */
commodity.get('/', function(req, res, next) {
    res.send('Hello!!!!!!');
});

commodity.get('/love66', function (req, res, next){
    res.send('66 is the best girl I have ever met');
});

module.exports = commodity;
