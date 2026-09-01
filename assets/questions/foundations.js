/* Foundations: the six kinds of sum the quiz started with. */
(function (M) {
  'use strict';

  var BIGGEST_ANSWER = 1e12;   // keeps × and ÷ answers exact and readable
  var PERCENTS = [10, 20, 25, 50, 75, 100];
  var DENOMS = [2, 3, 4, 5, 10];

  function howMany(ctx) {
    return ctx.parts === 'mix' ? M.rand.int(2, 4) : (ctx.parts || 2);
  }

  M.register({
    id: 'add', chapter: 'foundations', label: 'Adding', emoji: '➕', tint: 'add',
    make: function (ctx) {
      var parts = [];
      for (var i = 0; i < howMany(ctx); i++) parts.push(M.rand.int(ctx.from, ctx.to));
      return {
        prompt: M.chain(parts, '+'),
        mode: 'number',
        answer: parts.reduce(function (a, b) { return a + b; }, 0)
      };
    }
  });

  M.register({
    id: 'sub', chapter: 'foundations', label: 'Taking away', emoji: '➖', tint: 'sub',
    make: function (ctx) {                       // built backwards so it never goes below zero
      var rest = [];
      for (var i = 0; i < howMany(ctx) - 1; i++) rest.push(M.rand.int(ctx.from, ctx.to));
      var result = M.rand.int(ctx.from, ctx.to);
      var first = rest.reduce(function (a, b) { return a + b; }, result);
      return { prompt: M.chain([first].concat(rest), '−'), mode: 'number', answer: result };
    }
  });

  M.register({
    id: 'mul', chapter: 'foundations', label: 'Times', emoji: '✖️', tint: 'mul',
    make: function (ctx) {
      var parts = [], product = 1, n = howMany(ctx);
      for (var i = 0; i < n; i++) {
        var factor = M.rand.int(ctx.from, ctx.to);
        if (parts.length >= 2 && product * factor > BIGGEST_ANSWER) break;
        parts.push(factor);
        product *= factor;
      }
      return { prompt: M.chain(parts, '×'), mode: 'number', answer: product };
    }
  });

  M.register({
    id: 'div', chapter: 'foundations', label: 'Sharing', emoji: '➗', tint: 'div',
    make: function (ctx) {                       // built backwards so it always divides exactly
      var rest = [], result = M.rand.int(ctx.from, ctx.to), top = result;
      for (var i = 0; i < howMany(ctx) - 1; i++) {
        var divisor = Math.max(1, M.rand.int(ctx.from, ctx.to));
        if (rest.length >= 1 && top * divisor > BIGGEST_ANSWER) break;
        rest.push(divisor);
        top *= divisor;
      }
      return { prompt: M.chain([top].concat(rest), '÷'), mode: 'number', answer: result };
    }
  });

  M.register({
    id: 'pct', chapter: 'foundations', label: 'Percentages', emoji: '💯', tint: 'pct',
    make: function (ctx) {                       // base is a multiple of 20, so answers stay whole
      var percent = M.rand.pick(PERCENTS);
      var base = Math.round(M.rand.int(ctx.from, ctx.to) / 20) * 20;
      if (base < 20) base = 20;
      return { prompt: percent + '% of ' + base, mode: 'number', answer: base * percent / 100 };
    }
  });

  M.register({
    id: 'frac', chapter: 'foundations', label: 'Fractions', emoji: '🍕', tint: 'frac',
    make: function (ctx) {                       // lowest terms, whole answers
      var denom = M.rand.pick(DENOMS);
      var numer = M.rand.int(1, denom - 1);
      for (var i = 0; i < 10 && M.gcd(numer, denom) !== 1; i++) numer = M.rand.int(1, denom - 1);
      if (M.gcd(numer, denom) !== 1) numer = 1;
      var chunk = M.rand.int(ctx.from, ctx.to);
      return {
        prompt: numer + '/' + denom + ' of ' + (denom * chunk),
        mode: 'number',
        answer: numer * chunk
      };
    }
  });
})(window.Mathly);
