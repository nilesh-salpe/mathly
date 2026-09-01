/* Numbers & Place Value — CBSE Class 3.
   easy = 2-digit, just right = 3-digit, challenge = 4-digit. */
(function (M) {
  'use strict';

  var SIZE = {
    easy:      { min: 10,   max: 99,   places: ['tens', 'ones'] },
    just:      { min: 100,  max: 999,  places: ['hundreds', 'tens', 'ones'] },
    challenge: { min: 1000, max: 9999, places: ['thousands', 'hundreds', 'tens', 'ones'] }
  };

  function size(ctx) { return SIZE[ctx.level] || SIZE.just; }
  function number(ctx) { var s = size(ctx); return M.rand.int(s.min, s.max); }

  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function inWords(n) {
    if (n < 20) return ONES[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
    if (n < 1000) {
      var rest = n % 100;
      return ONES[Math.floor(n / 100)] + ' hundred' + (rest ? ' and ' + inWords(rest) : '');
    }
    var left = n % 1000;
    return inWords(Math.floor(n / 1000)) + ' thousand' +
      (left ? (left < 100 ? ' and ' : ' ') + inWords(left) : '');
  }

  function digitsOf(n, places) {
    var out = [];
    for (var i = places.length - 1; i >= 0; i--) {
      out.unshift(n % 10);
      n = Math.floor(n / 10);
    }
    return out;
  }

  function distinctChoices(right, makers) {
    var seen = {}, list = [String(right)];
    seen[String(right)] = true;
    for (var i = 0; i < makers.length && list.length < 4; i++) {
      var value = String(makers[i]());
      if (!seen[value] && Number(value) > 0) { seen[value] = true; list.push(value); }
    }
    return M.rand.shuffle(list);
  }

  M.register({
    id: 'numbers-expanded', chapter: 'numbers', label: 'Expanded form', emoji: '🧱', tint: 'add',
    make: function (ctx) {
      var places = size(ctx).places;
      var n = number(ctx);
      var digits = digitsOf(n, places);
      return {
        prompt: n + ' =',
        mode: 'multi',
        fields: places.map(function (p) { return { label: p }; }),
        answer: digits
      };
    }
  });

  M.register({
    id: 'numbers-compare', chapter: 'numbers', label: 'Bigger or smaller', emoji: '⚖️', tint: 'sub',
    make: function (ctx) {
      var a = number(ctx);
      var b = M.rand.int(0, 5) === 0 ? a : number(ctx);
      return {
        prompt: a + '  ◻  ' + b,
        mode: 'choice',
        choices: ['<', '>', '='],
        answer: a < b ? '<' : (a > b ? '>' : '='),
        note: 'Put the right sign in the box'
      };
    }
  });

  M.register({
    id: 'numbers-digit-value', chapter: 'numbers', label: 'Value of a digit', emoji: '🔍', tint: 'mul',
    make: function (ctx) {
      var places = size(ctx).places;
      var n, digits, at = -1;

      // the digit asked about must appear only once, or the question has two answers
      for (var tries = 0; tries < 30 && at < 0; tries++) {
        n = number(ctx);
        digits = digitsOf(n, places);
        var once = [];
        digits.forEach(function (d, i) {
          if (d !== 0 && digits.filter(function (other) { return other === d; }).length === 1) once.push(i);
        });
        if (once.length) at = M.rand.pick(once);
      }
      if (at < 0) { n = 1234; digits = digitsOf(n, places); at = 0; }

      return {
        prompt: 'In ' + n + ', what is the ' + digits[at] + ' worth?',
        mode: 'number',
        answer: digits[at] * Math.pow(10, places.length - 1 - at)
      };
    },
    check: function (q) {
      var shown = q.prompt.match(/In (\d+), what is the (\d)/);
      if (!shown) return 'prompt does not read properly';
      var count = shown[1].split('').filter(function (d) { return d === shown[2]; }).length;
      return count === 1 ? null : 'the digit ' + shown[2] + ' appears ' + count + ' times in ' + shown[1];
    }
  });

  M.register({
    id: 'numbers-neighbours', chapter: 'numbers', label: 'Before, after, between', emoji: '↔️', tint: 'div',
    make: function (ctx) {
      var n = number(ctx);
      var kind = M.rand.pick(['after', 'before', 'between']);
      if (kind === 'after') return { prompt: 'What comes just after ' + n + '?', mode: 'number', answer: n + 1 };
      if (kind === 'before') return { prompt: 'What comes just before ' + n + '?', mode: 'number', answer: n - 1 };
      return { prompt: 'What comes between ' + (n - 1) + ' and ' + (n + 1) + '?', mode: 'number', answer: n };
    }
  });

  M.register({
    id: 'numbers-skip', chapter: 'numbers', label: 'Skip counting', emoji: '🦘', tint: 'pct',
    make: function (ctx) {
      var steps = { easy: [2, 5, 10], just: [2, 3, 4, 5, 10], challenge: [25, 50, 100] };
      var step = M.rand.pick(steps[ctx.level] || steps.just);
      var start = step * M.rand.int(1, 8);
      var shown = [start, start + step, start + 2 * step, start + 3 * step];
      return {
        prompt: shown.join(', ') + ', ▢',
        mode: 'number',
        answer: start + 4 * step,
        note: 'Counting in ' + step + 's'
      };
    }
  });

  M.register({
    id: 'numbers-round', chapter: 'numbers', label: 'Rounding', emoji: '🎯', tint: 'frac',
    make: function (ctx) {
      var toNearest = ctx.level === 'challenge' ? 100 : 10;
      var n = number(ctx);
      if (n % toNearest === 0) n += M.rand.int(1, toNearest - 1);
      return {
        prompt: 'Round ' + n + ' to the nearest ' + toNearest,
        mode: 'number',
        answer: Math.round(n / toNearest) * toNearest
      };
    }
  });

  M.register({
    id: 'numbers-words', chapter: 'numbers', label: 'Numbers in words', emoji: '🔤', tint: 'add',
    make: function (ctx) {
      var n = number(ctx);
      var digits = String(n).split('');
      var swapped = digits.length > 1
        ? Number(digits.slice().reverse().join(''))
        : n + 1;
      var choices = distinctChoices(n, [
        function () { return swapped; },
        function () { return n + (ctx.level === 'easy' ? 9 : 90); },
        function () { return Math.max(1, n - (ctx.level === 'easy' ? 10 : 100)); },
        function () { return n * 10; }
      ]);
      return {
        prompt: 'Which number is ' + inWords(n) + '?',
        mode: 'choice',
        choices: choices,
        answer: String(n)
      };
    }
  });

  M.inWords = inWords;   // the concept pages use this too
})(window.Mathly);
