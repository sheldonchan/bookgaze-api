var amazon = require('amazon-product-api');
var btoa = require('btoa');
var atob = require('atob');
var http = require('http');
var cheerio = require('cheerio');

module.exports = function(Config) {

  // Use the amazon-product-api and create a client to connect
  var client = amazon.createClient({
    awsTag: Config.AWS_TAG,
    awsId: Config.AWS_ACCESS_KEY_ID,
    awsSecret: Config.AWS_SECRET_ACCESS_KEY
  });

  // Really, just get us the first entry
  var first = function(arr) {
    return (arr && arr.length > 0) ? arr[0] : arr;
  };

  // Extract simplified, relevant information for our needs
  var processBook = function (obj) {
    var attribs = first(obj["ItemAttributes"][0]);
    var item = {
      asin: first(obj["ASIN"]),
      title: first(attribs["Title"]),
      author: first(attribs["Author"]),
      thumbnail: (obj["SmallImage"]) ? first(first(obj["SmallImage"])["URL"]) : "/images/noimage.png",
      image: (obj["MediumImage"]) ? first(first(obj["MediumImage"])["URL"]) : "/images/noimage.png",
      url: first(obj["DetailPageURL"]),
      isbn: first(attribs["ISBN"]),
      date: attribs["PublicationDate"] ? new Date(attribs["PublicationDate"]).getFullYear() : "",
      pages: first(attribs["NumberOfPages"])
    };
    if (obj["EditorialReviews"]) {
      obj["EditorialReviews"].map(function(x) {
        x["EditorialReview"].map(function(y) {
          if(y["Source"] == "Product Description") {
            item.description = first(y["Content"]);
          }
        });
      });
    }
    if (obj["CustomerReviews"]) {
      item.ratingUrl = btoa(first(first(obj["CustomerReviews"]).IFrameURL));
    }
    return item;
  };

  // Find us similar books to the given ASIN identifier
  var similar = function(asin, debug, callback) {
    console.log("Finding similar for asin: " + asin);
    client.similarityLookup({
      itemId: asin,
      similarityType: 'Random',
      responseGroup: 'ItemAttributes,Images,EditorialReview,Reviews'
    }, function(err, results) {
      if (err) {
        callback(err, null);
      } else {
        callback(err, debug ? results : results.map(processBook));
      }
    });
  };

  // Find us the book that a user is specifying based on the keywords
  var search = function(keywords, pageIndex, debug, callback) {
    client.itemSearch({
      keywords: keywords,
      searchIndex: "Books",
      itemPage: pageIndex,
      responseGroup: 'ItemAttributes,Images'
    }, function(err, results) {
      if (err) {
        callback(err, null);
      } else if (debug) {
        callback(err, results);
      } else {
        var asin = processBook(results[0]).asin;
        similar(asin, debug, callback);
      }
    });
  };

  // Parse out rating from the rating url 
  var parseRating = function(html) {
    var re = /\(([0-9|,]+?) customer reviews\)/;
    var rtre = /(\d.*?) out of/;
    $ = cheerio.load(html);

    // No. of ratings
    var count = $("div .crIFrameNumCustReviews").text();
    var oCount = re.exec(count);

    // Actual rating
    var rating = $("span .asinReviewsSummary").find("img").attr("title");
    var oRating = rtre.exec(rating);
    return {
      ratingCount: (oCount && oCount.length > 0) ? oCount[1] : undefined,
      rating: (oRating && oRating.length > 0) ? oRating[1] : undefined
    };  
  };

  // Retrieve rating url page
  var getRating = function (url, debug, callback) {
    if (debug) {
      console.log("Extracting rating from: " + atob(url));
    }

    http.get(atob(url), function(res) {
      var data = "";
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on("end", function() {
        callback(null, parseRating(data));
      });
    }).on("error", function(err) {
      callback(err, null);
    });
  };

  return {
    search: search,
    rating: getRating
  }

};


