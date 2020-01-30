import React from "react";
import { Link } from "react-router-dom";

import { Container, Box, Heading, Text, Button, TextField } from "gestalt";
import ToastMessage from "./toastmessage";

class SignIn extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    toast: false,
    toastMessage: "",
    loading: false
  };

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();

    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill all the fields");
      return;
    }
    console.log("submit");

    //Sign up user
    try {
      this.setState({});
      // set loading = true
      //make request to register user with Strapi
      //set loading to false
      //put token(to manage user session) in local localStorage
      //redirect users to home page
    } catch (err) {
      //set loading
      //show erros message
    }
  };

  isFormEmpty = ({ username, email, password }) => {
    return !username || !email || !password;
  };

  showToast = toastMessage => {
    this.setState({ toast: true, toastMessage });
    setTimeout(() => this.setState({ toast: false, toastMessage: "" }), 5000);
  };

  render() {
    const { toastMessage, toast } = this.state;
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
              <Heading color="midnight">Let's get started</Heading>
              <Text italic color="orchid">
                Sign up to order some brews!
              </Text>
            </Box>
            <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
            />
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={this.handleChange}
            />
            <TextField
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
            />

            <Button color="blue" text="submit" type="submit" />
          </form>
        </Box>
        <ToastMessage show={toast} message={toastMessage} />
      </Container>
    );
  }
}

export default SignIn;
