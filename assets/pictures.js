/* Every drawing used by a lesson page. The lesson content in data/concepts.json
   names one of these and passes its numbers, so the words live in data and the
   drawing lives in code. */
(function (M) {
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


  /* A vertical sum with the carried digits written above, as it is taught in class */
  function columnAddPicture(a, b) {
    var A = String(a).split(''), B = String(b).split(''), total = String(a + b).split('');
    var cols = Math.max(A.length, B.length, total.length);
    var x0 = 120, step = 46, top = 52;
    var body = '';

    // work out the carries the same way a child would
    var carries = [], carry = 0;
    for (var i = 0; i < cols; i++) {
      var da = Number(A[A.length - 1 - i] || 0), db = Number(B[B.length - 1 - i] || 0);
      carries.unshift(carry);
      carry = (da + db + carry) >= 10 ? 1 : 0;
    }

    function digitRow(chars, y, colour, prefix) {
      var out = '';
      for (var i = 0; i < chars.length; i++) {
        var x = x0 + (cols - chars.length + i) * step;
        out += '<text x="' + x + '" y="' + y + '" text-anchor="middle" fill="' + colour +
          '" font-family="Fredoka, sans-serif" font-size="30" font-weight="600">' + chars[i] + '</text>';
      }
      if (prefix) out += '<text x="' + (x0 - step) + '" y="' + y + '" text-anchor="middle" fill="' + SOFT +
        '" font-family="Fredoka, sans-serif" font-size="28" font-weight="600">' + prefix + '</text>';
      return out;
    }

    for (var c = 0; c < cols; c++) {
      if (carries[c] === 1) {
        body += '<text x="' + (x0 + c * step - 14) + '" y="' + (top - 18) + '" text-anchor="middle" fill="' + PINK_D +
          '" font-family="Fredoka, sans-serif" font-size="17" font-weight="700">1</text>';
      }
    }

    body += digitRow(A, top, INK);
    body += digitRow(B, top + 40, INK, '+');
    body += '<line x1="' + (x0 - step - 14) + '" y1="' + (top + 54) + '" x2="' + (x0 + (cols - 1) * step + 18) +
      '" y2="' + (top + 54) + '" stroke="' + SOFT + '" stroke-width="3" stroke-linecap="round"/>';
    body += digitRow(total, top + 92, GREEN_D);
    body += label(x0 + ((cols - 1) * step) / 2, top + 122, 'ones first, then tens, then hundreds', SOFT, 12);

    return svg(x0 + cols * step + 80, top + 140, body);
  }

  /* Borrowing: each changed column shows its working value above the crossed-out digit */
  function columnSubPicture(a, b) {
    var A = String(a).split(''), B = String(b).split(''), answer = String(a - b).split('');
    var cols = A.length, x0 = 120, step = 46, top = 62;
    var working = A.map(Number);
    var changed = [];

    for (var i = cols - 1; i >= 0; i--) {
      var db = Number(B[B.length - cols + i] || 0);
      if (working[i] < db) {
        working[i] += 10;
        working[i - 1] -= 1;
        changed[i] = true;
        changed[i - 1] = true;
      }
    }

    var body = '';
    for (var c = 0; c < cols; c++) {
      if (!changed[c]) continue;
      var x = x0 + c * step;
      body += '<text x="' + x + '" y="' + (top - 26) + '" text-anchor="middle" fill="' + BLUE_D +
        '" font-family="Fredoka, sans-serif" font-size="18" font-weight="700">' + working[c] + '</text>';
      body += '<line x1="' + (x - 14) + '" y1="' + (top + 2) + '" x2="' + (x + 14) + '" y2="' + (top - 22) +
        '" stroke="' + BLUE_D + '" stroke-width="2.5" stroke-linecap="round"/>';
    }

    function row(chars, y, colour, prefix) {
      var out = '';
      for (var j = 0; j < chars.length; j++) {
        var x = x0 + (cols - chars.length + j) * step;
        out += '<text x="' + x + '" y="' + y + '" text-anchor="middle" fill="' + colour +
          '" font-family="Fredoka, sans-serif" font-size="30" font-weight="600">' + chars[j] + '</text>';
      }
      if (prefix) out += '<text x="' + (x0 - step) + '" y="' + y + '" text-anchor="middle" fill="' + SOFT +
        '" font-family="Fredoka, sans-serif" font-size="28" font-weight="600">' + prefix + '</text>';
      return out;
    }

    body += row(A, top, INK);
    body += row(B, top + 42, INK, '−');
    body += '<line x1="' + (x0 - step - 14) + '" y1="' + (top + 56) + '" x2="' + (x0 + (cols - 1) * step + 18) +
      '" y2="' + (top + 56) + '" stroke="' + SOFT + '" stroke-width="3" stroke-linecap="round"/>';
    body += row(answer, top + 94, GREEN_D);
    body += label(x0 + ((cols - 1) * step) / 2, top + 124, 'borrow a ten when the top digit is too small', SOFT, 12);

    return svg(x0 + cols * step + 80, top + 142, body);
  }

  /* A story with its numbers picked out, and the sum it turns into */
  function storyPicture(one, two, sign, total) {
    var body = '<rect x="10" y="10" width="540" height="66" rx="16" fill="#fff" stroke="' + BLUE + '" stroke-width="3"/>';
    body += '<text x="30" y="38" fill="' + INK + '" font-family="Fredoka, sans-serif" font-size="15">Meera had ' +
      '<tspan fill="' + PINK_D + '" font-weight="700">' + one + '</tspan> stickers and Kabir gave her</text>';
    body += '<text x="30" y="60" fill="' + INK + '" font-family="Fredoka, sans-serif" font-size="15">' +
      '<tspan fill="' + PINK_D + '" font-weight="700">' + two + '</tspan> more. How many does she have now?</text>';
    body += '<line x1="280" y1="82" x2="280" y2="98" stroke="' + SOFT + '" stroke-width="3" stroke-linecap="round"/>';
    body += '<path d="M 272 98 L 288 98 L 280 110 z" fill="' + SOFT + '"/>';
    body += '<rect x="170" y="112" width="220" height="52" rx="14" fill="' + GREEN + '" opacity=".35" stroke="' + GREEN_D + '" stroke-width="3"/>';
    body += '<text x="280" y="146" text-anchor="middle" fill="' + GREEN_D +
      '" font-family="Fredoka, sans-serif" font-size="26" font-weight="700">' + one + ' ' + sign + ' ' + two + ' = ' + total + '</text>';
    return svg(560, 178, body);
  }


  /* Equal groups: plates of counters */
  function groupsPicture(groups, each) {
    var body = '', plateW = 108, gap = 18, x = 14;
    for (var g = 0; g < groups; g++) {
      body += '<rect x="' + x + '" y="14" width="' + plateW + '" height="76" rx="18" fill="' + PINK +
        '" opacity=".3" stroke="' + PINK_D + '" stroke-width="3"/>';
      for (var i = 0; i < each; i++) {
        var cx = x + 26 + (i % 3) * 30;
        var cy = 38 + Math.floor(i / 3) * 30;
        body += '<circle cx="' + cx + '" cy="' + cy + '" r="10" fill="' + PINK_D + '"/>';
      }
      x += plateW + gap;
    }
    body += label(x / 2, 116, groups + ' groups of ' + each + ' = ' + groups + ' × ' + each + ' = ' + groups * each, INK, 17);
    return svg(x + 4, 132, body);
  }

  /* Sharing with a remainder: counters dealt onto plates, the rest left outside */
  function sharePicture(total, groups) {
    var each = Math.floor(total / groups), left = total % groups;
    var body = '', plateW = 96, gap = 14, x = 14;
    for (var g = 0; g < groups; g++) {
      body += '<rect x="' + x + '" y="14" width="' + plateW + '" height="70" rx="18" fill="' + BLUE +
        '" opacity=".3" stroke="' + BLUE_D + '" stroke-width="3"/>';
      for (var i = 0; i < each; i++) {
        body += '<circle cx="' + (x + 24 + (i % 3) * 26) + '" cy="' + (38 + Math.floor(i / 3) * 26) + '" r="9" fill="' + BLUE_D + '"/>';
      }
      body += label(x + plateW / 2, 100, each + ' each', BLUE_D, 12);
      x += plateW + gap;
    }
    x += 12;
    body += '<rect x="' + x + '" y="14" width="' + (left * 26 + 22) + '" height="70" rx="18" fill="none" stroke="' + PINK_D +
      '" stroke-width="3" stroke-dasharray="6 5"/>';
    for (var j = 0; j < left; j++) {
      body += '<circle cx="' + (x + 22 + j * 26) + '" cy="38" r="9" fill="' + PINK_D + '"/>';
    }
    body += label(x + (left * 26 + 22) / 2, 100, left + ' left over', PINK_D, 12);
    var width = x + left * 26 + 40;
    body += label(width / 2, 126, total + ' ÷ ' + groups + ' = ' + each + ' each, ' + left + ' left over', INK, 17);
    return svg(width, 142, body);
  }

  /* Splitting a 2-digit number to multiply it */
  function splitPicture(big, small) {
    var tens = Math.floor(big / 10) * 10, ones = big % 10;
    var wide = 360, narrow = Math.max(80, Math.round(wide * ones / tens));
    var body = '<rect x="14" y="18" width="' + wide + '" height="58" rx="14" fill="' + PURPLE +
      '" opacity=".35" stroke="' + PURPLE_D + '" stroke-width="3"/>';
    body += '<text x="' + (14 + wide / 2) + '" y="55" text-anchor="middle" fill="' + PURPLE_D +
      '" font-family="Fredoka, sans-serif" font-size="22" font-weight="700">' + tens + ' × ' + small + ' = ' + tens * small + '</text>';
    body += '<rect x="' + (24 + wide) + '" y="18" width="' + narrow + '" height="58" rx="14" fill="' + GREEN +
      '" opacity=".4" stroke="' + GREEN_D + '" stroke-width="3"/>';
    body += '<text x="' + (24 + wide + narrow / 2) + '" y="55" text-anchor="middle" fill="' + GREEN_D +
      '" font-family="Fredoka, sans-serif" font-size="20" font-weight="700">' + ones + ' × ' + small + ' = ' + ones * small + '</text>';
    var width = 38 + wide + narrow;
    body += label(width / 2, 104, tens * small + ' + ' + ones * small + ' = ' + big * small, INK, 18);
    return svg(width, 120, body);
  }


  /* A shape cut into equal parts, some shaded */
  function partsPicture(parts, shaded, caption) {
    var w = 480, h = 70, step = w / parts, body = '';
    for (var i = 0; i < parts; i++) {
      body += '<rect x="' + (12 + i * step) + '" y="12" width="' + (step - 2) + '" height="' + h +
        '" fill="' + (i < shaded ? PINK : '#fff') + '" stroke="' + PINK_D + '" stroke-width="3"/>';
      body += label(12 + i * step + step / 2, 58, '1/' + parts, i < shaded ? PINK_D : SOFT, 15);
    }
    body += label(w / 2 + 12, 108, caption, INK, 17);
    return svg(w + 24, 124, body);
  }

  /* A group of counters split into equal shares, one share ringed */
  function groupFractionPicture(total, parts) {
    var each = total / parts, body = '', x = 14, boxW = each * 30 + 20;
    for (var g = 0; g < parts; g++) {
      body += '<rect x="' + x + '" y="14" width="' + boxW + '" height="52" rx="16" fill="' +
        (g === 0 ? BLUE : '#fff') + '" opacity="' + (g === 0 ? '.45' : '1') + '" stroke="' +
        (g === 0 ? BLUE_D : '#e2d9ef') + '" stroke-width="3"/>';
      for (var i = 0; i < each; i++) {
        body += '<circle cx="' + (x + 20 + i * 30) + '" cy="40" r="10" fill="' + (g === 0 ? BLUE_D : SOFT) + '"/>';
      }
      x += boxW + 14;
    }
    body += label(x / 2, 92, 'One ' + (parts === 2 ? 'half' : parts === 3 ? 'third' : 'quarter') + ' of ' +
      total + ' is ' + each, INK, 17);
    return svg(x + 4, 108, body);
  }

  /* Three bars stacked, so bigger pieces are obvious */
  function compareFractionsPicture() {
    var w = 420, body = '', rows = [2, 3, 4], y = 14;
    rows.forEach(function (parts) {
      var step = w / parts;
      for (var i = 0; i < parts; i++) {
        body += '<rect x="' + (70 + i * step) + '" y="' + y + '" width="' + (step - 2) + '" height="36" fill="' +
          (i === 0 ? PURPLE : '#fff') + '" stroke="' + PURPLE_D + '" stroke-width="2.5"/>';
      }
      body += '<text x="56" y="' + (y + 25) + '" text-anchor="end" fill="' + INK +
        '" font-family="Fredoka, sans-serif" font-size="16" font-weight="600">1/' + parts + '</text>';
      y += 46;
    });
    body += label((w + 80) / 2, y + 20, 'the fewer the pieces, the bigger each piece', SOFT, 13);
    return svg(w + 90, y + 36, body);
  }


  /* A line with labelled stops and the jumps between them */
  function jumpsPicture(stops, jumps, caption) {
    var w = 540, left = 40, right = w - 40, body = '';
    var gap = (right - left) / (stops.length - 1);
    body += '<line x1="' + left + '" y1="86" x2="' + right + '" y2="86" stroke="' + SOFT + '" stroke-width="3" stroke-linecap="round"/>';
    stops.forEach(function (stop, i) {
      var x = left + i * gap;
      body += '<line x1="' + x + '" y1="78" x2="' + x + '" y2="94" stroke="' + INK + '" stroke-width="3"/>';
      body += label(x, 116, stop, INK, 16);
    });
    jumps.forEach(function (jump, i) {
      var x1 = left + i * gap, x2 = left + (i + 1) * gap, mid = (x1 + x2) / 2;
      body += '<path d="M ' + x1 + ' 76 Q ' + mid + ' 34 ' + x2 + ' 76" fill="none" stroke="' + PINK_D + '" stroke-width="3"/>';
      body += '<path d="M ' + (x2 - 8) + ' 68 L ' + x2 + ' 78 L ' + (x2 - 11) + ' 78 z" fill="' + PINK_D + '"/>';
      body += label(mid, 34, jump, PINK_D, 15);
    });
    body += label(w / 2, 142, caption, INK, 17);
    return svg(w, 158, body);
  }

  /* Rupee notes and coins laid out to make an amount */
  function moneyPicture(notes, coins, caption) {
    var body = '', x = 14;
    notes.forEach(function (value) {
      body += '<rect x="' + x + '" y="16" width="96" height="52" rx="8" fill="' + GREEN + '" opacity=".4" stroke="' + GREEN_D + '" stroke-width="3"/>';
      body += '<text x="' + (x + 48) + '" y="49" text-anchor="middle" fill="' + GREEN_D +
        '" font-family="Fredoka, sans-serif" font-size="22" font-weight="700">₹' + value + '</text>';
      x += 106;
    });
    coins.forEach(function (value) {
      body += '<circle cx="' + (x + 26) + '" cy="42" r="26" fill="' + BLUE + '" opacity=".5" stroke="' + BLUE_D + '" stroke-width="3"/>';
      body += '<text x="' + (x + 26) + '" y="49" text-anchor="middle" fill="' + BLUE_D +
        '" font-family="Fredoka, sans-serif" font-size="17" font-weight="700">₹' + value + '</text>';
      x += 60;
    });
    body += label(Math.max(x, 200) / 2, 96, caption, INK, 17);
    return svg(Math.max(x + 10, 220), 112, body);
  }

  /* One metre marked out in centimetres, with the other two unit pairs beside it */
  function unitsPicture() {
    var body = '', w = 520;
    body += '<rect x="14" y="18" width="' + (w - 28) + '" height="34" rx="8" fill="#fff" stroke="' + PURPLE_D + '" stroke-width="3"/>';
    for (var i = 1; i < 10; i++) {
      var x = 14 + (w - 28) * i / 10;
      body += '<line x1="' + x + '" y1="18" x2="' + x + '" y2="' + (i === 5 ? 52 : 38) + '" stroke="' + PURPLE_D + '" stroke-width="2"/>';
    }
    body += label(w / 2, 44, '1 metre = 100 centimetres', PURPLE_D, 16);
    body += label(w / 4, 86, '1 kg = 1000 g', GREEN_D, 17);
    body += label(w * 3 / 4, 86, '1 litre = 1000 ml', BLUE_D, 17);
    body += label(w / 2, 112, 'the big unit is always made of many small ones', SOFT, 13);
    return svg(w, 128, body);
  }

  /* Three everyday things with the unit that suits them */
  function sensibleUnitsPicture() {
    var items = [
      { emoji: '✏️', text: 'a pencil', unit: '15 cm', colour: PINK_D },
      { emoji: '🎒', text: 'a school bag', unit: '3 kg', colour: GREEN_D },
      { emoji: '🥤', text: 'a glass of water', unit: '200 ml', colour: BLUE_D }
    ];
    var body = '', x = 14, boxW = 168;
    items.forEach(function (item) {
      body += '<rect x="' + x + '" y="14" width="' + boxW + '" height="86" rx="18" fill="#fff" stroke="#e2d9ef" stroke-width="3"/>';
      body += '<text x="' + (x + boxW / 2) + '" y="48" text-anchor="middle" font-size="26">' + item.emoji + '</text>';
      body += label(x + boxW / 2, 68, item.text, SOFT, 13);
      body += label(x + boxW / 2, 90, item.unit, item.colour, 18);
      x += boxW + 12;
    });
    return svg(x, 112, body);
  }


  /* A row of shapes with their sides counted */
  function shapesRowPicture() {
    var shapes = [{ n: 3, name: 'triangle' }, { n: 4, name: 'square' }, { n: 5, name: 'pentagon' }, { n: 6, name: 'hexagon' }];
    var body = '', x = 20, gap = 130;
    shapes.forEach(function (shape) {
      var points = [];
      for (var i = 0; i < shape.n; i++) {
        var a = (i / shape.n) * Math.PI * 2 - Math.PI / 2;
        points.push((x + 44 + Math.cos(a) * 38).toFixed(1) + ',' + (52 + Math.sin(a) * 38).toFixed(1));
      }
      body += '<polygon points="' + points.join(' ') + '" fill="' + PURPLE + '" opacity=".4" stroke="' + PURPLE_D + '" stroke-width="3.5" stroke-linejoin="round"/>';
      body += label(x + 44, 108, shape.name, INK, 15);
      body += label(x + 44, 126, shape.n + ' sides · ' + shape.n + ' corners', SOFT, 12);
      x += gap;
    });
    return svg(x, 138, body);
  }

  /* A shape folded along its line of symmetry */
  function symmetryPicture() {
    var body = '';
    body += '<rect x="60" y="20" width="150" height="90" rx="8" fill="' + GREEN + '" opacity=".35" stroke="' + GREEN_D + '" stroke-width="3.5"/>';
    body += '<line x1="135" y1="10" x2="135" y2="120" stroke="' + PINK_D + '" stroke-width="3" stroke-dasharray="7 5"/>';
    body += label(135, 140, 'one line of symmetry', PINK_D, 13);
    var points = [];
    for (var i = 0; i < 5; i++) {
      var a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      points.push((380 + Math.cos(a) * 48).toFixed(1) + ',' + (66 + Math.sin(a) * 48).toFixed(1));
    }
    body += '<polygon points="' + points.join(' ') + '" fill="' + PURPLE + '" opacity=".35" stroke="' + PURPLE_D + '" stroke-width="3.5" stroke-linejoin="round"/>';
    for (var j = 0; j < 5; j++) {
      var b = (j / 5) * Math.PI * 2 - Math.PI / 2;
      body += '<line x1="380" y1="66" x2="' + (380 + Math.cos(b) * 48) + '" y2="' + (66 + Math.sin(b) * 48) +
        '" stroke="' + PINK_D + '" stroke-width="2" stroke-dasharray="6 4"/>';
    }
    body += label(380, 140, 'a regular pentagon has five', PINK_D, 13);
    return svg(500, 152, body);
  }

  /* A pictograph with a key */
  function pictographPicture() {
    var rows = [{ day: 'Monday', many: 4 }, { day: 'Tuesday', many: 2 }, { day: 'Wednesday', many: 5 }];
    var body = label(100, 24, 'Key: 🚲 = 5 bikes', SOFT, 14), y = 56;
    rows.forEach(function (row) {
      body += '<text x="14" y="' + y + '" fill="' + INK + '" font-family="Fredoka, sans-serif" font-size="15" font-weight="600">' + row.day + '</text>';
      var bikes = '';
      for (var i = 0; i < row.many; i++) bikes += '🚲';
      body += '<text x="120" y="' + y + '" font-size="20">' + bikes + '</text>';
      body += label(120 + row.many * 24 + 34, y, '= ' + row.many * 5, PINK_D, 15);
      y += 34;
    });
    return svg(400, y + 6, body);
  }

  /* The words that hint at each kind of sum */
  function keywordsPicture() {
    var cols = [
      { head: 'Add', colour: GREEN_D, fill: GREEN, words: ['altogether', 'in total', 'more', 'both'] },
      { head: 'Take away', colour: PINK_D, fill: PINK, words: ['left', 'gave away', 'sold', 'how many more'] },
      { head: 'Times or share', colour: BLUE_D, fill: BLUE, words: ['each', 'every', 'rows of', 'shared equally'] }
    ];
    var body = '', x = 12, boxW = 176;
    cols.forEach(function (col) {
      body += '<rect x="' + x + '" y="12" width="' + boxW + '" height="126" rx="18" fill="' + col.fill +
        '" opacity=".3" stroke="' + col.colour + '" stroke-width="3"/>';
      body += label(x + boxW / 2, 38, col.head, col.colour, 17);
      col.words.forEach(function (word, i) {
        body += label(x + boxW / 2, 64 + i * 22, word, INK, 14);
      });
      x += boxW + 12;
    });
    return svg(x, 150, body);
  }

  M.pictures = {
    keywords: keywordsPicture,
    placeValue: placeValuePicture,
    compare: comparePicture,
    numberLine: numberLinePicture,
    jumps: jumpsPicture,
    money: moneyPicture,
    units: unitsPicture,
    sensibleUnits: sensibleUnitsPicture,
    shapesRow: shapesRowPicture,
    symmetry: symmetryPicture,
    pictograph: pictographPicture,
    parts: partsPicture,
    groupFraction: groupFractionPicture,
    compareFractions: compareFractionsPicture,
    groups: groupsPicture,
    share: sharePicture,
    split: splitPicture,
    columnAdd: columnAddPicture,
    columnSub: columnSubPicture,
    story: storyPicture,
    clock: function (h, m) { return M.clockSvg ? M.clockSvg(h, m) : ''; },
    polygon: function (sides) { return M.polygonSvg ? M.polygonSvg(sides) : ''; },
    tally: function (n) { return M.tallySvg ? M.tallySvg(n) : ''; }
  };
})(window.Mathly);
