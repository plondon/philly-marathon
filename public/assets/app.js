var $ul = $('#runs');

$.get('/runs', function (runs) {
  runs.forEach(function (run) {
    var $li = $('<li>');
    var $a = $('<a target="_blank">');
    var link = 'https://www.strava.com/activities/';

    $a.html(run.name);
    $a.attr('href', link + run.id);
    $ul.append($li.append($a));
  });
});
