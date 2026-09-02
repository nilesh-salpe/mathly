/* Shared helpers for olympiad questions: every one is four options, exactly one
   right, with the wrong ones built from the mistakes children actually make. */
(function (M) {
  'use strict';

  function options(correct, wrongs) {
    var seen = {}, list = [String(correct)];
    seen[String(correct)] = true;
    for (var i = 0; i < wrongs.length && list.length < 4; i++) {
      var value = String(wrongs[i]);
      if (value === 'NaN' || value === 'undefined' || seen[value]) continue;
      seen[value] = true;
      list.push(value);
    }
    // only numbers can be padded sensibly; a short list is left short so the
    // self-test catches it rather than a child seeing a nonsense option
    if (list.length < 4 && String(Number(correct)) === String(correct)) {
      for (var pad = 1; pad <= 40 && list.length < 4; pad++) {
        var filler = String(Number(correct) + (pad % 2 ? pad : -pad));
        if (Number(filler) >= 0 && !seen[filler]) { seen[filler] = true; list.push(filler); }
      }
    }
    return M.rand.shuffle(list);
  }

  function mcq(def) {
    return {
      prompt: def.prompt,
      mode: 'choice',
      choices: options(def.answer, def.wrongs || []),
      answer: String(def.answer),
      why: def.why,
      note: def.note,
      picture: def.picture
    };
  }

  M.olympiad = { options: options, mcq: mcq };
})(window.Mathly);
