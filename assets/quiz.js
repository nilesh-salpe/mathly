(function () {
  'use strict';

  var STORE = 'mathly-quiz-scores';

  var setup = document.getElementById('quizSetup');
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
  var questions = [];
  var ticker = null;
  var secondsLeft = 0;
  var secondsUsed = 0;
  var finished = true;

  function clampInt(value, min, max, fallback) {
    var n = parseInt(value, 10);
    if (isNaN(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function twoDigits(n) { return (n < 10 ? '0' : '') + n; }

  function clockText(total) {
    return twoDigits(Math.floor(total / 60)) + ':' + twoDigits(total % 60);
  }

  function starsText(count) {
    return new Array(count + 1).join('⭐') + new Array(6 - count).join('☆');
  }

  var OP_NAMES = { add: 'adding', sub: 'taking away', mul: 'times', div: 'sharing', pct: 'percentages', frac: 'fractions' };
  var OP_EMOJI = { add: '➕', sub: '➖', mul: '✖️', div: '➗', pct: '💯', frac: '🍕' };
  var PERCENTS = [10, 20, 25, 50, 75, 100];
  var PERCENT_BASES = [20, 40, 50, 60, 80, 100, 120];
  var DENOMS = [2, 3, 4, 5, 10];

  function pick(arr) { return arr[randomInt(0, arr.length - 1)]; }

  function gcd(a, b) { return b ? gcd(b, a % b) : a; }

  function howManyParts(cfg) {
    return cfg.factors === 'mix' ? randomInt(2, 4) : cfg.factors;
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = randomInt(0, i);
      var swap = arr[i]; arr[i] = arr[j]; arr[j] = swap;
    }
    return arr;
  }

  // Deal the ticked operations round by round, so every kind shows up
  // before any of them comes round a second time.
  function opSchedule(ops, count) {
    var seq = [];
    while (seq.length < count) seq = seq.concat(shuffle(ops.slice()));
    return seq.slice(0, count);
  }

  function buildQuestion(cfg, op) {
    op = op || pick(cfg.ops);
    var n = howManyParts(cfg);
    var parts = [];
    var i, rest, sum, product, result;

    if (op === 'add') {
      for (i = 0; i < n; i++) parts.push(randomInt(cfg.from, cfg.to));
      sum = parts.reduce(function (a, b) { return a + b; }, 0);
      return { op: 'add', text: parts.join(' + '), answer: sum };
    }

    if (op === 'sub') {                     // built backwards so it never goes below zero
      rest = [];
      for (i = 0; i < n - 1; i++) rest.push(randomInt(cfg.from, cfg.to));
      result = randomInt(cfg.from, cfg.to);
      var first = rest.reduce(function (a, b) { return a + b; }, result);
      return { op: 'sub', text: [first].concat(rest).join(' − '), answer: result };
    }

    if (op === 'mul') {
      for (i = 0; i < n; i++) parts.push(randomInt(cfg.from, cfg.to));
      product = parts.reduce(function (a, b) { return a * b; }, 1);
      return { op: 'mul', text: parts.join(' × '), answer: product };
    }

    if (op === 'div') {                     // built backwards so it always divides exactly
      rest = [];
      for (i = 0; i < n - 1; i++) rest.push(Math.max(1, randomInt(cfg.from, cfg.to)));
      result = randomInt(cfg.from, cfg.to);
      var top = rest.reduce(function (a, b) { return a * b; }, result);
      return { op: 'div', text: [top].concat(rest).join(' ÷ '), answer: result };
    }

    if (op === 'pct') {                     // friendly numbers only, answers stay whole
      var percent = pick(PERCENTS);
      var base = pick(PERCENT_BASES);
      for (i = 0; i < 12 && (base * percent) % 100 !== 0; i++) {
        percent = pick(PERCENTS);
        base = pick(PERCENT_BASES);
      }
      if ((base * percent) % 100 !== 0) { percent = 50; base = 60; }
      return { op: 'pct', text: percent + '% of ' + base, answer: base * percent / 100 };
    }

    var denom = pick(DENOMS);               // fractions of a whole number, lowest terms
    var numer = randomInt(1, denom - 1);
    for (i = 0; i < 10 && gcd(numer, denom) !== 1; i++) numer = randomInt(1, denom - 1);
    if (gcd(numer, denom) !== 1) numer = 1;
    var chunk = randomInt(cfg.from, cfg.to);
    return { op: 'frac', text: numer + '/' + denom + ' of ' + (denom * chunk), answer: numer * chunk };
  }

  function makeQuestions(cfg) {
    var schedule = opSchedule(cfg.ops, cfg.count);
    var made = [];
    var seen = {};

    for (var i = 0; i < schedule.length; i++) {
      var q = buildQuestion(cfg, schedule[i]);
      for (var tries = 0; tries < 40 && seen[q.text]; tries++) {
        q = buildQuestion(cfg, schedule[i]);       // tiny ranges: repeats are fine in the end
      }
      seen[q.text] = true;
      made.push(q);
    }
    return made;
  }

  function renderQuiz() {
    list.innerHTML = '';
    questions.forEach(function (q, index) {
      var li = document.createElement('li');
      li.className = 'quiz-item op-' + q.op;

      var badge = document.createElement('span');
      badge.className = 'quiz-badge';
      badge.innerHTML = '<span class="quiz-no">' + (index + 1) + '</span>' +
        '<span class="quiz-op" aria-hidden="true">' + OP_EMOJI[q.op] + '</span>';
      li.appendChild(badge);

      var sum = document.createElement('span');
      sum.className = 'quiz-sum';
      sum.textContent = q.text + ' =';
      li.appendChild(sum);

      var input = document.createElement('input');
      input.type = 'text';
      input.inputMode = 'numeric';
      input.autocomplete = 'off';
      input.className = 'quiz-input';
      input.dataset.index = String(index);
      input.setAttribute('aria-label', 'Answer for ' + q.text);
      li.appendChild(input);

      var mark = document.createElement('span');
      mark.className = 'quiz-mark';
      li.appendChild(mark);

      list.appendChild(li);
    });
  }

  function stopTimer() {
    if (ticker) { clearInterval(ticker); ticker = null; }
  }

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
      if (secondsLeft <= 0) {
        timerBox.classList.add('done');
        finishQuiz(true);
      }
    }, 1000);
  }

  function describe(cfg) {
    var kind = cfg.factors === 'mix' ? 'mixed 2–4 numbers' : cfg.factors + ' numbers';
    var ops = cfg.ops.map(function (o) { return OP_NAMES[o]; }).join(', ');
    return cfg.count + ' sums · ' + ops + ' · ' + kind + ' · from ' + cfg.from + ' to ' + cfg.to;
  }

  function startQuiz() {
    questions = makeQuestions(settings);
    finished = false;
    renderQuiz();
    result.hidden = true;
    result.className = 'result';
    title.textContent = '2. Answer the sums ✏️';
    var extra = document.createElement('span');
    extra.className = 'quiz-title-extra';
    extra.textContent = describe(settings);
    title.appendChild(extra);
    panel.hidden = false;
    startTimer();
    var first = list.querySelector('input');
    if (first) first.focus();
  }

  function finishQuiz(byTimer) {
    if (finished) return;
    finished = true;
    stopTimer();
    if (settings.limit && !byTimer) secondsUsed = settings.limit - Math.max(0, secondsLeft);

    var right = 0, wrong = 0, blank = 0;
    var inputs = list.querySelectorAll('.quiz-input');

    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      var q = questions[Number(input.dataset.index)];
      var mark = input.parentNode.querySelector('.quiz-mark');
      var typed = input.value.trim();
      input.disabled = true;
      input.classList.remove('right', 'wrong', 'blank');

      if (typed === '') {
        input.classList.add('blank');
        mark.className = 'quiz-mark blank';
        mark.textContent = '💛 ' + q.answer;
        blank++;
      } else if (typed.replace(/^0+(?=\d)/, '') === String(q.answer)) {
        input.classList.add('right');
        mark.className = 'quiz-mark right';
        mark.textContent = '✅ 1 point';
        right++;
      } else {
        input.classList.add('wrong');
        mark.className = 'quiz-mark wrong';
        mark.textContent = '❌ it was ' + q.answer;
        wrong++;
      }
    }

    var total = questions.length;
    var perfect = right === total;
    var stars = perfect ? 5 : Math.min(4, Math.max(0, Math.round((right / total) * 5)));
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

    saveScore({
      when: Date.now(),
      right: right,
      total: total,
      stars: stars,
      seconds: settings.limit ? secondsUsed : null,
      timedOut: !!byTimer,
      about: describe(settings)
    });
  }

  function readScores() {
    try { return JSON.parse(localStorage.getItem(STORE)) || []; } catch (e) { return []; }
  }

  function saveScore(entry) {
    var all = readScores();
    all.unshift(entry);
    all = all.slice(0, 20);
    try { localStorage.setItem(STORE, JSON.stringify(all)); } catch (e) { /* private mode */ }
    renderScores(all);
  }

  function renderScores(all) {
    all = all || readScores();
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

  setup.addEventListener('submit', function (e) {
    e.preventDefault();
    var from = clampInt(document.getElementById('qFrom').value, 1, 30, 2);
    var to = clampInt(document.getElementById('qTo').value, 1, 30, 12);
    if (from > to) { var swap = from; from = to; to = swap; }
    var ops = [].slice.call(document.querySelectorAll('.op-check:checked')).map(function (b) { return b.value; });
    if (!ops.length) {
      hint.classList.add('error');
      hint.textContent = 'Pick at least one kind of sum first — ➕ ➖ ✖️ ➗ 💯 🍕';
      return;
    }
    var factorsRaw = document.getElementById('qFactors').value;
    var minutes = clampInt(document.getElementById('qMinutes').value, 0, 60, 3);
    var seconds = clampInt(document.getElementById('qSeconds').value, 0, 59, 0);

    document.getElementById('qFrom').value = from;
    document.getElementById('qTo').value = to;
    document.getElementById('qMinutes').value = minutes;
    document.getElementById('qSeconds').value = seconds;

    settings = {
      ops: ops,
      from: from,
      to: to,
      factors: factorsRaw === 'mix' ? 'mix' : parseInt(factorsRaw, 10),
      count: clampInt(document.getElementById('qCount').value, 1, 50, 10),
      limit: minutes * 60 + seconds
    };
    document.getElementById('qCount').value = settings.count;

    hint.classList.remove('error');
    hint.textContent = settings.limit
      ? 'Your quiz is ready — you have ' + clockText(settings.limit) + ' on the clock. Good luck! 🍀'
      : 'Your quiz is ready — no timer this time, take as long as you like. 🍀';
    startQuiz();
  });

  list.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || !e.target.classList.contains('quiz-input')) return;
    e.preventDefault();
    var next = list.querySelector('.quiz-input[data-index="' + (Number(e.target.dataset.index) + 1) + '"]');
    if (next) next.focus(); else finishQuiz(false);
  });

  document.getElementById('finishBtn').addEventListener('click', function () { finishQuiz(false); });
  document.getElementById('newQuizBtn').addEventListener('click', function () {
    if (!settings) return;
    startQuiz();
  });
  document.getElementById('clearScores').addEventListener('click', function () {
    try { localStorage.removeItem(STORE); } catch (e) { /* ignore */ }
    renderScores([]);
  });

  renderScores();
})();
