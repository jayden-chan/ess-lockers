import React, { Component } from 'react';

class Contact extends Component {
  render() {
    return (
      <div className="container">
        <div className="jumbotron">
          <h1 className="display-4">About / Contact</h1>
          <p>Lockers system maintainer: <a href="mailto:jaydencn7@gmail.com">Jayden Chan</a></p>
          <p>ESS Director of IT: <a href="mailto:essbtec@uvic.ca">Biarki Weeks</a></p>
        </div>
      </div>
    );
  }
}

export default Contact;
