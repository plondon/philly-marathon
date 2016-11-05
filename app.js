var express = require('express');
var app = express();
var strava = require('strava-v3');

app.use(express.static(__dirname + '/src/client'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/src/client/index.html');
});

app.get('/runs', function (req, res) {
  return strava.athlete.listActivities({}, function (err, payload) {
    if (!err) res.send(payload);
    else res.send(err);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
