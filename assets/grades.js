(function (M) {
  'use strict';

  var menu = document.getElementById('gradeMenu');

  M.data.json('grades').then(function (data) {
    data.grades.forEach(function (grade) {
      var el = document.createElement(grade.ready ? 'a' : 'div');
      el.className = 'card tint-' + (grade.tint || 1) + (grade.ready ? ' card-link' : ' card-soon');
      if (grade.ready) el.href = grade.href; else el.setAttribute('aria-disabled', 'true');
      el.innerHTML =
        '<span class="card-icon" aria-hidden="true">' + grade.emoji + '</span>' +
        '<span class="card-body">' +
          '<span class="card-title">' + grade.title + '</span>' +
          '<span class="card-text">' + grade.text + '</span>' +
          '<span class="card-meta">' + grade.meta + '</span>' +
        '</span>' +
        (grade.ready ? '<span class="card-arrow" aria-hidden="true">▶</span>' : '');
      menu.appendChild(el);
    });
  }).catch(function () {
    menu.innerHTML = '<p class="hint error">Could not load the class list — please refresh.</p>';
  });
})(window.Mathly);
