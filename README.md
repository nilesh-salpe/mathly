# Mathly

A colourful, kid-friendly static site for practising multiplication tables, ready for GitHub Pages.

- `index.html` — home page with the menu (Multiplication Tables).
- `tables.html` — pick a range of tables (1–30), fill the boxes, tick the columns you want graded, then **Check answers**. Correct boxes turn light green, wrong ones light pink (with the right answer underneath), unanswered ones light yellow — plus an encouraging message and a star score.
- `assets/style.css`, `assets/app.js` — styles and logic. No build step, no dependencies.

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
