/* The whole site menu lives here.
   Add a chapter: push an object onto CHAPTERS.
   Add a game to a chapter: push an object onto that chapter's games list.
   Nothing else needs editing — index.html and chapter.html read this file. */
window.MATHLY = {
  chapters: [
    {
      id: 'foundations',
      title: 'Foundations',
      emoji: '🧱',
      tint: 1,
      text: 'The building blocks — tables, adding, taking away, times, sharing, percentages and fractions.',
      games: [
        {
          title: 'Multiplication Tables',
          emoji: '✖️',
          tint: 1,
          href: 'tables.html',
          text: 'Choose your tables from 1 to 30, fill in the boxes, and see how many stars you win!'
        },
        {
          title: 'Quiz Time',
          emoji: '⏱️',
          tint: 2,
          href: 'quiz.html',
          text: 'Beat the clock! Adding, taking away, times, sharing, percentages and fractions — mix and match.'
        }
      ]
    },
    {
      id: 'shapes',
      title: 'Shapes &amp; Space',
      emoji: '📐',
      tint: 3,
      text: 'Coming soon… 🚧',
      games: []
    },
    {
      id: 'time-money',
      title: 'Time &amp; Money',
      emoji: '🕒',
      tint: 4,
      text: 'Coming soon… 🚧',
      games: []
    },
    {
      id: 'word-problems',
      title: 'Word Problems',
      emoji: '📚',
      tint: 5,
      text: 'Coming soon… 🚧',
      games: []
    }
  ]
};
