/* Measurement — CBSE Class 3: length, weight and capacity in metric units. */
(function (M) {
  'use strict';

  var UNITS = [
    { big: 'm', small: 'cm', per: 100, what: 'length', thing: ['rope', 'ribbon', 'plank', 'cloth'] },
    { big: 'kg', small: 'g', per: 1000, what: 'weight', thing: ['bag of rice', 'pumpkin', 'watermelon', 'sack'] },
    { big: 'l', small: 'ml', per: 1000, what: 'capacity', thing: ['jug', 'bottle', 'can', 'bucket'] }
  ];

  var ESTIMATES = [
    { thing: 'a school bag', right: '3 kg', wrong: ['3 g', '30 kg', '300 kg'] },
    { thing: 'a pencil', right: '15 cm', wrong: ['15 m', '150 cm', '15 km'] },
    { thing: 'a glass of water', right: '200 ml', wrong: ['200 l', '2 ml', '20 l'] },
    { thing: 'a classroom door', right: '2 m', wrong: ['2 cm', '20 m', '200 m'] },
    { thing: 'an apple', right: '150 g', wrong: ['150 kg', '15 g', '1500 kg'] },
    { thing: 'a bucket of water', right: '10 l', wrong: ['10 ml', '100 l', '1 ml'] },
    { thing: 'a cricket bat', right: '1 m', wrong: ['1 cm', '10 m', '100 m'] },
    { thing: 'a spoon of medicine', right: '5 ml', wrong: ['5 l', '50 l', '500 ml'] }
  ];

  function unit(ctx) {
    return ctx.level === 'easy' ? UNITS[0] : M.rand.pick(UNITS);
  }

  function smallPart(u) {
    return u.per === 100 ? M.rand.int(1, 99) : M.rand.int(1, 9) * 100 + M.rand.int(0, 9) * 10;
  }

  M.register({
    id: 'measure-to-small', chapter: 'measure', label: 'Change to the small unit', emoji: '📏', tint: 'add',
    make: function (ctx) {
      var u = unit(ctx);
      var big = M.rand.int(1, ctx.level === 'easy' ? 5 : 9);
      var small = smallPart(u);
      return {
        prompt: big + ' ' + u.big + ' ' + small + ' ' + u.small + ' is how many ' + u.small + '?',
        mode: 'number',
        unit: u.small,
        answer: big * u.per + small,
        note: '1 ' + u.big + ' = ' + u.per + ' ' + u.small
      };
    }
  });

  M.register({
    id: 'measure-to-big', chapter: 'measure', label: 'Change to the big unit', emoji: '⚖️', tint: 'sub',
    make: function (ctx) {
      var u = unit(ctx);
      var big = M.rand.int(1, ctx.level === 'easy' ? 5 : 9);
      var small = smallPart(u);
      return {
        prompt: (big * u.per + small) + ' ' + u.small + ' is how many ' + u.big + ' and ' + u.small + '?',
        mode: 'multi',
        fields: [{ label: u.big }, { label: u.small }],
        answer: [big, small]
      };
    }
  });

  M.register({
    id: 'measure-compare', chapter: 'measure', label: 'Which is more?', emoji: '🔍', tint: 'mul',
    make: function (ctx) {
      var u = unit(ctx);
      var big = M.rand.int(1, 4);
      var small = smallPart(u);
      var total = big * u.per + small;
      var other = total + M.rand.pick([-1, 1]) * M.rand.int(5, 60);
      var first = big + ' ' + u.big + ' ' + small + ' ' + u.small;
      var second = other + ' ' + u.small;
      return {
        prompt: 'Which is more: ' + first + ' or ' + second + '?',
        mode: 'choice',
        choices: M.rand.shuffle([first, second]),
        answer: total > other ? first : second,
        note: 'Change both to ' + u.small + ' first'
      };
    }
  });

  M.register({
    id: 'measure-estimate', chapter: 'measure', label: 'Sensible measures', emoji: '🤔', tint: 'div',
    make: function () {
      var item = M.rand.pick(ESTIMATES);
      var choices = [item.right].concat(item.wrong.slice(0, 3));
      return {
        prompt: 'About how much is ' + item.thing + '?',
        mode: 'choice',
        choices: M.rand.shuffle(choices.slice(0, 4)),
        answer: item.right
      };
    }
  });

  M.register({
    id: 'measure-add', chapter: 'measure', label: 'Adding measures', emoji: '➕', tint: 'pct',
    make: function (ctx) {
      var u = unit(ctx);
      var a = M.rand.int(1, 4) * u.per + smallPart(u);
      var b = M.rand.int(1, 3) * u.per + smallPart(u);
      return {
        prompt: a + ' ' + u.small + ' + ' + b + ' ' + u.small,
        mode: 'number',
        unit: u.small,
        answer: a + b
      };
    }
  });

  M.register({
    id: 'measure-story', chapter: 'measure', label: 'Measuring stories', emoji: '📖', tint: 'frac',
    make: function (ctx) {
      var u = unit(ctx);
      var thing = M.rand.pick(u.thing);
      var whole = M.rand.int(2, 6) * u.per;
      var used = M.rand.int(1, whole / u.per - 1) * u.per + (u.per === 100 ? M.rand.int(1, 90) : M.rand.int(1, 9) * 100);
      return {
        prompt: 'A ' + thing + ' holds ' + (whole / u.per) + ' ' + u.big + '. ' + used + ' ' + u.small +
          ' is used. How many ' + u.small + ' are left?',
        mode: 'number',
        unit: u.small,
        answer: whole - used
      };
    },
    check: function (q) { return q.answer > 0 ? null : 'nothing is left, so the story does not work'; }
  });
})(window.Mathly);
