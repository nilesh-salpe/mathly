# Mathly

A colourful, kid-friendly static site for practising multiplication tables, ready for GitHub Pages.

- `index.html` — **Pick a chapter** (Foundations, plus placeholders for future chapters).
- `chapter.html?c=<id>` — **Pick a game** inside a chapter. One generic page serves every chapter.
- `assets/catalog.js` — the whole menu as data. **To add a chapter**, push an object onto `MATHLY.chapters` (`id`, `title`, `emoji`, `tint` 1–6, `text`, `games: []`); a chapter with no games shows as "coming soon". **To add a game**, push `{ title, emoji, tint, href, text }` onto that chapter's `games`. No other file needs editing.
- `tables.html` — (Foundations) pick a range of tables (1–30), fill the boxes, tick the columns you want graded, then **Check answers**. Correct boxes turn light green, wrong ones light pink (with the right answer underneath), unanswered ones light yellow — plus an encouraging message and a star score.
- `quiz.html` — (Foundations) timed quiz. Tick the kinds of sums you want — adding, taking away, times, sharing (division), percentages, fractions — then choose a number range, how many numbers per sum (2 = a×b, 3 = a×b×c, 4 = a×b×c×d, or a mix; applies to + − × ÷), how many sums, and a timer (minutes + seconds; 0:00 means no clock). Subtraction never goes below zero, division always divides exactly, and percentages/fractions always land on whole answers. Ticked operations are dealt round-robin, so every kind you pick shows up before any repeats. Each answer is marked individually, you get a score out of the total with stars, and every quiz is kept in a **My scores** list (saved in the browser). **New quiz** deals a fresh set with the same settings.
- `assets/style.css`, `assets/menu.js`, `assets/app.js`, `assets/quiz.js` — styles and logic. No build step, no dependencies.

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
