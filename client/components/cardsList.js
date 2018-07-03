import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {List} from 'immutable';

export default withStyles(
  {
    textField: {
      width: 300
    }
  }
)(class CardsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.createInitialState(props);
  }

  componentWillReceiveProps(newProps) {
    this.setState(this.createInitialState(newProps));
  }

  formatCard(count, card) {
    return `${count} ${card.name} (Set${card.getValue('Set Number')} #${card.getValue('Eternal ID')})`;
  }

  parseCard(cardText) {
    const {allCards} = this.props;

    const regex = /^(\d+) ([^(]+) \(Set(\d+) #(\d+)\)$/;
    const matches = cardText.match(regex);
    if (matches) {
      const count = parseInt(matches[1], 10);
      const name = matches[2];
      const card = allCards.find(card => card.name == name);
      if (card) {
        return List()
          .set(count - 1, 0)
          .map(() => card);
      }
    }
    return null;
  }

  createInitialState(props) {
    const {cards, format} = props;
    return {
      text: cards
        .groupBy(card => card.id)
        .map(cards => this.formatCard(cards.size, cards.first()))
        .join('\n')
    };
  }

  onChange = event => {
    const {onChange} = this.props;
    const text = event.target.value;
    this.setState({text});

    const cards = List(text.split('\n'))
      .map(cardText => this.parseCard(cardText));
    const errors = cards.filter(card => !card);
    if (errors.isEmpty()) {
      onChange(cards.flatten());
    }
  }

  render() {
    const {onChange, classes} = this.props;
    const {text} = this.state;
    return (
      <TextField
        label='Cards List'
        className={classes.textField}
        multiline={true}
        rows={10}
        rowsMax={60}
        value={text}
        readOnly={!!onChange}
        onChange={this.onChange}
        onBlur={this.onBlur}
      />
    );
  }
});

