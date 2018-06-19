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
    fetch('http://localhost:3001/register/update', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.emailValue,
        locker: this.state.lockerValue
      })
    })
      .then(res => {
        if(res.status === 200) {
          res.text().then(text => alert(text));
        }
        else if(res.status === 400) {
          res.text().then(text => alert(text));
        }
      })

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
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <input type="submit" className="btn btn-primary"value="Submit" />
        </form>
      </div>
    );
  }
}

export default Update;
