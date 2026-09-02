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
      id: 'money',
      title: 'Money',
      emoji: '🪙',
      tint: 4,
      text: 'Rupees and paise, making amounts, adding up a bill and working out change.',
      games: [
        { title: 'Rupees and paise', emoji: '🪙', tint: 4, kind: 'learn',
          href: 'concept.html?c=money&t=rupees-paise',
          text: 'Notes and coins, and why ₹1 is 100 paise.' },
        { title: 'Working out change', emoji: '💵', tint: 3, kind: 'learn',
          href: 'concept.html?c=money&t=giving-change',
          text: 'Count up from the price to the money you paid.' },
        { title: 'Money Quiz', emoji: '⏱️', tint: 1, kind: 'quiz',
          href: 'quiz.html?chapter=money&level=just',
          text: 'Adding money, change, making amounts, paise, bills and is there enough.' }
      ]
    },
    {
      id: 'measure',
      title: 'Measurement',
      emoji: '📏',
      tint: 5,
      text: 'Length, weight and capacity — metres and centimetres, kilograms and grams, litres and millilitres.',
      games: [
        { title: 'Big units and small units', emoji: '📏', tint: 5, kind: 'learn',
          href: 'concept.html?c=measure&t=big-and-small-units',
          text: 'Changing m to cm, kg to g and l to ml, and back again.' },
        { title: 'Choosing a sensible measure', emoji: '🤔', tint: 2, kind: 'learn',
          href: 'concept.html?c=measure&t=sensible-units',
          text: 'Guess first, then pick the unit that fits.' },
        { title: 'Measurement Quiz', emoji: '⏱️', tint: 6, kind: 'quiz',
          href: 'quiz.html?chapter=measure&level=just',
          text: 'Changing units, comparing, sensible guesses, adding measures and stories.' }
      ]
    },
    {
      id: 'time',
      title: 'Time &amp; Calendar',
      emoji: '🕐',
      tint: 2,
      text: 'Reading a clock, how long things take, a.m. and p.m., days, weeks and months.',
      games: [
        { title: 'Reading a clock', emoji: '🕐', tint: 2, kind: 'learn',
          href: 'concept.html?c=time&t=read-the-clock',
          text: 'The short hand, the long hand and counting minutes in fives.' },
        { title: 'How long does it take?', emoji: '⏳', tint: 4, kind: 'learn',
          href: 'concept.html?c=time&t=how-long',
          text: 'Count on from the start time to the finish time.' },
        { title: 'Time Quiz', emoji: '⏱️', tint: 5, kind: 'quiz',
          href: 'quiz.html?chapter=time&level=just',
          text: 'Clock faces, how long, finishing times, a.m. or p.m., time facts and the calendar.' }
      ]
    },
    {
      id: 'shapes',
      title: 'Shapes &amp; Patterns',
      emoji: '📐',
      tint: 3,
      text: 'Flat shapes and solids, sides and corners, lines of symmetry, and patterns that repeat or grow.',
      games: [
        { title: 'Sides and corners', emoji: '📐', tint: 3, kind: 'learn',
          href: 'concept.html?c=shapes&t=sides-and-corners',
          text: 'Name a shape by counting its straight sides.' },
        { title: 'Symmetry and patterns', emoji: '🦋', tint: 5, kind: 'learn',
          href: 'concept.html?c=shapes&t=symmetry-and-patterns',
          text: 'Folding shapes in half, and finding the rule in a pattern.' },
        { title: 'Shapes &amp; Patterns Quiz', emoji: '⏱️', tint: 1, kind: 'quiz',
          href: 'quiz.html?chapter=shapes&level=just',
          text: 'Sides and corners, naming shapes, symmetry, solids and patterns.' }
      ]
    },
    {
      id: 'data',
      title: 'Data Handling',
      emoji: '📊',
      tint: 6,
      text: 'Tally marks, pictographs and answering questions from a small table.',
      games: [
        { title: 'Tally marks and pictographs', emoji: '📊', tint: 6, kind: 'learn',
          href: 'concept.html?c=data&t=tally-and-pictograph',
          text: 'Bundles of five, and why the key matters.' },
        { title: 'Data Quiz', emoji: '⏱️', tint: 2, kind: 'quiz',
          href: 'quiz.html?chapter=data&level=just',
          text: 'Reading tallies, pictographs, totals, most and fewest, and how many more.' }
      ]
    },
    {
      id: 'wordproblems',
      title: 'Word Problems',
      emoji: '📚',
      tint: 3,
      text: 'Stories from every chapter — joining, sharing, money, measures, time and fractions, in one step and two.',
      games: [
        { title: 'Which sum does this story need?', emoji: '🧭', tint: 3, kind: 'learn',
          href: 'concept.html?c=wordproblems&t=which-sum',
          text: 'The clue words that tell you whether to add, take away, times or share.' },
        { title: 'Word Problems Quiz', emoji: '⏱️', tint: 5, kind: 'quiz',
          href: 'quiz.html?chapter=wordproblems&level=just',
          text: 'Joining and leaving, groups, money, measures, time, fractions, two-step and choosing the sum.' }
      ]
    },
    {
      id: 'revision',
      title: 'Revision &amp; Report',
      emoji: '🏅',
      tint: 5,
      text: 'A mixed quiz from every chapter, and a report card for a grown-up to look at.',
      games: [
        { title: 'Mixed Quiz', emoji: '🎲', tint: 5, kind: 'quiz',
          href: 'quiz.html?chapter=all&level=just',
          text: 'Every kind of question in the whole of Mathly, mixed together. Untick any you do not want.' },
        { title: 'All question banks', emoji: '🗂️', tint: 6, kind: 'bank',
          href: 'bank.html',
          text: '100 ready-made questions for every chapter — filter by topic or level, hide the answers, print them out.' },
        { title: 'My report card', emoji: '🏅', tint: 4, kind: 'learn',
          href: 'report.html',
          text: 'Stars for each topic, what has been practised, and what to try next.' }
      ]
    }
  ]
};
