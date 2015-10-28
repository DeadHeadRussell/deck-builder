'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _cards = require('./cards');

var _cards2 = _interopRequireDefault(_cards);

var Pack = (function () {
  function Pack(cards) {
    _classCallCheck(this, Pack);

    if (cards) {
      this.cards = cards;
    } else {
      this.cards = _cards2['default'].getRare().concat(_cards2['default'].getUncommons()).concat(_cards2['default'].getCommons());
    }
  }

  _createClass(Pack, null, [{
    key: 'fromNames',
    value: function fromNames(names) {
      return new Pack(_cards2['default'].fromNames(names));
    }
  }]);

  return Pack;
})();

exports['default'] = Pack;
module.exports = exports['default'];