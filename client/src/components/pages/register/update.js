import React, { Component } from 'react';

class Update extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValue: '',
      lockerValue: ''
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
          <div className="form-group">
            <label htmlFor="inputEmail">Email address</label>
            <input type="email" name="emailValue" id="inputEmail" placeholder="Enter email" className="form-control" value={this.state.emailValue} onChange={this.handleChange} />
            <small id="emailHelp" className="form-text text-muted">Enter the same email address you used to reserve your locker.</small>
          </div>
          <div className="form-group" style={{maxWidth: '40%'}}>
            <label htmlFor="lockerDrop">New locker number</label>
            <select id="lockerDrop" className="form-control" name="lockerValue" value={this.state.lockerValue} onChange={this.handleChange}>
              <option value="coconut">1</option>
              <option value="grapefruit">2</option>
              <option value="lime">3</option>
              <option value="mango">4</option>
            </select>
          </div>
          <input type="submit" className="btn btn-primary"value="Submit" />
        </form>
      </div>
    );
  }
}

export default Update;
