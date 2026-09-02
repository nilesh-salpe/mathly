/* Checks every registered question type against the invariants a child would
   otherwise find: whole answers, nothing negative, prompts that read properly,
   exactly one correct choice, and answers that mark themselves right. */
(function (M) {
  'use strict';

  var SAMPLES = 200;
  var MODES = { number: 1, choice: 1, multi: 1, unit: 1 };

  function checkOne(q, type) {
    if (!q) return 'make() returned nothing';
    if (typeof q.prompt !== 'string' || !q.prompt.trim()) return 'empty prompt';
    if (/NaN|undefined|null/.test(q.prompt)) return 'prompt reads "' + q.prompt + '"';
    if (!MODES[q.mode]) return 'unknown answer mode "' + q.mode + '"';

    if (q.mode === 'multi') {
      if (!Array.isArray(q.answer) || !Array.isArray(q.fields)) return 'multi needs fields and an answer list';
      if (q.answer.length !== q.fields.length) return 'multi has ' + q.fields.length + ' boxes but ' + q.answer.length + ' answers';
      for (var i = 0; i < q.answer.length; i++) {
        if (!Number.isInteger(q.answer[i]) || q.answer[i] < 0) return 'answer ' + q.answer[i] + ' is not a whole number';
      }
      if (!M.isRight(q, q.answer.map(String))) return 'its own answer marks as wrong';
      return type && type.check ? type.check(q) : null;
    }

    if (q.mode === 'choice') {
      if (!Array.isArray(q.choices) || q.choices.length < 2 || q.choices.length > 4) return 'needs 2 to 4 choices';
      // olympiad questions are always four options with a reason attached
      if (type && type.section) {
        if (q.choices.length !== 4) return 'an olympiad question needs exactly four options';
        if (!q.why || !String(q.why).trim()) return 'no explanation on this question';
        if (/undefined|NaN/.test(String(q.why))) return 'the explanation reads badly';
        // every option must look like the same kind of thing as the answer:
        // digits stay digits (a code may keep a leading zero), words stay words
        var digitsOnly = /^\d+$/;
        var answerIsDigits = digitsOnly.test(String(q.answer));
        for (var c = 0; c < q.choices.length; c++) {
          var option = String(q.choices[c]);
          if (option.length > 30) return 'an option is too long to be believable';
          if (answerIsDigits && !digitsOnly.test(option)) return 'option "' + option + '" is not a plain number';
          if (/\d\.\d{3}/.test(option)) return 'option "' + option + '" looks like a stray number';
        }
      }
      var seen = {}, correct = 0;
      q.choices.forEach(function (c) {
        if (seen[c]) correct = -99;
        seen[c] = true;
        if (String(c) === String(q.answer)) correct++;
      });
      if (correct !== 1) return correct < 0 ? 'duplicate choices' : correct + ' of the choices are correct';
      if (!M.isRight(q, q.answer)) return 'its own answer marks as wrong';
      return type && type.check ? type.check(q) : null;
    }

    if (!Number.isInteger(q.answer)) return 'answer ' + q.answer + ' is not a whole number';
    if (q.answer < 0) return 'answer ' + q.answer + ' is below zero';
    if (q.answer > 1e12) return 'answer ' + q.answer + ' is far too big';
    if (!M.isRight(q, String(q.answer))) return 'its own answer marks as wrong';
    if (M.isRight(q, 'banana')) return 'marks nonsense as correct';
    return type && type.check ? type.check(q) : null;
  }

  function run(report) {
    var rows = [];
    var failures = 0;

    M.all().forEach(function (type) {
      M.LEVEL_ORDER.forEach(function (levelId) {
        var level = M.level(levelId);
        var ctx = { level: levelId, from: level.from, to: level.to, parts: level.parts };
        var problem = null;
        var prompts = {};
        var repeats = 0;

        for (var i = 0; i < SAMPLES && !problem; i++) {
          var q;
          try { q = type.make(ctx); } catch (e) { problem = 'threw ' + e.message; break; }
          problem = checkOne(q, type);
          if (prompts[q && q.prompt]) repeats++;
          if (q) prompts[q.prompt] = true;
        }

        if (problem) failures++;
        rows.push({
          type: type.chapter + ' · ' + type.label,
          id: type.id,
          level: level.label,
          problem: problem,
          variety: Math.round((1 - repeats / SAMPLES) * 100)
        });
      });
    });

    report(rows, failures);
  }

  window.MathlySelfTest = { run: run, SAMPLES: SAMPLES };
})(window.Mathly);
