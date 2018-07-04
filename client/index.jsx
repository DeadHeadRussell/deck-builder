import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom';

import Root from '~/pages/root';
import muiTheme from '~/styles/theme';

const roboto = document.createElement('link');
roboto.rel = 'stylesheet';
roboto.href = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500';
document.head.appendChild(roboto);

const main = document.createElement('main');
main.id = 'main';
document.body.appendChild(main);

ReactDOM.render((
  <HashRouter>
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Root />
    </MuiThemeProvider>
  </HashRouter>
), document.querySelector('#main'));

