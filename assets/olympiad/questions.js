/* Loads the olympiad question files. Paths come from this file's own URL. */
(function () {
  var here = (document.currentScript && document.currentScript.src) || 'assets/olympiad/questions.js';
  var base = here.replace(/questions\.js.*$/, '');

  ['kit', 'lr', 'mr', 'ev', 'ach'].forEach(function (name) {
    document.write('<script src="' + base + name + '.js"><\/script>');
  });
})();
