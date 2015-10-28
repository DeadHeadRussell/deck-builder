'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _componentsCardGroup = require('./components/cardGroup');

var _componentsCardGroup2 = _interopRequireDefault(_componentsCardGroup);

var _modelsCards = require('./models/cards');

var _modelsCards2 = _interopRequireDefault(_modelsCards);

var Board = (function (_React$Component) {
  function Board() {
    _classCallCheck(this, Board);

    _get(Object.getPrototypeOf(Board.prototype), 'constructor', this).call(this);
    this.sort = this.sort.bind(this);
  }

  _inherits(Board, _React$Component);

  _createClass(Board, [{
    key: 'getCardsList',
    value: function getCardsList() {
      var cardNums = this.props.cards.reduce(function (cards, card) {
        cards[card.name] = cards[card.name] || 0;
        cards[card.name]++;
        return cards;
      }, {});
      return Object.keys(cardNums).map(function (name) {
        return cardNums[name] + ' ' + name;
      });
    }
  }, {
    key: 'getCardGroups',
    value: function getCardGroups() {
      var _this = this;

      var groups = _modelsCards2['default'].group(this.props.cards, this.grouping);
      if (this.sorts) {
        groups.forEach(function (group) {
          return _modelsCards2['default'].sort(group, _this.sorts);
        });
      }
      return groups;
    }
  }, {
    key: 'sort',
    value: function sort(grouping) {
      this.grouping = grouping;
      switch (grouping) {
        case 'packs':
          this.sorts = null;
          break;

        case 'colour':
          this.sorts = ['name', 'rarity', 'cmc', 'type'];
          break;

        case 'type':
          this.sorts = ['name', 'rarity', 'cmc', 'colour'];
          break;

        case 'rarity':
          this.sorts = ['name', 'cmc', 'colour', 'type'];
          break;

        case 'cmc':
          this.sorts = ['name', 'rarity', 'colour', 'type'];
          break;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var cardsList = this.getCardsList().join('\n');
      var cardGroupElems = this.getCardGroups().map(function (group) {
        return _react2['default'].createElement(_componentsCardGroup2['default'], { name: group.name, cards: group.cards });
      });

      return _react2['default'].createElement(
        'div',
        { 'class': 'board' },
        _react2['default'].createElement(
          'h2',
          { 'class': 'board-header' },
          this.props.name
        ),
        _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'h3',
            { 'class': 'board-subheader' },
            'Sort...'
          ),
          _react2['default'].createElement(
            'button',
            { onClick: this.sort('packs') },
            'Packs'
          ),
          _react2['default'].createElement(
            'button',
            { onClick: this.sort('colour') },
            'Colour'
          ),
          _react2['default'].createElement(
            'button',
            { onClick: this.sort('type') },
            'Type'
          ),
          _react2['default'].createElement(
            'button',
            { onClick: this.sort('cmc') },
            'CMC'
          ),
          _react2['default'].createElement(
            'button',
            { onClick: this.sort('rarity') },
            'Rarity'
          )
        ),
        _react2['default'].createElement(
          'textarea',
          { 'class': 'board-cards-list' },
          cardsList
        ),
        _react2['default'].createElement(
          'div',
          { 'class': 'cards' },
          cardGroupElems
        )
      );
    }
  }]);

  return Board;
})(_react2['default'].Component);

exports['default'] = Board;
module.exports = exports['default'];