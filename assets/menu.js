(function () {
  'use strict';

  var chapters = (window.MATHLY && window.MATHLY.chapters) || [];

  function findChapter(id) {
    for (var i = 0; i < chapters.length; i++) {
      if (chapters[i].id === id) return chapters[i];
    }
    return null;
  }

  function card(item, href, ready) {
    var tag = ready ? 'a' : 'div';
    var el = document.createElement(tag);
    el.className = 'card tint-' + (item.tint || 1) + (ready ? ' card-link' : ' card-soon');
    if (ready) el.href = href; else el.setAttribute('aria-disabled', 'true');
    el.innerHTML =
      '<span class="card-icon" aria-hidden="true">' + item.emoji + '</span>' +
      '<span class="card-body">' +
        '<span class="card-title">' + item.title + '</span>' +
        '<span class="card-text">' + item.text + '</span>' +
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

    if (!chapter.games.length) {
      var soon = document.createElement('p');
      soon.className = 'hint';
      soon.textContent = 'No games in this chapter yet — check back soon! 🚧';
      gameMenu.appendChild(soon);
    } else {
      chapter.games.forEach(function (game) {
        gameMenu.appendChild(card(game, game.href + '?from=' + chapter.id, true));
      });
    }
  }

  // Breadcrumb "back" link on a game page points at the chapter it came from.
  var crumb = document.getElementById('chapterCrumb');
  if (crumb) {
    var from = (location.search.match(/[?&]from=([^&]+)/) || [])[1];
    var parent = findChapter(from ? decodeURIComponent(from) : 'foundations') || chapters[0];
    crumb.href = 'chapter.html?c=' + parent.id;
    crumb.innerHTML = parent.emoji + ' ' + parent.title;
  }
})();
