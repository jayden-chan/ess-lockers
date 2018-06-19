import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Homepage extends Component {
  render() {
    return (
      <div>
        <div className="container">
          <div className="jumbotron">
            <h1 className="display-4">ESS Locker Registration</h1>
            <h5 className="display-5"><b>Before registering please read the following information:</b></h5>
            <p style={{marginTop: 30}}>
              This is the locker registration page for the lockers in the ELW. The Engineering Students Society controls the registration of lockers in the Engineering Lab Wing (ELW) only.<b> The lockers are registered on a first come first serve basis.</b>
            </p>
            <p style={{marginTop: 30}}>
              If you register a locker, you may keep it until the first week of the next term. After that time, please remove your lock or inform us that you will be continuing to use your locker.
            </p>
            <p style={{marginTop: 30}}>
              These lockers are free, but <b>please</b> don't register for a locker unless you really think you are going to use it. There are far less lockers than students. You do not need to be in the faculty of Engineering to use a locker.
            </p>
            <p style={{marginTop: 30, marginBottom: 35}}>
              Before you register a locker, you need to <b>physically make sure the one you want is open.</b> Then <b>you have to put a lock on it.</b> If you don't, and the rest of the lockers have been registered, we will delete your registration and give the locker to someone more deserving.
            </p>
            <Link to="register">
              <button className="btn btn-primary btn-lg">
                I'm ready to register
              </button>
            </Link>
          </div>
        </div>
        <div className="container">
          <div className="jumbotron">
            <h4 className="display-5" style={{marginBottom: 20}}>Renew existing locker reservation</h4>
            <p>Renew existing locker registrations here. To prevent abandoned / forgotten lockers, reservations will automatically be removed at the beginning of each new term unless they are renewed.</p>
            <Link to="renew">
              <button className="btn btn-primary btn-lg">
                Renew my locker
              </button>
            </Link>
          </div>
        </div>
        <div className="container">
          <div className="jumbotron">
            <h4 className="display-5" style={{marginBottom: 20}}>Update / remove existing registration</h4>
            <p>Deregister or change your locker location here. Your locker reservation will automatically be removed at the beginning of each new term unless you renew it.</p>
            <Link to="deregister">
              <button className="btn btn-primary btn-lg">
                Deregister a locker
              </button>
            </Link>
            <Link to="register/update" style={{marginLeft: 20}}>
              <button className="btn btn-primary btn-lg">
                Change locker number
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
export default Homepage;
