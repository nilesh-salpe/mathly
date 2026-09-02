/* Data Handling — CBSE Class 3: tally marks, pictographs and simple tables. */
(function (M) {
  'use strict';

  var THINGS = [
    { one: 'bike', many: 'bikes', emoji: '🚲' },
    { one: 'book', many: 'books', emoji: '📗' },
    { one: 'mango', many: 'mangoes', emoji: '🥭' },
    { one: 'ball', many: 'balls', emoji: '⚽' },
    { one: 'flower', many: 'flowers', emoji: '🌼' },
    { one: 'bus', many: 'buses', emoji: '🚌' }
  ];
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  var NAMES = ['Aarav', 'Meera', 'Riya', 'Kabir', 'Ananya', 'Diya'];

  /* tally marks: bundles of five, the fifth drawn across the other four */
  function tallySvg(total) {
    var bundles = Math.floor(total / 5), left = total % 5, body = '', x = 12;
    function bundle(count, crossed) {
      var out = '';
      for (var i = 0; i < count; i++) {
        out += '<line x1="' + (x + i * 11) + '" y1="10" x2="' + (x + i * 11) + '" y2="52" stroke="#3d3450" stroke-width="4" stroke-linecap="round"/>';
      }
      if (crossed) {
        out += '<line x1="' + (x - 4) + '" y1="48" x2="' + (x + 4 * 11 + 4) + '" y2="14" stroke="#c9457e" stroke-width="4" stroke-linecap="round"/>';
      }
      x += count * 11 + (crossed ? 22 : 16);
      return out;
    }
    for (var b = 0; b < bundles; b++) body += bundle(4, true);
    if (left) body += bundle(left, false);
    return '<svg viewBox="0 0 ' + Math.max(x, 60) + ' 62" role="img" aria-label="tally marks">' + body + '</svg>';
  }

  M.register({
    id: 'data-tally', chapter: 'data', label: 'Tally marks', emoji: '✋', tint: 'add',
    make: function (ctx) {
      var total = M.rand.int(ctx.level === 'easy' ? 3 : 7, ctx.level === 'challenge' ? 39 : 24);
      return {
        picture: tallySvg(total),
        prompt: 'How many does this tally show?',
        mode: 'number',
        answer: total,
        note: 'Each crossed bundle is 5'
      };
    }
  });

  M.register({
    id: 'data-tally-draw', chapter: 'data', label: 'Bundles of five', emoji: '5️⃣', tint: 'sub',
    make: function (ctx) {
      var total = M.rand.int(6, ctx.level === 'easy' ? 19 : 44);
      return {
        prompt: 'To tally ' + total + ', how many full bundles of 5 and how many single marks?',
        mode: 'multi',
        fields: [{ label: 'bundles' }, { label: 'singles' }],
        answer: [Math.floor(total / 5), total % 5]
      };
    }
  });

  M.register({
    id: 'data-pictograph', chapter: 'data', label: 'Reading a pictograph', emoji: '📊', tint: 'mul',
    make: function (ctx) {
      var thing = M.rand.pick(THINGS);
      var stands = M.rand.pick(ctx.level === 'easy' ? [2, 5] : [2, 5, 10]);
      var pictures = M.rand.int(2, 6);
      var day = M.rand.pick(DAYS);
      var row = new Array(pictures + 1).join(thing.emoji + ' ');
      return {
        prompt: 'Each ' + thing.emoji + ' stands for ' + stands + ' ' + thing.many + '.  ' + day + ': ' +
          row.trim() + '  — how many ' + thing.many + ' is that?',
        mode: 'number',
        answer: pictures * stands
      };
    }
  });

  M.register({
    id: 'data-total', chapter: 'data', label: 'Adding up a table', emoji: '🧮', tint: 'div',
    make: function (ctx) {
      var thing = M.rand.pick(THINGS);
      var top = ctx.level === 'easy' ? 9 : 30;
      var counts = [M.rand.int(2, top), M.rand.int(2, top), M.rand.int(2, top)];
      return {
        prompt: DAYS[0] + ': ' + counts[0] + ' ' + thing.many + ', ' + DAYS[1] + ': ' + counts[1] +
          ', ' + DAYS[2] + ': ' + counts[2] + '. How many ' + thing.many + ' altogether?',
        mode: 'number',
        answer: counts[0] + counts[1] + counts[2]
      };
    }
  });

  M.register({
    id: 'data-most', chapter: 'data', label: 'Most and least', emoji: '🏆', tint: 'pct',
    make: function (ctx) {
      var thing = M.rand.pick(THINGS);
      var people = M.rand.shuffle(NAMES.slice()).slice(0, 3);
      var counts = M.rand.shuffle([M.rand.int(2, 9), M.rand.int(10, 19), M.rand.int(20, 30)]);
      var wantMost = M.rand.int(0, 1);
      var best = counts.indexOf(wantMost ? Math.max.apply(null, counts) : Math.min.apply(null, counts));
      return {
        prompt: people.map(function (name, i) { return name + ': ' + counts[i]; }).join(', ') + ' ' + thing.many +
          '. Who has the ' + (wantMost ? 'most' : 'fewest') + '?',
        mode: 'choice',
        choices: M.rand.shuffle(people.slice()),
        answer: people[best]
      };
    }
  });

  M.register({
    id: 'data-difference', chapter: 'data', label: 'How many more?', emoji: '↔️', tint: 'frac',
    make: function (ctx) {
      var thing = M.rand.pick(THINGS);
      var top = ctx.level === 'easy' ? 12 : 40;
      var one = M.rand.int(2, top), two = M.rand.int(2, top);
      while (one === two) two = M.rand.int(2, top);
      var people = M.rand.shuffle(NAMES.slice()).slice(0, 2);
      return {
        prompt: people[0] + ' has ' + one + ' ' + thing.many + ' and ' + people[1] + ' has ' + two +
          '. How many more does ' + (one > two ? people[0] : people[1]) + ' have?',
        mode: 'number',
        answer: Math.abs(one - two)
      };
    }
  });

  M.tallySvg = tallySvg;      // the lesson page draws tallies too
})(window.Mathly);
