import React, { Component } from 'react';

class Deregister extends Component {
  confirmedEmail = '';
  constructor(props) {
    super(props);
    this.state = {
      emailValue: '',
      codeValue: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCode   = this.handleCode.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleCode(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} style={{marginTop: 30}}>
          <div className="form-group">
            <label htmlFor="inputEmail">Email address</label>
            <div className="form-row">
              <div className="form-group col-md-8">
                <input type="email" name="emailValue" id="inputEmail" placeholder="Enter email" className="form-control" value={this.state.emailValue} onChange={this.handleChange} />
                <small id="emailHelp" className="form-text text-muted">Enter the same email address you used to reserve your locker. A confirmation email will be sent containing a short security code.</small>
              </div>
              <div className="form-group col-md-2">
                <input type="button" className="btn btn-primary"value="Send code" onClick={this.handleCode}/>
              </div>
            </div>
            <label htmlFor="inputCode">Confirmation code</label>
            <div className="form-row">
              <div className="form-group col-md-2">
                <input type="text" name="codeValue" id="inputCode" placeholder="Enter code" className="form-control" value={this.state.codeValue} onChange={this.handleChange} />
              </div>
            </div>
            <input type="submit" className="btn btn-primary"value="Submit" />
          </div>
        </form>
      </div>
    );
  }
}

export default Deregister;
