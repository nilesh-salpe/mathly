(function (M) {
  'use strict';

  var STORE = 'mathly-quiz-scores';

  var setup = document.getElementById('quizSetup');
  var topicChips = document.getElementById('topicChips');
  var levelChips = document.getElementById('levelChips');
  var hint = document.getElementById('quizHint');
  var panel = document.getElementById('quizPanel');
  var list = document.getElementById('quizList');
  var title = document.getElementById('quizTitle');
  var timerBox = document.getElementById('timer');
  var timerValue = document.getElementById('timerValue');
  var result = document.getElementById('quizResult');
  var resultEmoji = document.getElementById('quizResultEmoji');
  var resultHead = document.getElementById('quizResultHead');
  var resultSub = document.getElementById('quizResultSub');
  var resultStars = document.getElementById('quizResultStars');
  var scorePanel = document.getElementById('scorePanel');
  var scoreboard = document.getElementById('scoreboard');

  var settings = null;
  var items = [];
  var ticker = null;
  var secondsLeft = 0;
  var secondsUsed = 0;
  var finished = true;

  // only a bare sum gets an "=" after it; a worded question already ends properly
  function needsEquals(q) {
    return (q.mode === 'number' || q.mode === 'unit') && !/[a-z▢◻,]/i.test(q.prompt);
  }

  function param(name) {
    var found = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    // a stray second "?" in a shared link must not become part of the value
    return found ? decodeURIComponent(found[1]).split(/[?#]/)[0] : null;
  }

  function clampInt(value, min, max, fallback) {
    var n = parseInt(value, 10);
    if (isNaN(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function twoDigits(n) { return (n < 10 ? '0' : '') + n; }
  function clockText(total) { return twoDigits(Math.floor(total / 60)) + ':' + twoDigits(total % 60); }
  function starsText(count) { return new Array(count + 1).join('⭐') + new Array(6 - count).join('☆'); }

  /* ---------- setting up ---------- */

  var CHAPTER_NAMES = { foundations: 'Foundations', numbers: 'Numbers & place value', addsub: 'Add & subtract', muldiv: 'Multiply & divide', fractions: 'Fractions', money: 'Money', measure: 'Measurement', time: 'Time & calendar' };

  function buildTopicChips() {
    var chapters = {};
    M.all().forEach(function (type) {
      (chapters[type.chapter] = chapters[type.chapter] || []).push(type);
    });

    var wanted = {};
    var topic = param('topic');
    var chapter = param('chapter');
    if (topic) wanted[topic] = true;

    Object.keys(chapters).forEach(function (id) {
      var group = document.createElement('div');
      group.className = 'chip-group';

      var name = document.createElement('span');
      name.className = 'chip-group-name';
      name.textContent = CHAPTER_NAMES[id] || id;
      group.appendChild(name);

      chapters[id].forEach(function (type) {
        var label = document.createElement('label');
        label.className = 'op op-' + (type.tint || 'add');
        var box = document.createElement('input');
        box.type = 'checkbox';
        box.className = 'op-check';
        box.value = type.id;
        box.checked = topic ? !!wanted[type.id] : (chapter ? chapter === id : type.id === 'mul');
        var text = document.createElement('span');
        text.textContent = type.emoji + ' ' + type.label;
        label.appendChild(box);
        label.appendChild(text);
        group.appendChild(label);
      });

      topicChips.appendChild(group);
    });
  }

  function buildLevelChips() {
    var chosen = param('level') || 'just';
    M.LEVEL_ORDER.forEach(function (id) {
      var level = M.LEVELS[id];
      var label = document.createElement('label');
      label.className = 'level';
      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'level';
      radio.value = id;
      radio.checked = id === chosen;
      var text = document.createElement('span');
      text.textContent = level.emoji + ' ' + level.label;
      label.appendChild(radio);
      label.appendChild(text);
      levelChips.appendChild(label);
    });
    applyLevelDefaults(chosen);
  }

  function applyLevelDefaults(id) {
    var level = M.level(id);
    document.getElementById('qFrom').value = level.from;
    document.getElementById('qTo').value = level.to;
    document.getElementById('qFactors').value = String(level.parts);
  }

  function chosenLevel() {
    var picked = levelChips.querySelector('input[name="level"]:checked');
    return picked ? picked.value : 'just';
  }

  function chosenTopics() {
    return [].slice.call(topicChips.querySelectorAll('.op-check:checked')).map(function (b) { return b.value; });
  }

  /* ---------- making the quiz ---------- */

  function schedule(topics, count) {
    var seq = [];
    while (seq.length < count) seq = seq.concat(M.rand.shuffle(topics.slice()));
    return seq.slice(0, count);
  }

  function makeItems(cfg) {
    var plan = schedule(cfg.topics, cfg.count);
    var made = [];
    var seen = {};

    plan.forEach(function (typeId) {
      var type = M.get(typeId);
      var q = type.make(cfg.ctx);
      for (var tries = 0; tries < 40 && seen[q.prompt]; tries++) q = type.make(cfg.ctx);
      seen[q.prompt] = true;
      made.push({ typeId: typeId, type: type, q: q, given: null });
    });
    return made;
  }

  /* ---------- drawing the questions ---------- */

  function speakButton(text) {
    if (!M.canSpeak()) return null;
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'speak';
    button.title = 'Read this out';
    button.setAttribute('aria-label', 'Read this question out loud');
    button.textContent = '🔊';
    button.addEventListener('click', function () { M.speak(text); });
    return button;
  }

  function renderItems() {
    list.innerHTML = '';
    items.forEach(function (item, index) {
      var q = item.q;
      var li = document.createElement('li');
      li.className = 'quiz-item op-' + (item.type.tint || 'add') + (q.mode === 'choice' ? ' quiz-item-wide' : '');

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

      var sum = document.createElement('span');
      sum.className = 'quiz-sum';
      sum.textContent = q.prompt + (needsEquals(q) ? ' =' : '');
      li.appendChild(sum);

      if (/[a-z]{3}/i.test(q.prompt)) {
        var speaker = speakButton(q.prompt);
        if (speaker) li.appendChild(speaker);
      }

      if (q.mode === 'choice') {
        var group = document.createElement('span');
        group.className = 'choices';
        q.choices.forEach(function (choice) {
          var button = document.createElement('button');
          button.type = 'button';
          button.className = 'choice';
          button.textContent = choice;
          button.addEventListener('click', function () {
            if (finished) return;
            item.given = choice;
            [].slice.call(group.children).forEach(function (b) { b.classList.remove('picked'); });
            button.classList.add('picked');
          });
          group.appendChild(button);
        });
        li.appendChild(group);
        item.el = group;
      } else if (q.mode === 'multi') {
        var wrap = document.createElement('span');
        wrap.className = 'multi';
        q.fields.forEach(function (field, i) {
          var cell = document.createElement('span');
          cell.className = 'multi-cell';
          var input = numberInput(index, i);
          cell.appendChild(input);
          var label = document.createElement('span');
          label.className = 'multi-label';
          label.textContent = field.label;
          cell.appendChild(label);
          wrap.appendChild(cell);
        });
        li.appendChild(wrap);
        item.el = wrap;
      } else {
        var single = numberInput(index, 0);
        li.appendChild(single);
        if (q.unit) {
          var unit = document.createElement('span');
          unit.className = 'unit';
          unit.textContent = q.unit;
          li.appendChild(unit);
        }
        item.el = single;
      }

      if (q.note) {
        var note = document.createElement('span');
        note.className = 'quiz-note';
        note.textContent = q.note;
        li.appendChild(note);
      }

      var mark = document.createElement('span');
      mark.className = 'quiz-mark';
      li.appendChild(mark);
      item.mark = mark;
      item.li = li;

      list.appendChild(li);
    });
  }

  function numberInput(index, field) {
    var input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'numeric';
    input.autocomplete = 'off';
    input.className = 'quiz-input';
    input.dataset.index = String(index);
    input.dataset.field = String(field);
    return input;
  }

  function readGiven(item) {
    var q = item.q;
    if (q.mode === 'choice') return item.given;
    if (q.mode === 'multi') {
      return [].slice.call(item.el.querySelectorAll('input')).map(function (i) { return i.value.trim(); });
    }
    return item.el.value.trim();
  }

  function isBlank(item) {
    var given = readGiven(item);
    if (item.q.mode === 'choice') return !given;
    if (item.q.mode === 'multi') return given.every(function (v) { return v === ''; });
    return given === '';
  }

  /* ---------- the clock ---------- */

  function stopTimer() { if (ticker) { clearInterval(ticker); ticker = null; } }

  function startTimer() {
    stopTimer();
    secondsUsed = 0;
    if (!settings.limit) { timerBox.hidden = true; return; }
    secondsLeft = settings.limit;
    timerBox.hidden = false;
    timerBox.classList.remove('hurry', 'done');
    timerValue.textContent = clockText(secondsLeft);
    ticker = setInterval(function () {
      secondsLeft--;
      secondsUsed++;
      timerValue.textContent = clockText(Math.max(0, secondsLeft));
      timerBox.classList.toggle('hurry', secondsLeft <= 30 && secondsLeft > 0);
      if (secondsLeft <= 0) { timerBox.classList.add('done'); finishQuiz(true); }
    }, 1000);
  }

  /* ---------- running a quiz ---------- */

  function describe(cfg) {
    var names = cfg.topics.map(function (id) { return M.get(id).label.toLowerCase(); }).join(', ');
    return cfg.count + ' questions · ' + names + ' · ' + M.level(cfg.level).label.toLowerCase();
  }

  function startQuiz() {
    items = makeItems(settings);
    finished = false;
    renderItems();
    result.hidden = true;
    result.className = 'result';
    title.textContent = '2. Answer the questions ✏️';
    var extra = document.createElement('span');
    extra.className = 'quiz-title-extra';
    extra.textContent = describe(settings);
    title.appendChild(extra);
    panel.hidden = false;
    startTimer();
    var first = list.querySelector('.quiz-input');
    if (first) first.focus();
  }

  function finishQuiz(byTimer) {
    if (finished) return;
    finished = true;
    stopTimer();
    if (settings.limit && !byTimer) secondsUsed = settings.limit - Math.max(0, secondsLeft);

    var right = 0, wrong = 0, blank = 0;
    var perTopic = {};

    items.forEach(function (item) {
      var given = readGiven(item);
      var tally = perTopic[item.typeId] = perTopic[item.typeId] || { right: 0, total: 0 };
      tally.total++;

      item.li.querySelectorAll('.quiz-input').forEach(function (i) { i.disabled = true; });
      item.li.querySelectorAll('.choice').forEach(function (b) { b.disabled = true; });

      var state;
      if (isBlank(item)) { state = 'blank'; blank++; }
      else if (M.isRight(item.q, given)) { state = 'right'; right++; tally.right++; }
      else { state = 'wrong'; wrong++; }

      paint(item, state);
    });

    Object.keys(perTopic).forEach(function (id) {
      M.progress.record(id, perTopic[id].right, perTopic[id].total);
    });

    showScore(right, wrong, blank, byTimer);
    saveScore(right, byTimer);
    renderScores();
  }

  function paint(item, state) {
    var q = item.q;
    if (q.mode === 'choice') {
      [].slice.call(item.el.children).forEach(function (button) {
        if (button.textContent === String(q.answer)) button.classList.add('right');
        else if (button.classList.contains('picked')) button.classList.add('wrong');
      });
    } else {
      item.li.querySelectorAll('.quiz-input').forEach(function (i) { i.classList.add(state); });
    }
    item.mark.className = 'quiz-mark ' + state;
    item.mark.textContent = state === 'right' ? '✅ 1 point'
      : state === 'blank' ? '💛 ' + M.answerText(q)
      : '❌ it was ' + M.answerText(q);
  }

  function showScore(right, wrong, blank, byTimer) {
    var total = items.length;
    var perfect = right === total;
    var stars = perfect ? 5 : M.starsFor(right, total);
    var kind = perfect ? 'pass' : (right >= total / 2 ? 'mixed' : 'fail');
    var head = perfect ? 'Perfect score! 🎉'
      : (right >= total * 0.8 ? 'Brilliant work!'
        : (right >= total / 2 ? 'Good job!' : 'Keep practising — you are getting there!'));
    var timePart = settings.limit
      ? (byTimer ? ' Time is up! ⏰' : ' Time used: ' + clockText(secondsUsed) + '.')
      : '';

    result.hidden = false;
    result.className = 'result ' + kind;
    resultEmoji.textContent = perfect ? '🏆' : (kind === 'mixed' ? '🙂' : '💪');
    resultHead.textContent = 'Score: ' + right + ' out of ' + total;
    resultSub.textContent = head + (wrong ? ' ' + wrong + ' to fix.' : '') +
      (blank ? ' ' + blank + ' left empty.' : '') + timePart;
    resultStars.textContent = starsText(stars);
    result.scrollIntoView({ block: 'nearest' });
  }

  /* ---------- the scoreboard ---------- */

  function readScores() {
    try { return JSON.parse(localStorage.getItem(STORE)) || []; } catch (e) { return []; }
  }

  function saveScore(right, byTimer) {
    var all = readScores();
    all.unshift({
      when: Date.now(),
      right: right,
      total: items.length,
      stars: right === items.length ? 5 : M.starsFor(right, items.length),
      seconds: settings.limit ? secondsUsed : null,
      timedOut: !!byTimer,
      about: describe(settings)
    });
    try { localStorage.setItem(STORE, JSON.stringify(all.slice(0, 20))); } catch (e) { /* private mode */ }
  }

  function renderScores() {
    var all = readScores();
    scoreboard.innerHTML = '';
    if (!all.length) { scorePanel.hidden = true; return; }
    scorePanel.hidden = false;

    all.forEach(function (item, i) {
      var li = document.createElement('li');
      li.className = 'score-row';

      var badge = document.createElement('span');
      badge.className = 'score-badge ' + (item.right === item.total ? 'right' : (item.right >= item.total / 2 ? 'blank' : 'wrong'));
      badge.textContent = item.right + '/' + item.total;
      li.appendChild(badge);

      var body = document.createElement('span');
      body.className = 'score-body';
      var line1 = document.createElement('strong');
      line1.textContent = (i === 0 ? 'Newest quiz' : 'Quiz ' + (all.length - i)) + ' · ' + starsText(item.stars);
      var line2 = document.createElement('span');
      var bits = [item.about];
      if (item.seconds !== null && item.seconds !== undefined) {
        bits.push(item.timedOut ? 'ran out of time' : 'took ' + clockText(item.seconds));
      }
      bits.push(new Date(item.when).toLocaleString());
      line2.textContent = bits.join(' · ');
      body.appendChild(line1);
      body.appendChild(line2);
      li.appendChild(body);
      scoreboard.appendChild(li);
    });
  }

  /* ---------- wiring ---------- */

  setup.addEventListener('submit', function (e) {
    e.preventDefault();
    var topics = chosenTopics();
    if (!topics.length) {
      hint.classList.add('error');
      hint.textContent = 'Pick at least one kind of question first — tap a chip above.';
      return;
    }

    var from = clampInt(document.getElementById('qFrom').value, 1, 10000, 2);
    var to = clampInt(document.getElementById('qTo').value, 1, 10000, 12);
    if (from > to) { var swap = from; from = to; to = swap; }
    document.getElementById('qFrom').value = from;
    document.getElementById('qTo').value = to;

    var minutes = clampInt(document.getElementById('qMinutes').value, 0, 60, 0);
    var seconds = clampInt(document.getElementById('qSeconds').value, 0, 59, 0);
    var factors = document.getElementById('qFactors').value;
    var level = chosenLevel();

    settings = {
      topics: topics,
      level: level,
      count: clampInt(document.getElementById('qCount').value, 1, 50, 10),
      limit: minutes * 60 + seconds,
      ctx: {
        level: level,
        from: from,
        to: to,
        parts: factors === 'mix' ? 'mix' : parseInt(factors, 10)
      }
    };
    document.getElementById('qCount').value = settings.count;

    hint.classList.remove('error');
    hint.textContent = settings.limit
      ? 'Your quiz is ready — you have ' + clockText(settings.limit) + ' on the clock. Good luck! 🍀'
      : 'Your quiz is ready — no timer this time, take as long as you like. 🍀';
    startQuiz();
  });

  levelChips.addEventListener('change', function (e) {
    if (e.target.name === 'level') applyLevelDefaults(e.target.value);
  });

  list.addEventListener('input', function (e) {
    if (!e.target.classList.contains('quiz-input')) return;
    e.target.classList.remove('right', 'wrong', 'blank');
  });

  list.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || !e.target.classList.contains('quiz-input')) return;
    e.preventDefault();
    var boxes = [].slice.call(list.querySelectorAll('.quiz-input:not([disabled])'));
    var at = boxes.indexOf(e.target);
    if (at > -1 && at + 1 < boxes.length) boxes[at + 1].focus();
    else finishQuiz(false);
  });

  document.getElementById('finishBtn').addEventListener('click', function () { finishQuiz(false); });
  document.getElementById('newQuizBtn').addEventListener('click', function () { if (settings) startQuiz(); });
  document.getElementById('clearScores').addEventListener('click', function () {
    try { localStorage.removeItem(STORE); } catch (e) { /* ignore */ }
    renderScores();
  });

  buildTopicChips();
  buildLevelChips();
  renderScores();
  if (param('topic') || param('chapter')) {
    setup.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }
})(window.Mathly);
