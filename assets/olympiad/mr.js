/* Mathematical Reasoning — Class 3 content, asked sideways. */
(function (M) {
  'use strict';

  var mcq = M.olympiad.mcq;
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  var THINGS = ['books', 'kites', 'mangoes', 'balloons', 'pencils'];

  function digits(n) { return String(n).split('').map(Number); }

  M.register({
    id: 'mr-biggest', chapter: 'mr', section: 'mr', label: 'Biggest and smallest', emoji: '🔝', tint: 'add',
    make: function (ctx) {
      var pool = M.rand.shuffle([M.rand.int(1, 9), M.rand.int(0, 9), M.rand.int(1, 9)]);
      while (pool[0] === pool[1] && pool[1] === pool[2]) pool[2] = M.rand.int(1, 9);
      var sorted = pool.slice().sort(function (a, b) { return b - a; });
      var biggest = Number(sorted.join(''));
      var smallestDigits = sorted.slice().reverse();
      if (smallestDigits[0] === 0) {                       // no leading zero
        var swap = smallestDigits.findIndex(function (d) { return d > 0; });
        smallestDigits[0] = smallestDigits[swap];
        smallestDigits[swap] = 0;
      }
      var smallest = Number(smallestDigits.join(''));
      var wantBiggest = M.rand.int(0, 1);
      return mcq({
        prompt: 'Using the digits ' + pool.join(', ') + ' once each, what is the ' +
          (wantBiggest ? 'largest' : 'smallest') + ' 3-digit number you can make?',
        answer: wantBiggest ? biggest : smallest,
        wrongs: [wantBiggest ? smallest : biggest, Number(pool.join('')), Number(sorted.slice().reverse().join(''))],
        why: wantBiggest
          ? 'Put the biggest digit first: ' + sorted.join(', ') + ' gives ' + biggest + '.'
          : 'Put the smallest digit first, but never a 0 at the front, which gives ' + smallest + '.'
      });
    }
  });

  M.register({
    id: 'mr-missing-digit', chapter: 'mr', section: 'mr', label: 'Missing digit', emoji: '🔍', tint: 'sub',
    make: function (ctx) {
      var hidden = M.rand.int(1, 9);
      var rest = M.rand.int(1, 9) * 100 + M.rand.int(0, 9);
      var first = rest + hidden * 10;
      var second = M.rand.int(11, ctx.level === 'easy' ? 40 : 99);
      var total = first + second;
      return mcq({
        prompt: String(Math.floor(first / 100)) + '▢' + String(first % 10) + ' + ' + second + ' = ' + total +
          '. What is the missing digit?',
        answer: hidden,
        wrongs: [(hidden + 1) % 10, (hidden + 9) % 10, digits(total)[1]],
        why: 'Take the other number away from the total: ' + total + ' − ' + second + ' = ' + first +
          ', so the missing digit is ' + hidden + '.'
      });
    }
  });

  M.register({
    id: 'mr-divisibility', chapter: 'mr', section: 'mr', label: 'Divides exactly', emoji: '➗', tint: 'mul',
    make: function (ctx) {
      var by = M.rand.pick([2, 5, 10]);
      var right = by * M.rand.int(11, 60);
      var wrongs = [right + 1, right + (by === 2 ? 3 : 2), right - (by === 10 ? 5 : 1)]
        .filter(function (n) { return n % by !== 0; });
      return mcq({
        prompt: 'Which of these numbers divides exactly by ' + by + '?',
        answer: right,
        wrongs: wrongs,
        why: by === 2 ? 'A number divides by 2 when it ends in 0, 2, 4, 6 or 8 — ' + right + ' does.'
          : by === 5 ? 'A number divides by 5 when it ends in 0 or 5 — ' + right + ' does.'
          : 'A number divides by 10 only when it ends in 0 — ' + right + ' does.'
      });
    }
  });

  M.register({
    id: 'mr-perimeter', chapter: 'mr', section: 'mr', label: 'Distance all the way round', emoji: '📐', tint: 'div',
    make: function (ctx) {
      var long = M.rand.int(4, ctx.level === 'easy' ? 9 : 20);
      var short = M.rand.int(2, long - 1);
      var perimeter = 2 * (long + short);
      return mcq({
        prompt: 'A rectangle is ' + long + ' cm long and ' + short +
          ' cm wide. How far is it all the way round?',
        answer: perimeter,
        wrongs: [long * short, long + short, perimeter + long],
        why: 'Add all four sides: ' + long + ' + ' + short + ' + ' + long + ' + ' + short + ' = ' + perimeter +
          ' cm. (' + (long * short) + ' would be the space inside, not the distance round.)'
      });
    }
  });

  M.register({
    id: 'mr-fraction-of', chapter: 'mr', section: 'mr', label: 'Fraction of an amount', emoji: '🍕', tint: 'pct',
    make: function (ctx) {
      var parts = M.rand.pick([2, 3, 4]);
      var each = M.rand.int(3, ctx.level === 'easy' ? 8 : 15);
      var numer = M.rand.int(1, parts - 1);
      var total = parts * each;
      var answer = numer * each;
      var thing = M.rand.pick(THINGS);
      return mcq({
        prompt: 'What is ' + numer + '/' + parts + ' of ' + total + ' ' + thing + '?',
        answer: answer,
        wrongs: [each, total - answer, answer + each],
        why: 'Share ' + total + ' into ' + parts + ' equal groups of ' + each + ', then take ' + numer +
          ' of them: ' + numer + ' × ' + each + ' = ' + answer + '.'
      });
    }
  });

  M.register({
    id: 'mr-place-value', chapter: 'mr', section: 'mr', label: 'Place value puzzles', emoji: '🧱', tint: 'frac',
    make: function (ctx) {
      var n = ctx.level === 'easy' ? M.rand.int(100, 999) : M.rand.int(1000, 9999);
      var list = digits(n);
      var places = list.length === 4 ? ['thousands', 'hundreds', 'tens', 'ones'] : ['hundreds', 'tens', 'ones'];
      var at = M.rand.int(0, places.length - 1);
      var worth = list[at] * Math.pow(10, places.length - 1 - at);
      return mcq({
        prompt: 'In the number ' + n + ', what is the digit in the ' + places[at] + ' place worth?',
        answer: worth,
        wrongs: [list[at], worth * 10, list[at] * 10],
        why: 'The digit is ' + list[at] + ' and it sits in the ' + places[at] + ' place, so it is worth ' +
          list[at] + ' × ' + Math.pow(10, places.length - 1 - at) + ' = ' + worth + '.'
      });
    }
  });

  M.register({
    id: 'mr-multiples', chapter: 'mr', section: 'mr', label: 'Multiples and factors', emoji: '✖️', tint: 'add',
    make: function (ctx) {
      var table = M.rand.int(3, ctx.level === 'easy' ? 6 : 9);
      var right = table * M.rand.int(4, 12);
      return mcq({
        prompt: 'Which of these is a multiple of ' + table + '?',
        answer: right,
        wrongs: [right + 1, right + 2, right - 1].filter(function (n) { return n % table !== 0; }),
        why: right + ' is in the ' + table + ' times table: ' + table + ' × ' + (right / table) + ' = ' + right + '.'
      });
    }
  });

  M.register({
    id: 'mr-chart', chapter: 'mr', section: 'mr', label: 'Reading a table', emoji: '📊', tint: 'sub',
    make: function (ctx) {
      var thing = M.rand.pick(THINGS);
      var top = ctx.level === 'easy' ? 12 : 40;
      var counts = DAYS.slice(0, 4).map(function () { return M.rand.int(3, top); });
      var one = M.rand.int(0, 3);
      var two = (one + M.rand.int(1, 3)) % 4;            // always a different day
      if (counts[two] === counts[one]) {                  // and always a different count
        counts[two] = counts[one] + M.rand.pick([1, 2, 3, -1, -2]);
        if (counts[two] < 1) counts[two] = counts[one] + 2;
      }
      var high = Math.max(counts[one], counts[two]), low = Math.min(counts[one], counts[two]);
      var rows = DAYS.slice(0, 4).map(function (day, i) { return day + ': ' + counts[i]; }).join(' · ');
      return mcq({
        prompt: rows + ' ' + thing + ' sold. How many more were sold on ' +
          DAYS[counts[one] > counts[two] ? one : two] + ' than on ' +
          DAYS[counts[one] > counts[two] ? two : one] + '?',
        answer: high - low,
        wrongs: [high + low, high, low],
        why: 'Take the smaller from the bigger: ' + high + ' − ' + low + ' = ' + (high - low) + '.'
      });
    }
  });
})(window.Mathly);
