/* Loads every question file, in order, before the page scripts that use them.
   Add a new chapter's questions here and every page picks them up. */
(function () {
  ['foundations', 'numbers', 'addsub', 'muldiv', 'fractions', 'money', 'measure', 'time', 'shapes', 'data'].forEach(function (name) {
    document.write('<script src="assets/questions/' + name + '.js"><\/script>');
  });
})();
