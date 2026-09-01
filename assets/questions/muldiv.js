/* Multiply & Divide — CBSE Class 3: tables, 2-digit × 1-digit, equal sharing and remainders. */
(function (M) {
  'use strict';

  var TABLE = { easy: [2, 5], just: [2, 10], challenge: [2, 12] };
  var BIG = { easy: [10, 30], just: [10, 60], challenge: [10, 99] };
  var SMALL = { easy: [2, 5], just: [2, 9], challenge: [2, 9] };

  function band(map, ctx) { return map[ctx.level] || map.just; }
  function from(map, ctx) { var b = band(map, ctx); return M.rand.int(b[0], b[1]); }

  var NAMES = ['Aarav', 'Meera', 'Riya', 'Kabir', 'Ananya', 'Vihaan', 'Ishaan', 'Diya', 'Arjun', 'Sara'];
  var THINGS = ['ladoos', 'marbles', 'mangoes', 'pencils', 'stickers', 'biscuits', 'crayons'];

  M.register({
    id: 'muldiv-table', chapter: 'muldiv', label: 'Times tables', emoji: '✖️', tint: 'mul',
    make: function (ctx) {
      var a = from(TABLE, ctx), b = M.rand.int(2, ctx.level === 'challenge' ? 12 : 10);
      return { prompt: a + ' × ' + b, mode: 'number', answer: a * b };
    }
  });

  M.register({
    id: 'muldiv-two-digit', chapter: 'muldiv', label: '2-digit × 1-digit', emoji: '🔢', tint: 'add',
    make: function (ctx) {
      var big = from(BIG, ctx), small = from(SMALL, ctx);
      return {
        prompt: big + ' × ' + small,
        mode: 'number',
        answer: big * small,
        note: 'Split it: ' + (Math.floor(big / 10) * 10) + ' × ' + small + ' and ' + (big % 10) + ' × ' + small
      };
    }
  });

  M.register({
    id: 'muldiv-divide', chapter: 'muldiv', label: 'Sharing exactly', emoji: '➗', tint: 'div',
    make: function (ctx) {                      // built from the answer, so it always divides exactly
      var each = from(TABLE, ctx), groups = M.rand.int(2, ctx.level === 'challenge' ? 12 : 10);
      return { prompt: (each * groups) + ' ÷ ' + groups, mode: 'number', answer: each };
    }
  });

  M.register({
    id: 'muldiv-remainder', chapter: 'muldiv', label: 'How many left over?', emoji: '🍪', tint: 'sub',
    make: function (ctx) {
      var groups = M.rand.int(3, ctx.level === 'easy' ? 5 : 9);
      var each = from(TABLE, ctx);
      var left = M.rand.int(1, groups - 1);
      var thing = M.rand.pick(THINGS);
      return {
        prompt: (each * groups + left) + ' ' + thing + ' shared equally between ' + groups + ' friends',
        mode: 'multi',
        fields: [{ label: 'each' }, { label: 'left over' }],
        answer: [each, left]
      };
    },
    check: function (q) {
      return q.answer[1] < 1 ? 'nothing is left over, so the question has no second part' : null;
    }
  });

  M.register({
    id: 'muldiv-missing', chapter: 'muldiv', label: 'Missing number', emoji: '🕵️', tint: 'pct',
    make: function (ctx) {
      var a = from(TABLE, ctx), b = M.rand.int(2, 10), total = a * b;
      var shape = M.rand.pick(['times-second', 'times-first', 'divide']);
      if (shape === 'times-second') return { prompt: a + ' × ▢ = ' + total, mode: 'number', answer: b };
      if (shape === 'times-first') return { prompt: '▢ × ' + b + ' = ' + total, mode: 'number', answer: a };
      return { prompt: total + ' ÷ ▢ = ' + a, mode: 'number', answer: b };
    }
  });

  M.register({
    id: 'muldiv-groups', chapter: 'muldiv', label: 'Equal groups', emoji: '🟣', tint: 'frac',
    make: function (ctx) {
      var each = from(TABLE, ctx);
      var groups = M.rand.int(2, ctx.level === 'easy' ? 4 : 6);
      var sum = [];
      for (var i = 0; i < groups; i++) sum.push(each);
      return {
        prompt: sum.join(' + ') + ' = ▢ × ' + each,
        mode: 'number',
        answer: groups,
        note: 'How many groups of ' + each + ' are there?'
      };
    }
  });

  var STORIES = [
    function (n) {
      var who = M.rand.pick(NAMES), thing = M.rand.pick(THINGS);
      return {
        text: who + ' has ' + n.groups + ' boxes of ' + thing + '. Each box holds ' + n.each +
          '. How many ' + thing + ' altogether?',
        answer: n.groups * n.each
      };
    },
    function (n) {
      var thing = M.rand.pick(THINGS);
      return {
        text: (n.groups * n.each) + ' ' + thing + ' are shared equally between ' + n.groups +
          ' children. How many does each child get?',
        answer: n.each
      };
    },
    function (n) {
      return {
        text: 'One pencil costs ₹' + n.each + '. How much do ' + n.groups + ' pencils cost?',
        answer: n.each * n.groups
      };
    },
    function (n) {
      var thing = M.rand.pick(THINGS);
      return {
        text: (n.groups * n.each) + ' ' + thing + ' are put into rows of ' + n.each +
          '. How many rows are there?',
        answer: n.groups
      };
    }
  ];

  M.register({
    id: 'muldiv-story', chapter: 'muldiv', label: 'Story problems', emoji: '📖', tint: 'add',
    make: function (ctx) {
      var n = { each: from(TABLE, ctx), groups: M.rand.int(2, ctx.level === 'easy' ? 5 : 9) };
      var story = M.rand.pick(STORIES)(n);
      return { prompt: story.text, mode: 'number', answer: story.answer };
    }
  });
})(window.Mathly);
