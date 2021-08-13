import React, { Component } from 'react';
import {
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';
import LoaderButton from './LoaderButton';
import Error from './Error';
import { SERVER } from '../config';
class Login extends Component {
  state = {
    isLoading: false,
    username: '',
    password: '',
    error: null,
  };

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  login(username, password) {
    return fetch(`${SERVER}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: username,
        password,
      }),
    }).then(response => response.ok ? response.json() : response.json().then(json => Promise.reject(json)));
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({ isLoading: true });
    this.login(this.state.username, this.state.password)
      .then(({ token }) => this.props.handleLogin(token, '/devices'))
      .catch(error => this.setState({ isLoading: false, error }));
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup>
          <Label>Email</Label>
          <Input
            autoFocus
            id="username"
            type="email"
            value={this.state.username}
            onChange={this.handleChange} />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input
            id="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange} />
        </FormGroup>
        <Error
          error={this.state.error}
          onDismiss={() => this.setState({ error: null })} />
        <LoaderButton
          block
          color="primary"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Login"
          loadingText="Logging in…" />
      </Form>
    );
  }
}

export default Login;
