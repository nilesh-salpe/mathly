/* Where the site's content comes from.
   Everything a page shows — the menu, the lessons, the question banks — is JSON
   fetched from here. Point `base` somewhere else (an API, a CDN) and nothing
   else has to change:  Mathly.data.base = 'https://example.com/mathly/';  */
(function (M) {
  'use strict';

  // each grade keeps its content in its own folder; a page says which before this loads
  var base = window.MATHLY_DATA_BASE || 'data/';
  var cache = {};

  function json(name) {
    if (!cache[name]) {
      cache[name] = fetch(base + name + '.json', { credentials: 'same-origin' })
        .then(function (response) {
          if (!response.ok) throw new Error('Could not load ' + name + ' (' + response.status + ')');
          return response.json();
        });
    }
    return cache[name];
  }

  function catalog() {
    return json('catalog').then(function (data) {
      window.MATHLY = data;                 // the menu, as the pages expect it
      return data;
    });
  }

  function concepts() {
    return json('concepts').then(function (data) {
      window.MATHLY_CONCEPTS = data;        // the lessons
      return data;
    });
  }

  function bank(chapter) {
    return json('banks/' + chapter);
  }

  function failed(error) {
    var note = document.createElement('p');
    note.className = 'hint error';
    note.textContent = 'Something went wrong loading this page: ' + error.message +
      ' — please refresh, or check you are online.';
    (document.querySelector('main') || document.body).prepend(note);
    throw error;
  }

  var started = null;

  M.data = {
    get base() { return base; },
    set base(value) { base = value; cache = {}; started = null; },
    json: json,
    catalog: catalog,
    concepts: concepts,
    bank: bank,
    // pages that show chapters or lessons wait on this; the grade picker never asks
    get ready() {
      if (!started) started = Promise.all([catalog(), concepts()]).catch(failed);
      return started;
    }
  };
})(window.Mathly);
