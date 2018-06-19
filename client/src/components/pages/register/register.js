import React, { Component } from 'react';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameValue: '',
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
    fetch('http://localhost:3001/register/new', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.nameValue,
        email: this.state.emailValue,
        locker: this.state.lockerValue
      })
    })
      .then(res => {
        if(res.status === 200) {
          this.props.history.push('/register/thankyou');
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
        <form method="post" onSubmit={this.handleSubmit} style={{marginTop: 30}}>
          <div className="form-group">
            <label htmlFor="inputName">Name</label>
            <input type="text" name="nameValue" placeholder="Enter name" className="form-control" value={this.state.nameValue} onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="inputEmail">Email address</label>
            <input type="email" name="emailValue" id="inputEmail" placeholder="Enter email" className="form-control" value={this.state.emailValue} onChange={this.handleChange} />
            <small id="emailHelp" className="form-text text-muted">Your email will not be shared with anyone else. We will send you messages regarding the status of your reservation.</small>
          </div>
          <div className="form-group" style={{maxWidth: '40%'}}>
            <label htmlFor="lockerDrop">Choose your locker</label>
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

export default Register;
