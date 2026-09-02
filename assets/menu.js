(function () {
  'use strict';

  window.Mathly.data.ready.then(function () {

  var chapters = (window.MATHLY && window.MATHLY.chapters) || [];

  function findChapter(id) {
    for (var i = 0; i < chapters.length; i++) {
      if (chapters[i].id === id) return chapters[i];
    }
    return null;
  }

  var KINDS = {
    learn: { label: 'Learn it', emoji: '📖' },
    quiz:  { label: 'Quiz',     emoji: '⏱️' },
    drill: { label: 'Practice', emoji: '✏️' },
    bank:  { label: 'Question bank', emoji: '🗂️' }
  };

  function summary(chapter) {
    var counts = { learn: 0, quiz: 0, drill: 0 };
    chapter.games.forEach(function (game) { if (counts[game.kind] !== undefined) counts[game.kind]++; });
    var bits = [];
    if (counts.learn) bits.push('📖 ' + counts.learn + (counts.learn > 1 ? ' lessons' : ' lesson'));
    if (counts.quiz) bits.push('⏱️ ' + counts.quiz + ' quiz');
    if (counts.drill) bits.push('✏️ ' + counts.drill + ' practice sheet');
    if (window.Mathly) {
      var types = window.Mathly.byChapter(chapter.id).length;
      if (types) bits.push('🎲 ' + types + ' kinds of question');
    }
    return bits.join(' · ');
  }

  function stars(chapterId) {
    if (!window.Mathly || !window.Mathly.progress) return '';
    var got = window.Mathly.progress.chapter(chapterId);
    if (!got.topics || !got.earned) return '';
    return '<span class="card-stars">⭐ ' + got.earned + ' / ' + got.possible + '</span>';
  }

  function card(item, href, ready) {
    var tag = ready ? 'a' : 'div';
    var el = document.createElement(tag);
    el.className = 'card tint-' + (item.tint || 1) + (ready ? ' card-link' : ' card-soon');
    if (ready) el.href = href; else el.setAttribute('aria-disabled', 'true');
    var kind = KINDS[item.kind];
    el.innerHTML =
      '<span class="card-icon" aria-hidden="true">' + item.emoji + '</span>' +
      '<span class="card-body">' +
        '<span class="card-title">' + item.title +
          (kind ? '<span class="kind">' + kind.emoji + ' ' + kind.label + '</span>' : '') +
          (item.id ? stars(item.id) : '') +
        '</span>' +
        '<span class="card-text">' + item.text + '</span>' +
        (item.games && item.games.length ? '<span class="card-meta">' + summary(item) + '</span>' : '') +
      '</span>' +
      (ready ? '<span class="card-arrow" aria-hidden="true">▶</span>' : '');
    return el;
  }

  var chapterMenu = document.getElementById('chapterMenu');
  if (chapterMenu) {
    chapters.forEach(function (ch) {
      chapterMenu.appendChild(card(ch, 'chapter.html?c=' + ch.id, ch.games.length > 0));
    });
  }

  var gameMenu = document.getElementById('gameMenu');
  if (gameMenu) {
    var id = (location.search.match(/[?&]c=([^&]+)/) || [])[1] || 'foundations';
    var chapter = findChapter(decodeURIComponent(id)) || chapters[0];

    document.title = chapter.title.replace('&amp;', '&') + ' · Mathly';
    var heading = document.getElementById('chapterTitle');
    if (heading) heading.innerHTML = '<span class="brand-emoji" aria-hidden="true">' + chapter.emoji + '</span> ' + chapter.title;
    var blurb = document.getElementById('chapterText');
    if (blurb) blurb.innerHTML = chapter.text;

    var meta = document.getElementById('chapterMeta');
    if (meta) {
      var line = summary(chapter);
      var got = window.Mathly ? window.Mathly.progress.chapter(chapter.id) : null;
      if (got && got.earned) line += ' · ⭐ ' + got.earned + ' of ' + got.possible + ' stars so far';
      meta.textContent = line;
    }

    if (!chapter.games.length) {
      var soon = document.createElement('p');
      soon.className = 'hint';
      soon.textContent = 'No games in this chapter yet — check back soon! 🚧';
      gameMenu.appendChild(soon);
    } else {
      chapter.games.forEach(function (game) {
        var join = game.href.indexOf('?') > -1 ? '&' : '?';
        gameMenu.appendChild(card(game, game.href + join + 'from=' + chapter.id, true));
      });

      // every chapter with a bank gets a card for it, without touching the catalog
      window.Mathly.data.json('banks/index').then(function (index) {
        if (index.chapters.indexOf(chapter.id) < 0) return;
        gameMenu.appendChild(card({
          title: 'Question bank',
          emoji: '🗂️',
          tint: 6,
          kind: 'bank',
          text: index.perChapter + ' ready-made questions for this chapter, with answers you can hide, and a print button.'
        }, 'bank.html?c=' + chapter.id, true));
      });
    }
  }

  // Breadcrumb "back" link on a game page points at the chapter it came from.
  var crumb = document.getElementById('chapterCrumb');
  if (crumb) {
    var query = location.search;
    var from = (query.match(/[?&]from=([^&]+)/) || query.match(/[?&]chapter=([^&]+)/) || query.match(/[?&]c=([^&]+)/) || [])[1];
    if (from === 'all') from = 'revision';
    var parent = findChapter(from ? decodeURIComponent(from) : 'foundations') || chapters[0];
    crumb.href = 'chapter.html?c=' + parent.id;
    crumb.innerHTML = parent.emoji + ' ' + parent.title;
  }
  });
})();
