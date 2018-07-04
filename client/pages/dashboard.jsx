import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import {Link} from 'react-router-dom';

import {withStore} from '~/libs/store';
import {compose} from '~/libs/utils';

export default compose(
  withStore({
    bins: ['decks']
  }),
  withStyles(
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
  )
)(class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isUndoShown: false};
  }

  removeDeck = deck => {
    return () => {
      const {decks} = this.props;
      decks.removeDeck(deck);
      this.setState({isUndoShown: true});
    }
  }

  handleUndoClose = () => {
    this.setState({isUndoShown: false});
  }

  handleUndo = () => {
    const {decks} = this.props;
    decks.undoRemoveDeck();
    this.setState({isUndoShown: false});
  }

  render() {
    const {classes, decks} = this.props;
    const {isUndoShown} = this.state;

    return (
      <div>
        <Typography variant='title'>Your Decks</Typography>
        {decks.getDecksList()
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
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          open={isUndoShown}
          autoHideDuration={10000}
          onClose={this.handleUndoClose}
          ContentProps={{
            'aria-describedby': 'undo-message-id'
          }}
          message={<span id='undo-message-id'>Deck Removed</span>}
          action={[
            <Button key='undo' color='secondary' size='small' onClick={this.handleUndo}>
              UNDO
            </Button>,
            <IconButton
              key='close'
              aria-label='Close'
              color='inherit'
              onClick={this.handleUndoClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />

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

