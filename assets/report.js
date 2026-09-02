(function (M) {
  'use strict';

  M.data.ready.then(function () {

  var chapters = (window.MATHLY && window.MATHLY.chapters) || [];
  var body = document.getElementById('reportBody');
  var progress = M.progress.read();

  function starsText(count) {
    return new Array(count + 1).join('⭐') + new Array(6 - count).join('☆');
  }

  function when(stamp) {
    if (!stamp) return '';
    var days = Math.floor((Date.now() - stamp) / 86400000);
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 7) return days + ' days ago';
    return new Date(stamp).toLocaleDateString();
  }

  function chapterName(id) {
    for (var i = 0; i < chapters.length; i++) {
      if (chapters[i].id === id) return chapters[i];
    }
    return { title: id, emoji: '📘', tint: 1 };
  }

  function render() {
    progress = M.progress.read();
    body.innerHTML = '';

    var seen = {}, allTypes = M.all();
    var totals = { topics: allTypes.length, tried: 0, stars: 0, possible: allTypes.length * 5, asked: 0, right: 0 };

    allTypes.forEach(function (type) { seen[type.chapter] = true; });

    Object.keys(seen).forEach(function (chapterId) {
      var chapter = chapterName(chapterId);
      var types = M.byChapter(chapterId);

      var block = document.createElement('div');
      block.className = 'report-chapter tint-' + (chapter.tint || 1);

      var head = document.createElement('div');
      head.className = 'report-head';
      var earned = 0;
      types.forEach(function (type) { earned += (progress[type.id] && progress[type.id].stars) || 0; });
      head.innerHTML = '<span class="report-emoji" aria-hidden="true">' + chapter.emoji + '</span>' +
        '<span><strong>' + chapter.title + '</strong>' +
        '<span class="report-sub">⭐ ' + earned + ' of ' + types.length * 5 + ' stars · ' +
        types.length + ' kinds of question</span></span>';
      block.appendChild(head);

      var bar = document.createElement('div');
      bar.className = 'report-bar';
      bar.innerHTML = '<span style="width:' + Math.round((earned / (types.length * 5)) * 100) + '%"></span>';
      block.appendChild(bar);

      var list = document.createElement('ul');
      list.className = 'report-list';
      types.forEach(function (type) {
        var row = progress[type.id];
        if (row) { totals.tried++; totals.stars += row.stars; totals.asked += row.asked; totals.right += row.right; }
        var li = document.createElement('li');
        li.className = 'report-row' + (row ? '' : ' untried');
        li.innerHTML = '<span class="report-topic">' + type.emoji + ' ' + type.label + '</span>' +
          '<span class="report-stars">' + (row ? starsText(row.stars) : '— not tried yet') + '</span>' +
          '<span class="report-detail">' + (row
            ? row.right + ' right out of ' + row.asked + ' · best ' + row.best + '% · ' + when(row.last)
            : '') + '</span>' +
          '<a class="report-go no-print" href="quiz.html?topic=' + type.id + '&level=just">Practise ▶</a>';
        list.appendChild(li);
      });
      block.appendChild(list);
      body.appendChild(block);
    });

    document.getElementById('reportSummary').textContent = totals.tried
      ? totals.tried + ' of ' + totals.topics + ' kinds of question tried · ⭐ ' + totals.stars + ' of ' +
        totals.possible + ' stars · ' + totals.right + (totals.right === 1 ? ' correct answer' : ' correct answers') +
        ' out of ' + totals.asked
      : 'No quizzes finished yet. Finish one and this page fills up.';

    renderNext();
  }

  function renderNext() {
    var next = document.getElementById('nextUp');
    var panel = document.getElementById('nextPanel');
    next.innerHTML = '';

    var scored = M.all().map(function (type) {
      var row = progress[type.id];
      return { type: type, stars: row ? row.stars : -1, tried: !!row };
    });

    var weakest = scored.filter(function (item) { return item.tried && item.stars < 5; })
      .sort(function (a, b) { return a.stars - b.stars; });
    var untried = scored.filter(function (item) { return !item.tried; });
    var picks = weakest.slice(0, 2).concat(untried.slice(0, 2)).slice(0, 3);

    if (!picks.length) { panel.hidden = true; return; }
    panel.hidden = false;

    picks.forEach(function (item) {
      var chapter = chapterName(item.type.chapter);
      var link = document.createElement('a');
      link.className = 'card card-link tint-' + (chapter.tint || 1);
      link.href = 'quiz.html?topic=' + item.type.id + '&level=just';
      link.innerHTML = '<span class="card-icon" aria-hidden="true">' + item.type.emoji + '</span>' +
        '<span class="card-body"><span class="card-title">' + item.type.label + '</span>' +
        '<span class="card-text">' + chapter.title + ' · ' +
        (item.tried ? starsText(item.stars) + ' so far — one more go could win a star' : 'not tried yet') +
        '</span></span><span class="card-arrow" aria-hidden="true">▶</span>';
      next.appendChild(link);
    });
  }

  var clear = document.getElementById('clearProgress');
  var armed = false;
  clear.addEventListener('click', function () {
    if (!armed) {
      armed = true;
      clear.innerHTML = '<span class="btn-emoji" aria-hidden="true">⚠️</span>Tap again to clear everything';
      setTimeout(function () {
        armed = false;
        clear.innerHTML = '<span class="btn-emoji" aria-hidden="true">🧹</span>Clear all progress';
      }, 5000);
      return;
    }
    M.progress.clear();
    armed = false;
    clear.innerHTML = '<span class="btn-emoji" aria-hidden="true">✅</span>Cleared';
    render();
  });

  render();
  });
})(window.Mathly);
