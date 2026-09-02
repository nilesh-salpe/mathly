/* Achievers — fewer questions, two things to hold in your head at once. */
(function (M) {
  'use strict';

  var mcq = M.olympiad.mcq;

  M.register({
    id: 'ach-two-conditions', chapter: 'ach', section: 'ach', label: 'Two rules at once', emoji: '🎯', tint: 'mul',
    make: function (ctx) {
      var a = M.rand.pick([2, 3, 4]), b = M.rand.pick([3, 4, 5, 6]);
      while (b === a) b = M.rand.pick([3, 4, 5, 6]);
      var step = a * b / (function gcd(x, y) { return y ? gcd(y, x % y) : x; })(a, b);
      var multiple = step * M.rand.int(2, ctx.level === 'easy' ? 4 : 8);
      var low = multiple - M.rand.int(2, 6), high = multiple + M.rand.int(2, 6);
      return mcq({
        prompt: 'Which number between ' + low + ' and ' + high + ' divides exactly by both ' + a + ' and ' + b + '?',
        answer: multiple,
        wrongs: [multiple + a, multiple - b, multiple + 1].filter(function (n) {
          return n > low && n < high && (n % a !== 0 || n % b !== 0);
        }),
        why: multiple + ' ÷ ' + a + ' = ' + (multiple / a) + ' and ' + multiple + ' ÷ ' + b + ' = ' +
          (multiple / b) + ', so it passes both tests. The others pass only one.'
      });
    },
    check: function (q) {
      return q.choices.length === 4 ? null : 'needs four options';
    }
  });

  M.register({
    id: 'ach-pattern-sum', chapter: 'ach', section: 'ach', label: 'Pattern then sum', emoji: '🧩', tint: 'add',
    make: function (ctx) {
      var step = M.rand.int(3, ctx.level === 'easy' ? 6 : 12);
      var start = M.rand.int(2, 20);
      var shown = [start, start + step, start + 2 * step, start + 3 * step];
      var next = start + 4 * step, after = start + 5 * step;
      var answer = next + after;
      return mcq({
        prompt: shown.join(', ') + ', … Continue the pattern and add the next two numbers together. What do you get?',
        answer: answer,
        wrongs: [next, after, next + shown[3]],
        why: 'The jump is + ' + step + ', so the next two numbers are ' + next + ' and ' + after +
          '. Together they make ' + answer + '.'
      });
    }
  });

  M.register({
    id: 'ach-true-statement', chapter: 'ach', section: 'ach', label: 'Which one is true?', emoji: '✅', tint: 'div',
    make: function (ctx) {
      var a = M.rand.int(11, ctx.level === 'easy' ? 60 : 400);
      var b = M.rand.int(11, ctx.level === 'easy' ? 60 : 400);
      while (b === a) b = M.rand.int(11, 400);
      var big = Math.max(a, b), small = Math.min(a, b);
      var truth = big + ' − ' + small + ' = ' + (big - small);
      return mcq({
        prompt: 'Look at the numbers ' + a + ' and ' + b + '. Which statement is true?',
        answer: truth,
        wrongs: [
          small + ' is greater than ' + big,
          big + ' + ' + small + ' = ' + (big - small),
          big + ' − ' + small + ' = ' + (big + small)
        ],
        why: big + ' is the bigger number, and ' + big + ' − ' + small + ' = ' + (big - small) +
          '. The other three statements do not hold.'
      });
    }
  });

  M.register({
    id: 'ach-two-step-money', chapter: 'ach', section: 'ach', label: 'Two-step money', emoji: '🪙', tint: 'pct',
    make: function (ctx) {
      var price = M.rand.int(12, ctx.level === 'easy' ? 30 : 80);
      var many = M.rand.int(3, 6);
      var pocket = price * many + M.rand.int(20, 120);
      var left = pocket - price * many;
      var more = Math.floor(left / price);
      return mcq({
        prompt: 'A pen costs ₹' + price + '. With ₹' + pocket + ' you buy ' + many +
          ' pens. How many more pens could you still buy with the money left?',
        answer: more,
        wrongs: [many + more, Math.floor(pocket / price), more + 1],
        why: many + ' pens cost ₹' + (price * many) + ', leaving ₹' + left + '. That buys ' + more +
          ' more pen' + (more === 1 ? '' : 's') + ' at ₹' + price + ' each.'
      });
    },
    check: function (q) { return Number(q.answer) >= 0 ? null : 'negative answer'; }
  });
})(window.Mathly);
