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
          kind: 'drill',
          href: 'tables.html',
          text: 'Choose your tables from 1 to 30, fill in the boxes, and see how many stars you win!'
        },
        {
          title: 'Quiz Time',
          emoji: '⏱️',
          tint: 2,
          kind: 'quiz',
          href: 'quiz.html',
          text: 'Beat the clock! Adding, taking away, times, sharing, percentages and fractions — mix and match.'
        }
      ]
    },
    {
      id: 'numbers',
      title: 'Numbers &amp; Place Value',
      emoji: '🔢',
      tint: 2,
      text: 'Hundreds, tens and ones — reading, comparing, counting on and rounding numbers.',
      games: [
        {
          title: 'Hundreds, tens and ones',
          emoji: '🧱',
          tint: 2,
          kind: 'learn',
          href: 'concept.html?c=numbers&t=place-value',
          text: 'What each digit is worth, and how to write a number in expanded form.'
        },
        {
          title: 'Which number is bigger?',
          emoji: '⚖️',
          tint: 5,
          kind: 'learn',
          href: 'concept.html?c=numbers&t=compare-numbers',
          text: 'Compare numbers place by place and put in the < > = sign.'
        },
        {
          title: 'Rounding to the nearest 10',
          emoji: '🎯',
          tint: 1,
          kind: 'learn',
          href: 'concept.html?c=numbers&t=rounding',
          text: 'Jump to the closest ten using a number line.'
        },
        {
          title: 'Numbers Quiz',
          emoji: '⏱️',
          tint: 3,
          kind: 'quiz',
          href: 'quiz.html?chapter=numbers&level=just',
          text: 'Expanded form, comparing, digit values, before and after, skip counting, rounding and number words.'
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
