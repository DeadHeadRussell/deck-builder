import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {default as MaterialCard} from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import {List} from 'immutable';

export default withStyles(
  theme => ({
    card: {
      display: 'inline-block',
      width: 308,
      margin: theme.spacing.unit
    },
    image: {
      width: '100%',
      height: 412.5
    },
    compact: {
      width: 260,
      height: 412.5,
      cursor: 'pointer',

      '&.rows:not(:first-child)': {
        marginLeft: -150
      },
      '&.columns:not(:first-child)': {
        marginTop: -330
      },
      '&:hover': {
        zIndex: 100000
      }
    }
  }),
  {useTheme: true}
)(class Card extends React.Component {
  onClick = cardAction => {
    const {card, onClick} = this.props;
    return () => onClick && onClick(cardAction, card);
  }

  render() {
    const {card, count, view, compact, cardActions, classes} = this.props;

    return compact
      ? List().set(count - 1, 0)
        .map(() => (
          <img
            className={classNames(classes.compact, view)}
            onClick={this.onClick(cardActions[0])}
            src={card.imageUrl}
            alt={card.name}
          />
        ))
      : (
        <MaterialCard className={classes.card}>
          <CardContent>
            <Typography gutterBottom variant='headline' component='h3'>
              {card.name} {count > 1 ? `x${count}` : null}
            </Typography>
            <CardMedia className={classes.image} image={card.imageUrl} title={card.name} />
          </CardContent>
          <CardActions>
            {cardActions
              .map(cardAction => (
                <Button size='small' color='primary' onClick={this.onClick(cardAction)}>{cardAction}</Button>
              ))
            }
          </CardActions>
        </MaterialCard>
      );
  }
});
