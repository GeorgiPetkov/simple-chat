import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap-tabs';
import Form from './Form';
import styles from './HomePage.css';

const loginFields = { username: { label: 'Username', type: 'text' }, password: { label: 'Password', type: 'password' } };
const registerFields = { username: { label: 'Username', type: 'text' }, password: { label: 'Password', type: 'password' }, confirmPassword: { label: 'Confirm Password', type: 'password' } };

export default class HomePage extends Component {
  render() {
    const user = this.props.user;
    if (user !== undefined) {
      return <Redirect to={user.role === 'admin' ? '/admin' : '/chat'} />;
    }

    return (
      <div className={styles.homePage}>
        <Tabs>
          <Tab label="Home">
            <p>TODO: Description</p>
          </Tab>
          <Tab label="Login">
            <Form submitButtonText="Login" fields={loginFields} onSubmit={this.props.onLogin} />
          </Tab>
          <Tab label="Register">
            <Form submitButtonText="Register" fields={registerFields} onSubmit={this.props.onRegister} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}
import PropTypes from 'prop-types';
HomePage.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired
};
