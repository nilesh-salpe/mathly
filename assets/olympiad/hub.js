(function (M) {
  'use strict';

  var PAPERS = 'mathly-olympiad-papers';

  M.data.json('paper').then(function (paper) {
    var total = paper.sections.reduce(function (sum, section) { return sum + section.count; }, 0);
    document.getElementById('paperShape').textContent =
      total + ' questions in ' + paper.minutes + ' minutes, in the order they come in the real paper: ' +
      paper.sections.map(function (s) { return s.name + ' (' + s.count + ')'; }).join(', ') +
      '. You can skip and come back.';

    var list = document.getElementById('sectionList');
    paper.sections.forEach(function (section) {
      var block = document.createElement('section');
      block.className = 'panel';
      block.innerHTML = '<h2 class="panel-title">' + section.emoji + ' ' + section.name +
        ' <span class="kind">' + section.count + ' in the paper</span></h2>' +
        '<p class="hint">' + section.blurb + '</p>';

      var menu = document.createElement('nav');
      menu.className = 'menu';
      M.byChapter(section.id).forEach(function (type) {
        var link = document.createElement('a');
        link.className = 'card card-link tint-' + (section.tint || 1);
        link.href = 'practice.html?type=' + type.id;
        link.innerHTML = '<span class="card-icon" aria-hidden="true">' + type.emoji + '</span>' +
          '<span class="card-body"><span class="card-title">' + type.label +
          '<span class="kind">🎯 Drill</span></span>' +
          '<span class="card-text">Ten questions of just this kind, untimed, with the reason shown after each one.</span></span>' +
          '<span class="card-arrow" aria-hidden="true">▶</span>';
        menu.appendChild(link);
      });

      var mixed = document.createElement('a');
      mixed.className = 'card card-link tint-' + (section.tint || 1);
      mixed.href = 'practice.html?section=' + section.id;
      mixed.innerHTML = '<span class="card-icon" aria-hidden="true">🎲</span>' +
        '<span class="card-body"><span class="card-title">Mixed ' + section.name +
        '<span class="kind">🎯 Drill</span></span>' +
        '<span class="card-text">All the kinds above, shuffled together.</span></span>' +
        '<span class="card-arrow" aria-hidden="true">▶</span>';
      menu.appendChild(mixed);

      block.appendChild(menu);
      list.appendChild(block);
    });

    showPapers(paper);
  });

  function showPapers(paper) {
    var kept;
    try { kept = JSON.parse(localStorage.getItem(PAPERS)) || []; } catch (e) { kept = []; }
    if (!kept.length) return;

    document.getElementById('lastPanel').hidden = false;
    var list = document.getElementById('lastPapers');
    kept.slice(0, 5).forEach(function (attempt, i) {
      var li = document.createElement('li');
      li.className = 'score-row';
      var share = attempt.right / attempt.total;
      li.innerHTML = '<span class="score-badge ' + (share > .79 ? 'right' : share > .49 ? 'blank' : 'wrong') + '">' +
        attempt.right + '/' + attempt.total + '</span>' +
        '<span class="score-body"><strong>' + (i === 0 ? 'Newest paper' : 'Paper ' + (kept.length - i)) + '</strong>' +
        '<span>' + attempt.sections.map(function (s) { return s.name + ' ' + s.right + '/' + s.total; }).join(' · ') +
        ' · ' + new Date(attempt.when).toLocaleString() + '</span></span>';
      list.appendChild(li);
    });
  }
})(window.Mathly);
