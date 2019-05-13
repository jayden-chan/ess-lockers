/* global fetch window document */
import React, { Component } from 'react';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.min.css';
import '../../assets/css/custom.min.css';

const API_KEY = 'LOCKERS_API_KEY_PLACEHOLDER';
const DATE_FORMAT = 'MMM D, YYYY h:mm:ss A';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all: [],
      show: false,
      searchNameString: '',
      editingRow: null,
      editName: '',
      editEmail: '',
      editStatus: '',
      editIndex: 0,
      resetRequesterEmail: '',
      modalContent: {
        title: '',
        body: '',
        confirmation: '',
        form: false,
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleButtonPress = this.handleButtonPress.bind(this);
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
          return res.text().then(text => {
            console.log(`Lockers API request failed with status code ${res.status}: ${text}`);
            return {error: {
              code: res.status,
              message: text,
            }};
          });
        }
      })
      .then(json => {
        this.setState({all: json});
      });
  }

  closeModal() {
    this.setState({show: false});
  }

  openModal(modalContent) {
    this.setState({show: true, modalContent});
  }

  submitWithEnter(event) {
    this.submitEdits();
    event.preventDefault();
  }

  submitEdits() {
    fetch('/lockersapi/upsert', {
      method: 'post',
      mode: 'same-origin',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.editName,
        email: this.state.editEmail,
        number: this.state.editingRow,
        status: this.state.editStatus,
      }),
    })
      .then(res => {
        if (res.status === 200) {
          toast('Locker updated successfully', {
            hideProgressBar: true,
            autoClose: 3000,
            className: 'toast-container',
          });

          const newAll = this.state.all;
          const idx = this.state.editIndex;

          newAll[idx].name = this.state.editName;
          newAll[idx].email = this.state.editEmail;
          newAll[idx].status = this.state.editStatus;

          this.setState({
            editingRow: null,
            editName: '',
            editEmail: '',
            editStats: '',
            editIndex: 0,
            all: newAll,
          });
        } else {
          res.text().then(text => {
            toast.error(`Locker update failed with status code ${res.status}:\n${text}`, {
              hideProgressBar: true,
              autoClose: 3000,
            });
          });
        }
      });
  }

  handleButtonPress(event) {
    switch (event.keyCode) {
      case 27:
        this.setState({
          editingRow: null,
          editName: '',
          editEmail: '',
          editStatus: '',
        });
        break;
      default: break;
    }
  }

  componentDidMount() {
    this.fetchTableData();
    document.addEventListener('keydown', this.handleButtonPress, false);
  }

  componentWillUnmount(){
    document.removeEventListener('keydown', this.handleButtonPress, false);
  }

  editableRow(entry, idx) {
    return (
      <tr key={entry.number}>
        <th scope="row">{entry.number}</th>
        <td>
          <form onSubmit={(e) => this.submitWithEnter(e)}>
            <input
              type="text"
              name="editName"
              value={this.state.editName}
              onChange={this.handleChange}
            />
          </form>
        </td>
        <td>
          <form onSubmit={(e) => this.submitWithEnter(e)}>
            <input
              type="text"
              name="editEmail"
              value={this.state.editEmail}
              onChange={this.handleChange}
            />
          </form>
        </td>
        <td>
          {dayjs(entry.submitted).format(DATE_FORMAT)}
        </td>
        <td>
          <form onSubmit={(e) => this.submitWithEnter(e)}>
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
            className="btn btn-success btn-sm"
            onClick={() => this.submitEdits()}
          >
            Finished
          </button>
        </td>
      </tr>
    );
  }

  staticRow(entry, idx) {
    return (
      <tr key={entry.number}>
        <th scope="row">{entry.number}</th>
        <td>{entry.name}</td>
        <td>{entry.email}</td>
        <td>{dayjs(entry.submitted).format(DATE_FORMAT)}</td>
        <td>{entry.status}</td>
        <td>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {this.setState({
              editingRow: entry.number,
              editName: entry.name,
              editEmail: entry.email,
              editStatus: entry.status,
              editIndex: idx,
            })}}
          >
            Edit Row
          </button>
        </td>
      </tr>
    );
  }

  assembleTable(data) {
    if (data.error) {
      return (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Error</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">An error ocurred (Code {data.error.code}): {data.error.message}</th>
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
            <th scope="col">Last Updated</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => {

            let searchTerm = this.state.searchNameString.toLowerCase();
            let shouldShow = false;

            if (searchTerm.startsWith('#')) {
              searchTerm = searchTerm.substring(1);
              shouldShow = (idx + 1).toString().includes(searchTerm);
            } else {
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

              shouldShow = containsName || containsEmail || containsStatus;
            }

            if (shouldShow) {
              if (this.state.editingRow === entry.number) {
                return this.editableRow(entry, idx);
              } else {
                return this.staticRow(entry, idx);
              }
            } else {
              return <div></div>;
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

  renderModalForm(shouldRender) {
    if (!shouldRender) {
      return <></>;
    }

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          this.closeModal();

          fetch('/lockersapi/reset/init', {
            method: 'post',
            mode: 'same-origin',
            headers: {
              'Authorization': API_KEY,
              'Content-Type': 'application/json',
            },
            body: {
              requesterEmail: this.state.resetRequesterEmail,
            },
          })
            .then(res => {
              if (res.status === 200) {
                toast('Reset initiated', {
                  hideProgressBar: true,
                  autoClose: 3000,
                  className: 'toast-container',
                });
              } else {
                return res.text().then(text => {
                  toast(text, {
                    hideProgressBar: true,
                    autoClose: 3000,
                    className: 'toast-container',
                  });
                });
              }
            });
        }}
        style={{marginTop: 15}}
        id='resetForm'
      >
        <div className='form-group'>
          <input
            type='email'
            name='resetRequesterEmail'
            id='resetRequesterEmail'
            placeholder='Email'
            className='form-control'
            value={this.state.resetRequesterEmail}
            onChange={this.handleChange}
          />
        </div>
      </form>
    );
  }

  render() {
    return (
      <div>
        <div className='container'>
          <div className='jumbotron'>
            <h4 className='display-4'>Administration</h4>
            <p>
              This page is intended to serve as a basic interface for viewing the status
              of the lockers DB. If you need to perform more advanced actions, please
              contact the lockers maintainer.
            </p>
          </div>

          <div className='jumbotron'>
            <h2>Actions</h2>
            <p>
              <b>WARNING</b>: Some of these actions have irreversible effects! If you do
              not understand what they mean or what they will do, please contact the
              maintainer before running them!
            </p>
            <button type='button'
              className='btn btn-primary action-button'
            >
              Delete the production database
            </button>
            <button
              type='button'
              className='btn btn-primary action-button'
              onClick={() => {this.openModal({
                title: 'WARNING!!!',
                body: (
                  <>
                    Are you sure you want to run the semester reset?
                    This will set all closed lockers to pending and send an email
                    to the owners of the affected lockers

                    <div style={{marginTop: 30}}>
                      Please enter your email. A status update will be sent here once the
                      reset process is finished.
                    </div>
                  </>
                ),
                confirmation: 'Yes, I\'m sure I want to run the reset.',
                form: true,
              })}}
            >
              Run semester reset script
            </button>
            <button
              type='button'
              className='btn btn-primary action-button'
              onClick={() => {
                window.open('https://app.contentful.com/spaces/ixvlauwykl2e/home', '_blank');
              }}
            >
              Edit email contents
            </button>
          </div>
          <h5 className='display-5'>All Lockers</h5>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className='form-group'>
              <div className='form-row'>
                <div className='form-group col-md-4'>
                  <input
                    type='text'
                    name='searchNameString'
                    id='searchNameString'
                    placeholder='Search by name, email, or status'
                    className='form-control'
                    value={this.state.searchNameString}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>
          </form>

          <ToastContainer/>
          <div style={{marginBottom: '50px'}}>
            {this.assembleTable(this.state.all)}
          </div>
        </div>

        <Modal show={this.state.show} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.modalContent.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.modalContent.body}
            {this.renderModalForm(this.state.modalContent.form)}
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-primary' onClick={this.closeModal}>
              Close
            </button>
            <button
              className="btn btn-primary"
              type='submit'
              form='resetForm'
            >
              {this.state.modalContent.confirmation}
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Admin;
