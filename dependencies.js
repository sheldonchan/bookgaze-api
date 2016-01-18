var fs = require('fs');
var amzn = require('./amazon');

module.exports = function(wagner) {
  wagner.factory('Config', function() {
    return JSON.parse(fs.readFileSync('./config.json').toString());
  });

  wagner.factory('Amazon', amzn);
};
