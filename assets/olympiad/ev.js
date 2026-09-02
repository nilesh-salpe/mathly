/* Everyday Mathematics — maths in real situations. */
(function (M) {
  'use strict';

  var mcq = M.olympiad.mcq;
  var NAMES = ['Meera', 'Aarav', 'Riya', 'Kabir', 'Ananya', 'Vihaan', 'Diya'];
  var SHOP = [
    { name: 'pen', cost: 12 }, { name: 'notebook', cost: 25 }, { name: 'eraser', cost: 6 },
    { name: 'kite', cost: 15 }, { name: 'chocolate', cost: 20 }, { name: 'ball', cost: 40 }
  ];

  function two(n) { return (n < 10 ? '0' : '') + n; }

  M.register({
    id: 'ev-shopping', chapter: 'ev', section: 'ev', label: 'Shopping and change', emoji: '🛒', tint: 'add',
    make: function (ctx) {
      var item = M.rand.pick(SHOP), extra = M.rand.pick(SHOP);
      var many = M.rand.int(2, ctx.level === 'easy' ? 3 : 5);
      var bill = item.cost * many + extra.cost;
      var paid = Math.ceil(bill / 50) * 50;
      if (paid === bill) paid += 50;
      return mcq({
        prompt: many + ' ' + item.name + 's cost ₹' + item.cost + ' each and one ' + extra.name +
          ' costs ₹' + extra.cost + '. What change is left from ₹' + paid + '?',
        answer: paid - bill,
        wrongs: [paid - item.cost * many, bill, paid - extra.cost],
        why: 'The bill is ' + many + ' × ₹' + item.cost + ' = ₹' + (item.cost * many) + ', plus ₹' +
          extra.cost + ' = ₹' + bill + '. Change is ₹' + paid + ' − ₹' + bill + ' = ₹' + (paid - bill) + '.'
      });
    }
  });

  M.register({
    id: 'ev-timetable', chapter: 'ev', section: 'ev', label: 'Times and journeys', emoji: '🚌', tint: 'sub',
    make: function (ctx) {
      var startH = M.rand.int(6, 9);
      var journey = M.rand.pick(ctx.level === 'easy' ? [30, 45, 60] : [35, 40, 55, 70, 85]);
      // the point of the question is carrying past the hour, so make sure it does
      var starts = [10, 15, 20, 25, 30, 40, 45, 50].filter(function (m) { return m + journey > 60; });
      var startM = starts.length ? M.rand.pick(starts) : 45;
      var end = startH * 60 + startM + journey;
      var right = Math.floor(end / 60) + ':' + two(end % 60);
      var naive = startH + ':' + two(startM + journey);       // the classic "past 60" mistake
      return mcq({
        prompt: 'A bus leaves at ' + startH + ':' + two(startM) + ' and the journey takes ' + journey +
          ' minutes. What time does it arrive?',
        answer: right,
        wrongs: [naive,
          Math.floor(end / 60) + ':' + two((end % 60 + 10) % 60),
          (Math.floor(end / 60) + 1) + ':' + two(end % 60),
          (Math.floor(end / 60) - 1) + ':' + two(end % 60),
          Math.floor(end / 60) + ':' + two((end % 60 + 30) % 60)],
        why: two(startM) + ' + ' + journey + ' minutes goes past the hour, so carry 60 minutes into the hours: ' +
          'the bus arrives at ' + right + '.'
      });
    }
  });

  M.register({
    id: 'ev-packing', chapter: 'ev', section: 'ev', label: 'Packing and sharing', emoji: '📦', tint: 'mul',
    make: function (ctx) {
      var perBox = M.rand.int(4, ctx.level === 'easy' ? 6 : 9);
      var full = M.rand.int(4, 12);
      var left = M.rand.int(1, perBox - 1);
      var total = perBox * full + left;
      return mcq({
        prompt: total + ' laddoos are packed into boxes of ' + perBox +
          '. How many boxes are needed so that none are left out?',
        answer: full + 1,
        wrongs: [full, perBox, full + 2],
        why: full + ' full boxes hold ' + (perBox * full) + ' laddoos, and ' + left +
          ' are left over — those still need a box, so ' + (full + 1) + ' boxes are needed.'
      });
    }
  });

  M.register({
    id: 'ev-recipe', chapter: 'ev', section: 'ev', label: 'Recipes and rates', emoji: '🍲', tint: 'div',
    make: function (ctx) {
      var per = M.rand.int(2, 5);
      var people = M.rand.pick([2, 4, 5]);
      var wanted = people * M.rand.int(2, ctx.level === 'easy' ? 3 : 5);
      var answer = per * (wanted / people);
      return mcq({
        prompt: 'A recipe uses ' + per + ' cups of rice for ' + people + ' people. How many cups are needed for ' +
          wanted + ' people?',
        answer: answer,
        wrongs: [per + (wanted - people), answer + per, wanted / people],
        why: wanted + ' people is ' + (wanted / people) + ' times as many as ' + people + ', so use ' +
          (wanted / people) + ' × ' + per + ' = ' + answer + ' cups.'
      });
    }
  });

  M.register({
    id: 'ev-sensible', chapter: 'ev', section: 'ev', label: 'Does it sound right?', emoji: '🤔', tint: 'pct',
    make: function () {
      var items = [
        { thing: 'a school bag', right: '3 kg', wrong: ['3 g', '30 kg', '300 g'] },
        { thing: 'a bus journey across the city', right: '45 minutes', wrong: ['45 seconds', '45 hours', '4 minutes'] },
        { thing: 'a bottle of cold drink', right: '500 ml', wrong: ['500 l', '5 ml', '50 l'] },
        { thing: 'the height of a classroom door', right: '2 m', wrong: ['2 cm', '20 m', '200 m'] },
        { thing: 'the weight of one mango', right: '250 g', wrong: ['250 kg', '25 g', '2 kg'] },
        { thing: 'a school day', right: '6 hours', wrong: ['6 minutes', '60 hours', '6 days'] }
      ];
      var item = M.rand.pick(items);
      return mcq({
        prompt: 'About how much is ' + item.thing + '?',
        answer: item.right,
        wrongs: item.wrong,
        why: 'Compare it with something you know. ' + item.right + ' is the only sensible size for ' + item.thing + '.'
      });
    }
  });

  M.register({
    id: 'ev-saving', chapter: 'ev', section: 'ev', label: 'Saving up', emoji: '🐷', tint: 'frac',
    make: function (ctx) {
      var who = M.rand.pick(NAMES);
      var weekly = M.rand.pick([5, 10, 15, 20, 25]);
      var target = weekly * M.rand.int(3, ctx.level === 'easy' ? 6 : 12);
      var weeks = target / weekly;
      return mcq({
        prompt: who + ' saves ₹' + weekly + ' every week to buy a game costing ₹' + target +
          '. How many weeks will it take?',
        answer: weeks,
        wrongs: [weeks + 1, target - weekly, weeks * 2],
        why: 'Share the cost into weekly amounts: ₹' + target + ' ÷ ₹' + weekly + ' = ' + weeks + ' weeks.'
      });
    }
  });
})(window.Mathly);
