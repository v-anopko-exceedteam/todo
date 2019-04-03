import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import TodoDataService from './../../services/TodoDataService.js';
import './SignIn.css';

export default class SignIn extends Component {
  constructor() {
    super();

    this.state = {
      userId: '',
      signInStatus: {
        showMessage: false,
        success: false,
        signInDescription: '',
      },
    };

    this.todoService = new TodoDataService();

    this.userLoginInput    = React.createRef();
    this.userPasswordInput = React.createRef();

    this.onSignIn = (evt) => {
      evt.preventDefault();

      const user = {
        login: this.userLoginInput.current.value,
        secret: this.userPasswordInput.current.value,
      };

      this.todoService.signIn(user)
                      .then(({userId, ...signInStatus}) => {
                        this.setState({
                          userId,
                          signInStatus,
                        });

                        if (userId) {
                          this.props.enterInTodo(userId);
                        }
                      });
    };
  }

  render() {
    const {signInStatus: {showMessage, success, signInDescription}} = this.state,
          {authorized} = this.props,
          statusMessageStyle = success ? 'siteForm__message--success' : 'siteForm__message--error',
          statusMessage = showMessage ? <span className={`siteForm__message ${statusMessageStyle}`}>{signInDescription}</span> : null;

    if (authorized) {
      return(
        <Redirect to="/" />
      );
    }

    return(
      <form className="signInForm siteForm" onSubmit={this.onSignIn} >
        <div className="siteForm__title">
          <h2>Sign In</h2>
        </div>

        <div className="formFieldsWrapper signInForm__fieldsWrapper">
          <input ref={this.userLoginInput} type="text" name="userLogin" placeholder="Login" className="form-control formFieldsWrapper__field" required />
          <input ref={this.userPasswordInput} type="password" name="userPassword" placeholder="Password" className="form-control formFieldsWrapper__field" required />
          {statusMessage}
          <input type="submit" className="btn btn-info formFieldsWrapper__btn" value="Sign In" />
        </div>

        <div className="askBlockForForm">
          <div className="askBlockForForm__ask">
            <span>New to ToDo?</span>
          </div>

          <Link to="/registration/" className="btn btn-outline-secondary askBlockForForm__btn" >Create your ToDo account</Link>
        </div>
      </form>
    );
  }
};
