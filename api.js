var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');

module.exports = function(wagner) {
  var api = express.Router();
     
  api.use(bodyparser.json());

  // Search the Amazon API for similar books to the given search string
  // e.g. http://localhost:3000/api/v1/search?title=aliens&page=1&debug=true
  api.get('/search', wagner.invoke(function(Amazon) {
    return function(req, res) {
      try {
        var items = Amazon.search(req.query.title, req.query.page, req.query.debug, 
          function(err, results) {
            if (err) {
              console.log(err);
            } else {
              return res.json(results);
            }
          });        
      } catch(e) {
        return res
          .status(status.BAD_REQUEST)
          .json({ error: 'No search specified!' });
      }
    }
  }));

  // Retrieve the rating given the rating url
  api.get('/rating/:url', wagner.invoke(function(Amazon) {
    return function(req, res) {
      try {
        Amazon.rating(req.params.url, req.query.debug, 
          function(err, results) {
            if (err) {
              console.log(err);
            } else {
              return res.json(results);
            }
          });        
      } catch(e) {
        return res
          .status(status.BAD_REQUEST)
          .json({ error: 'No search specified!' });
      }
    }
  }));

  return api;
};