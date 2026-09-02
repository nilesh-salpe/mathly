/* Lesson content. Loaded into data/concepts.json by tools/export-data.js —
   this file stays the editable source. */
(function (M) {
  'use strict';
  var P = M.pictures;

  window.MATHLY_CONCEPTS = {
    'which-sum': {
      chapter: 'wordproblems',
      title: 'Which sum does this story need?',
      emoji: '🧭',
      bigIdea: 'A word problem is a sum hiding inside a sentence. Certain words tell you which sum to do.',
      picture: P.keywords(),
      pictureCaption: 'Words that give the sum away',
      remember: 'Read it twice, find the numbers, look for the clue words, then do the sum and check your answer against the question.',
      watchOut: [
        '"How many more" means take away, even though it sounds like adding.',
        '"Each" usually means times when you are joining groups, and share when you are splitting one.',
        'A two-step problem needs two sums — do not stop after the first.'
      ],
      words: [
        { word: 'Altogether', meaning: 'Everything joined together — usually add.' },
        { word: 'Left', meaning: 'What remains — usually take away.' },
        { word: 'Each', meaning: 'One for every one — points to times or sharing.' },
        { word: 'Two-step', meaning: 'A problem that needs two sums, one after the other.' }
      ],
      steps: [
        { head: 'Read it twice', text: 'Once for the story, once for the numbers. Tap 🔊 if you would like it read aloud.' },
        { head: 'Underline the numbers', text: 'Write them down in the order they appear.' },
        { head: 'Look for the clue words', text: 'Altogether and more mean add. Left and sold mean take away. Each and rows of mean times. Shared equally means divide.' },
        { head: 'Do it and check', text: 'Work out the sum, then read the question again. Does your answer actually answer it?' }
      ],
      tryTypes: ['wp-choose', 'wp-joining'],
      practice: 'quiz.html?chapter=wordproblems&level=just'
    },

    'sides-and-corners': {
      chapter: 'shapes',
      title: 'Sides and corners',
      emoji: '📐',
      bigIdea: 'Flat shapes are named by how many straight sides they have — and they always have the same number of corners.',
      picture: P.shapesRow(),
      pictureCaption: 'triangle 3, square 4, pentagon 5, hexagon 6',
      remember: 'Count the straight sides and you have the name. Sides and corners always match.',
      watchOut: [
        'A square and a rectangle both have 4 sides — a square has all four the same length.',
        'A circle has no straight sides and no corners at all.'
      ],
      words: [
        { word: 'Side', meaning: 'One straight edge of a flat shape.' },
        { word: 'Corner', meaning: 'The point where two sides meet.' },
        { word: 'Face', meaning: 'A flat surface on a solid shape, like one side of a dice.' }
      ],
      steps: [
        { head: 'Trace the outline', text: 'Follow the edge of the shape with your finger and count each straight part.' },
        { head: 'Count the corners', text: 'Every time your finger turns, that is a corner.' },
        { head: 'Name it', text: '3 sides is a triangle, 4 a square or rectangle, 5 a pentagon, 6 a hexagon, 8 an octagon.' },
        { head: 'Solids too', text: 'A cube is made of 6 square faces, with 8 corners and 12 edges.' }
      ],
      tryTypes: ['shapes-sides', 'shapes-name'],
      practice: 'quiz.html?chapter=shapes&level=just'
    },

    'symmetry-and-patterns': {
      chapter: 'shapes',
      title: 'Symmetry and patterns',
      emoji: '🦋',
      bigIdea: 'A line of symmetry folds a shape into two halves that match exactly. A pattern is something that repeats or grows by the same amount.',
      picture: P.symmetry(),
      pictureCaption: 'A rectangle folds in two ways; a regular pentagon in five',
      remember: 'A regular shape has as many lines of symmetry as it has sides.',
      watchOut: [
        'A rectangle has only 2 lines of symmetry, not 4 — folding it corner to corner does not match.',
        'In a number pattern, check the jump between every pair, not just the first two.'
      ],
      words: [
        { word: 'Symmetry', meaning: 'When both halves match exactly after folding.' },
        { word: 'Pattern', meaning: 'Something that repeats or grows in the same way each time.' },
        { word: 'Rule', meaning: 'What the pattern does each step — add 5, double, or repeat.' }
      ],
      steps: [
        { head: 'Fold it in your head', text: 'If the two halves land exactly on top of each other, that fold line is a line of symmetry.' },
        { head: 'Try every direction', text: 'A square folds four ways: down, across, and both diagonals.' },
        { head: 'Find a pattern rule', text: 'In 4, 8, 12, 16 the jump is always +4, so the next is 20.' },
        { head: 'Repeating patterns', text: 'In 🔺 🔵 🔺 🔵 the unit is two shapes long, so the next is 🔺.' }
      ],
      tryTypes: ['shapes-symmetry', 'patterns-number'],
      practice: 'quiz.html?topic=patterns-number&level=just'
    },

    'tally-and-pictograph': {
      chapter: 'data',
      title: 'Tally marks and pictographs',
      emoji: '📊',
      bigIdea: 'Counting is easier in bundles. Tally marks bundle by five; a pictograph lets one picture stand for many things.',
      picture: P.pictograph(),
      pictureCaption: 'Each bike stands for 5, so Monday is 4 × 5 = 20 bikes',
      remember: 'Always read the key first. One picture almost never means one thing.',
      watchOut: [
        'The fifth tally mark goes across the other four — it does not stand beside them.',
        '4 pictures does not mean 4 things. If the key says 5, it means 20.'
      ],
      words: [
        { word: 'Tally', meaning: 'A quick mark made while counting.' },
        { word: 'Key', meaning: 'The note that says what one picture stands for.' },
        { word: 'Data', meaning: 'The facts you have collected.' }
      ],
      steps: [
        { head: 'Make the marks', text: 'Draw one line for each thing you count.' },
        { head: 'Bundle at five', text: 'The fifth mark goes across the other four, so each bundle is easy to spot.' },
        { head: 'Count the bundles', text: '3 bundles and 2 singles is 3 × 5 + 2 = 17.' },
        { head: 'Read a pictograph', text: 'Check the key, count the pictures, then multiply. 4 bikes with a key of 5 means 20.' }
      ],
      tryTypes: ['data-tally', 'data-pictograph'],
      practice: 'quiz.html?chapter=data&level=just'
    },

    'rupees-paise': {
      chapter: 'money',
      title: 'Rupees and paise',
      emoji: '🪙',
      bigIdea: 'One rupee is made of 100 paise, the same way one metre is made of 100 centimetres.',
      picture: P.money([50, 20, 10], [5], 'a ₹50 note, a ₹20 note, a ₹10 note and a ₹5 coin make ₹85'),
      pictureCaption: '₹50 + ₹20 + ₹10 + ₹5 = ₹85',
      remember: '100 paise = ₹1. To change rupees into paise, multiply by 100.',
      watchOut: [
        '₹2 and 50 paise is 250 paise, not 205 paise.',
        'Write the rupee sign in front of the number: ₹85, not 85₹.'
      ],
      words: [
        { word: 'Note', meaning: 'Paper money — ₹10, ₹20, ₹50, ₹100 and more.' },
        { word: 'Coin', meaning: 'Metal money — ₹1, ₹2, ₹5, ₹10.' },
        { word: 'Paise', meaning: 'The small unit of money. 100 of them make one rupee.' }
      ],
      steps: [
        { head: 'Start with the big notes', text: 'To make ₹85, take the biggest note that fits: ₹50.' },
        { head: 'Keep going', text: '₹85 − ₹50 = ₹35 still to make. Add a ₹20 note, then a ₹10 note.' },
        { head: 'Finish with coins', text: '₹5 is left, so add a ₹5 coin. Altogether: 50 + 20 + 10 + 5 = 85.' },
        { head: 'Rupees into paise', text: '₹3 = 300 paise. ₹3 and 50 paise = 350 paise.' }
      ],
      tryTypes: ['money-make', 'money-paise'],
      practice: 'quiz.html?chapter=money&level=just'
    },

    'giving-change': {
      chapter: 'money',
      title: 'Working out change',
      emoji: '💵',
      bigIdea: 'Change is what is left when you pay with more than the price. Count up from the price to the money you gave.',
      picture: P.jumps(['₹34', '₹40', '₹50'], ['+ ₹6', '+ ₹10'], '₹6 + ₹10 = ₹16 change'),
      pictureCaption: 'A ₹34 pen paid for with a ₹50 note',
      remember: 'Counting up is easier than taking away: go to the next ten first, then on to the amount you paid.',
      watchOut: [
        'Change can never be more than the money you handed over.',
        'If the price and the money paid are the same, the change is ₹0 — that is fine.'
      ],
      words: [
        { word: 'Change', meaning: 'The money handed back to you.' },
        { word: 'Cost', meaning: 'How much something is priced at.' },
        { word: 'Total', meaning: 'Everything added together.' }
      ],
      steps: [
        { head: 'Look at the price', text: 'The pen costs ₹34 and you pay with ₹50.' },
        { head: 'Jump to the next ten', text: 'From ₹34 up to ₹40 is ₹6.' },
        { head: 'Jump to what you paid', text: 'From ₹40 up to ₹50 is ₹10.' },
        { head: 'Add the jumps', text: '₹6 + ₹10 = ₹16. So the change is ₹16. Check: 34 + 16 = 50.' }
      ],
      tryTypes: ['money-change', 'money-bill'],
      practice: 'quiz.html?topic=money-change&level=just'
    },

    'big-and-small-units': {
      chapter: 'measure',
      title: 'Big units and small units',
      emoji: '📏',
      bigIdea: 'Every measure has a big unit and a small unit. Metres and centimetres, kilograms and grams, litres and millilitres.',
      picture: P.units(),
      pictureCaption: '1 m = 100 cm · 1 kg = 1000 g · 1 l = 1000 ml',
      remember: 'To go from the big unit to the small one, multiply. To come back, divide.',
      watchOut: [
        'Metres use 100, but kilograms and litres use 1000. It is easy to mix them up.',
        '2 m 45 cm is 245 cm, not 2045 cm.'
      ],
      words: [
        { word: 'Length', meaning: 'How long something is — measured in m and cm.' },
        { word: 'Weight', meaning: 'How heavy something is — measured in kg and g.' },
        { word: 'Capacity', meaning: 'How much a container holds — measured in l and ml.' }
      ],
      steps: [
        { head: 'Name the units', text: 'Length uses metres and centimetres. 1 m = 100 cm.' },
        { head: 'Going down to the small unit', text: '2 m = 2 × 100 = 200 cm. Add the extra centimetres: 2 m 45 cm = 245 cm.' },
        { head: 'Coming back up', text: '350 cm = 3 m and 50 cm, because 3 whole hundreds fit into 350.' },
        { head: 'Weight and capacity', text: 'They work the same way, but with 1000: 2 kg 300 g = 2300 g, and 1 l 500 ml = 1500 ml.' }
      ],
      tryTypes: ['measure-to-small', 'measure-to-big'],
      practice: 'quiz.html?chapter=measure&level=just'
    },

    'sensible-units': {
      chapter: 'measure',
      title: 'Choosing a sensible measure',
      emoji: '🤔',
      bigIdea: 'Before measuring, guess. A sensible guess tells you which unit to use and warns you when an answer is silly.',
      picture: P.sensibleUnits(),
      pictureCaption: 'Small things use small units',
      remember: 'Use cm for small lengths and m for big ones, g for light things and kg for heavy ones, ml for a glass and l for a bucket.',
      watchOut: [
        'A pencil is about 15 cm, not 15 m — 15 m is longer than a classroom.',
        'A school bag is about 3 kg, not 3 g. 3 g is lighter than a coin.'
      ],
      words: [
        { word: 'Estimate', meaning: 'A sensible guess made before measuring.' },
        { word: 'Unit', meaning: 'What you measure in: cm, m, g, kg, ml, l.' },
        { word: 'Compare', meaning: 'Decide which of two measures is more.' }
      ],
      steps: [
        { head: 'Picture the thing', text: 'Think of something you know the size of — your hand is about 10 cm across.' },
        { head: 'Pick the unit', text: 'Small things use cm, g and ml. Big things use m, kg and l.' },
        { head: 'Make the guess', text: 'A pencil is about as long as your hand and a half, so around 15 cm.' },
        { head: 'Check the answer', text: 'If a measurement sounds silly — a pencil 15 m long — the unit is probably wrong.' }
      ],
      tryTypes: ['measure-estimate', 'measure-compare'],
      practice: 'quiz.html?topic=measure-estimate&level=just'
    },

    'read-the-clock': {
      chapter: 'time',
      title: 'Reading a clock',
      emoji: '🕐',
      bigIdea: 'The short hand tells you the hour. The long hand tells you the minutes, counting five for every big number.',
      picture: P.clock(3, 40),
      pictureWidth: 260,
      pictureCaption: 'The short hand is past 3, the long hand is on 8: twenty to four, or 3:40',
      remember: 'Count the minutes in fives round the clock: 5, 10, 15, 20… all the way to 60.',
      watchOut: [
        'When the long hand is past 6, the short hand is nearly at the next number — but the hour is still the smaller one.',
        'The long hand on 8 means 40 minutes, not 8 minutes.'
      ],
      words: [
        { word: 'Hour hand', meaning: 'The short, thick hand.' },
        { word: 'Minute hand', meaning: 'The long, thin hand.' },
        { word: 'Half past', meaning: '30 minutes after the hour.' },
        { word: 'Quarter past', meaning: '15 minutes after the hour.' }
      ],
      steps: [
        { head: 'Find the short hand', text: 'It is between 3 and 4, so the hour is 3 — always the number it has passed.' },
        { head: 'Find the long hand', text: 'It points at 8.' },
        { head: 'Count in fives', text: '8 × 5 = 40, so it is 40 minutes past the hour.' },
        { head: 'Say the time', text: '3:40. People also say twenty minutes to four, because 20 more minutes reaches 4 o clock.' }
      ],
      tryTypes: ['time-read', 'time-ampm'],
      practice: 'quiz.html?chapter=time&level=just'
    },

    'how-long': {
      chapter: 'time',
      title: 'How long does it take?',
      emoji: '⏳',
      bigIdea: 'To find how long something lasts, count on from the start time to the finish time — the o clock first, then the extra minutes.',
      picture: P.jumps(['3:15', '4:00', '4:05'], ['+ 45 min', '+ 5 min'], '45 + 5 = 50 minutes'),
      pictureCaption: 'From 3:15 to 4:05 is 50 minutes',
      remember: 'Jump to the next o clock first, then count the leftover minutes, then add the jumps.',
      watchOut: [
        'An hour is 60 minutes, not 100. 1 hour 20 minutes is 80 minutes.',
        'Counting the hours only is not enough — the minutes on both sides matter.'
      ],
      words: [
        { word: 'Duration', meaning: 'How long something lasts.' },
        { word: 'a.m.', meaning: 'Midnight to noon — the morning half of the day.' },
        { word: 'p.m.', meaning: 'Noon to midnight — the afternoon and night.' }
      ],
      steps: [
        { head: 'Write both times', text: 'The film starts at 3:15 and finishes at 4:05.' },
        { head: 'Jump to the o clock', text: 'From 3:15 to 4:00 is 45 minutes.' },
        { head: 'Count the extra minutes', text: 'From 4:00 to 4:05 is 5 minutes.' },
        { head: 'Add the jumps', text: '45 + 5 = 50 minutes altogether.' }
      ],
      tryTypes: ['time-elapsed', 'time-finish'],
      practice: 'quiz.html?topic=time-elapsed&level=just'
    },

    'equal-parts': {
      chapter: 'fractions',
      title: 'What a fraction is',
      emoji: '🍫',
      bigIdea: 'A fraction is what you get when a whole is cut into equal parts. The parts must be the same size.',
      picture: P.parts(4, 1, 'one quarter is shaded: 1 out of 4 equal parts'),
      pictureCaption: '1/4 — the 4 says how many parts, the 1 says how many you take',
      steps: [
        { head: 'Cut into equal parts', text: 'This chocolate bar is cut into 4 parts, all the same size.' },
        { head: 'The bottom number', text: 'The 4 goes underneath. It counts how many equal parts the whole was cut into.' },
        { head: 'The top number', text: 'One part is shaded, so 1 goes on top. We write 1/4 and say one quarter.' },
        { head: 'Watch out', text: 'If the parts are not the same size, it is not a fraction of the whole at all.' }
      ],
      remember: 'The bottom number counts the equal parts in the whole. The top number counts the parts you have.',
      watchOut: [
        'The parts must be exactly the same size, or it is not that fraction at all.',
        'A bigger bottom number means smaller pieces, not bigger ones.'
      ],
      words: [
        { word: 'Fraction', meaning: 'A part of a whole thing.' },
        { word: 'Numerator', meaning: 'The number on top — how many parts you have.' },
        { word: 'Denominator', meaning: 'The number underneath — how many equal parts there are.' },
        { word: 'Whole', meaning: 'All of it, every part together.' }
      ],
      tryTypes: ['fractions-shaded', 'fractions-whole'],
      practice: 'quiz.html?topic=fractions-shaded&level=just'
    },

    'fraction-of-group': {
      chapter: 'fractions',
      title: 'A fraction of a group',
      emoji: '🫘',
      bigIdea: 'To find a fraction of a group, share the group into that many equal piles, then take the piles you need.',
      picture: P.groupFraction(12, 3),
      pictureCaption: 'One third of 12 mangoes is 4',
      steps: [
        { head: 'Read the bottom number', text: 'For one third, the bottom number is 3, so make 3 equal piles.' },
        { head: 'Share them out', text: '12 mangoes into 3 piles gives 4 in each pile.' },
        { head: 'Take the top number of piles', text: 'One third means take 1 pile — that is 4 mangoes.' },
        { head: 'More than one pile', text: 'Two thirds would be 2 piles, which is 8 mangoes.' }
      ],
      remember: 'Divide by the bottom number to make the piles, then multiply by the top number to take the piles you need.',
      watchOut: [
        'Make the piles equal before you count. Grabbing a handful gives the wrong answer.',
        'One quarter of 20 is 5, not 4. The 4 tells you how many piles, not the answer.'
      ],
      words: [
        { word: 'Of', meaning: 'In fractions, "of" tells you to work out that part of the amount.' },
        { word: 'Share equally', meaning: 'Give exactly the same amount to each group.' },
        { word: 'Half', meaning: 'One of two equal parts.' }
      ],
      tryTypes: ['fractions-of-group', 'fractions-story'],
      practice: 'quiz.html?topic=fractions-of-group&level=just'
    },

    'compare-fractions': {
      chapter: 'fractions',
      title: 'Which piece is bigger?',
      emoji: '⚖️',
      bigIdea: 'When the whole is the same, the fraction with fewer parts has the bigger pieces.',
      picture: P.compareFractions(),
      pictureCaption: '1/2 is bigger than 1/3, and 1/3 is bigger than 1/4',
      steps: [
        { head: 'Same whole', text: 'All three bars are the same length, so we can compare them fairly.' },
        { head: 'Count the pieces', text: 'The first bar has 2 pieces, the next has 3, the last has 4.' },
        { head: 'Look at one piece', text: 'The more pieces you cut a bar into, the smaller each piece becomes.' },
        { head: 'The rule', text: 'So 1/2 > 1/3 > 1/4. A bigger bottom number means a smaller piece.' }
      ],
      remember: 'When the wholes are the same size, the fraction with the bigger bottom number has the smaller pieces.',
      watchOut: [
        '1/4 is smaller than 1/2, even though 4 is bigger than 2.',
        'You can only compare fairly when both wholes are the same size — half a small roti is not half a big one.'
      ],
      words: [
        { word: 'Compare', meaning: 'Work out which one is bigger or smaller.' },
        { word: 'Same whole', meaning: 'Both fractions come from things of the same size.' },
        { word: 'Equal parts', meaning: 'Pieces that are exactly the same size as each other.' }
      ],
      tryTypes: ['fractions-compare', 'fractions-shaded'],
      practice: 'quiz.html?topic=fractions-compare&level=just'
    },

    'equal-groups': {
      chapter: 'muldiv',
      title: 'Times means equal groups',
      emoji: '✖️',
      bigIdea: 'Multiplying is a fast way of adding the same number again and again.',
      picture: P.groups(3, 4),
      pictureCaption: '3 plates with 4 on each plate',
      steps: [
        { head: 'Count one group', text: 'Each plate has 4 laddoos.' },
        { head: 'Count the groups', text: 'There are 3 plates.' },
        { head: 'Add them up', text: '4 + 4 + 4 = 12.' },
        { head: 'Write it as times', text: '3 groups of 4 is written 3 × 4 = 12. Swapping them gives the same answer: 4 × 3 = 12 too.' }
      ],
      remember: '3 × 4 means 3 groups of 4. Multiplying is a shortcut for adding the same number again and again.',
      watchOut: [
        'The groups must be equal. Three plates with different amounts is not a times sum.',
        '3 × 4 and 4 × 3 give the same answer, but they draw different pictures.'
      ],
      words: [
        { word: 'Product', meaning: 'The answer to a multiplication.' },
        { word: 'Equal groups', meaning: 'Groups with exactly the same number in each.' },
        { word: 'Times table', meaning: 'The list of answers for one number: 4, 8, 12, 16…' }
      ],
      tryTypes: ['muldiv-groups', 'muldiv-table'],
      practice: 'quiz.html?topic=muldiv-table&level=just'
    },

    'sharing-left-over': {
      chapter: 'muldiv',
      title: 'Sharing with some left over',
      emoji: '🍪',
      bigIdea: 'Share out one for each person at a time. Whatever cannot be shared fairly is the remainder.',
      picture: P.share(13, 4),
      pictureCaption: '13 biscuits shared between 4 friends',
      steps: [
        { head: 'Deal them out', text: 'Give one biscuit to each friend, then go round again.' },
        { head: 'Count each share', text: 'Every friend ends up with 3 biscuits. That is 4 × 3 = 12 biscuits used.' },
        { head: 'What is left?', text: '13 − 12 = 1 biscuit is left over. It cannot be shared without breaking it.' },
        { head: 'Say the answer', text: '13 ÷ 4 = 3 each, with 1 left over. The leftover is called the remainder.' }
      ],
      remember: 'Deal them out one at a time. Whatever cannot be shared fairly is the remainder.',
      watchOut: [
        'The remainder is always smaller than the number of groups. If it is not, each group can take one more.',
        'When nothing is left over, the remainder is 0 and the sharing was exact.'
      ],
      words: [
        { word: 'Divide', meaning: 'Share into equal groups.' },
        { word: 'Quotient', meaning: 'How many each group gets.' },
        { word: 'Remainder', meaning: 'What is left over after sharing fairly.' }
      ],
      tryTypes: ['muldiv-remainder', 'muldiv-divide'],
      practice: 'quiz.html?topic=muldiv-remainder&level=just'
    },

    'split-to-multiply': {
      chapter: 'muldiv',
      title: 'Multiplying a bigger number',
      emoji: '🔢',
      bigIdea: 'To multiply a 2-digit number, split it into tens and ones, multiply each part, then add.',
      picture: P.split(34, 6),
      pictureCaption: '34 × 6 = 180 + 24 = 204',
      steps: [
        { head: 'Split the number', text: '34 is 30 and 4.' },
        { head: 'Multiply the tens', text: '30 × 6 = 180. (3 × 6 = 18, then add the zero.)' },
        { head: 'Multiply the ones', text: '4 × 6 = 24.' },
        { head: 'Add the two parts', text: '180 + 24 = 204. So 34 × 6 = 204.' }
      ],
      remember: 'Split into tens and ones, multiply each part, then add the two parts together.',
      watchOut: [
        'Do not stop at the tens. 30 × 6 = 180 is only half of the answer.',
        '30 × 6 is just 3 × 6 with a zero on the end.'
      ],
      words: [
        { word: 'Split', meaning: 'Break a number into its tens and ones.' },
        { word: 'Part answer', meaning: 'One piece of the sum, before you add the pieces together.' },
        { word: 'Multiple', meaning: 'A number you land on when counting in equal steps.' }
      ],
      tryTypes: ['muldiv-two-digit', 'muldiv-story'],
      practice: 'quiz.html?topic=muldiv-two-digit&level=just'
    },

    'add-regrouping': {
      chapter: 'addsub',
      title: 'Adding with carrying',
      emoji: '➕',
      bigIdea: 'Add the ones first. If they make ten or more, carry the ten over to the next column.',
      picture: P.columnAdd(345, 278),
      pictureCaption: '345 + 278 = 623',
      steps: [
        { head: 'Line up the columns', text: 'Ones under ones, tens under tens, hundreds under hundreds.' },
        { head: 'Add the ones', text: '5 + 8 = 13. That is 1 ten and 3 ones. Write the 3 and carry the 1 above the tens.' },
        { head: 'Add the tens', text: '4 + 7 = 11, plus the carried 1 makes 12 tens. Write 2 and carry 1 to the hundreds.' },
        { head: 'Add the hundreds', text: '3 + 2 = 5, plus the carried 1 makes 6. The answer is 623.' }
      ],
      remember: 'Add the ones first. Ten ones make one ten, and that ten is carried into the next column.',
      watchOut: [
        'Remember to add the carried 1 when you add the next column.',
        'Keep the columns straight: ones under ones, tens under tens.'
      ],
      words: [
        { word: 'Carry', meaning: 'Move a whole ten (or hundred) into the next column.' },
        { word: 'Sum', meaning: 'The answer to an addition.' },
        { word: 'Column', meaning: 'A line of digits that all have the same place value.' }
      ],
      tryTypes: ['addsub-add', 'addsub-estimate'],
      practice: 'quiz.html?topic=addsub-add&level=just'
    },

    'sub-regrouping': {
      chapter: 'addsub',
      title: 'Taking away with borrowing',
      emoji: '➖',
      bigIdea: 'If the top digit is too small to take from, borrow a ten from the column next door.',
      picture: P.columnSub(532, 147),
      pictureCaption: '532 − 147 = 385',
      steps: [
        { head: 'Start at the ones', text: 'You cannot take 7 from 2, so borrow a ten from the tens column.' },
        { head: 'Borrow', text: 'The 3 tens become 2 tens, and the 2 ones become 12 ones. Now 12 − 7 = 5.' },
        { head: 'Now the tens', text: 'You cannot take 4 from 2, so borrow again: 5 hundreds become 4, and 2 tens become 12. 12 − 4 = 8.' },
        { head: 'Finish the hundreds', text: '4 − 1 = 3. The answer is 385. Check it: 385 + 147 = 532.' }
      ],
      remember: 'When the top digit is too small, borrow ten from the column on its left.',
      watchOut: [
        "Do not just take the small digit from the big one. 2 − 7 is not 5 — you must borrow.",
        'After borrowing, the column you borrowed from is one less. Write the change down so you do not forget it.'
      ],
      words: [
        { word: 'Borrow', meaning: 'Take one ten from the next column along and add it here.' },
        { word: 'Difference', meaning: 'The answer to a subtraction.' },
        { word: 'Check', meaning: 'Add your answer back on to see if you get the number you started with.' }
      ],
      tryTypes: ['addsub-sub', 'addsub-inverse'],
      practice: 'quiz.html?topic=addsub-sub&level=just'
    },

    'story-problems': {
      chapter: 'addsub',
      title: 'Turning a story into a sum',
      emoji: '📖',
      bigIdea: 'Every word problem hides a sum. Find the numbers, decide whether things are joining or leaving, then work it out.',
      picture: P.story(126, 45, '+', 171),
      pictureCaption: 'More stickers arriving means adding',
      steps: [
        { head: 'Read it twice', text: 'Once to hear the story, once to look for the numbers. Tap 🔊 if you would like it read to you.' },
        { head: 'Find the numbers', text: 'Meera had 126 stickers. Kabir gave her 45 more.' },
        { head: 'Joining or leaving?', text: 'Words like gave her, more, altogether and in total mean add. Words like gave away, sold, left and how many more mean take away.' },
        { head: 'Do the sum and check', text: '126 + 45 = 171. Read the question again — does 171 stickers answer it? Yes.' }
      ],
      remember: 'Things joining together means add. Things leaving, or being compared, means take away.',
      watchOut: [
        'Read right to the end. The last sentence tells you what to find.',
        '"How many more" means take away, even though the word more sounds like adding.'
      ],
      words: [
        { word: 'Altogether', meaning: 'A word that usually means add.' },
        { word: 'Left', meaning: 'A word that usually means take away.' },
        { word: 'Two-step', meaning: 'A problem that needs two sums, one after the other.' }
      ],
      tryTypes: ['addsub-story', 'addsub-story-two'],
      practice: 'quiz.html?topic=addsub-story&level=just'
    },

    'place-value': {
      chapter: 'numbers',
      title: 'Hundreds, tens and ones',
      emoji: '🧱',
      bigIdea: 'Every 3-digit number is just some hundreds, some tens and some ones stuck together.',
      picture: P.placeValue(4, 7, 6),
      pictureCaption: '476 = 4 hundreds + 7 tens + 6 ones',
      steps: [
        { head: 'Start with the number', text: 'Take 476. Say it out loud: four hundred and seventy-six.' },
        { head: 'Split it up', text: 'The 4 is in the hundreds place, the 7 is in the tens place and the 6 is in the ones place.' },
        { head: 'Give each digit its value', text: '4 hundreds is 400. 7 tens is 70. 6 ones is 6.' },
        { head: 'Add them back', text: '400 + 70 + 6 = 476. That is called the expanded form.' }
      ],
      remember: 'The place a digit sits in tells you what it is worth — hundreds, tens or ones.',
      watchOut: [
        'A zero still holds a place. In 406 there are no tens, but the 0 keeps the 4 in the hundreds.',
        'The same digit can be worth different amounts: in 337 the first 3 is worth 300 and the second is worth 30.'
      ],
      words: [
        { word: 'Digit', meaning: 'One of the symbols 0 to 9 that numbers are made from.' },
        { word: 'Place value', meaning: 'What a digit is worth because of where it sits.' },
        { word: 'Expanded form', meaning: '476 written the long way: 400 + 70 + 6.' }
      ],
      tryTypes: ['numbers-expanded', 'numbers-digit-value'],
      practice: 'quiz.html?chapter=numbers&level=just'
    },

    'compare-numbers': {
      chapter: 'numbers',
      title: 'Which number is bigger?',
      emoji: '⚖️',
      bigIdea: 'To compare two numbers, look at the biggest place first — the hundreds. Only if they match do you look at the tens.',
      picture: P.compare(308, 380),
      pictureCaption: '308 is smaller than 380',
      steps: [
        { head: 'Line them up', text: 'Write 308 and 380 one under the other. Both have 3 digits, so they are both hundreds numbers.' },
        { head: 'Compare the hundreds', text: 'Both have 3 hundreds. Still a tie, so move one place to the right.' },
        { head: 'Compare the tens', text: '308 has 0 tens. 380 has 8 tens. 0 is less than 8, so 308 is the smaller number.' },
        { head: 'Write the sign', text: '308 < 380. The open end of the sign always faces the bigger number — it is a hungry mouth.' }
      ],
      remember: 'Compare the biggest place first. Only if those digits are the same do you move one place to the right.',
      watchOut: [
        'More digits almost always wins: 1000 is bigger than 999.',
        'The open end of the sign faces the bigger number, like a mouth that wants more.'
      ],
      words: [
        { word: 'Greater than', meaning: 'The > sign, used when the first number is bigger.' },
        { word: 'Less than', meaning: 'The < sign, used when the first number is smaller.' },
        { word: 'Equal to', meaning: 'The = sign, used when both numbers are the same.' }
      ],
      tryTypes: ['numbers-compare', 'numbers-neighbours'],
      practice: 'quiz.html?topic=numbers-compare&level=just'
    },

    'rounding': {
      chapter: 'numbers',
      title: 'Rounding to the nearest 10',
      emoji: '🎯',
      bigIdea: 'Rounding means jumping to the closest ten. If you are halfway or past it, you jump up.',
      picture: P.numberLine(67, 60, 70),
      pictureCaption: '67 is past halfway, so it rounds up to 70',
      steps: [
        { head: 'Find the two tens', text: '67 sits between 60 and 70.' },
        { head: 'Find halfway', text: 'Halfway between 60 and 70 is 65.' },
        { head: 'Which side?', text: '67 is past 65, so it is closer to 70.' },
        { head: 'Round it', text: '67 rounded to the nearest 10 is 70. The quick way: look at the ones digit — 5 or more rounds up, 4 or less stays.' }
      ],
      remember: 'Look at the digit to the right of the place you are rounding to: 5 or more rounds up, 4 or less stays.',
      watchOut: [
        'Rounding is not guessing. 67 always rounds to 70, never to 65.',
        'A number that already ends in 0 stays exactly where it is.'
      ],
      words: [
        { word: 'Round', meaning: 'Change a number to the nearest ten or hundred.' },
        { word: 'Nearest ten', meaning: 'The closest number you say when counting in tens.' },
        { word: 'Estimate', meaning: 'A close-enough answer worked out quickly in your head.' }
      ],
      tryTypes: ['numbers-round', 'numbers-skip'],
      practice: 'quiz.html?topic=numbers-round&level=just'
    }
  };
})(window.Mathly);
