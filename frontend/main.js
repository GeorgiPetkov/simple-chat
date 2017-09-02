import React from 'react';
import ReactDOM from 'react-dom';
import { PageHeader } from 'react-bootstrap';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { createStore, dispatch } from 'redux';
import { Provider, connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import HomePage from './HomePage.js';

import { login, register, logout, getLoggedUser } from './proxy';

function reducer(state = {}, action) {
  if (action.type === 'ADD_USER') {
    return {
      ...state,
      user: action.user
    };
  }

  return state;
}

const store = createStore(reducer);

function addUser(user) {
  store.dispatch({
    type: 'ADD_USER',
    user
  });
}

function ensureProvidedUsernameAndPassword(username, password) {
  return new Promise(resolve => {
    if (username === '') {
      toast.error('Username is required.');

      return;
    }

    if (password === '') {
      toast.error('Password is required.');

      return;
    }

    resolve();
  });
}

function ensureNoPasswordsMismatch(password, confirmPassword) {
  return new Promise(resolve => {
    if (password !== confirmPassword) {
      toast.error('Passwords mismatch!');

      return;
    }

    resolve();
  });
}

function handleLogin({ username, password }) {
  ensureProvidedUsernameAndPassword(username, password)
    .then(() => login(username, password))
    .then(() => toast.success('Login succeeded.'))
    .then(() => getLoggedUser())
    .then(user => addUser(user))
    .catch(() => toast.error('Login failed.'));
}

function handleRegister({ username, password, confirmPassword }) {
  ensureProvidedUsernameAndPassword(username, password)
    .then(() => ensureNoPasswordsMismatch(password, confirmPassword))
    .then(() => register(username, password))
    .then(() => toast.success('Registration succeeded.'))
    .then(() => getLoggedUser())
    .then(user => addUser(user))
    .catch(() => toast.error('Registration failed.'));
}

function handleLogout() {
  logout()
    .then(() => toast.success('Logout succeeded.'))
    .then(user => addUser(undefined))
    .catch(() => toast.error('Logout failed.'));
}

getLoggedUser()
  .then(user => {
    ReactDOM.render(<ToastContainer />, document.getElementById('toasts'));
    addUser(user);

    const Home = connect(
      state => ({
        user: state.user,
        onLogin: handleLogin,
        onRegister: handleRegister
      }))(HomePage);
    const Chat = () => <div>Chat TODO</div>;
    const Admin = () => <div>Admin TODO</div>;


    const appPlaceholder = document.getElementById('root');
    ReactDOM.render(
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <PageHeader>Simple Chat</PageHeader>
            <main>
              <Switch>
                <Route path="/home" exact component={Home} />
                <Route path="/chat" exact component={Chat} />
                <Route path="/admin" exact component={Admin} />
                <Redirect to="/home" />
              </Switch>
            </main>
          </div>
        </BrowserRouter>
      </Provider>,
      appPlaceholder);
  });
