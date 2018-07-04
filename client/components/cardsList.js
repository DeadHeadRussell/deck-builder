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
    if (!newProps.cards.equals(this.props.cards)) {
      this.setState(this.createInitialState(newProps));
    }
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

  getText() {
    return this.state.text;
  }

  formatCard(count, card) {
    return `${count} ${card.name} (Set${card.getValue('Set Number')} #${card.getValue('Eternal ID')})`;
  }

  parseCard(cardText) {
    const {allCards} = this.props;

    const regex = /^(\d+) ([^(]+) \((Set(\d+) #(\d*))?\)$/;
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
    return cardText;
  }

  onChange = event => {
    const {onChange} = this.props;
    const text = event.target.value;
    this.setState({text, textError: null});

    const cards = List(text.split('\n'))
      .filter(cardText => cardText)
      .map(cardText => this.parseCard(cardText));
    const errors = cards.filter(card => typeof card == 'string');
    if (errors.isEmpty()) {
      onChange(cards.flatten());
    } else {
      this.setState({
        textError: `Could not parse cards: ${errors.join(', ')}`
      });
    }
  }

  render() {
    const {label, onChange, classes} = this.props;
    const {text, textError} = this.state;
    return (
      <TextField
        label={label || 'Cards List'}
        className={classes.textField}
        multiline={true}
        error={!!textError}
        helperText={textError}
        rows={10}
        rowsMax={20}
        value={text}
        readOnly={!!onChange}
        onChange={this.onChange}
        onBlur={this.onBlur}
        inputProps={{
          ref: textInput => this.textInput = textInput
        }}
      />
    );
  }
});

