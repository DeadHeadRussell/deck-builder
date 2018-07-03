import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import {default as MaterialCard} from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';

import Card from './card';

export default withStyles(
  theme => ({
    rowsRoot: {
      width: '100%',
    },

    columnsRoot: {
      width: 380,

      '&.compact': {
        width: 308
      }
    },

    content: {
      flex: '0 0 100%'
    },

    rows: {
      display: 'flex',
      flexFlow: 'row wrap'
    },

    columns: {
      display: 'flex',
      flexFlow: 'column nowrap'
    },

    compact: {
      maxWidth: 'calc(100% - 150px)'
    }
  }),
  {useTheme: true}
)(class CardGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {visible: props.defaultVisibility || false};
  }

  toggleVisible = () => {
    const {visible} = this.state;
    this.setState({visible: !visible});
  }

  render() {
    const {name, cards, view, display, cardActions, onCardClick, classes} = this.props;
    const {visible} = this.state;

    const cardElems = cards
      .groupBy(card => card.id)
      .map((cards, id) => (
        <Card key={id} card={cards.first()} count={cards.size} view={view} display={display} cardActions={cardActions} onClick={onCardClick} />
      ))
      .toList()
      .flatten();

    const parsedName = typeof name == 'undefined' || name.length == 0
      ? '(None)'
      : name;

    return (
      <MaterialCard
        className={classNames(classes[`${view}Root`], display)}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} onClick={this.toggleVisible}>
          <Typography variant='title' component='h2'>
            {parsedName} - ({cards.size})
          </Typography>
        </ExpansionPanelSummary>
        {visible
          ? (
            <ExpansionPanelDetails
              className={classNames(
                classes.content,
                classes[view],
                classes[display]
              )}
            >
              {cardElems}
            </ExpansionPanelDetails>
          )
          : null
        }
      </MaterialCard>
    );
  }
});

