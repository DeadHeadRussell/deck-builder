import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import Drafter from '~/pages/drafter';
import muiTheme from '~/styles/theme';

const roboto = document.createElement('link');
roboto.rel = 'stylesheet';
roboto.href = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500';
document.head.appendChild(roboto);

const main = document.createElement('main');
main.id = 'main';
document.body.appendChild(main);

ReactDOM.render((
  <BrowserRouter>
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Drafter />
    </MuiThemeProvider>
  </BrowserRouter>
), document.querySelector('#main'));

