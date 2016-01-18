var express = require('express');
var morgan = require('morgan');
var wagner = require('wagner-core');

require('./dependencies')(wagner);

// For test purposes
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

var app = express();

// DEVELOPMENT:: Access-Control-Allow-Origin
// app.use(allowCrossDomain);

app.use(morgan('combined'));
app.use('/api/v1', require('./api')(wagner));

app.listen(3000);
console.log('Listening on port 3000!');
