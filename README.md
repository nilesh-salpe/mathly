# Mathly

A colourful, kid-friendly static site for practising multiplication tables, ready for GitHub Pages.

- `index.html` — **Pick a chapter** (Foundations, plus placeholders for future chapters).
- `chapter.html?c=<id>` — **Pick a game** inside a chapter. One generic page serves every chapter.
- `assets/catalog.js` — the whole menu as data. **To add a chapter**, push an object onto `MATHLY.chapters` (`id`, `title`, `emoji`, `tint` 1–6, `text`, `games: []`); a chapter with no games shows as "coming soon". **To add a game**, push `{ title, emoji, tint, href, text }` onto that chapter's `games`. No other file needs editing.
- `tables.html` — (Foundations) pick a range of tables (1–30), fill the boxes, tick the columns you want graded, then **Check answers**. Correct boxes turn light green, wrong ones light pink (with the right answer underneath), unanswered ones light yellow — plus an encouraging message and a star score.
- `quiz.html` — (Foundations) timed quiz. Tick the kinds of sums you want — adding, taking away, times, sharing (division), percentages, fractions — then choose a number range (1 up to 10000), how many numbers per sum (2 = a×b, 3 = a×b×c, 4 = a×b×c×d, or a mix; applies to + − × ÷), how many sums, and a timer (minutes + seconds; 0:00 means no clock). Subtraction never goes below zero, division always divides exactly, percentages and fractions always land on whole answers (percentage bases follow the chosen range, rounded to a multiple of 20), and × / ÷ drop a factor rather than let an answer run past a trillion, so every answer stays exact. Sums with 3 or more numbers are bracketed left to right — `((a − b) − c) − d` — so the order is never in doubt. Ticked operations are dealt round-robin, so every kind you pick shows up before any repeats. Each answer is marked individually, you get a score out of the total with stars, and every quiz is kept in a **My scores** list (saved in the browser). **New quiz** deals a fresh set with the same settings.
- `concept.html?c=<chapter>&t=<topic>` — a **Learn it** page: big idea, an SVG picture, the method one step at a time, two "now you try" questions with instant marking, then a button into the quiz for that topic.
- `selftest.html` — runs every registered question type at every level (200 questions each) and checks the invariants: whole answers, nothing negative, prompts that read properly, exactly one correct choice, answers that mark themselves right, plus any per-type check. Open it before every push.
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
