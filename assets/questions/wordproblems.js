/* Word Problems — stories from every part of the Class 3 syllabus.
   The sentences are fixed and checked; only the numbers move. */
(function (M) {
  'use strict';

  var NAMES = ['Aarav', 'Meera', 'Riya', 'Kabir', 'Ananya', 'Vihaan', 'Ishaan', 'Diya', 'Arjun', 'Sara'];
  var THINGS = ['marbles', 'stickers', 'mangoes', 'ladoos', 'pencils', 'story books', 'balloons', 'crayons'];
  var SHOPS = ['pencil', 'notebook', 'eraser', 'chocolate', 'kite', 'ball'];
  var SIZE = { easy: [5, 40], just: [20, 300], challenge: [100, 900] };

  function span(ctx) { return SIZE[ctx.level] || SIZE.just; }
  function num(ctx) { var s = span(ctx); return M.rand.int(s[0], s[1]); }
  function small(ctx) { return M.rand.int(2, ctx.level === 'easy' ? 5 : 9); }
  function two() {
    var a = M.rand.pick(NAMES), b = M.rand.pick(NAMES);
    while (b === a) b = M.rand.pick(NAMES);
    return [a, b];
  }

  function story(list) {
    return function (ctx) {
      var made = M.rand.pick(list)(ctx);
      return { prompt: made.text, mode: 'number', unit: made.unit, answer: made.answer };
    };
  }

  M.register({
    id: 'wp-joining', chapter: 'wordproblems', label: 'Joining and leaving', emoji: '➕', tint: 'add',
    make: story([
      function (ctx) {
        var who = two(), thing = M.rand.pick(THINGS), a = num(ctx), b = num(ctx);
        return { text: who[0] + ' collected ' + a + ' ' + thing + ' and ' + who[1] + ' collected ' + b +
          '. How many ' + thing + ' do they have altogether?', answer: a + b };
      },
      function (ctx) {
        var thing = M.rand.pick(THINGS), left = num(ctx), gone = num(ctx);
        return { text: 'A shop had ' + (left + gone) + ' ' + thing + ' in the morning and sold ' + gone +
          ' during the day. How many ' + thing + ' are left?', answer: left };
      },
      function (ctx) {
        var who = two(), more = num(ctx), fewer = num(ctx);
        return { text: who[0] + ' has ' + (fewer + more) + ' rupees and ' + who[1] + ' has ' + fewer +
          ' rupees. How many more rupees does ' + who[0] + ' have?', unit: '₹', answer: more };
      },
      function (ctx) {
        var start = num(ctx), joined = num(ctx);
        return { text: 'There were ' + start + ' people on a train. At the next station ' + joined +
          ' more got on. How many people are on the train now?', answer: start + joined };
      }
    ])
  });

  M.register({
    id: 'wp-groups', chapter: 'wordproblems', label: 'Groups and sharing', emoji: '✖️', tint: 'mul',
    make: story([
      function (ctx) {
        var thing = M.rand.pick(THINGS), boxes = small(ctx), each = small(ctx);
        return { text: 'A shopkeeper packs ' + each + ' ' + thing + ' into each box and fills ' + boxes +
          ' boxes. How many ' + thing + ' is that?', answer: boxes * each };
      },
      function (ctx) {
        var thing = M.rand.pick(THINGS), children = small(ctx), each = small(ctx);
        return { text: (children * each) + ' ' + thing + ' are shared equally between ' + children +
          ' children. How many does each child get?', answer: each };
      },
      function (ctx) {
        var rows = small(ctx), each = small(ctx);
        return { text: 'A classroom has ' + rows + ' rows of chairs with ' + each +
          ' chairs in each row. How many chairs are there?', answer: rows * each };
      },
      function (ctx) {
        var who = M.rand.pick(NAMES), each = small(ctx), days = small(ctx);
        return { text: who + ' reads ' + each + ' pages every day. How many pages in ' + days + ' days?',
          answer: each * days };
      }
    ])
  });

  M.register({
    id: 'wp-money', chapter: 'wordproblems', label: 'Money stories', emoji: '🪙', tint: 'pct',
    make: story([
      function (ctx) {
        var who = M.rand.pick(NAMES), item = M.rand.pick(SHOPS), cost = M.rand.int(6, 60), many = small(ctx);
        return { text: who + ' buys ' + many + ' ' + item + 's at ₹' + cost + ' each. What is the total cost?',
          unit: '₹', answer: cost * many };
      },
      function (ctx) {
        var item = M.rand.pick(SHOPS), cost = M.rand.int(11, 88), paid = Math.ceil(cost / 50) * 50 + 50;
        return { text: 'A ' + item + ' costs ₹' + cost + '. You pay ₹' + paid + '. How much change do you get?',
          unit: '₹', answer: paid - cost };
      },
      function (ctx) {
        var who = M.rand.pick(NAMES), week = M.rand.int(5, 40), weeks = small(ctx);
        return { text: who + ' saves ₹' + week + ' every week. How much money after ' + weeks + ' weeks?',
          unit: '₹', answer: week * weeks };
      },
      function (ctx) {
        var pocket = num(ctx), spent = M.rand.int(5, 40);
        return { text: 'A boy had ₹' + (pocket + spent) + ' and spent ₹' + spent +
          ' at the school fair. How much is left?', unit: '₹', answer: pocket };
      }
    ])
  });

  M.register({
    id: 'wp-measure', chapter: 'wordproblems', label: 'Measuring stories', emoji: '📏', tint: 'div',
    make: story([
      function (ctx) {
        var metres = small(ctx), cut = M.rand.int(20, 90);
        return { text: 'A ribbon is ' + metres + ' m long. ' + cut +
          ' cm is cut off. How many centimetres of ribbon are left?', unit: 'cm', answer: metres * 100 - cut };
      },
      function (ctx) {
        var bags = small(ctx), each = M.rand.int(2, 9);
        return { text: 'A sack holds ' + each + ' kg of rice. How many kilograms in ' + bags + ' sacks?',
          unit: 'kg', answer: bags * each };
      },
      function (ctx) {
        var glasses = small(ctx), each = M.rand.pick([100, 150, 200, 250]);
        return { text: 'A glass holds ' + each + ' ml of milk. How many millilitres in ' + glasses + ' glasses?',
          unit: 'ml', answer: glasses * each };
      },
      function (ctx) {
        var jug = M.rand.int(2, 6), poured = M.rand.int(200, 900);
        return { text: 'A jug holds ' + jug + ' litres of juice. ' + poured +
          ' ml is poured out. How many millilitres are left?', unit: 'ml', answer: jug * 1000 - poured };
      }
    ])
  });

  M.register({
    id: 'wp-time', chapter: 'wordproblems', label: 'Time stories', emoji: '🕐', tint: 'sub',
    make: story([
      function (ctx) {
        var mins = M.rand.pick([20, 25, 35, 40, 45, 50]);
        var startH = M.rand.int(1, 9), startM = M.rand.pick([0, 5, 10, 15, 20, 30]);
        var end = startH * 60 + startM + mins;
        return { text: 'A class starts at ' + startH + ':' + (startM < 10 ? '0' : '') + startM +
          ' and finishes at ' + Math.floor(end / 60) + ':' + (end % 60 < 10 ? '0' : '') + (end % 60) +
          '. How many minutes long is the class?', unit: 'minutes', answer: mins };
      },
      function (ctx) {
        var hours = small(ctx);
        return { text: 'A journey takes ' + hours + ' hours. How many minutes is that?',
          unit: 'minutes', answer: hours * 60 };
      },
      function (ctx) {
        var weeks = small(ctx), days = M.rand.int(1, 6);
        return { text: 'The holidays last ' + weeks + ' weeks and ' + days + ' days. How many days is that?',
          unit: 'days', answer: weeks * 7 + days };
      },
      function (ctx) {
        var each = M.rand.pick([15, 20, 30]), times = small(ctx);
        return { text: 'A girl practises the tabla for ' + each + ' minutes a day. How many minutes in ' +
          times + ' days?', unit: 'minutes', answer: each * times };
      }
    ])
  });

  M.register({
    id: 'wp-fraction', chapter: 'wordproblems', label: 'Fraction stories', emoji: '🍕', tint: 'frac',
    make: story([
      function (ctx) {
        var parts = M.rand.pick([2, 3, 4]), each = small(ctx), thing = M.rand.pick(THINGS);
        var word = parts === 2 ? 'Half' : parts === 3 ? 'One third' : 'One quarter';
        return { text: 'A basket holds ' + (parts * each) + ' ' + thing + '. ' + word +
          ' of them are given away. How many are given away?', answer: each };
      },
      function (ctx) {
        var parts = M.rand.pick([2, 4]), each = small(ctx), thing = M.rand.pick(THINGS);
        var word = parts === 2 ? 'Half' : 'One quarter';
        return { text: 'There are ' + (parts * each) + ' ' + thing + ' in a box. ' + word +
          ' of them are broken. How many are not broken?', answer: parts * each - each };
      },
      function (ctx) {
        var each = small(ctx);
        return { text: 'A cake is cut into 4 equal pieces and ' + Math.min(3, Math.max(1, each % 4 || 1)) +
          ' pieces are eaten. How many pieces are left?', answer: 4 - Math.min(3, Math.max(1, each % 4 || 1)) };
      }
    ])
  });

  M.register({
    id: 'wp-twostep', chapter: 'wordproblems', label: 'Two-step stories', emoji: '📚', tint: 'add',
    make: story([
      function (ctx) {
        var who = two(), thing = M.rand.pick(THINGS), start = num(ctx), got = num(ctx);
        var gave = M.rand.int(1, Math.max(1, Math.floor((start + got) / 2)));
        return { text: who[0] + ' had ' + start + ' ' + thing + ', was given ' + got + ' more by ' + who[1] +
          ', then gave ' + gave + ' away. How many ' + thing + ' now?', answer: start + got - gave };
      },
      function (ctx) {
        var boxes = small(ctx), each = small(ctx), broken = M.rand.int(1, Math.max(1, boxes * each - 1));
        return { text: boxes + ' boxes hold ' + each + ' eggs each. ' + broken +
          ' eggs break. How many good eggs are left?', answer: boxes * each - broken };
      },
      function (ctx) {
        var item = M.rand.pick(SHOPS), cost = M.rand.int(8, 45), many = small(ctx);
        var paid = (cost * many) + M.rand.int(5, 60);
        return { text: 'A girl buys ' + many + ' ' + item + 's at ₹' + cost + ' each and pays with ₹' + paid +
          '. How much change does she get?', unit: '₹', answer: paid - cost * many };
      }
    ]),
    check: function (q) { return q.answer >= 0 ? null : 'story gives a negative answer'; }
  });

  M.register({
    id: 'wp-choose', chapter: 'wordproblems', label: 'Which sum is it?', emoji: '🧭', tint: 'mul',
    make: function (ctx) {
      var thing = M.rand.pick(THINGS), who = two();
      var kinds = [
        { text: who[0] + ' has ' + num(ctx) + ' ' + thing + ' and is given ' + num(ctx) +
          ' more. How many altogether?', answer: 'Add' },
        { text: 'A shop had ' + num(ctx) + ' ' + thing + ' and sold ' + num(ctx) + '. How many are left?', answer: 'Take away' },
        { text: small(ctx) + ' boxes hold ' + small(ctx) + ' ' + thing + ' each. How many in total?', answer: 'Times' },
        { text: num(ctx) + ' ' + thing + ' are shared equally between ' + small(ctx) +
          ' children. How many each?', answer: 'Share' }
      ];
      var pick = M.rand.pick(kinds);
      return {
        prompt: pick.text + ' Which sum would you do?',
        mode: 'choice',
        choices: ['Add', 'Take away', 'Times', 'Share'],
        answer: pick.answer,
        note: 'You do not have to work it out — just choose the kind of sum'
      };
    }
  });
})(window.Mathly);
