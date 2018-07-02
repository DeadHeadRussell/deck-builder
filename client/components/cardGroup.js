import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';

import Card from './card';

export default withStyles(
  theme => ({
    rootExpanded: {
      margin: 16,
      '&:first-child': {
        marginTop: 16
      }
    },

    rowsRoot: {
      width: '100%',
    },

    columnsRoot: {},

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
    }
  }),
  {useTheme: true}
)(class CardGroup extends React.Component {
  render() {
    const {name, cards, view, compact, cardActions, onCardClick, classes} = this.props;

    const cardElems = cards
      .groupBy(card => card.id)
      .map((cards, id) => (
        <Card key={id} card={cards.first()} count={cards.size} view={view} compact={compact} cardActions={cardActions} onClick={onCardClick} />
      ))
      .toList()
      .flatten();

    return (
      <ExpansionPanel
        classes={{
          root: classes[`${view}Root`],
          expanded: classes.rootExpanded
        }}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='title' component='h2'>
            {name} - ({cards.size})
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classNames(classes.content, classes[view])}>{cardElems}</div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
});

