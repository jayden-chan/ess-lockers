import React, { Component } from 'react';

class Homepage extends Component {
  render() {
    return (
      <div classNameName="container-fluid">
        <div className="jumbotron">
          <h1 className="display-4">ESS Locker Registration</h1>
          <h5 className="display-5"><b>Before registering please read the following information:</b></h5>
          <p className="lead" style={{marginTop: 30}}>
            This is the locker registration page for the lockers in the ELW. The Engineering Students Society controls the registration of lockers in the Engineering Lab Wing (ELW) only. <b>The lockers are registered on a first come first serve basis.</b>
          </p>
          <p className="lead" style={{marginTop: 30}}>
            If you register a locker, you may keep it until the first week of the next term. After that time, please remove your lock or inform us that you will be continuing to use your locker.
          </p>
          <p className="lead" style={{marginTop: 30}}>
            These lockers are free, but <b>please</b> don't register for a locker unless you really thing you are going to use it. There are far less lockers than students. You do not need to be in the faculty of Engineering to use a locker.
          </p>
          <p className="lead" style={{marginTop: 30}}>
            Before you register a locker, you need to <b>physically make sure the one you want is open.</b> Then you <b>have to put a lock on it.</b> If you don't, and the rest of the lockers have been registered, we will delete your registration and give the locker to someone more deserving.
          </p>
          <p className="lead">
            <a className="btn btn-primary btn-lg" href="#" role="button">I'm ready to register</a>
          </p>
        </div>
      </div>
    );
  }
}

export default Homepage;
