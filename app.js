var express = require('express');
var app = express();
var strava = require('strava-v3');
var strava_util = require('strava-v3/lib/util');

app.use(express.static(__dirname + '/src/client'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/src/client/index.html');
});

var oauth = strava.oauth.getRequestAccessURL({scope: 'view_private,write'});

app.get('/runs', function (req, res) {
  return strava.athlete.listActivities({}, function (err, payload) {
    if (!err) res.send(payload);
    else res.send(err);
  });
});

app.get('/beacon', function (req, res) {
  return strava.oauth.getToken(req.query.code, function (err, payload) {
    if (err) res.send(err);
    return strava_util.getEndpoint('beacon/status', {}, function (err, payload) {
      if (!err) res.send(payload);
      else res.send(err);
    });
  });
});

app.get('/request-access', function (req, res) {
  res.send(oauth);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
