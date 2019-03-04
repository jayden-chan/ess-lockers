import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  render() {
    return (
      <header>
        <div className="container">
          <nav className="navbar navbar-expand-md navbar-dark bg-primary">
            <a className="navbar-brand" href="http://ess.uvic.ca">
              University of Victoria - Engineering Student Society
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
