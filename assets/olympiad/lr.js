/* Logical Reasoning — the section a school textbook never covers. */
(function (M) {
  'use strict';

  var mcq = M.olympiad.mcq;
  var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  var DIRECTIONS = ['north', 'east', 'south', 'west'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var NAMES = ['Meera', 'Aarav', 'Riya', 'Kabir', 'Ananya', 'Vihaan', 'Diya'];

  M.register({
    id: 'lr-number-series', chapter: 'lr', section: 'lr', label: 'Number series', emoji: '🔢', tint: 'mul',
    make: function (ctx) {
      var doubling = ctx.level !== 'easy' && M.rand.int(0, 1);
      var shown = [], answer, step;
      if (doubling) {
        var start = M.rand.int(2, 6);
        shown = [start, start * 2, start * 4, start * 8];
        answer = start * 16;
        return mcq({
          prompt: shown.join(', ') + ', ?',
          answer: answer,
          wrongs: [shown[3] + start, answer + start, shown[3] * 3],
          why: 'Each number is double the one before it, so after ' + shown[3] + ' comes ' + shown[3] + ' × 2 = ' + answer + '.'
        });
      }
      step = M.rand.int(2, ctx.level === 'easy' ? 6 : 12);
      var from = M.rand.int(1, 20);
      shown = [from, from + step, from + 2 * step, from + 3 * step];
      answer = from + 4 * step;
      return mcq({
        prompt: shown.join(', ') + ', ?',
        answer: answer,
        wrongs: [answer + step, answer - 1, shown[3] * 2],
        why: 'The jump is + ' + step + ' every time, so ' + shown[3] + ' + ' + step + ' = ' + answer + '.'
      });
    }
  });

  M.register({
    id: 'lr-letter-series', chapter: 'lr', section: 'lr', label: 'Letter series', emoji: '🔠', tint: 'add',
    make: function (ctx) {
      var step = ctx.level === 'easy' ? 1 : M.rand.int(2, 3);
      var start = M.rand.int(0, 12);
      var letter = function (index) { return LETTERS[((index % 26) + 26) % 26]; };
      var shown = [0, 1, 2, 3].map(function (i) { return letter(start + i * step); });
      var answer = letter(start + 4 * step);
      return mcq({
        prompt: shown.join(', ') + ', ?',
        answer: answer,
        wrongs: [1, -1, 2, step + 1, -2].map(function (offset) { return letter(start + 4 * step + offset); }),
        why: 'The letters jump ' + step + ' place' + (step > 1 ? 's' : '') + ' each time, so after ' +
          shown[3] + ' comes ' + answer + '.'
      });
    }
  });

  M.register({
    id: 'lr-odd-one-out', chapter: 'lr', section: 'lr', label: 'Odd one out', emoji: '🕵️', tint: 'sub',
    make: function (ctx) {
      var table = M.rand.pick(ctx.level === 'easy' ? [2, 5, 10] : [3, 4, 6, 7, 8, 9]);
      var inGroup = M.rand.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).map(function (n) { return n * table; });
      var odd = inGroup[0] + M.rand.pick([1, -1, 2]);
      while (odd % table === 0 || odd < 1) odd++;
      return mcq({
        prompt: 'Which number does not belong: ' + M.rand.shuffle(inGroup.concat([odd])).join(', ') + '?',
        answer: odd,
        wrongs: inGroup,
        why: 'All the others are in the ' + table + ' times table. ' + odd + ' is not, because ' +
          odd + ' ÷ ' + table + ' does not come out exactly.'
      });
    }
  });

  M.register({
    id: 'lr-analogy', chapter: 'lr', section: 'lr', label: 'Number pairs', emoji: '🔗', tint: 'div',
    make: function (ctx) {
      var times = M.rand.int(2, ctx.level === 'easy' ? 3 : 6);
      var a = M.rand.int(2, 9), b = M.rand.int(2, 9);
      while (b === a) b = M.rand.int(2, 9);
      var answer = b * times;
      return mcq({
        prompt: a + ' : ' + (a * times) + '  ::  ' + b + ' : ?',
        answer: answer,
        wrongs: [b + (a * times - a), answer + times, b * (times + 1)],
        why: a + ' × ' + times + ' = ' + (a * times) + ', so the rule is × ' + times + '. That makes ' +
          b + ' × ' + times + ' = ' + answer + '.'
      });
    }
  });

  M.register({
    id: 'lr-ranking', chapter: 'lr', section: 'lr', label: 'Places in a row', emoji: '🧍', tint: 'pct',
    make: function (ctx) {
      var total = M.rand.int(8, ctx.level === 'easy' ? 12 : 25);
      var fromLeft = M.rand.int(2, total - 1);
      var who = M.rand.pick(NAMES);
      var answer = total - fromLeft + 1;
      return mcq({
        prompt: who + ' is ' + fromLeft + 'th from the left in a row of ' + total +
          ' children. Which place is that from the right?',
        answer: answer,
        wrongs: [total - fromLeft, fromLeft, answer + 1],
        why: 'Take the place from the left away from the total, then add 1 for ' + who + ': ' +
          total + ' − ' + fromLeft + ' + 1 = ' + answer + '.'
      });
    }
  });

  M.register({
    id: 'lr-direction', chapter: 'lr', section: 'lr', label: 'Direction sense', emoji: '🧭', tint: 'frac',
    make: function (ctx) {
      var facing = M.rand.int(0, 3);
      var turns = ctx.level === 'easy' ? 1 : M.rand.int(1, 3);
      var right = M.rand.int(0, 1);
      var end = ((facing + (right ? turns : -turns)) % 4 + 4) % 4;
      return mcq({
        prompt: 'You are facing ' + DIRECTIONS[facing] + ' and turn ' + (right ? 'right' : 'left') + ' ' +
          (turns === 1 ? 'once' : turns + ' times') + '. Which way are you facing now?',
        answer: DIRECTIONS[end],
        wrongs: DIRECTIONS.filter(function (d) { return d !== DIRECTIONS[end]; }),
        why: 'Each turn moves you one quarter round: ' + DIRECTIONS[facing] + ' → ' +
          DIRECTIONS[((facing + (right ? 1 : -1)) % 4 + 4) % 4] + ' and so on, ending at ' + DIRECTIONS[end] + '.'
      });
    }
  });

  M.register({
    id: 'lr-coding', chapter: 'lr', section: 'lr', label: 'Codes', emoji: '🔐', tint: 'mul',
    make: function (ctx) {
      var word = M.rand.pick(ctx.level === 'easy' ? ['CAB', 'BAD', 'ACE'] : ['FADE', 'HEAD', 'CAGE', 'BEAD']);
      var code = word.split('').map(function (letter) { return LETTERS.indexOf(letter) + 1; }).join('');
      var wrongCode = word.split('').map(function (letter) { return LETTERS.indexOf(letter); }).join('');
      var reversed = word.split('').reverse().map(function (letter) { return LETTERS.indexOf(letter) + 1; }).join('');
      return mcq({
        prompt: 'If A = 1, B = 2, C = 3 and so on, what is the code for ' + word + '?',
        answer: code,
        wrongs: [wrongCode, reversed, code.split('').reverse().join('')],
        why: 'Swap each letter for its place in the alphabet: ' +
          word.split('').map(function (l) { return l + '=' + (LETTERS.indexOf(l) + 1); }).join(', ') + '.'
      });
    }
  });

  M.register({
    id: 'lr-calendar', chapter: 'lr', section: 'lr', label: 'Calendar logic', emoji: '📅', tint: 'add',
    make: function (ctx) {
      var day = M.rand.int(0, 6);
      var date = M.rand.int(1, 10);
      var jump = M.rand.pick(ctx.level === 'easy' ? [7, 14] : [7, 14, 21, 9, 10]);
      var answer = DAYS[(day + jump) % 7];
      return mcq({
        prompt: 'If the ' + date + 'th of a month is a ' + DAYS[day] + ', what day is the ' + (date + jump) + 'th?',
        answer: answer,
        wrongs: [DAYS[(day + jump + 1) % 7], DAYS[(day + jump + 6) % 7], DAYS[(day + jump + 3) % 7]],
        why: jump + ' days later is ' + Math.floor(jump / 7) + ' whole week' + (jump >= 14 ? 's' : '') +
          (jump % 7 ? ' and ' + (jump % 7) + ' day' + (jump % 7 > 1 ? 's' : '') : '') +
          ', so the day moves on ' + (jump % 7) + ' place' + (jump % 7 === 1 ? '' : 's') + ' to ' + answer + '.'
      });
    }
  });
})(window.Mathly);
