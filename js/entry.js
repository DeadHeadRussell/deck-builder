import 'babel/register';

import React from 'react';
import ReactDOM from 'react-dom';

import AllCards from './pages/allCards';
import DeckEditor from './pages/deckEditor';
import Draft from './pages/draft';
import Sealed from './pages/sealed';

let page = window.location.pathname.substr(1).split('.')[0];
ReactDOM.render(getElem(page), document.getElementById('root'));

function getElem(page) {
  switch (page) {
    case 'allCards': return (<AllCards />);
    case 'deckEditor': return (<DeckEditor />);
    case 'draft': return (<Draft />);
    case 'sealed': return (<Sealed />);
  }
}

