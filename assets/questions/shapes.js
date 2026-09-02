/* Shapes & Patterns — CBSE Class 3: flat shapes, solids, symmetry and patterns. */
(function (M) {
  'use strict';

  var FLAT = [
    { name: 'triangle', sides: 3, lines: 3 },
    { name: 'square', sides: 4, lines: 4 },
    { name: 'rectangle', sides: 4, lines: 2 },
    { name: 'pentagon', sides: 5, lines: 5 },
    { name: 'hexagon', sides: 6, lines: 6 },
    { name: 'octagon', sides: 8, lines: 8 }
  ];

  var SOLIDS = [
    { name: 'cube', faces: 6, corners: 8, edges: 12 },
    { name: 'cuboid', faces: 6, corners: 8, edges: 12 },
    { name: 'cylinder', faces: 3, corners: 0, edges: 2 },
    { name: 'cone', faces: 2, corners: 1, edges: 1 },
    { name: 'sphere', faces: 1, corners: 0, edges: 0 }
  ];

  var SHAPE_EMOJI = ['🔺', '🔵', '⭐', '🟩', '🟣', '🔶'];

  /* a regular shape drawn from its number of sides */
  function polygonSvg(sides, spin) {
    var cx = 60, cy = 58, r = 44, points = [];
    for (var i = 0; i < sides; i++) {
      var a = (i / sides) * Math.PI * 2 - Math.PI / 2 + (spin || 0);
      points.push((cx + Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r).toFixed(1));
    }
    return '<svg viewBox="0 0 120 116" role="img" aria-label="a shape with ' + sides + ' sides">' +
      '<polygon points="' + points.join(' ') + '" fill="#f1ecff" stroke="#6d51c9" stroke-width="4" stroke-linejoin="round"/>' +
      '</svg>';
  }

  M.register({
    id: 'shapes-sides', chapter: 'shapes', label: 'Sides and corners', emoji: '📐', tint: 'add',
    make: function (ctx) {
      var shape = M.rand.pick(ctx.level === 'easy' ? FLAT.slice(0, 4) : FLAT);
      return {
        prompt: 'A ' + shape.name + ' has how many sides and corners?',
        mode: 'multi',
        fields: [{ label: 'sides' }, { label: 'corners' }],
        answer: [shape.sides, shape.sides]
      };
    }
  });

  M.register({
    id: 'shapes-name', chapter: 'shapes', label: 'Name the shape', emoji: '🔷', tint: 'mul',
    make: function (ctx) {
      var regular = FLAT.filter(function (s) { return s.name !== 'rectangle'; });
      var shape = M.rand.pick(ctx.level === 'easy' ? regular.slice(0, 3) : regular);
      var others = regular.filter(function (s) { return s.name !== shape.name; });
      var choices = [shape.name].concat(M.rand.shuffle(others.slice()).slice(0, 3).map(function (s) { return s.name; }));
      return {
        picture: polygonSvg(shape.sides),
        prompt: 'What is this shape called?',
        mode: 'choice',
        choices: M.rand.shuffle(choices),
        answer: shape.name
      };
    }
  });

  M.register({
    id: 'shapes-symmetry', chapter: 'shapes', label: 'Lines of symmetry', emoji: '🦋', tint: 'sub',
    make: function (ctx) {
      var shape = M.rand.pick(ctx.level === 'easy' ? FLAT.slice(0, 3) : FLAT);
      return {
        picture: polygonSvg(shape.sides),
        prompt: 'How many lines of symmetry does a regular ' + shape.name + ' have?',
        mode: 'number',
        answer: shape.name === 'rectangle' ? 2 : shape.sides,
        note: 'A line of symmetry folds the shape exactly in half'
      };
    }
  });

  M.register({
    id: 'shapes-solids', chapter: 'shapes', label: 'Solid shapes', emoji: '🧊', tint: 'div',
    make: function () {
      var solid = M.rand.pick(SOLIDS);
      var part = M.rand.pick(['faces', 'corners', 'edges']);
      return {
        prompt: 'How many ' + part + ' does a ' + solid.name + ' have?',
        mode: 'number',
        answer: solid[part],
        note: 'Faces are the flat or curved surfaces, corners are the points, edges are the lines where faces meet'
      };
    }
  });

  M.register({
    id: 'patterns-number', chapter: 'shapes', label: 'Number patterns', emoji: '🔢', tint: 'pct',
    make: function (ctx) {
      var kind = M.rand.pick(ctx.level === 'easy' ? ['add', 'add'] : ['add', 'subtract', 'double']);
      var shown = [], answer;
      if (kind === 'double') {
        var start = M.rand.int(1, 5);
        shown = [start, start * 2, start * 4, start * 8];
        answer = start * 16;
      } else if (kind === 'subtract') {
        var step = M.rand.int(2, 9);
        var top = step * M.rand.int(6, 12);
        shown = [top, top - step, top - 2 * step, top - 3 * step];
        answer = top - 4 * step;
      } else {
        var up = M.rand.int(2, ctx.level === 'easy' ? 5 : 12);
        var from = M.rand.int(1, 20);
        shown = [from, from + up, from + 2 * up, from + 3 * up];
        answer = from + 4 * up;
      }
      return {
        prompt: shown.join(', ') + ', ▢',
        mode: 'number',
        answer: answer,
        note: 'Look at the jump between each pair'
      };
    },
    check: function (q) { return q.answer >= 0 ? null : 'pattern goes below zero'; }
  });

  M.register({
    id: 'patterns-shape', chapter: 'shapes', label: 'Shape patterns', emoji: '🔺', tint: 'frac',
    make: function (ctx) {
      var many = ctx.level === 'easy' ? 2 : M.rand.int(2, 3);
      var unit = M.rand.shuffle(SHAPE_EMOJI.slice()).slice(0, many);
      var strip = [];
      for (var i = 0; i < 7; i++) strip.push(unit[i % many]);
      var answer = unit[7 % many];
      var choices = M.rand.shuffle(SHAPE_EMOJI.slice()).filter(function (e) { return e !== answer; }).slice(0, 2);
      return {
        prompt: strip.join(' ') + ' ▢',
        mode: 'choice',
        choices: M.rand.shuffle([answer].concat(choices)),
        answer: answer,
        note: 'The pattern repeats every ' + many + ' shapes'
      };
    }
  });

  M.polygonSvg = polygonSvg;    // the lesson pages draw shapes too
})(window.Mathly);
