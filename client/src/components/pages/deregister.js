import React, { Component } from 'react';

class Deregister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberValue: '',
      codeValue: '',
      emailValue: '',
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
      [name]: value,
    });
  }

  handleSubmit(event) {
    // Send the code to the API and have it delete the locker
    // if the code is correct
    fetch('/lockersapi/deregister/confirm', {
      method: 'delete',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: this.state.codeValue,
      }),
    })
      .then(res => {
        // If the request was successful, redirect to thank you page,
        // otherwise show what the error was
        if (res.status === 200) {
          this.props.history.push('/deregister/thankyou');
        } else if (res.status >= 500) {
          alert(
            'An internal server error occurred, please try again later or contact the maintaner.'
          );
        } else {
          res.text().then(text => alert(text));
        }
      });

    event.preventDefault();
  }

  handleCode(event) {
    // Send an API request to have a locker reset code genereated
    // and emailed to the user
    fetch('/lockersapi/deregister/code', {
      method: 'post',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        number: this.state.numberValue,
        email: this.state.emailValue,
      }),
    })
      .then(res => {
        // If the request succeeded, let the user know
        if (res.status >= 500) {
          alert(
            'An internal server error occurred, please try again later or contact the maintaner.'
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
            <label htmlFor="inputCode">Email</label>
            <div className="form-row">
              <div className="form-group col-md-6">
                <input type="email" name="emailValue" id="inputEmail" placeholder="Enter email"
                  className="form-control" value={this.state.emailValue} onChange={this.handleChange}
                />
              </div>
            </div>
            <label htmlFor="inputNumber">Locker number</label>
            <div className="form-row">
              <div className="form-group col-md-4">
                <input type="number" name="numberValue" id="inputNumber"
                  placeholder="Enter locker number" className="form-control"
                  value={this.state.numberValue} onChange={this.handleChange}
                />
                <small id="numberHelp" className="form-text text-muted">
                  Enter the locker number you wish to deregister.
                  A confirmation email will be sent to the address associated with the locker.
                </small>
              </div>
              <div className="form-group col-md-2">
                <input type="button" className="btn btn-primary"value="Send code"
                  onClick={this.handleCode}
                />
              </div>
            </div>
            <label htmlFor="inputCode">Confirmation code</label>
            <div className="form-row">
              <div className="form-group col-md-2">
                <input type="text" name="codeValue" id="inputCode" placeholder="Enter code"
                  className="form-control" value={this.state.codeValue} onChange={this.handleChange}
                />
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
