/* Turns the editable sources (assets/catalog.js, assets/concepts.js) into the
   JSON the site actually reads. Run: node tools/export-data.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');

function pictureStub() {
  // every drawing the lessons can name; keep in step with assets/pictures.js
  const names = ['placeValue', 'compare', 'numberLine', 'jumps', 'money', 'units', 'sensibleUnits',
    'shapesRow', 'symmetry', 'pictograph', 'parts', 'groupFraction', 'compareFractions', 'groups',
    'share', 'split', 'columnAdd', 'columnSub', 'story', 'keywords', 'clock', 'polygon', 'tally'];
  const out = {};
  names.forEach(function (name) {
    out[name] = function () { return { draw: name, args: Array.prototype.slice.call(arguments) }; };
  });
  return out;
}

const context = { window: {}, console };
context.window.Mathly = { pictures: pictureStub() };
context.Mathly = context.window.Mathly;
vm.createContext(context);

['assets/catalog.js', 'assets/concepts.js'].forEach(function (file) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
});

function write(name, value) {
  const file = path.join(root, 'data', '3', name + '.json');
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
  console.log('wrote data/3/' + name + '.json');
}

write('catalog', context.window.MATHLY);
write('concepts', context.window.MATHLY_CONCEPTS);
