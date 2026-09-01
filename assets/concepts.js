/* Concept pages: the teaching half of each topic.
   Pictures are built here as small inline SVGs so the pages stay dependency-free. */
(function () {
  'use strict';

  var INK = '#3d3450', SOFT = '#7c7290';
  var PINK = '#ffc9dd', BLUE = '#b9dbff', GREEN = '#b6e6b1', PURPLE = '#d3c6ff';
  var PINK_D = '#c9457e', BLUE_D = '#2f6ec0', GREEN_D = '#3d8b3a', PURPLE_D = '#6d51c9';

  function svg(width, height, body) {
    return '<svg viewBox="0 0 ' + width + ' ' + height + '" role="img" class="concept-svg">' + body + '</svg>';
  }

  function label(x, y, text, colour, size) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle" fill="' + (colour || SOFT) +
      '" font-family="Fredoka, sans-serif" font-size="' + (size || 13) + '" font-weight="600">' + text + '</text>';
  }

  /* 4 hundred-flats, 7 ten-rods and 6 units — the classic place-value picture */
  function placeValuePicture(hundreds, tens, ones) {
    var body = '', x = 12, i, j;

    for (i = 0; i < hundreds; i++) {
      body += '<rect x="' + x + '" y="16" width="46" height="46" rx="5" fill="' + PINK + '" stroke="' + PINK_D + '" stroke-width="2"/>';
      for (j = 1; j < 5; j++) {
        body += '<line x1="' + (x + j * 9.2) + '" y1="16" x2="' + (x + j * 9.2) + '" y2="62" stroke="' + PINK_D + '" stroke-width=".6" opacity=".5"/>';
        body += '<line x1="' + x + '" y1="' + (16 + j * 9.2) + '" x2="' + (x + 46) + '" y2="' + (16 + j * 9.2) + '" stroke="' + PINK_D + '" stroke-width=".6" opacity=".5"/>';
      }
      x += 54;
    }
    body += label(12 + hundreds * 27, 80, hundreds + ' hundreds = ' + hundreds * 100, PINK_D);

    x += 26;
    var tensStart = x;
    for (i = 0; i < tens; i++) {
      body += '<rect x="' + x + '" y="16" width="13" height="46" rx="4" fill="' + BLUE + '" stroke="' + BLUE_D + '" stroke-width="2"/>';
      for (j = 1; j < 5; j++) {
        body += '<line x1="' + x + '" y1="' + (16 + j * 9.2) + '" x2="' + (x + 13) + '" y2="' + (16 + j * 9.2) + '" stroke="' + BLUE_D + '" stroke-width=".6" opacity=".5"/>';
      }
      x += 19;
    }
    body += label(tensStart + (tens * 19) / 2 - 3, 80, tens + ' tens = ' + tens * 10, BLUE_D);

    x += 26;
    var onesStart = x;
    for (i = 0; i < ones; i++) {
      body += '<rect x="' + (x + (i % 3) * 15) + '" y="' + (16 + Math.floor(i / 3) * 15) + '" width="11" height="11" rx="3" fill="' + GREEN + '" stroke="' + GREEN_D + '" stroke-width="2"/>';
    }
    body += label(onesStart + 20, 80, ones + ' ones = ' + ones, GREEN_D);

    return svg(Math.max(560, onesStart + 90), 96, body);
  }

  function comparePicture(a, b) {
    function card(x, n, highlight) {
      var text = String(n), out = '<rect x="' + x + '" y="14" width="150" height="62" rx="14" fill="#fff" stroke="' + PURPLE + '" stroke-width="3"/>';
      for (var i = 0; i < text.length; i++) {
        var cx = x + 26 + i * 34;
        if (i === highlight) {
          out += '<circle cx="' + cx + '" cy="46" r="19" fill="' + PURPLE + '" opacity=".55"/>';
        }
        out += '<text x="' + cx + '" y="54" text-anchor="middle" fill="' + INK +
          '" font-family="Fredoka, sans-serif" font-size="30" font-weight="600">' + text[i] + '</text>';
      }
      return out;
    }
    var sign = a < b ? '&lt;' : (a > b ? '&gt;' : '=');
    return svg(430, 96,
      card(10, a, 1) +
      '<text x="215" y="58" text-anchor="middle" fill="' + PURPLE_D + '" font-family="Fredoka, sans-serif" font-size="34" font-weight="700">' + sign + '</text>' +
      card(270, b, 1) +
      label(215, 88, 'Same hundreds? Then look at the tens.', SOFT, 12));
  }

  function numberLinePicture(value, low, high) {
    var width = 560, left = 30, right = width - 30, span = high - low;
    var x = function (n) { return left + ((n - low) / span) * (right - left); };
    var body = '<line x1="' + left + '" y1="52" x2="' + right + '" y2="52" stroke="' + SOFT + '" stroke-width="3" stroke-linecap="round"/>';
    for (var n = low; n <= high; n++) {
      var tall = (n === low || n === high);
      body += '<line x1="' + x(n) + '" y1="' + (tall ? 38 : 45) + '" x2="' + x(n) + '" y2="' + (tall ? 66 : 59) + '" stroke="' + (tall ? INK : SOFT) + '" stroke-width="' + (tall ? 3 : 1.5) + '"/>';
      if (tall) body += label(x(n), 84, String(n), INK, 15);
    }
    var mid = (low + high) / 2;
    body += '<line x1="' + x(mid) + '" y1="34" x2="' + x(mid) + '" y2="70" stroke="' + PURPLE_D + '" stroke-width="2" stroke-dasharray="4 4"/>';
    body += label(x(mid), 26, 'halfway', PURPLE_D, 11);
    body += '<circle cx="' + x(value) + '" cy="52" r="9" fill="' + PINK_D + '"/>';
    body += label(x(value), 100, String(value), PINK_D, 15);
    var target = Math.round(value / (high - low)) * (high - low);
    body += '<path d="M ' + x(value) + ' 108 Q ' + ((x(value) + x(target)) / 2) + ' 126 ' + x(target) + ' 112" fill="none" stroke="' + PINK_D + '" stroke-width="2.5" marker-end="url(#tip)"/>';
    body = '<defs><marker id="tip" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">' +
      '<path d="M0 0 L8 4 L0 8 z" fill="' + PINK_D + '"/></marker></defs>' + body;
    return svg(width, 132, body);
  }

  window.MATHLY_CONCEPTS = {
    'place-value': {
      chapter: 'numbers',
      title: 'Hundreds, tens and ones',
      emoji: '🧱',
      bigIdea: 'Every 3-digit number is just some hundreds, some tens and some ones stuck together.',
      picture: placeValuePicture(4, 7, 6),
      pictureCaption: '476 = 4 hundreds + 7 tens + 6 ones',
      steps: [
        { head: 'Start with the number', text: 'Take 476. Say it out loud: four hundred and seventy-six.' },
        { head: 'Split it up', text: 'The 4 is in the hundreds place, the 7 is in the tens place and the 6 is in the ones place.' },
        { head: 'Give each digit its value', text: '4 hundreds is 400. 7 tens is 70. 6 ones is 6.' },
        { head: 'Add them back', text: '400 + 70 + 6 = 476. That is called the expanded form.' }
      ],
      tryTypes: ['numbers-expanded', 'numbers-digit-value'],
      practice: 'quiz.html?chapter=numbers&level=just'
    },

    'compare-numbers': {
      chapter: 'numbers',
      title: 'Which number is bigger?',
      emoji: '⚖️',
      bigIdea: 'To compare two numbers, look at the biggest place first — the hundreds. Only if they match do you look at the tens.',
      picture: comparePicture(308, 380),
      pictureCaption: '308 is smaller than 380',
      steps: [
        { head: 'Line them up', text: 'Write 308 and 380 one under the other. Both have 3 digits, so they are both hundreds numbers.' },
        { head: 'Compare the hundreds', text: 'Both have 3 hundreds. Still a tie, so move one place to the right.' },
        { head: 'Compare the tens', text: '308 has 0 tens. 380 has 8 tens. 0 is less than 8, so 308 is the smaller number.' },
        { head: 'Write the sign', text: '308 < 380. The open end of the sign always faces the bigger number — it is a hungry mouth.' }
      ],
      tryTypes: ['numbers-compare', 'numbers-neighbours'],
      practice: 'quiz.html?topic=numbers-compare&level=just'
    },

    'rounding': {
      chapter: 'numbers',
      title: 'Rounding to the nearest 10',
      emoji: '🎯',
      bigIdea: 'Rounding means jumping to the closest ten. If you are halfway or past it, you jump up.',
      picture: numberLinePicture(67, 60, 70),
      pictureCaption: '67 is past halfway, so it rounds up to 70',
      steps: [
        { head: 'Find the two tens', text: '67 sits between 60 and 70.' },
        { head: 'Find halfway', text: 'Halfway between 60 and 70 is 65.' },
        { head: 'Which side?', text: '67 is past 65, so it is closer to 70.' },
        { head: 'Round it', text: '67 rounded to the nearest 10 is 70. The quick way: look at the ones digit — 5 or more rounds up, 4 or less stays.' }
      ],
      tryTypes: ['numbers-round', 'numbers-skip'],
      practice: 'quiz.html?topic=numbers-round&level=just'
    }
  };
})();
