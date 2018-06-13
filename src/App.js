import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Header from './components/header/header.js';
import Homepage from './components/pages/homepage.js';
import Contact from './components/pages/contact.js';
import Register from './components/pages/register/register.js';
import Update from './components/pages/register/update.js';
import Deregister from './components/pages/deregister.js';
import Renew from './components/pages/renew.js';

import './assets/css/custom.min.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Route exact path='/' component={Homepage} />
          <Route exact path='/contact' component={Contact} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/register/update' component={Update} />
          <Route exact path='/deregister' component={Deregister} />
          <Route exact path='/renew' component={Renew} />
        </div>
      </Router>
    );
  }
}

export default App;
