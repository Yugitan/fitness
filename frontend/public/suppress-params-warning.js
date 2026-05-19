(function () {
  if (typeof window === 'undefined') return;

  var MARKERS = ['params are being enumerated', 'sync-dynamic-apis'];

  function isNoise(args) {
    var text = Array.prototype.slice.call(args).join(' ');
    return MARKERS.some(function (m) {
      return text.indexOf(m) !== -1;
    });
  }

  function patch(method) {
    var original = console[method].bind(console);
    console[method] = function () {
      if (isNoise(arguments)) return;
      return original.apply(console, arguments);
    };
  }

  function apply() {
    patch('error');
    patch('warn');
  }

  apply();
  setTimeout(apply, 0);
  setTimeout(apply, 300);
  setTimeout(apply, 1500);
})();
