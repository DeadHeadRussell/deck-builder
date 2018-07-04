import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import {Link, Route} from 'react-router-dom';

import Builder from '~/pages/builder';
import Dashboard from '~/pages/dashboard';

const drawerWidth = 240;

export default withStyles(
  theme => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      overflow: 'hidden'
    },
    appBar: {
      [theme.breakpoints.up('md')]: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`
      }
    },
    navIcon: {
      [theme.breakpoints.up('md')]: {
        display: 'none'
      }
    },
    drawer: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing.unit * 3,
      [theme.breakpoints.up('md')]: {
        marginLeft: drawerWidth
      }
    }
  }),
  {withTheme: true}
)(class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isDrawerOpen: false};
  }

  toggleDrawer = () => {
    this.setState({isDrawerOpen: !this.state.isDrawerOpen});
  }

  render() {
    const {classes} = this.props;
    const {isDrawerOpen} = this.state;

    return (
      <div className={classes.root}>
        <AppBar position='static' color='primary' className={classes.appBar}>
          <Toolbar>
            <IconButton
              color='inherit'
              area-label='Menu'
              onClick={this.toggleDrawer}
              className={classes.navIcon}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='title' color='inherit'>
              Deck Builder
            </Typography>
          </Toolbar>
        </AppBar>

        <Hidden mdUp>
          <Drawer
            variant='temporary'
            open={isDrawerOpen}
            onClose={this.toggleDrawer}
            classes={{paper: classes.drawer}}
            ModalProps={{keepMounted: true}}
          >
            {this.renderDrawerMenu()}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation='css'>
          <Drawer variant="permanent" open classes={{paper: classes.drawer}}>
            {this.renderDrawerMenu()}
          </Drawer>
        </Hidden>
        <main className={classes.content}>
          <Route path='/' exact={true} component={Dashboard} />
          <Route path='/builder/:name' component={Builder} />
          <Route path='/builder' exact={true} component={Builder} />
        </main>
      </div>
    );
  }

  renderDrawerMenu() {
    return (
      <React.Fragment>
        <MenuItem component={Link} to='/'>Dashboard</MenuItem>
        <MenuItem component={Link} to='/builder'>Deck Builder</MenuItem>
      </React.Fragment>
    );
  }
});

