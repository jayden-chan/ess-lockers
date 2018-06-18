import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/header/header.js';
import Homepage from './components/pages/homepage.js';
import Contact from './components/pages/contact.js';
import Register from './components/pages/register/register.js';
import Update from './components/pages/register/update.js';
import Deregister from './components/pages/deregister.js';
import Renew from './components/pages/renew.js';
import Lost from './components/pages/404.js';

import './assets/css/custom.min.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path='/' component={Homepage} />
            <Route path='/contact' component={Contact} />
            <Route path='/register' component={Register} />
            <Route path='/register/update' component={Update} />
            <Route path='/deregister' component={Deregister} />
            <Route path='/renew' component={Renew} />
            <Route component={Lost} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
