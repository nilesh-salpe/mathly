# Mathly

A colourful, kid-friendly static site for practising multiplication tables, ready for GitHub Pages.

- `index.html` — **Pick a class** (the grade picker, read from `data/grades.json`).
- `3/index.html` — Class 3: **Pick a chapter** (Foundations, plus placeholders for future chapters).
- `3/chapter.html?c=<id>` — **Pick a game** inside a chapter. One generic page serves every chapter.
- `assets/catalog.js` — the whole menu as data. **To add a chapter**, push an object onto `MATHLY.chapters` (`id`, `title`, `emoji`, `tint` 1–6, `text`, `games: []`); a chapter with no games shows as "coming soon". **To add a game**, push `{ title, emoji, tint, href, text }` onto that chapter's `games`. No other file needs editing.
- `3/tables.html` — (Foundations) pick a range of tables (1–30), fill the boxes, tick the columns you want graded, then **Check answers**. Correct boxes turn light green, wrong ones light pink (with the right answer underneath), unanswered ones light yellow — plus an encouraging message and a star score.
- `3/quiz.html` — (Foundations) timed quiz. Tick the kinds of sums you want — adding, taking away, times, sharing (division), percentages, fractions — then choose a number range (1 up to 10000), how many numbers per sum (2 = a×b, 3 = a×b×c, 4 = a×b×c×d, or a mix; applies to + − × ÷), how many sums, and a timer (minutes + seconds; 0:00 means no clock). Subtraction never goes below zero, division always divides exactly, percentages and fractions always land on whole answers (percentage bases follow the chosen range, rounded to a multiple of 20), and × / ÷ drop a factor rather than let an answer run past a trillion, so every answer stays exact. Sums with 3 or more numbers are bracketed left to right — `((a − b) − c) − d` — so the order is never in doubt. Ticked operations are dealt round-robin, so every kind you pick shows up before any repeats. Each answer is marked individually, you get a score out of the total with stars, and every quiz is kept in a **My scores** list (saved in the browser). **New quiz** deals a fresh set with the same settings.
**Chapters:** Word Problems · Foundations (mixed sums) · Numbers & Place Value · Add & Subtract · Multiply & Divide · Fractions · Money · Measurement · Time & Calendar · Shapes & Patterns · Data Handling · Revision & Report. Eleven in all. Each has *Learn it* concept pages and a quiz; Multiply & Divide also has the tables drill.

- `3/concept.html?c=<chapter>&t=<topic>` — a **Learn it** page: big idea, an SVG picture, the method one step at a time, two "now you try" questions with instant marking, then a button into the quiz for that topic.
- `3/bank.html?c=<chapter>` — the **question bank**: 100 ready-made questions per chapter, filterable by topic and level, answers hidden until asked for, and printable. Without a chapter it lists them all.
- `3/report.html` — the report card: stars per topic, what has been practised, what to try next, and a print layout. Reads the same `mathly-progress` store the quizzes write.
- `3/selftest.html` — runs every registered question type at every level (200 questions each) and checks the invariants: whole answers, nothing negative, prompts that read properly, exactly one correct choice, answers that mark themselves right, plus any per-type check. Open it before every push.
- `assets/engine.js` — the question registry, levels, marking, per-topic progress and read-aloud. Question types live in `assets/questions/*.js` and register themselves:

```js
Mathly.register({
  id: 'numbers-round', chapter: 'numbers', label: 'Rounding', emoji: '🎯', tint: 'frac',
  make: function (ctx) {            // ctx = { level, from, to, parts }
    return { prompt: 'Round 67 to the nearest 10', mode: 'number', answer: 70 };
  },
  check: function (q) { return null; }   // optional extra invariant for the self-test
});
```

Answer modes: `number` (one box), `choice` (big buttons, needs `choices`), `multi` (several labelled boxes, needs `fields`), `unit` (a box with a unit after it). Adding a topic = one `Mathly.register` call, one entry in `assets/concepts.js`, one entry in `assets/catalog.js`.
- `assets/style.css`, `assets/menu.js`, `assets/app.js`, `assets/quiz.js`, `assets/concept.js`, `assets/concepts.js`, `assets/selftest.js` — styles and logic. No build step, no dependencies.

## Olympiad section

`olympiad/3/` is a separate track for IMO-style papers, on the same engine:

- `olympiad/3/index.html` — the hub: the paper's shape, drills for every question type, and your last papers.
- `olympiad/3/practice.html?type=<id>` (or `?section=<id>`) — ten questions of one kind, untimed, with the reason shown as soon as you answer.
- `olympiad/3/paper.html` — a full practice paper: one clock, a question strip you can skip around and flag, nothing marked until you hand it in, then section-wise scores and a review with an explanation on every question.
- `olympiad/3/selftest.html` — the same harness with two extra rules for olympiad questions: exactly four options, and an explanation on every one.
- `data/olympiad/3/paper.json` — the paper pattern (sections, counts, minutes). Patterns change year to year; edit this file, nothing else.
- `assets/olympiad/*.js` — `kit.js` (four-option helper), then `lr`, `mr`, `ev` and `ach` question types.

Every olympiad question builds its own wrong options from the mistakes children actually make — the
off-by-one, the forgotten carry, area instead of perimeter — so a wrong click says something.

## Where the content lives

All content is JSON under `data/`, fetched at runtime — no content is hard-coded into a page:

```
data/grades.json          the classes on the front page
data/3/catalog.json       Class 3 menu: chapters and what is in each one
data/3/concepts.json      every lesson: big idea, steps, remember, watch out, words, picture spec
data/3/banks/index.json   which chapters have a bank, and how many questions each holds
data/3/banks/<chapter>.json   100 checked questions with answers
```

Pages are grouped by class: everything for Class 3 lives in `3/`, shares `assets/` at the root, and
names its content folder before loading the site scripts:

```html
<script>window.MATHLY_DATA_BASE = '../data/3/';</script>
```

Adding Class 4 means a `4/` folder of pages, a `data/4/` folder of content, and one more entry in
`data/grades.json` — no changes to anything else.

`assets/data.js` is the only thing that knows where that comes from. To move the
content behind an API later, point it somewhere else and change nothing else:

```js
Mathly.data.base = 'https://api.example.com/mathly/3/';   // expects the same JSON shapes
```

Lessons name a drawing rather than embedding one — `"picture": { "draw": "columnAdd", "args": [345, 278] }`
— and `assets/pictures.js` holds the drawings. So the words are data and the SVG is code.

### Rebuilding the data

The editable sources are `assets/catalog.js` and `assets/concepts.js`; the JSON is generated:

```bash
node tools/export-data.js     # catalog.js + concepts.js  ->  data/catalog.json, data/concepts.json
node tools/build-banks.js     # question generators       ->  data/banks/*.json  (100 per chapter)
node tools/build-banks.js 200 # a bigger bank
```

`build-banks.js` runs the same checks as `selftest.html` on every question before writing it, and
fingerprints each question by prompt, picture, answer and choices, so no two are the same.

## Publish on GitHub Pages

```bash
git init
git add .
git commit -m "Multiplication tables practice site"
git branch -M main
git remote add origin https://github.com/nilesh-salpe/mathly.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
The site appears at `https://nilesh-salpe.github.io/mathly/`.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
