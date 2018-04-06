'use strict';

var url = require('url');
var target = 'http://lambdastaticwebsite.s3-website-us-east-1.amazonaws.com';
exports.handler = (event, context, callback) => {
    // TODO implement
  var urlObject = url.parse(target);
  var json = {};
  json.message = 'up';
  var flag = json;
  var mod = require(
    urlObject.protocol.substring(0, urlObject.protocol.length - 1)
  );
  console.log('[INFO] - Checking ' + target);
  var req = mod.request(urlObject, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      console.log('[INFO] - Read body chunk' + chunk);
      var n = chunk.search("Error");
      console.log('[INFO] - Search for error' + n);
      if(n > 0) {
        console.log('In the if condition');
        json.message = 'down';;
        flag = json;
        callback(null, flag);
      } else {
        callback(null, flag);
      }
    });
  
  });
  console.log('value in flag' + flag);
  req.end();
  

};
