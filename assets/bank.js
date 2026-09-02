(function (M) {
  'use strict';

  M.data.ready.then(function () {
    var chapters = (window.MATHLY && window.MATHLY.chapters) || [];
    var wanted = (location.search.match(/[?&]c=([^&]+)/) || [])[1];
    if (wanted) wanted = decodeURIComponent(wanted).split(/[?#]/)[0];

    var list = document.getElementById('bankList');
    var panel = document.getElementById('bankPanel');
    var controls = document.getElementById('bankControls');
    var picker = document.getElementById('bankChapters');
    var showing = false;
    var bank = null;

    function chapterOf(id) {
      for (var i = 0; i < chapters.length; i++) if (chapters[i].id === id) return chapters[i];
      return { id: id, title: id, emoji: '📘', tint: 1 };
    }

    if (!wanted) return showPicker();

    M.data.bank(wanted).then(function (data) {
      bank = data;
      var chapter = chapterOf(data.chapter);
      document.title = chapter.title.replace('&amp;', '&') + ' bank · Mathly';
      document.getElementById('bankTitle').innerHTML =
        '<span class="brand-emoji" aria-hidden="true">🗂️</span> ' + chapter.title + ' — question bank';
      document.getElementById('bankSummary').textContent =
        data.count + ' questions across ' + data.topics.length + ' topics, at all three levels. Answers are hidden until you ask for them.';
      var crumb = document.getElementById('chapterCrumb');
      crumb.hidden = false;
      crumb.href = 'chapter.html?c=' + chapter.id;
      crumb.innerHTML = chapter.emoji + ' ' + chapter.title;

      var filter = document.getElementById('topicFilter');
      data.topics.forEach(function (topic) {
        var option = document.createElement('option');
        option.value = topic.id;
        option.textContent = topic.emoji + ' ' + topic.label;
        filter.appendChild(option);
      });

      controls.hidden = false;
      panel.hidden = false;
      render();
    }).catch(function () {
      document.getElementById('bankSummary').textContent =
        'There is no question bank for that chapter yet. Pick one below.';
      showPicker();
    });

    function showPicker() {
      M.data.json('banks/index').then(function (index) {
        index.chapters.forEach(function (id) {
          var chapter = chapterOf(id);
          var link = document.createElement('a');
          link.className = 'card card-link tint-' + (chapter.tint || 1);
          link.href = 'bank.html?c=' + id;
          link.innerHTML = '<span class="card-icon" aria-hidden="true">' + chapter.emoji + '</span>' +
            '<span class="card-body"><span class="card-title">' + chapter.title + '</span>' +
            '<span class="card-text">' + index.perChapter + ' questions to work through</span></span>' +
            '<span class="card-arrow" aria-hidden="true">▶</span>';
          picker.appendChild(link);
        });
      });
    }

    function render() {
      var topic = document.getElementById('topicFilter').value;
      var level = document.getElementById('levelFilter').value;
      list.innerHTML = '';
      var shown = 0;

      bank.questions.forEach(function (q) {
        if (topic !== 'all' && q.type !== topic) return;
        if (level !== 'all' && q.level !== level) return;
        shown++;

        var li = document.createElement('li');
        li.className = 'bank-item';

        var head = document.createElement('div');
        head.className = 'bank-q';
        head.innerHTML = (q.picture ? '<span class="bank-picture">' + q.picture + '</span>' : '') +
          '<span class="bank-prompt">' + q.prompt + (q.unit ? ' <span class="unit">(' + q.unit + ')</span>' : '') + '</span>';
        li.appendChild(head);

        if (q.choices) {
          var options = document.createElement('div');
          options.className = 'bank-choices';
          q.choices.forEach(function (choice) {
            var pill = document.createElement('span');
            pill.className = 'bank-choice';
            pill.textContent = choice;
            options.appendChild(pill);
          });
          li.appendChild(options);
        }

        var answer = document.createElement('div');
        answer.className = 'bank-answer';
        answer.hidden = !showing;
        answer.textContent = 'Answer: ' + (Array.isArray(q.answer)
          ? q.answer.map(function (a, i) { return a + ' ' + (q.fields[i].label || ''); }).join(', ')
          : q.answer) + (q.unit ? ' ' + q.unit : '');
        li.appendChild(answer);

        var tag = document.createElement('span');
        tag.className = 'bank-tag';
        tag.textContent = q.topic + ' · ' + M.level(q.level).label;
        li.appendChild(tag);

        list.appendChild(li);
      });

      document.getElementById('bankCount').textContent = shown + ' of ' + bank.count + ' questions shown.';
    }

    document.getElementById('topicFilter').addEventListener('change', render);
    document.getElementById('levelFilter').addEventListener('change', render);
    document.getElementById('toggleAnswers').addEventListener('click', function () {
      showing = !showing;
      this.innerHTML = '<span class="btn-emoji" aria-hidden="true">' + (showing ? '🙈' : '👀') + '</span>' +
        (showing ? 'Hide answers' : 'Show answers');
      list.querySelectorAll('.bank-answer').forEach(function (node) { node.hidden = !showing; });
    });
  });
})(window.Mathly);
