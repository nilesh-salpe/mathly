/* Money — CBSE Class 3: rupees and paise, making amounts, bills and change. */
(function (M) {
  'use strict';

  var NOTES = [500, 200, 100, 50, 20, 10];
  var COINS = [20, 10, 5, 2, 1];
  var PRICE = { easy: [5, 40], just: [10, 90], challenge: [20, 400] };
  var ITEMS = [
    { name: 'pencil', cost: 8 }, { name: 'eraser', cost: 5 }, { name: 'notebook', cost: 25 },
    { name: 'sharpener', cost: 6 }, { name: 'chocolate', cost: 20 }, { name: 'pen', cost: 12 },
    { name: 'ruler', cost: 15 }, { name: 'colour box', cost: 60 }
  ];
  var NAMES = ['Aarav', 'Meera', 'Riya', 'Kabir', 'Ananya', 'Vihaan', 'Diya', 'Arjun'];

  function priceBand(ctx) { return PRICE[ctx.level] || PRICE.just; }
  function price(ctx) { var b = priceBand(ctx); return M.rand.int(b[0], b[1]); }

  function article(word) { return 'aeiou'.indexOf(word[0].toLowerCase()) > -1 ? 'An' : 'A'; }

  function plural(word) {
    return /(x|s|ch|sh)$/.test(word) ? word + 'es' : word + 's';
  }

  // the note a person would actually hand over: the next one or two up from the price
  function noteFor(cost) {
    var bigger = NOTES.filter(function (n) { return n > cost; }).sort(function (a, b) { return a - b; });
    if (!bigger.length) return Math.ceil(cost / 100) * 100 + 100;
    return M.rand.pick(bigger.slice(0, 2));
  }

  // a believable price for that item at this level
  function priceOf(item, ctx) {
    var many = ctx.level === 'challenge' ? M.rand.int(2, 5) : 1;
    return item.cost * many + M.rand.int(0, 4);
  }

  M.register({
    id: 'money-add', chapter: 'money', label: 'Adding money', emoji: '🧾', tint: 'add',
    make: function (ctx) {
      var a = price(ctx), b = price(ctx);
      return { prompt: '₹' + a + ' + ₹' + b, mode: 'number', unit: '₹', answer: a + b };
    }
  });

  M.register({
    id: 'money-change', chapter: 'money', label: 'Giving change', emoji: '💵', tint: 'sub',
    make: function (ctx) {
      var item = M.rand.pick(ITEMS);
      var cost = priceOf(item, ctx);
      var paid = noteFor(cost);
      var thing = item.name;
      return {
        prompt: article(thing) + ' ' + thing + ' costs ₹' + cost + '. You pay with a ₹' + paid + ' note. How much change?',
        mode: 'number',
        unit: '₹',
        answer: paid - cost
      };
    }
  });

  M.register({
    id: 'money-make', chapter: 'money', label: 'Making an amount', emoji: '🪙', tint: 'mul',
    make: function (ctx) {
      var piece = M.rand.pick(ctx.level === 'easy' ? [2, 5, 10] : [2, 5, 10, 20, 50]);
      var many = M.rand.int(3, ctx.level === 'challenge' ? 12 : 9);
      return {
        prompt: 'How many ₹' + piece + ' ' + (piece > 10 ? 'notes' : 'coins') + ' make ₹' + (piece * many) + '?',
        mode: 'number',
        answer: many
      };
    }
  });

  M.register({
    id: 'money-paise', chapter: 'money', label: 'Rupees and paise', emoji: '🔁', tint: 'div',
    make: function (ctx) {
      var rupees = M.rand.int(1, ctx.level === 'easy' ? 5 : 20);
      var paise = M.rand.pick([25, 50, 75, 25, 50, 75, 0]);
      if (M.rand.int(0, 1)) {
        return {
          prompt: '₹' + rupees + (paise ? ' and ' + paise + ' paise' : '') + ' is how many paise?',
          mode: 'number',
          unit: 'paise',
          answer: rupees * 100 + paise
        };
      }
      return {
        prompt: (rupees * 100 + paise) + ' paise is how many rupees and paise?',
        mode: 'multi',
        fields: [{ label: 'rupees' }, { label: 'paise' }],
        answer: [rupees, paise]
      };
    }
  });

  M.register({
    id: 'money-bill', chapter: 'money', label: 'Adding up a bill', emoji: '🛒', tint: 'pct',
    make: function (ctx) {
      var first = M.rand.pick(ITEMS), second = M.rand.pick(ITEMS);
      for (var i = 0; i < 6 && second.name === first.name; i++) second = M.rand.pick(ITEMS);
      var howMany = M.rand.int(2, ctx.level === 'easy' ? 3 : 5);
      return {
        prompt: howMany + ' ' + plural(first.name) + ' at ₹' + first.cost + ' each and one ' + second.name +
          ' at ₹' + second.cost + '. What is the total bill?',
        mode: 'number',
        unit: '₹',
        answer: howMany * first.cost + second.cost
      };
    }
  });

  M.register({
    id: 'money-enough', chapter: 'money', label: 'Is there enough?', emoji: '🤔', tint: 'frac',
    make: function (ctx) {
      var item = M.rand.pick(ITEMS);
      var howMany = M.rand.int(2, 5);
      var total = item.cost * howMany;
      var purse = total + M.rand.int(-15, 15);
      var who = M.rand.pick(NAMES);
      return {
        prompt: who + ' has ₹' + purse + ' and wants ' + howMany + ' ' + plural(item.name) + ' at ₹' +
          item.cost + ' each. Is there enough money?',
        mode: 'choice',
        choices: ['Yes', 'No'],
        answer: purse >= total ? 'Yes' : 'No',
        note: 'Work out the total cost first'
      };
    }
  });

  M.register({
    id: 'money-story', chapter: 'money', label: 'Money stories', emoji: '📖', tint: 'add',
    make: function (ctx) {
      var who = M.rand.pick(NAMES), item = M.rand.pick(ITEMS);
      if (M.rand.int(0, 1)) {
        var pocket = price(ctx) + item.cost;
        return {
          prompt: who + ' had ₹' + pocket + ' and bought ' + article(item.name).toLowerCase() + ' ' + item.name + ' for ₹' + item.cost +
            '. How much money is left?',
          mode: 'number', unit: '₹', answer: pocket - item.cost
        };
      }
      var weeks = M.rand.int(2, 6);
      return {
        prompt: who + ' saves ₹' + item.cost + ' every week. How much is saved after ' + weeks + ' weeks?',
        mode: 'number', unit: '₹', answer: item.cost * weeks
      };
    }
  });
})(window.Mathly);
