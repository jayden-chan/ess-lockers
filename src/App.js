import React, { Component } from 'react';
import Header from './components/header/header.js';
import Homepage from './components/homepage/homepage.js';

class App extends Component {
  render() {
    return (
      <div classNameName="App">
        <Header />
        <Homepage />
      </div>
    );
  }
}

export default App;
