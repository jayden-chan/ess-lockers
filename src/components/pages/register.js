import React, { Component } from 'react';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameValue: '',
      emailValue: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  render() {
    return (
      <div className="container">
          <form onSubmit={this.handleSubmit} style={{marginTop: 30}}>
            <div class="form-group">
              <label for="inputName">Name</label>
              <input type="text" name="nameValue" placeholder="Enter name" className="form-control" value={this.state.nameValue} onChange={this.handleChange} />
            </div>
            <div class="form-group">
              <label for="inputEmail">Email address</label>
              <input type="email" name="emailValue" id="inputEmail" placeholder="Enter email" className="form-control" value={this.state.emailValue} onChange={this.handleChange} />
              <small id="emailHelp" class="form-text text-muted">Your email will not be shared with anyone else. We will send you messages regarding the status of your reservation.</small>
            </div>
            <input type="submit" className="btn btn-primary"value="Submit" />
          </form>
      </div>
    );
  }
}

export default Register;
