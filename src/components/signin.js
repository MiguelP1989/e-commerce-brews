import React from "react";

import { Container, Box, Heading, Button, TextField } from "gestalt";

import ToastMessage from "./toastmessage";
import { setToken } from "../utils";

import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
console.log(apiUrl);
const strapi = new Strapi(apiUrl);

class SignIn extends React.Component {
  state = {
    username: "",
    password: "",
    toast: false,
    toastMessage: "",
    loading: false
  };

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { username, password } = this.state;

    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill all the field");
      return;
    }
    // console.log("submit");

    //Sign up user
    try {
      this.setState({ loading: true });
      const response = await strapi.login(username, password);
      this.setState({ loading: false });
      setToken(response.jwt);
      console.log("response", response);
      this.redirectUser("/");
    } catch (err) {
      this.setState({ loading: false });
      this.showToast(err.message);
    }
  };

  redirectUser = path => {
    // console.log(this.props);
    this.props.history.push(path);
  };

  isFormEmpty = ({ username, password }) => {
    return !username || !password;
  };

  showToast = toastMessage => {
    this.setState({ toast: true, toastMessage });
    setTimeout(() => this.setState({ toast: false, toastMessage: "" }), 5000);
  };

  render() {
    const { toastMessage, toast, loading } = this.state;
    return (
      <Container>
        <Box
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
        >
          <form
            style={{
              display: "inlineBlock",
              textAlign: "center",
              maxWidth: 450
            }}
            onSubmit={this.handleSubmit}
          >
            <Box
              marginBottom={2}
              display="flex"
              direction="column"
              alignItems="center"
            >
              <Heading color="midnight">Welcome back!</Heading>
            </Box>
            <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
            />

            <TextField
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
            />

            <Button
              disable={loading}
              color="blue"
              text="submit"
              type="submit"
            />
          </form>
        </Box>
        <ToastMessage show={toast} message={toastMessage} />
      </Container>
    );
  }
}

export default SignIn;
