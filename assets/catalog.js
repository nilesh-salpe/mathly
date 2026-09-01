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
      id: 'addsub',
      title: 'Add &amp; Subtract',
      emoji: '➕',
      tint: 3,
      text: 'Carrying, borrowing, missing numbers, quick estimates and story problems.',
      games: [
        {
          title: 'Adding with carrying',
          emoji: '➕',
          tint: 3,
          kind: 'learn',
          href: 'concept.html?c=addsub&t=add-regrouping',
          text: 'Add the ones first, and carry the ten into the next column.'
        },
        {
          title: 'Taking away with borrowing',
          emoji: '➖',
          tint: 4,
          kind: 'learn',
          href: 'concept.html?c=addsub&t=sub-regrouping',
          text: 'Borrow a ten when the top digit is too small.'
        },
        {
          title: 'Turning a story into a sum',
          emoji: '📖',
          tint: 2,
          kind: 'learn',
          href: 'concept.html?c=addsub&t=story-problems',
          text: 'Find the numbers, decide add or take away, then solve it.'
        },
        {
          title: 'Add &amp; Subtract Quiz',
          emoji: '⏱️',
          tint: 1,
          kind: 'quiz',
          href: 'quiz.html?chapter=addsub&level=just',
          text: 'Sums, missing numbers, estimates, checking backwards and story problems.'
        }
      ]
    },
    {
      id: 'muldiv',
      title: 'Multiply &amp; Divide',
      emoji: '✖️',
      tint: 1,
      text: 'Equal groups, times tables, bigger numbers, sharing fairly and what is left over.',
      games: [
        {
          title: 'Times means equal groups',
          emoji: '✖️',
          tint: 1,
          kind: 'learn',
          href: 'concept.html?c=muldiv&t=equal-groups',
          text: 'Why 3 × 4 is the same as 4 + 4 + 4.'
        },
        {
          title: 'Sharing with some left over',
          emoji: '🍪',
          tint: 2,
          kind: 'learn',
          href: 'concept.html?c=muldiv&t=sharing-left-over',
          text: 'Deal them out fairly and find the remainder.'
        },
        {
          title: 'Multiplying a bigger number',
          emoji: '🔢',
          tint: 5,
          kind: 'learn',
          href: 'concept.html?c=muldiv&t=split-to-multiply',
          text: 'Split 34 into 30 and 4, multiply each part, then add.'
        },
        {
          title: 'Multiplication Tables',
          emoji: '📋',
          tint: 4,
          kind: 'drill',
          href: 'tables.html',
          text: 'The full grid, filled in column by column with no clock.'
        },
        {
          title: 'Multiply &amp; Divide Quiz',
          emoji: '⏱️',
          tint: 3,
          kind: 'quiz',
          href: 'quiz.html?chapter=muldiv&level=just',
          text: 'Tables, 2-digit sums, sharing, remainders, missing numbers and stories.'
        }
      ]
    },
    {
      id: 'fractions',
      title: 'Fractions',
      emoji: '🍕',
      tint: 6,
      text: 'Halves, thirds and quarters — of a shape and of a group of things.',
      games: [
        {
          title: 'What a fraction is',
          emoji: '🍫',
          tint: 1,
          kind: 'learn',
          href: 'concept.html?c=fractions&t=equal-parts',
          text: 'Equal parts, the top number and the bottom number.'
        },
        {
          title: 'A fraction of a group',
          emoji: '🫘',
          tint: 2,
          kind: 'learn',
          href: 'concept.html?c=fractions&t=fraction-of-group',
          text: 'Share into equal piles, then take the piles you need.'
        },
        {
          title: 'Which piece is bigger?',
          emoji: '⚖️',
          tint: 5,
          kind: 'learn',
          href: 'concept.html?c=fractions&t=compare-fractions',
          text: 'Why 1/2 is bigger than 1/4 of the same cake.'
        },
        {
          title: 'Fractions Quiz',
          emoji: '⏱️',
          tint: 6,
          kind: 'quiz',
          href: 'quiz.html?chapter=fractions&level=just',
          text: 'Shaded shapes, fractions of groups, comparing and story problems.'
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
