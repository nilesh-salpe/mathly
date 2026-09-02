/* Builds a fixed question bank for every chapter from the same generators the
   quiz uses, checks each question, and writes data/banks/<chapter>.json.
   Run: node tools/build-banks.js [howMany]   (default 100 per chapter) */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const PER_CHAPTER = Number(process.argv[2]) || 100;

const context = { window: {}, console, document: { write: function () {} } };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'assets/engine.js'), 'utf8'), context);

const files = fs.readFileSync(path.join(root, 'assets/questions.js'), 'utf8')
  .match(/\[([^\]]+)\]/)[1]
  .split(',')
  .map(name => name.trim().replace(/'/g, ''));

files.forEach(name => {
  vm.runInContext(fs.readFileSync(path.join(root, 'assets/questions/' + name + '.js'), 'utf8'), context, { filename: name });
});

const M = context.window.Mathly;

function problem(q) {
  if (!q || typeof q.prompt !== 'string' || !q.prompt.trim()) return 'empty prompt';
  if (/NaN|undefined|null/.test(q.prompt)) return 'prompt reads badly';
  if (q.mode === 'multi') {
    if (!Array.isArray(q.answer) || q.answer.length !== q.fields.length) return 'boxes and answers do not match';
    if (q.answer.some(a => !Number.isInteger(a) || a < 0)) return 'answer is not a whole number';
    return null;
  }
  if (q.mode === 'choice') {
    if (!Array.isArray(q.choices) || q.choices.length < 2) return 'not enough choices';
    if (q.choices.filter(c => String(c) === String(q.answer)).length !== 1) return 'not exactly one correct choice';
    return null;
  }
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 1e12) return 'answer out of range';
  return null;
}

const chapters = {};
M.all().forEach(type => { (chapters[type.chapter] = chapters[type.chapter] || []).push(type); });

let total = 0;
const summary = [];

Object.keys(chapters).forEach(chapterId => {
  const types = chapters[chapterId];
  const levels = M.LEVEL_ORDER;
  const questions = [];
  const seen = new Set();
  let guard = 0;

  while (questions.length < PER_CHAPTER && guard < PER_CHAPTER * 200) {
    const type = types[guard % types.length];
    const levelId = levels[Math.floor(guard / types.length) % levels.length];
    const level = M.level(levelId);
    guard++;

    const q = type.make({ level: levelId, from: level.from, to: level.to, parts: level.parts });
    // two questions can share wording but differ in the picture, so the whole
    // question makes the fingerprint
    const signature = [q.prompt, q.picture || '', JSON.stringify(q.answer), (q.choices || []).join('|')].join('¬');
    const wrong = problem(q) || (type.check ? type.check(q) : null);
    if (wrong || seen.has(signature)) continue;
    seen.add(signature);

    questions.push({
      n: questions.length + 1,
      type: type.id,
      topic: type.label,
      level: levelId,
      prompt: q.prompt,
      mode: q.mode,
      answer: q.answer,
      choices: q.choices || undefined,
      fields: q.fields || undefined,
      unit: q.unit || undefined,
      note: q.note || undefined,
      picture: q.picture || undefined
    });
  }

  const file = path.join(root, 'data/3/banks/' + chapterId + '.json');
  fs.writeFileSync(file, JSON.stringify({
    chapter: chapterId,
    count: questions.length,
    topics: types.map(t => ({ id: t.id, label: t.label, emoji: t.emoji })),
    questions
  }, null, 1) + '\n');

  total += questions.length;
  summary.push(chapterId + ': ' + questions.length);
});

fs.writeFileSync(path.join(root, 'data/3/banks/index.json'),
  JSON.stringify({ chapters: Object.keys(chapters), perChapter: PER_CHAPTER, total }, null, 2) + '\n');

console.log(summary.join('\n'));
console.log('total ' + total + ' questions');
