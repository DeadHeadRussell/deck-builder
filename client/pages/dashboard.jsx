import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import {Link} from 'react-router-dom';

import {Decks} from '~/libs/persistence';

export default withStyles(
  theme => ({
    card: {
      width: 300,
      margin: theme.spacing.unit
    },

    fab: {
      position: 'absolute',
      bottom: theme.spacing.unit * 2,
      right: theme.spacing.unit * 2
    }
  }),
  {useTheme: true}
)(class Dashboard extends React.Component {
  removeDeck = deck => {
    return () => {
      Decks.removeDeck(deck.name);
      this.forceUpdate();
    }
  }

  render() {
    const {classes} = this.props;

    return (
      <div>
        <Typography variant='title'>Your Decks</Typography>
        {Decks.getDecksList()
          .map(deck => (
            <Card className={classes.card}>
              <CardContent>
                <Typography variant='body1'>
                  {deck.name || '(In progress...)'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} to={`/builder/${deck.name}`}>Edit deck</Button>
                <Button onClick={this.removeDeck(deck)}>Remove deck</Button>
              </CardActions>
            </Card>
          ))
          .update(decks => decks.isEmpty()
            ? (
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant='body1'>You have no decks</Typography>
                </CardContent>
                <CardActions>
                  <Button component={Link} to='/builder'>Create new deck</Button>
                </CardActions>
              </Card>
            )
            : decks
          )
        }
        <Button
          variant='fab'
          className={classes.fab}
          color='primary'
          aria-label='create deck'
          component={Link}
          to='/builder'
        >
          <AddIcon />
        </Button>
      </div>
    );
  }
});

