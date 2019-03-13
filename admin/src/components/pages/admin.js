/* global fetch */
import React, { Component } from 'react';

const API_KEY = 'LOCKERS_API_KEY_PLACEHOLDER';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all: [],
      searchNameString: '',
      editingRow: null,
      editName: '',
      editEmail: '',
      editStatus: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  fetchTableData(type) {
    // Fetch the lockers DB
    fetch('/lockersapi/summary', {
      method: 'get',
      mode: 'same-origin',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          console.log('Lockers API req failed (Code: '+ res.status + ')');
          return [];
        }
      })
      .then(json => {
        this.setState({all: json});
      });
  }

  componentWillMount() {
    this.fetchTableData();
  }

  assembleTable(data) {
    if (data === undefined) {
      return (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Error</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">An internal server error ocurred.</th>
            </tr>
          </tbody>
        </table>
      );

    }
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Submitted</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(entry => {
            // Filter the locker table based on the contents of the search bar
            const containsName = entry.name
              .toLowerCase()
              .includes(this.state.searchNameString.toLowerCase());

            const containsStatus = entry.status
              .toLowerCase()
              .includes(this.state.searchNameString.toLowerCase());

            let containsEmail = false;

            if (entry.email !== null) {
              containsEmail = entry.email
                .toLowerCase()
                .includes(this.state.searchNameString.toLowerCase());
            }

            if (containsName || containsEmail || containsStatus) {
              if (this.state.editingRow === entry.number) {
                return (
                  <tr key={entry.number}>
                      <th scope="row">{entry.number}</th>
                      <td>
                        <form>
                          <input
                            type="text"
                            name="editName"
                            value={this.state.editName}
                            onChange={this.handleChange}
                          />
                        </form>
                      </td>
                      <td>
                        <form>
                          <input
                            type="text"
                            name="editEmail"
                            value={this.state.editEmail}
                            onChange={this.handleChange}
                          />
                        </form>
                      </td>
                      <td>
                        {entry.submitted}
                      </td>
                      <td>
                        <form>
                          <select
                            name="editStatus"
                            value={this.state.editStatus}
                            onChange={this.handleChange}
                          >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="pending">Pending</option>
                            <option value="reserved">Reserved</option>
                            <option value="busted">Busted</option>
                          </select>
                        </form>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            this.setState({editingRow: null});
                            console.log(this.state.editName);
                            console.log(this.state.editEmail);
                            console.log(this.state.editStatus);
                          }}
                        >
                          Finished
                        </button>
                      </td>
                  </tr>
                );
              }
              return (
                <tr key={entry.number}>
                  <th scope="row">{entry.number}</th>
                  <td>{entry.name}</td>
                  <td>{entry.email}</td>
                  <td>{entry.submitted}</td>
                  <td>{entry.status}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {this.setState({
                        editingRow: entry.number,
                        editName: entry.name,
                        editEmail: entry.email,
                        editStatus: entry.status,
                      })}}
                    >
                      Edit Row
                    </button>
                  </td>
                </tr>
              );
            } else {
              return (<div></div>);
            }
          })}
        </tbody>
      </table>
    );
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div>
        <div className='container'>
          <div className='jumbotron'>
            <h4 className='display-4'>Administration</h4>
            <p>
              This page is intended to serve as a basic interface for viewing the status of
              the lockers DB. If you need to perform more advanced actions, please contact
              the lockers maintainer.
            </p>
          </div>
          <h5 className='display-5'>All Lockers</h5>

          <form>
            <div className='form-group'>
              <div className='form-row'>
                <div className='form-group col-md-4'>
                  <input type='text' name='searchNameString' id='searchNameString'
                    placeholder='Search by name, email, or status' className='form-control'
                    value={this.state.searchNameString} onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>
          </form>

          <div style={{marginBottom: '50px'}}>
            {this.assembleTable(this.state.all)}
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
