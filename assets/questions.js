/* Loads every question file, in order, before the page scripts that use them.
   Add a new chapter's questions here and every page picks them up.
   Paths are worked out from this file's own URL, so it works from any folder. */
(function () {
  var here = (document.currentScript && document.currentScript.src) || 'assets/questions.js';
  var base = here.replace(/questions\.js.*$/, 'questions/');

  ['foundations', 'numbers', 'addsub', 'muldiv', 'fractions', 'money', 'measure', 'time',
   'shapes', 'data', 'wordproblems'].forEach(function (name) {
    document.write('<script src="' + base + name + '.js"><\/script>');
  });
})();
