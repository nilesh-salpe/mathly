/* Time & Calendar — CBSE Class 3: reading a clock, how long things take, days and months. */
(function (M) {
  'use strict';

  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  var MORNING = ['school starts', 'the sun rises', 'you eat breakfast', 'the milkman comes'];
  var EVENING = ['the sun sets', 'you eat dinner', 'you go to bed', 'the street lights come on'];

  function two(n) { return (n < 10 ? '0' : '') + n; }

  /* a clock face with both hands, drawn to the minute */
  function clockSvg(hours, minutes) {
    var cx = 60, cy = 60, r = 52, body = '';
    body += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#fff" stroke="#7c5cff" stroke-width="4"/>';
    for (var t = 0; t < 60; t++) {
      var a = (t / 60) * Math.PI * 2 - Math.PI / 2;
      var big = t % 5 === 0;
      var inner = r - (big ? 9 : 4);
      body += '<line x1="' + (cx + Math.cos(a) * inner) + '" y1="' + (cy + Math.sin(a) * inner) +
        '" x2="' + (cx + Math.cos(a) * (r - 2)) + '" y2="' + (cy + Math.sin(a) * (r - 2)) +
        '" stroke="' + (big ? '#7c5cff' : '#cdbcff') + '" stroke-width="' + (big ? 2.5 : 1.2) + '"/>';
    }
    [12, 3, 6, 9].forEach(function (n) {
      var a = (n / 12) * Math.PI * 2 - Math.PI / 2;
      body += '<text x="' + (cx + Math.cos(a) * (r - 20)) + '" y="' + (cy + Math.sin(a) * (r - 20) + 6) +
        '" text-anchor="middle" fill="#3d3450" font-family="Fredoka, sans-serif" font-size="15" font-weight="600">' + n + '</text>';
    });
    var minuteAngle = (minutes / 60) * Math.PI * 2 - Math.PI / 2;
    var hourAngle = (((hours % 12) + minutes / 60) / 12) * Math.PI * 2 - Math.PI / 2;
    body += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.cos(hourAngle) * (r - 26)) +
      '" y2="' + (cy + Math.sin(hourAngle) * (r - 26)) + '" stroke="#3d3450" stroke-width="6" stroke-linecap="round"/>';
    body += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.cos(minuteAngle) * (r - 12)) +
      '" y2="' + (cy + Math.sin(minuteAngle) * (r - 12)) + '" stroke="#c9457e" stroke-width="4" stroke-linecap="round"/>';
    body += '<circle cx="' + cx + '" cy="' + cy + '" r="4.5" fill="#3d3450"/>';
    return '<svg viewBox="0 0 120 120" role="img" aria-label="a clock face">' + body + '</svg>';
  }

  function minuteStep(ctx) {
    return ctx.level === 'easy' ? M.rand.pick([0, 30]) :
      ctx.level === 'just' ? M.rand.pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]) :
      M.rand.int(0, 59);
  }

  M.register({
    id: 'time-read', chapter: 'time', label: 'Read the clock', emoji: '🕐', tint: 'add',
    make: function (ctx) {
      var hours = M.rand.int(1, 12), minutes = minuteStep(ctx);
      return {
        picture: clockSvg(hours, minutes),
        prompt: 'What time does the clock show?',
        mode: 'multi',
        fields: [{ label: 'hours' }, { label: 'minutes' }],
        answer: [hours, minutes],
        note: 'The short hand shows the hour, the long hand the minutes'
      };
    }
  });

  M.register({
    id: 'time-elapsed', chapter: 'time', label: 'How long did it take?', emoji: '⏳', tint: 'sub',
    make: function (ctx) {
      var startH = M.rand.int(1, 10), startM = M.rand.pick([0, 5, 10, 15, 20, 30, 40, 45]);
      var minutes = M.rand.pick(ctx.level === 'easy' ? [15, 30, 45, 60] : [20, 25, 35, 40, 50, 55, 70, 90]);
      var endTotal = startH * 60 + startM + minutes;
      return {
        prompt: 'A film starts at ' + startH + ':' + two(startM) + ' and finishes at ' +
          Math.floor(endTotal / 60) + ':' + two(endTotal % 60) + '. How many minutes long is it?',
        mode: 'number',
        unit: 'minutes',
        answer: minutes
      };
    }
  });

  M.register({
    id: 'time-finish', chapter: 'time', label: 'When does it finish?', emoji: '🏁', tint: 'mul',
    make: function (ctx) {
      var startH = M.rand.int(1, 10), startM = M.rand.pick([0, 10, 15, 20, 30, 45]);
      var minutes = M.rand.pick(ctx.level === 'easy' ? [15, 30, 60] : [25, 40, 45, 50, 75, 90]);
      var endTotal = startH * 60 + startM + minutes;
      return {
        prompt: 'A cricket match starts at ' + startH + ':' + two(startM) + ' and lasts ' + minutes +
          ' minutes. What time does it finish?',
        mode: 'multi',
        fields: [{ label: 'hours' }, { label: 'minutes' }],
        answer: [Math.floor(endTotal / 60), endTotal % 60]
      };
    }
  });

  M.register({
    id: 'time-ampm', chapter: 'time', label: 'a.m. or p.m.?', emoji: '🌗', tint: 'div',
    make: function () {
      var morning = M.rand.int(0, 1);
      var when = morning ? M.rand.pick(MORNING) : M.rand.pick(EVENING);
      return {
        prompt: 'Is it a.m. or p.m. when ' + when + '?',
        mode: 'choice',
        choices: ['a.m.', 'p.m.'],
        answer: morning ? 'a.m.' : 'p.m.',
        note: 'a.m. is midnight to noon, p.m. is noon to midnight'
      };
    }
  });

  M.register({
    id: 'time-units', chapter: 'time', label: 'Time facts', emoji: '📐', tint: 'pct',
    make: function (ctx) {
      var pool = [
        function () { var h = M.rand.int(2, 6); return { prompt: 'How many minutes are there in ' + h + ' hours?', unit: 'minutes', answer: h * 60 }; },
        function () { var m = M.rand.int(2, 6); return { prompt: 'How many seconds are there in ' + m + ' minutes?', unit: 'seconds', answer: m * 60 }; },
        function () { var w = M.rand.int(2, 8); return { prompt: 'How many days are there in ' + w + ' weeks?', unit: 'days', answer: w * 7 }; },
        function () { return { prompt: 'How many months are there in a year?', unit: 'months', answer: 12 }; },
        function () { return { prompt: 'How many days are there in a leap year?', unit: 'days', answer: 366 }; }
      ];
      var made = M.rand.pick(ctx.level === 'easy' ? pool.slice(2) : pool)();
      return { prompt: made.prompt, mode: 'number', unit: made.unit, answer: made.answer };
    }
  });

  M.register({
    id: 'time-calendar', chapter: 'time', label: 'Days and dates', emoji: '📅', tint: 'frac',
    make: function (ctx) {
      var kind = M.rand.pick(['week-later', 'next-month', 'day-count']);
      if (kind === 'week-later') {
        var day = M.rand.pick(DAYS);
        var date = M.rand.int(1, 20);
        var jump = M.rand.pick([7, 14]);
        return {
          prompt: 'If ' + date + ' March is a ' + day + ', what day is ' + (date + jump) + ' March?',
          mode: 'choice',
          choices: M.rand.shuffle([day, DAYS[(DAYS.indexOf(day) + 1) % 7], DAYS[(DAYS.indexOf(day) + 6) % 7]]),
          answer: day,
          note: 'A whole week later is the same day again'
        };
      }
      if (kind === 'next-month') {
        var at = M.rand.int(0, 11);
        return {
          prompt: 'Which month comes just after ' + MONTHS[at] + '?',
          mode: 'choice',
          choices: M.rand.shuffle([MONTHS[(at + 1) % 12], MONTHS[(at + 2) % 12], MONTHS[(at + 11) % 12]]),
          answer: MONTHS[(at + 1) % 12]
        };
      }
      var weeks = M.rand.int(2, 6), extra = M.rand.int(1, 6);
      return {
        prompt: 'How many days are there in ' + weeks + ' weeks and ' + extra + ' days?',
        mode: 'number',
        unit: 'days',
        answer: weeks * 7 + extra
      };
    }
  });

  M.clockSvg = clockSvg;      // the lesson page draws a clock too
})(window.Mathly);
