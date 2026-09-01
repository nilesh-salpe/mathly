(function (M) {
  'use strict';

  // only a bare sum gets an "=" after it; a worded question already ends properly
  function needsEquals(q) {
    return (q.mode === 'number' || q.mode === 'unit') && !/[a-z▢◻,]/i.test(q.prompt);
  }

  function param(name) {
    var found = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    return found ? decodeURIComponent(found[1]) : null;
  }

  var concepts = window.MATHLY_CONCEPTS || {};
  var id = param('t') || Object.keys(concepts)[0];
  var concept = concepts[id];
  if (!concept) {
    document.getElementById('conceptTitle').textContent = 'This page has moved';
    document.getElementById('conceptIdea').textContent = 'Pick a topic from the chapter page.';
    return;
  }

  var chapters = (window.MATHLY && window.MATHLY.chapters) || [];
  var chapter = chapters.filter(function (c) { return c.id === concept.chapter; })[0];

  document.title = concept.title + ' · Mathly';
  document.getElementById('conceptTitle').innerHTML =
    '<span class="brand-emoji" aria-hidden="true">' + concept.emoji + '</span> ' + concept.title;
  document.getElementById('conceptIdea').textContent = concept.bigIdea;
  document.getElementById('conceptCrumb').textContent = concept.title;
  document.getElementById('conceptPicture').innerHTML = concept.picture;
  document.getElementById('conceptCaption').textContent = concept.pictureCaption || '';
  document.getElementById('practiceLink').href = concept.practice;

  if (chapter) {
    var crumb = document.getElementById('chapterCrumb');
    crumb.href = 'chapter.html?c=' + chapter.id;
    crumb.innerHTML = chapter.emoji + ' ' + chapter.title;
  }

  /* ---- steps, revealed one at a time ---- */
  var stepsList = document.getElementById('conceptSteps');
  var nextButton = document.getElementById('nextStep');
  var shown = 0;

  concept.steps.forEach(function (step) {
    var li = document.createElement('li');
    li.className = 'step';
    li.hidden = true;
    li.innerHTML = '<strong>' + step.head + '</strong><span>' + step.text + '</span>';
    stepsList.appendChild(li);
  });

  function revealStep() {
    if (shown >= concept.steps.length) return;
    stepsList.children[shown].hidden = false;
    shown++;
    if (shown >= concept.steps.length) {
      nextButton.disabled = true;
      nextButton.innerHTML = '<span class="btn-emoji" aria-hidden="true">🎉</span>That is the whole method!';
    }
  }

  nextButton.addEventListener('click', revealStep);
  revealStep();

  /* ---- try one: two questions, instant marking, no score ---- */
  var tryList = document.getElementById('conceptTry');
  var tries = [];

  function drawTry() {
    tryList.innerHTML = '';
    tries = [];
    concept.tryTypes.forEach(function (typeId, index) {
      var type = M.get(typeId);
      if (!type) return;
      var q = type.make({ level: param('level') || 'just', from: 2, to: 12, parts: 2 });

      var li = document.createElement('li');
      li.className = 'quiz-item op-' + (type.tint || 'add');

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

      var item = { q: q, li: li };

      if (q.mode === 'choice') {
        var group = document.createElement('span');
        group.className = 'choices';
        q.choices.forEach(function (choice) {
          var button = document.createElement('button');
          button.type = 'button';
          button.className = 'choice';
          button.textContent = choice;
          button.addEventListener('click', function () {
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
        q.fields.forEach(function (field) {
          var cell = document.createElement('span');
          cell.className = 'multi-cell';
          cell.appendChild(box());
          var label = document.createElement('span');
          label.className = 'multi-label';
          label.textContent = field.label;
          cell.appendChild(label);
          wrap.appendChild(cell);
        });
        li.appendChild(wrap);
        item.el = wrap;
      } else {
        var single = box();
        li.appendChild(single);
        item.el = single;
      }

      var mark = document.createElement('span');
      mark.className = 'quiz-mark';
      li.appendChild(mark);
      item.mark = mark;

      tryList.appendChild(li);
      tries.push(item);
    });
  }

  function box() {
    var input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'numeric';
    input.autocomplete = 'off';
    input.className = 'quiz-input';
    return input;
  }

  function given(item) {
    if (item.q.mode === 'choice') return item.given;
    if (item.q.mode === 'multi') {
      return [].slice.call(item.el.querySelectorAll('input')).map(function (i) { return i.value.trim(); });
    }
    return item.el.value.trim();
  }

  document.getElementById('checkTry').addEventListener('click', function () {
    tries.forEach(function (item) {
      var value = given(item);
      var blank = item.q.mode === 'choice' ? !value
        : item.q.mode === 'multi' ? value.every(function (v) { return v === ''; })
        : value === '';
      var state = blank ? 'blank' : (M.isRight(item.q, value) ? 'right' : 'wrong');

      item.li.querySelectorAll('.quiz-input').forEach(function (i) {
        i.classList.remove('right', 'wrong', 'blank');
        i.classList.add(state);
      });
      if (item.q.mode === 'choice') {
        [].slice.call(item.el.children).forEach(function (b) {
          b.classList.remove('right', 'wrong');
          if (b.textContent === String(item.q.answer)) b.classList.add('right');
          else if (b.classList.contains('picked')) b.classList.add('wrong');
        });
      }
      item.mark.className = 'quiz-mark ' + state;
      item.mark.textContent = state === 'right' ? '✅ Yes!'
        : state === 'blank' ? '💛 ' + M.answerText(item.q)
        : '❌ it was ' + M.answerText(item.q);
    });
  });

  document.getElementById('newTry').addEventListener('click', drawTry);
  drawTry();
})(window.Mathly);
