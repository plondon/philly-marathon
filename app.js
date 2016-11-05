var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.get('/runs', function (req, res) {
  strava.athlete.listActivities({}, function (err, payload) {
    if (!err) res.send(payload);
    else console.log(err);
  });
});

var strava = require('strava-v3');

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
