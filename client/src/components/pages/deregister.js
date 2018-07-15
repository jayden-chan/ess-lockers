import React, { Component } from 'react';

class Deregister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberValue: '',
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
    console.log(this.state.codeValue);
    fetch('http://localhost:3001/api/deregister/confirm', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: this.state.codeValue
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

  handleCode(event) {
    fetch('http://localhost:3001/api/deregister/email', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.numberValue,
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
            <label htmlFor="inputNumber">Locker number</label>
            <div className="form-row">
              <div className="form-group col-md-3">
                <input type="number" name="numberValue" id="inputNumber" placeholder="Enter locker number" className="form-control" value={this.state.numberValue} onChange={this.handleChange} />
                <small id="numberHelp" className="form-text text-muted">Enter the locker number you wish to deregister. A confirmation email will be sent to the address associated with the locker.</small>
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
