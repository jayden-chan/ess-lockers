/* global window */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
    };

    this.updateWindowSize = this.updateWindowSize.bind(this);
  }

  updateWindowSize() {
    this.setState({ width: window.innerWidth });
  }

  componentDidMount() {
    this.updateWindowSize();
    window.addEventListener('resize', this.updateWindowSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowSize);
  }

  getHeaderText() {
    return (this.state.width < 600)
      ? 'UVic - ESS'
      : 'University of Victoria - Engineering Student Society';
  }

  render() {
    return (
      <header>
        <div className="container">
          <nav className="navbar navbar-expand-md navbar-dark bg-primary">
            <a className="navbar-brand" href="http://ess.uvic.ca">
              {this.getHeaderText()}
            </a>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to="contact" className="nav-link">About/Contact</Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    );
  }
}

export default Header;
