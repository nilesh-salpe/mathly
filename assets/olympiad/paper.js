(function (M) {
  'use strict';

  var PAPERS = 'mathly-olympiad-papers';

  var paper = null;
  var questions = [];
  var at = 0;
  var ticker = null;
  var secondsLeft = 0;
  var handedIn = false;

  var strip = document.getElementById('strip');
  var holder = document.getElementById('examQuestion');
  var timerBox = document.getElementById('timer');
  var timerValue = document.getElementById('timerValue');

  function two(n) { return (n < 10 ? '0' : '') + n; }
  function clock(total) { return two(Math.floor(total / 60)) + ':' + two(total % 60); }

  M.data.json('paper').then(function (data) {
    paper = data;
    var total = data.sections.reduce(function (sum, section) { return sum + section.count; }, 0);
    document.getElementById('paperIntro').textContent =
      total + ' questions · ' + data.minutes + ' minutes · four options each, and nothing is taken away for a wrong answer.';

    var notes = document.getElementById('startNotes');
    [
      'The clock runs for the whole paper, not for each question.',
      'If a question is slow, tap 🚩 and come back to it — the numbers along the top show where you are.',
      'Nothing is marked until you hand the paper in.',
      'Afterwards you get your score for each section and the reason behind every answer.'
    ].forEach(function (line) {
      var li = document.createElement('li');
      li.textContent = line;
      notes.appendChild(li);
    });

    document.getElementById('startPanel').hidden = false;
  });

  function build() {
    questions = [];
    paper.sections.forEach(function (section) {
      var types = M.byChapter(section.id);
      var seen = {};
      for (var i = 0; i < section.count; i++) {
        var type = types[i % types.length];
        var levelId = i % 5 === 4 ? 'challenge' : (section.id === 'ach' ? 'challenge' : 'just');
        var level = M.level(levelId);
        var q = type.make({ level: levelId, from: level.from, to: level.to, parts: level.parts });
        for (var tries = 0; tries < 30 && seen[q.prompt]; tries++) {
          q = type.make({ level: levelId, from: level.from, to: level.to, parts: level.parts });
        }
        seen[q.prompt] = true;
        questions.push({ section: section, type: type, q: q, given: null, flagged: false });
      }
    });
  }

  function drawStrip() {
    strip.innerHTML = '';
    questions.forEach(function (item, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'strip-dot' +
        (index === at ? ' here' : '') +
        (item.given ? ' done' : '') +
        (item.flagged ? ' flagged' : '');
      button.textContent = index + 1;
      button.title = item.section.name;
      button.addEventListener('click', function () { go(index); });
      strip.appendChild(button);
    });
  }

  function go(index) {
    at = Math.max(0, Math.min(questions.length - 1, index));
    show();
  }

  function show() {
    var item = questions[at];
    document.getElementById('examSection').textContent =
      item.section.emoji + ' ' + item.section.name + ' — question ' + (at + 1) + ' of ' + questions.length;

    holder.innerHTML = '';
    var card = document.createElement('div');
    card.className = 'exam-card op-' + (item.type.tint || 'add');

    if (item.q.picture) {
      var art = document.createElement('div');
      art.className = 'quiz-picture';
      art.innerHTML = item.q.picture;
      card.appendChild(art);
    }

    var prompt = document.createElement('p');
    prompt.className = 'exam-prompt';
    prompt.textContent = item.q.prompt;
    card.appendChild(prompt);

    if (M.canSpeak()) {
      var speaker = document.createElement('button');
      speaker.type = 'button';
      speaker.className = 'speak';
      speaker.textContent = '🔊';
      speaker.setAttribute('aria-label', 'Read this question out loud');
      speaker.addEventListener('click', function () { M.speak(item.q.prompt); });
      card.appendChild(speaker);
    }

    var choices = document.createElement('div');
    choices.className = 'choices choices-wide';
    item.q.choices.forEach(function (choice) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice' + (item.given === choice ? ' picked' : '');
      button.textContent = choice;
      button.addEventListener('click', function () {
        item.given = choice;
        drawStrip();
        show();
        if (at < questions.length - 1) setTimeout(function () { go(at + 1); }, 220);
      });
      choices.appendChild(button);
    });
    card.appendChild(choices);
    holder.appendChild(card);

    document.getElementById('flagBtn').innerHTML = '<span class="btn-emoji" aria-hidden="true">🚩</span>' +
      (item.flagged ? 'Stop flagging this' : 'Come back to this');
    drawStrip();
  }

  function startClock() {
    secondsLeft = paper.minutes * 60;
    timerValue.textContent = clock(secondsLeft);
    ticker = setInterval(function () {
      secondsLeft--;
      timerValue.textContent = clock(Math.max(0, secondsLeft));
      timerBox.classList.toggle('hurry', secondsLeft <= 120 && secondsLeft > 0);
      if (secondsLeft <= 0) { timerBox.classList.add('done'); handIn(true); }
    }, 1000);
  }

  function handIn(ranOut) {
    if (handedIn) return;
    handedIn = true;
    if (ticker) clearInterval(ticker);

    var sections = {}, right = 0;
    questions.forEach(function (item) {
      var tally = sections[item.section.id] = sections[item.section.id] ||
        { name: item.section.name, emoji: item.section.emoji, tint: item.section.tint, right: 0, total: 0 };
      tally.total++;
      var correct = item.given !== null && String(item.given) === String(item.q.answer);
      if (correct) { tally.right++; right++; }
      M.progress.record(item.type.id, correct ? 1 : 0, 1);
    });

    var order = paper.sections.map(function (section) { return sections[section.id]; });
    var used = paper.minutes * 60 - Math.max(0, secondsLeft);

    document.getElementById('examPanel').hidden = true;
    document.getElementById('resultPanel').hidden = false;

    var summary = document.getElementById('resultSummary');
    summary.innerHTML = '';

    var head = document.createElement('div');
    head.className = 'result ' + (right / questions.length > .79 ? 'pass' : right / questions.length > .49 ? 'mixed' : 'fail');
    head.innerHTML = '<span class="result-emoji" aria-hidden="true">' +
      (right / questions.length > .79 ? '🏆' : right / questions.length > .49 ? '🙂' : '💪') + '</span>' +
      '<span class="result-text"><strong>Score: ' + right + ' out of ' + questions.length + '</strong>' +
      '<span>' + (ranOut ? 'The clock ran out. ' : '') + 'Time used: ' + clock(used) + '.</span></span>';
    summary.appendChild(head);

    order.forEach(function (tally) {
      var row = document.createElement('div');
      row.className = 'report-chapter';
      row.innerHTML = '<div class="report-head"><span class="report-emoji">' + tally.emoji + '</span>' +
        '<span><strong>' + tally.name + '</strong><span class="report-sub">' + tally.right + ' of ' +
        tally.total + ' correct</span></span></div>' +
        '<div class="report-bar"><span style="width:' + Math.round((tally.right / tally.total) * 100) + '%"></span></div>';
      summary.appendChild(row);
    });

    var weakest = order.slice().sort(function (a, b) { return (a.right / a.total) - (b.right / b.total); })[0];
    var advice = document.createElement('p');
    advice.className = 'hint';
    advice.innerHTML = 'Best thing to practise next: <strong>' + weakest.name + '</strong> — ' +
      '<a href="practice.html?section=' + paper.sections.filter(function (s) { return s.name === weakest.name; })[0].id +
      '">drill that section</a>.';
    summary.appendChild(advice);

    keep({ when: Date.now(), right: right, total: questions.length, seconds: used, ranOut: !!ranOut,
      sections: order.map(function (t) { return { name: t.name, right: t.right, total: t.total }; }) });

    review();
  }

  function keep(attempt) {
    var all;
    try { all = JSON.parse(localStorage.getItem(PAPERS)) || []; } catch (e) { all = []; }
    all.unshift(attempt);
    try { localStorage.setItem(PAPERS, JSON.stringify(all.slice(0, 20))); } catch (e) { /* private mode */ }
  }

  function review() {
    var list = document.getElementById('reviewList');
    list.innerHTML = '';
    questions.forEach(function (item, index) {
      var correct = item.given !== null && String(item.given) === String(item.q.answer);
      var li = document.createElement('li');
      li.className = 'quiz-item quiz-item-drill op-' + (item.type.tint || 'add');
      li.innerHTML =
        '<span class="quiz-badge"><span class="quiz-no">' + (index + 1) + '</span></span>' +
        (item.q.picture ? '<span class="quiz-picture">' + item.q.picture + '</span>' : '') +
        '<span class="quiz-sum">' + item.q.prompt + '</span>' +
        '<span class="quiz-mark ' + (correct ? 'right' : item.given === null ? 'blank' : 'wrong') + '">' +
          (correct ? '✅ Correct' : item.given === null
            ? '💛 Not answered — the answer was ' + item.q.answer
            : '❌ You chose ' + item.given + ' — the answer was ' + item.q.answer) + '</span>' +
        '<span class="why"><strong>Why:</strong> ' + (item.q.why || '') + '</span>' +
        '<span class="bank-tag">' + item.section.name + ' · ' + item.type.label + '</span>';
      list.appendChild(li);
    });
  }

  document.getElementById('startBtn').addEventListener('click', function () {
    build();
    document.getElementById('startPanel').hidden = true;
    document.getElementById('examPanel').hidden = false;
    handedIn = false;
    at = 0;
    show();
    startClock();
  });

  document.getElementById('prevBtn').addEventListener('click', function () { go(at - 1); });
  document.getElementById('nextBtn').addEventListener('click', function () { go(at + 1); });
  document.getElementById('flagBtn').addEventListener('click', function () {
    questions[at].flagged = !questions[at].flagged;
    show();
  });
  document.getElementById('submitBtn').addEventListener('click', function () { handIn(false); });
  document.getElementById('againBtn').addEventListener('click', function () { location.reload(); });
})(window.Mathly);
