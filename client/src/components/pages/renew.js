import React, { Component } from 'react';

class Renew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValue: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    // Send a request to the API to renew the locker
    fetch('/lockersapi/renew', {
      method: 'post',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.emailValue,
      }),
    })
      .then(res => {
        // If the request succeded, show the thank you page.
        // Otherwise show the error
        if (res.status === 200) {
          this.props.history.push('/renew/thankyou');
        } else if (res.status >= 500) {
          alert(
            'An internal server error occurred, please try again later or contact the maintanter.'
          );
        } else {
          res.text().then(text => alert(text));
        }
      });
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
                <input type="email" name="emailValue" id="inputEmail" placeholder="Enter email"
                  className="form-control" value={this.state.emailValue} onChange={this.handleChange}
                />
                <small id="emailHelp" className="form-text text-muted">
                  Enter the same email address you used to reserve your locker.
                </small>
              </div>
              <div className="form-group col-md-2">
                <input type="submit" className="btn btn-primary"value="Renew" />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Renew;
