import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Todo from './../Todo';
import SignIn from './../SignIn';
import Registration from './../Registration';
import TodoDataService from './../../services/TodoDataService';
import Loader from './../Loader';
import './App.css';

export default class App extends Component {
  constructor() {
    super();

    this.todoService = new TodoDataService();

    this.state = {
      authorized: false,
      userId: '',
      loader: false
    };

    this.enterInTodo = (userId) => {
      this.setState({
        userId,
        authorized: true,
      });
    };

    this.logOut = () => {
      this.todoService.removeToken();

      this.setState({
        userId: '',
        authorized: false,
      });
    };
  }

  componentDidMount() {
    this.todoService.checkToken()
                    .then((userId) => {
                      if (userId) this.enterInTodo(userId);
                    });
  }

  render() {
    const {loader, authorized, userId} = this.state;

    if (loader) {
      return(<Loader />);
    }

    return(
      <Router>
        <Route path="/" render={() => <Todo authorized={authorized} userId={userId} onLogOut={this.logOut} />} exact />

        <Route path="/registration" component={Registration} />

        <Route path="/sign_in" render={() => <SignIn authorized={authorized} enterInTodo={this.enterInTodo} />} />
      </Router>
    );
  }
}
