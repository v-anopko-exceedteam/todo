import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import TodoDataService from './../../services/TodoDataService.js';
import './Registration.css';

export default class Registration extends Component {
  constructor() {
    super();

    this.state = {
      registrationStatus: {
        showMessage: false,
        success: false,
        registrationDescription: '',
      },
    };

    this.todoService = new TodoDataService();

    this.userNameInput     = React.createRef();
    this.userLoginInput    = React.createRef();
    this.userPasswordInput = React.createRef();

    this.onRegistration = (evt) => {
      evt.preventDefault();

      const userInfo = {
              name: this.userNameInput.current.value,
              login: this.userLoginInput.current.value,
              secret: this.userPasswordInput.current.value,
            };

      this.todoService.registration(userInfo)
                      .then((res) => this.setState({registrationStatus: res}));
    };
  }

  render() {
    const {registrationStatus: {showMessage, registrationDescription, success}} = this.state,
          statusMessageStyle = success ? 'siteForm__message--success' : 'siteForm__message--error',
          statusMessage = showMessage ? <span className={`siteForm__message ${statusMessageStyle}`}>{registrationDescription}</span> : null;

    return(
      <form className="registrationForm siteForm" onSubmit={this.onRegistration} >
        <div className="siteForm__title">
          <h2>Create account</h2>
        </div>

        <div className="formFieldsWrapper registrationForm__fieldsWrapper">
          <input ref={this.userNameInput} type="text" name="userName" placeholder="Your name" className="form-control formFieldsWrapper__field" required />
          <input ref={this.userLoginInput} type="text" name="userLogin" placeholder="Login" className="form-control formFieldsWrapper__field" required />
          <input ref={this.userPasswordInput} type="password" name="userPassword" placeholder="Password" className="form-control formFieldsWrapper__field" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\\w\\s]).{6,}" required />
          {statusMessage}
          <input type="submit" className="btn btn-info formFieldsWrapper__btn" value="Create your ToDo account" />
        </div>

        <div className="askBlockForForm">
          <div className="askBlockForForm__ask">
            <span>Already have an account?</span>
          </div>

          <Link to="/sign_in/" className="btn btn-outline-secondary askBlockForForm__btn">Sign In</Link>
        </div>
      </form>
    );
  }
};
