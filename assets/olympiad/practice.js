(function (M) {
  'use strict';

  function param(name) {
    var found = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    return found ? decodeURIComponent(found[1]).split(/[?#]/)[0] : null;
  }

  var typeId = param('type');
  var sectionId = param('section');
  var level = param('level') || 'just';
  var list = document.getElementById('drillList');
  var types = typeId ? [M.get(typeId)].filter(Boolean) : M.byChapter(sectionId || 'lr');

  if (!types.length) {
    document.getElementById('drillTitle').textContent = 'Pick a drill from the olympiad page';
    return;
  }

  var name = typeId ? types[0].label : 'Mixed ' + (sectionId || '').toUpperCase();
  document.title = name + ' · Mathly Olympiad';
  document.getElementById('drillTitle').innerHTML =
    '<span class="brand-emoji" aria-hidden="true">' + (typeId ? types[0].emoji : '🎲') + '</span> ' + name;
  document.getElementById('drillCrumb').textContent = name;

  var answered = 0;

  function draw() {
    list.innerHTML = '';
    answered = 0;
    updateProgress();

    for (var i = 0; i < 10; i++) {
      var type = types[i % types.length];
      var level_ = M.level(level);
      var q = type.make({ level: level, from: level_.from, to: level_.to, parts: level_.parts });
      list.appendChild(card(q, type, i));
    }
  }

  function updateProgress() {
    document.getElementById('drillProgress').textContent = answered + ' of 10 answered';
  }

  function card(q, type, index) {
    var li = document.createElement('li');
    li.className = 'quiz-item quiz-item-drill op-' + (type.tint || 'add');

    var badge = document.createElement('span');
    badge.className = 'quiz-badge';
    badge.innerHTML = '<span class="quiz-no">' + (index + 1) + '</span>';
    li.appendChild(badge);

    if (q.picture) {
      var art = document.createElement('span');
      art.className = 'quiz-picture';
      art.innerHTML = q.picture;
      li.appendChild(art);
    }

    var prompt = document.createElement('span');
    prompt.className = 'quiz-sum';
    prompt.textContent = q.prompt;
    li.appendChild(prompt);

    if (M.canSpeak()) {
      var speaker = document.createElement('button');
      speaker.type = 'button';
      speaker.className = 'speak';
      speaker.textContent = '🔊';
      speaker.setAttribute('aria-label', 'Read this question out loud');
      speaker.addEventListener('click', function () { M.speak(q.prompt); });
      li.appendChild(speaker);
    }

    var choices = document.createElement('span');
    choices.className = 'choices choices-wide';
    var done = false;

    q.choices.forEach(function (choice) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice';
      button.textContent = choice;
      button.addEventListener('click', function () {
        if (done) return;
        done = true;
        answered++;
        updateProgress();
        var right = String(choice) === String(q.answer);
        [].slice.call(choices.children).forEach(function (other) {
          other.disabled = true;
          if (other.textContent === String(q.answer)) other.classList.add('right');
          else if (other === button) other.classList.add('wrong');
        });
        mark.className = 'quiz-mark ' + (right ? 'right' : 'wrong');
        mark.textContent = right ? '✅ Yes — one point' : '❌ The answer is ' + q.answer;
        why.hidden = false;
        M.progress.record(type.id, right ? 1 : 0, 1);
      });
      choices.appendChild(button);
    });
    li.appendChild(choices);

    var mark = document.createElement('span');
    mark.className = 'quiz-mark';
    li.appendChild(mark);

    var why = document.createElement('span');
    why.className = 'why';
    why.hidden = true;
    why.innerHTML = '<strong>Why:</strong> ' + (q.why || '');
    li.appendChild(why);

    return li;
  }

  document.getElementById('newSet').addEventListener('click', draw);
  draw();
})(window.Mathly);
