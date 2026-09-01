/* Mathly engine: question registry, levels, marking helpers, progress and speech.
   Question types register themselves from assets/questions/*.js.
   A type looks like:
     Mathly.register({
       id: 'numbers-round10', chapter: 'numbers', label: 'Round to the nearest 10',
       make: function (ctx) { return { prompt: '…', mode: 'number', answer: 70 }; }
     });
   ctx = { level: 'easy' | 'just' | 'challenge', from, to, parts }
   A question is { prompt, mode, answer, choices?, fields?, note? }
     mode 'number'  → one box, answer is a number
     mode 'choice'  → big buttons, answer is one of choices
     mode 'multi'   → several small boxes, fields: [{label}], answer: [n, n, …]
     mode 'unit'    → one box with a unit printed after it, unit: 'cm' */
window.Mathly = (function () {
  'use strict';

  var types = {};
  var order = [];

  function randomInt(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
  function pick(arr) { return arr[randomInt(0, arr.length - 1)]; }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = randomInt(0, i);
      var swap = arr[i]; arr[i] = arr[j]; arr[j] = swap;
    }
    return arr;
  }

  function gcd(a, b) { return b ? gcd(b, a % b) : a; }

  // 3 or more numbers get brackets so the order is obvious: ((a − b) − c) − d
  function chain(parts, sign) {
    if (parts.length < 3) return parts.join(' ' + sign + ' ');
    var text = parts[0] + ' ' + sign + ' ' + parts[1];
    for (var i = 2; i < parts.length; i++) text = '(' + text + ') ' + sign + ' ' + parts[i];
    return text;
  }

  function register(def) {
    if (!types[def.id]) order.push(def.id);
    types[def.id] = def;
  }

  function get(id) { return types[id]; }
  function all() { return order.map(function (id) { return types[id]; }); }
  function byChapter(chapter) {
    return all().filter(function (t) { return t.chapter === chapter; });
  }

  var LEVELS = {
    easy:      { id: 'easy',      label: 'Easy',       emoji: '🌱', from: 1, to: 10,    parts: 2 },
    just:      { id: 'just',      label: 'Just right', emoji: '🌼', from: 2, to: 12,    parts: 2 },
    challenge: { id: 'challenge', label: 'Challenge',  emoji: '🚀', from: 2, to: 100,   parts: 3 }
  };
  var LEVEL_ORDER = ['easy', 'just', 'challenge'];

  function level(id) { return LEVELS[id] || LEVELS.just; }

  /* ---- marking ---- */
  function tidy(value) {
    return String(value).trim().replace(/[₹,\s]/g, '').replace(/^0+(?=\d)/, '').replace(/\.0+$/, '');
  }

  function isRight(question, given) {
    if (question.mode === 'multi') {
      if (!given || given.length !== question.answer.length) return false;
      for (var i = 0; i < question.answer.length; i++) {
        if (tidy(given[i]) !== tidy(question.answer[i])) return false;
      }
      return true;
    }
    return tidy(given) === tidy(question.answer);
  }

  function answerText(question) {
    if (question.mode === 'multi') {
      return question.answer.map(function (a, i) {
        return a + ' ' + (question.fields[i].label || '');
      }).join(', ').trim();
    }
    return String(question.answer) + (question.unit ? ' ' + question.unit : '');
  }

  /* ---- progress, per topic, in this browser only ---- */
  var STORE = 'mathly-progress';

  function readProgress() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; }
  }

  function writeProgress(data) {
    try { localStorage.setItem(STORE, JSON.stringify(data)); } catch (e) { /* private mode */ }
  }

  function starsFor(right, total) {
    if (!total) return 0;
    if (right === total) return 5;
    return Math.min(4, Math.max(0, Math.round((right / total) * 5)));
  }

  function record(typeId, right, total) {
    if (!typeId || !total) return;
    var data = readProgress();
    var row = data[typeId] || { attempts: 0, best: 0, stars: 0, right: 0, asked: 0 };
    var stars = starsFor(right, total);
    row.attempts++;
    row.right += right;
    row.asked += total;
    row.best = Math.max(row.best, Math.round((right / total) * 100));
    row.stars = Math.max(row.stars, stars);
    row.last = Date.now();
    data[typeId] = row;
    writeProgress(data);
  }

  function chapterStars(chapterId) {
    var data = readProgress();
    var list = byChapter(chapterId);
    var earned = 0;
    list.forEach(function (t) { earned += (data[t.id] && data[t.id].stars) || 0; });
    return { earned: earned, possible: list.length * 5, topics: list.length };
  }

  function clearProgress() { writeProgress({}); }

  /* ---- read aloud, for children who can do the maths but not yet the reading ---- */
  function canSpeak() {
    return typeof window.speechSynthesis !== 'undefined';
  }

  function speak(text) {
    if (!canSpeak()) return;
    try {
      window.speechSynthesis.cancel();
      var say = new SpeechSynthesisUtterance(String(text).replace(/[×]/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus '));
      say.rate = 0.9;
      say.lang = 'en-IN';
      window.speechSynthesis.speak(say);
    } catch (e) { /* nothing to do */ }
  }

  return {
    register: register,
    get: get,
    all: all,
    byChapter: byChapter,
    LEVELS: LEVELS,
    LEVEL_ORDER: LEVEL_ORDER,
    level: level,
    rand: { int: randomInt, pick: pick, shuffle: shuffle },
    gcd: gcd,
    chain: chain,
    isRight: isRight,
    answerText: answerText,
    starsFor: starsFor,
    progress: { read: readProgress, record: record, chapter: chapterStars, clear: clearProgress },
    speak: speak,
    canSpeak: canSpeak
  };
})();
