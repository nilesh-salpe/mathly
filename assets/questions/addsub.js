/* Add & Subtract — CBSE Class 3.
   easy = 2-digit, just right = 3-digit, challenge = 3-digit with two steps. */
(function (M) {
  'use strict';

  var SIZE = { easy: [10, 99], just: [100, 999], challenge: [100, 999] };

  function span(ctx) { return SIZE[ctx.level] || SIZE.just; }
  function number(ctx) { var s = span(ctx); return M.rand.int(s[0], s[1]); }

  var NAMES = ['Aarav', 'Meera', 'Riya', 'Kabir', 'Ananya', 'Vihaan', 'Ishaan', 'Diya', 'Arjun', 'Sara'];
  var THINGS = ['marbles', 'stickers', 'mangoes', 'ladoos', 'pencils', 'story books', 'cricket balls', 'crayons'];

  function twoNames() {
    var a = M.rand.pick(NAMES), b = M.rand.pick(NAMES);
    while (b === a) b = M.rand.pick(NAMES);
    return [a, b];
  }

  function roundTo(n, to) { return Math.round(n / to) * to; }

  M.register({
    id: 'addsub-add', chapter: 'addsub', label: 'Adding up', emoji: '➕', tint: 'add',
    make: function (ctx) {
      var a = number(ctx), b = number(ctx);
      return { prompt: a + ' + ' + b, mode: 'number', answer: a + b };
    }
  });

  M.register({
    id: 'addsub-sub', chapter: 'addsub', label: 'Taking away', emoji: '➖', tint: 'sub',
    make: function (ctx) {                       // built from the answer up, so it never goes below zero
      var b = number(ctx), left = number(ctx);
      return { prompt: (b + left) + ' − ' + b, mode: 'number', answer: left };
    }
  });

  M.register({
    id: 'addsub-missing', chapter: 'addsub', label: 'Missing number', emoji: '🕵️', tint: 'mul',
    make: function (ctx) {
      var a = number(ctx), b = number(ctx);
      var shape = M.rand.pick(['add-second', 'add-first', 'sub-second', 'sub-first']);
      if (shape === 'add-second') return { prompt: a + ' + ▢ = ' + (a + b), mode: 'number', answer: b };
      if (shape === 'add-first') return { prompt: '▢ + ' + b + ' = ' + (a + b), mode: 'number', answer: a };
      if (shape === 'sub-second') return { prompt: (a + b) + ' − ▢ = ' + a, mode: 'number', answer: b };
      return { prompt: '▢ − ' + b + ' = ' + a, mode: 'number', answer: a + b };
    }
  });

  M.register({
    id: 'addsub-estimate', chapter: 'addsub', label: 'Roughly how much?', emoji: '🤔', tint: 'div',
    make: function (ctx) {
      var to = ctx.level === 'easy' ? 10 : 100;
      var a = number(ctx), b = number(ctx);
      var answer = roundTo(a, to) + roundTo(b, to);
      var options = [answer, answer + to, answer - to, answer + 2 * to];
      var seen = {}, choices = [];
      options.forEach(function (value) {
        if (value > 0 && !seen[value] && choices.length < 4) { seen[value] = true; choices.push(String(value)); }
      });
      return {
        prompt: 'About how much is ' + a + ' + ' + b + '?',
        mode: 'choice',
        choices: M.rand.shuffle(choices),
        answer: String(answer),
        note: 'Round each number to the nearest ' + to + ' first'
      };
    }
  });

  M.register({
    id: 'addsub-inverse', chapter: 'addsub', label: 'Check it backwards', emoji: '🔁', tint: 'pct',
    make: function (ctx) {
      var a = number(ctx), b = number(ctx);
      var total = a + b;
      return M.rand.int(0, 1)
        ? { prompt: 'If ' + a + ' + ' + b + ' = ' + total + ', what is ' + total + ' − ' + b + '?', mode: 'number', answer: a }
        : { prompt: 'If ' + total + ' − ' + b + ' = ' + a + ', what is ' + a + ' + ' + b + '?', mode: 'number', answer: total };
    }
  });

  /* ---- word problems: the sentence is fixed, only the numbers move ---- */

  var ONE_STEP = [
    function (n) {
      var who = twoNames(), thing = M.rand.pick(THINGS);
      return {
        text: who[0] + ' had ' + n.a + ' ' + thing + '. ' + who[1] + ' gave ' + who[0] + ' ' + n.b +
          ' more. How many ' + thing + ' does ' + who[0] + ' have now?',
        answer: n.a + n.b
      };
    },
    function (n) {
      var thing = M.rand.pick(THINGS);
      return {
        text: 'One box has ' + n.a + ' ' + thing + ' and another box has ' + n.b +
          '. How many ' + thing + ' are there altogether?',
        answer: n.a + n.b
      };
    },
    function (n) {
      var who = twoNames(), thing = M.rand.pick(THINGS);
      return {
        text: who[0] + ' had ' + (n.a + n.b) + ' ' + thing + ' and gave ' + n.b + ' to ' + who[1] +
          '. How many ' + thing + ' are left?',
        answer: n.a
      };
    },
    function (n) {
      var thing = M.rand.pick(THINGS);
      return {
        text: 'A shop had ' + (n.a + n.b) + ' ' + thing + '. It sold ' + n.b +
          ' of them. How many ' + thing + ' are still in the shop?',
        answer: n.a
      };
    },
    function (n) {
      var who = twoNames();
      return {
        text: who[0] + ' has ₹' + (n.a + n.b) + ' and buys a book for ₹' + n.b +
          '. How much money is left?',
        answer: n.a
      };
    }
  ];

  var TWO_STEP = [
    function (n) {
      var who = twoNames(), thing = M.rand.pick(THINGS);
      return {
        text: who[0] + ' had ' + n.a + ' ' + thing + '. ' + who[1] + ' gave ' + who[0] + ' ' + n.b +
          ' more, and then ' + who[0] + ' gave ' + n.c + ' away. How many ' + thing + ' now?',
        answer: n.a + n.b - n.c
      };
    },
    function (n) {
      return {
        text: 'A bus had ' + n.a + ' people. At the first stop ' + n.c + ' got off and ' + n.b +
          ' got on. How many people are on the bus now?',
        answer: n.a - n.c + n.b
      };
    },
    function (n) {
      var thing = M.rand.pick(THINGS);
      return {
        text: 'A school had ' + n.a + ' ' + thing + '. It bought ' + n.b + ' more and gave ' + n.c +
          ' to another school. How many ' + thing + ' are left?',
        answer: n.a + n.b - n.c
      };
    }
  ];

  M.register({
    id: 'addsub-story', chapter: 'addsub', label: 'Story problems', emoji: '📖', tint: 'frac',
    make: function (ctx) {
      var s = span(ctx);
      var n = { a: M.rand.int(s[0], s[1]), b: M.rand.int(s[0], Math.max(s[0], Math.floor(s[1] / 2))) };
      var story = M.rand.pick(ONE_STEP)(n);
      return { prompt: story.text, mode: 'number', answer: story.answer };
    },
    check: function (q) {
      return q.answer >= 0 ? null : 'story gives a negative answer';
    }
  });

  M.register({
    id: 'addsub-story-two', chapter: 'addsub', label: 'Two-step stories', emoji: '📚', tint: 'add',
    make: function (ctx) {
      var s = span(ctx);
      var n = {
        a: M.rand.int(Math.max(s[0], 20), s[1]),
        b: M.rand.int(s[0], Math.max(s[0], Math.floor(s[1] / 3))),
        c: 0
      };
      n.c = M.rand.int(1, Math.min(n.a, Math.floor((n.a + n.b) / 2)));   // never takes away more than there is
      var story = M.rand.pick(TWO_STEP)(n);
      return { prompt: story.text, mode: 'number', answer: story.answer };
    },
    check: function (q) {
      return q.answer >= 0 ? null : 'story gives a negative answer';
    }
  });
})(window.Mathly);
