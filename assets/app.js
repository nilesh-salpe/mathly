(function () {
  'use strict';

  var MIN = 1, MAX = 30;
  var setup = document.getElementById('setup');
  var fromEl = document.getElementById('from');
  var toEl = document.getElementById('to');
  var rowsEl = document.getElementById('rows');
  var hint = document.getElementById('setupHint');
  var panel = document.getElementById('sheetPanel');
  var grid = document.getElementById('grid');
  var result = document.getElementById('result');
  var resultEmoji = document.getElementById('resultEmoji');
  var resultHead = document.getElementById('resultHead');
  var resultSub = document.getElementById('resultSub');
  var resultStars = document.getElementById('resultStars');

  function clampInt(value, min, max) {
    var n = parseInt(value, 10);
    if (isNaN(n)) return null;
    return Math.min(max, Math.max(min, n));
  }

  function showHint(text, isError) {
    hint.textContent = text;
    hint.classList.toggle('error', !!isError);
  }

  function buildSheet(from, to, rows) {
    grid.innerHTML = '';

    var thead = document.createElement('thead');
    var headRow = document.createElement('tr');
    headRow.appendChild(document.createElement('th'));

    for (var n = from; n <= to; n++) {
      var th = document.createElement('th');
      th.className = 'col-head tint-' + (((n - from) % 6) + 1);
      th.dataset.col = String(n);

      var num = document.createElement('span');
      num.className = 'num';
      num.textContent = n + ' ×';
      th.appendChild(num);

      var label = document.createElement('label');
      var box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = true;
      box.className = 'col-check';
      box.dataset.col = String(n);
      box.setAttribute('aria-label', 'Mark the ' + n + ' times table');
      label.appendChild(box);
      label.appendChild(document.createTextNode('mark'));
      th.appendChild(label);

      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    grid.appendChild(thead);

    var tbody = document.createElement('tbody');
    for (var r = 1; r <= rows; r++) {
      var tr = document.createElement('tr');
      var rh = document.createElement('th');
      rh.className = 'row-head';
      rh.scope = 'row';
      rh.textContent = '× ' + r;
      tr.appendChild(rh);

      for (var c = from; c <= to; c++) {
        var td = document.createElement('td');
        td.className = 'cell';
        var input = document.createElement('input');
        input.type = 'text';
        input.inputMode = 'numeric';
        input.autocomplete = 'off';
        input.dataset.col = String(c);
        input.dataset.row = String(r);
        input.dataset.answer = String(c * r);
        input.setAttribute('aria-label', c + ' times ' + r);
        td.appendChild(input);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    grid.appendChild(tbody);

    panel.hidden = false;
    hideResult();
    var first = grid.querySelector('tbody input');
    if (first) first.focus();
  }

  function hideResult() {
    result.hidden = true;
    result.className = 'result';
    resultEmoji.textContent = '';
    resultHead.textContent = '';
    resultSub.textContent = '';
    resultStars.textContent = '';
  }

  function showResult(kind, emoji, head, sub, stars) {
    result.hidden = false;
    result.className = 'result ' + kind;
    resultEmoji.textContent = emoji;
    resultHead.textContent = head;
    resultSub.textContent = sub;
    resultStars.textContent = stars ? new Array(stars + 1).join('⭐') + new Array(6 - stars).join('☆') : '';
  }

  function clearMark(input) {
    input.classList.remove('right', 'wrong', 'blank');
    var note = input.parentNode.querySelector('.answer');
    if (note) note.remove();
  }

  function isColumnOn(col) {
    var box = grid.querySelector('.col-check[data-col="' + col + '"]');
    return box ? box.checked : false;
  }

  function setColumnState(col, on) {
    var head = grid.querySelector('.col-head[data-col="' + col + '"]');
    if (head) head.classList.toggle('off', !on);
    var inputs = grid.querySelectorAll('tbody input[data-col="' + col + '"]');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = !on;
      if (!on) clearMark(inputs[i]);
    }
  }

  function checkAnswers() {
    var inputs = grid.querySelectorAll('tbody input');
    var right = 0, wrong = 0, blank = 0, columns = 0;
    var seen = {};

    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      clearMark(input);
      if (!isColumnOn(input.dataset.col)) continue;
      if (!seen[input.dataset.col]) { seen[input.dataset.col] = true; columns++; }

      var typed = input.value.trim();
      if (typed === '') {
        input.classList.add('blank');
        blank++;
      } else if (typed.replace(/^0+(?=\d)/, '') === input.dataset.answer) {
        input.classList.add('right');
        right++;
      } else {
        input.classList.add('wrong');
        wrong++;
        var note = document.createElement('span');
        note.className = 'answer';
        note.textContent = input.dataset.answer;
        input.parentNode.appendChild(note);
      }
    }

    if (columns === 0) {
      showResult('mixed', '🤔', 'Nothing to mark yet!',
        'Tick the little box on top of a table, then press Check my answers.', 0);
      return;
    }

    var total = right + wrong + blank;
    var stars = total ? Math.min(4, Math.max(1, Math.round((right / total) * 5))) : 0;
    var tableWord = columns > 1 ? 'tables' : 'table';

    if (wrong === 0 && blank === 0) {
      showResult('pass', '🎉', 'Wow — all correct!',
        'You got all ' + right + ' right in ' + columns + ' ' + tableWord + '. Superstar! 🌟', 5);
    } else if (wrong === 0) {
      showResult('mixed', '🙂', 'Great so far!',
        right + ' correct, and ' + blank + ' box' + (blank > 1 ? 'es' : '') + ' still empty. Fill them in and check again!', stars);
    } else {
      var head = right >= wrong * 4 ? 'So close!' : (right >= wrong ? 'Nice try!' : 'Keep going — you can do it!');
      showResult('fail', '💪', head,
        right + ' correct and ' + wrong + ' to fix' + (blank ? ' (' + blank + ' still empty)' : '') +
        '. The right answer is in small letters under each pink box. 🔎', stars);
    }
  }

  function clearAnswers() {
    var inputs = grid.querySelectorAll('tbody input');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = '';
      clearMark(inputs[i]);
    }
    hideResult();
  }

  setup.addEventListener('submit', function (e) {
    e.preventDefault();
    var from = clampInt(fromEl.value, MIN, MAX);
    var to = clampInt(toEl.value, MIN, MAX);
    var rows = clampInt(rowsEl.value, MIN, MAX);

    if (from === null || to === null || rows === null) {
      showHint('Oops! Please use numbers from 1 to 30. 🙂', true);
      return;
    }
    if (from > to) { var swap = from; from = to; to = swap; }

    fromEl.value = from; toEl.value = to; rowsEl.value = rows;
    showHint('Here are the ' + from + ' to ' + to + ' tables, counting up to ×' + rows + '. Have fun! 🎈', false);
    buildSheet(from, to, rows);
  });

  grid.addEventListener('change', function (e) {
    if (e.target.classList.contains('col-check')) {
      setColumnState(e.target.dataset.col, e.target.checked);
    }
  });

  grid.addEventListener('input', function (e) {
    if (e.target.tagName === 'INPUT' && e.target.type === 'text') clearMark(e.target);
  });

  grid.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || e.target.tagName !== 'INPUT' || e.target.type !== 'text') return;
    e.preventDefault();
    var col = e.target.dataset.col;
    var next = parseInt(e.target.dataset.row, 10) + 1;
    var target = grid.querySelector('input[data-col="' + col + '"][data-row="' + next + '"]');
    if (target) target.focus();
  });

  document.getElementById('checkBtn').addEventListener('click', checkAnswers);
  document.getElementById('clearBtn').addEventListener('click', clearAnswers);

  document.getElementById('selectAll').addEventListener('click', function () {
    toggleAll(true);
  });
  document.getElementById('selectNone').addEventListener('click', function () {
    toggleAll(false);
  });

  function toggleAll(on) {
    var boxes = grid.querySelectorAll('.col-check');
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].checked = on;
      setColumnState(boxes[i].dataset.col, on);
    }
    hideResult();
  }

  // Start with a sheet ready to play with.
  buildSheet(2, 6, 10);
})();
