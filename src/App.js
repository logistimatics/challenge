import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Routes from './Routes';
import { withApollo } from 'react-apollo';
import { withUser } from './queries';
import get from 'lodash.get';
import Navbar from './components/Navbar';
import { getToken, setToken } from './config';
import './App.css';

class App extends Component {
  updateUserToken = (userToken, redirect) => {
    setToken(userToken);

    if (!userToken) {
      window.location = '/login';
    } else {
      window.location = redirect || '/';
    }
  }

  handleLogin = (token, redirect) => {
    this.updateUserToken(token, redirect);
  }

  handleLogout = (event) => {
    this.updateUserToken(null);
  }

  render() {
    const childProps = {
      userToken: getToken(),
      updateUserToken: this.updateUserToken,
      handleLogin: this.handleLogin,
    };

    return (
      <div style={{ padding: 0, margin: 0 }} className="App">
        <Navbar
          me={get(this.props, ['data', 'me'])}
          handleLogout={this.handleLogout}
          history={this.props.history} />
        <Routes childProps={childProps} />
      </div>
    );
  }

}

export default withApollo(withRouter(withUser(App)));
