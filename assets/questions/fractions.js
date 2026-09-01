/* Fractions — CBSE Class 3: halves, thirds, quarters of shapes and of groups. */
(function (M) {
  'use strict';

  var WORDS = { 2: 'half', 3: 'third', 4: 'quarter', 5: 'fifth', 6: 'sixth', 8: 'eighth', 10: 'tenth' };
  var PLURAL = { 2: 'halves', 3: 'thirds', 4: 'quarters', 5: 'fifths', 6: 'sixths', 8: 'eighths', 10: 'tenths' };
  var DENOMS = { easy: [2, 4], just: [2, 3, 4], challenge: [2, 3, 4, 5, 6, 8] };
  var THINGS = ['mangoes', 'marbles', 'ladoos', 'stickers', 'pencils', 'biscuits'];

  function denoms(ctx) { return DENOMS[ctx.level] || DENOMS.just; }

  /* a bar cut into equal parts, some of them shaded */
  function barPicture(parts, shaded) {
    var w = 200, h = 56, step = w / parts, body = '';
    for (var i = 0; i < parts; i++) {
      body += '<rect x="' + (2 + i * step) + '" y="2" width="' + (step - 1) + '" height="' + (h - 4) +
        '" fill="' + (i < shaded ? '#ffc9dd' : '#ffffff') + '" stroke="#c9457e" stroke-width="2.5"/>';
    }
    return '<svg viewBox="0 0 ' + (w + 4) + ' ' + h + '" role="img" aria-label="' + shaded + ' out of ' +
      parts + ' parts shaded">' + body + '</svg>';
  }

  M.register({
    id: 'fractions-shaded', chapter: 'fractions', label: 'What fraction is shaded?', emoji: '🍫', tint: 'frac',
    make: function (ctx) {
      var list = denoms(ctx);
      var parts = M.rand.pick(list);
      var shaded = M.rand.int(1, parts - 1);
      var others = {}, choices = [shaded + '/' + parts];
      others[shaded + '/' + parts] = true;
      [[shaded, parts + 1], [shaded + 1, parts], [parts, shaded + parts]].forEach(function (pair) {
        var text = pair[0] + '/' + pair[1];
        if (!others[text] && pair[0] < pair[1] && choices.length < 4) { others[text] = true; choices.push(text); }
      });
      return {
        picture: barPicture(parts, shaded),
        prompt: 'What fraction of the bar is shaded?',
        mode: 'choice',
        choices: M.rand.shuffle(choices),
        answer: shaded + '/' + parts
      };
    }
  });

  M.register({
    id: 'fractions-of-group', chapter: 'fractions', label: 'Fraction of a group', emoji: '🫘', tint: 'add',
    make: function (ctx) {
      var parts = M.rand.pick(denoms(ctx));
      var each = M.rand.int(2, ctx.level === 'easy' ? 5 : 9);
      var numer = M.rand.int(1, parts - 1);
      var thing = M.rand.pick(THINGS);
      var name = numer === 1 ? 'One ' + WORDS[parts] : numer + ' ' + PLURAL[parts];
      return {
        prompt: name + ' of ' + (parts * each) + ' ' + thing + ' is how many?',
        mode: 'number',
        answer: numer * each,
        note: 'Share them into ' + parts + ' equal groups first'
      };
    }
  });

  M.register({
    id: 'fractions-compare', chapter: 'fractions', label: 'Which is bigger?', emoji: '⚖️', tint: 'sub',
    make: function (ctx) {
      var list = denoms(ctx);
      var a = M.rand.pick(list), b = M.rand.pick(list);
      for (var i = 0; i < 8 && b === a; i++) b = M.rand.pick(list);
      if (b === a) b = a === 2 ? 4 : 2;
      var bigger = a < b ? a : b;                 // fewer parts means bigger pieces
      return {
        prompt: 'Which is the bigger piece of the same cake: 1/' + a + ' or 1/' + b + '?',
        mode: 'choice',
        choices: M.rand.shuffle(['1/' + a, '1/' + b]),
        answer: '1/' + bigger,
        note: 'Fewer pieces means each piece is bigger'
      };
    }
  });

  M.register({
    id: 'fractions-whole', chapter: 'fractions', label: 'Making one whole', emoji: '🥧', tint: 'div',
    make: function (ctx) {
      var parts = M.rand.pick(denoms(ctx));
      return {
        picture: barPicture(parts, parts),
        prompt: 'How many ' + PLURAL[parts] + ' make one whole?',
        mode: 'number',
        answer: parts
      };
    }
  });

  M.register({
    id: 'fractions-story', chapter: 'fractions', label: 'Story problems', emoji: '📖', tint: 'pct',
    make: function (ctx) {
      var parts = M.rand.pick(denoms(ctx));
      var each = M.rand.int(2, ctx.level === 'easy' ? 5 : 9);
      var total = parts * each;
      var thing = M.rand.pick(THINGS);
      var name = 'One ' + WORDS[parts];
      return M.rand.int(0, 1)
        ? {
            prompt: 'A basket has ' + total + ' ' + thing + '. ' + name + ' of them are given away. How many are given away?',
            mode: 'number',
            answer: each
          }
        : {
            prompt: 'A basket has ' + total + ' ' + thing + '. ' + name + ' of them are given away. How many are left?',
            mode: 'number',
            answer: total - each
          };
    }
  });
})(window.Mathly);
