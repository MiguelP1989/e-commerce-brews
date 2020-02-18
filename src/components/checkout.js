import React from "react";
import ConfirmationModal from "./modal";

import {
  Elements,
  StripeProvider,
  CardElement,
  injectStripe
} from "react-stripe-elements";

import { Container, Box, Heading, Text, TextField } from "gestalt";
import ToastMessage from "./toastmessage";
import { getCart, calculatePrice, clearCart, calculateAmount } from "../utils";
import { withRouter } from "react-router-dom";

import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);
console.log("straaaapi", strapi);

class _CheckOutForm extends React.Component {
  state = {
    cartItems: [],
    address: "",
    postalCode: "",
    city: "",
    confirmationEmailAddress: "",
    toast: false,
    toastMessage: "",
    orderProcessing: false,
    modal: false,
    card: ""
  };

  componentDidMount() {
    console.log("mounting");
    this.setState({ cartItems: getCart() }, () =>
      console.log(this.state.cartItems)
    );
  }

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: event.target.value });
  };

  handleConfirmOrder = async event => {
    console.log("hiiiiiiii");
    event.preventDefault();

    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill all the field");
      return;
    }
    this.setState({ modal: true });
  };

  handleSubmitOrder = async () => {
    const { cartItems, city, address, postalCode } = this.state;
    const amount = calculateAmount(cartItems);
    console.log(amount);
    // process orders
    this.setState({
      orderProcessing: true
    });
    let token;
    try {
      // createnstripe token
      const response = await this.props.stripe.createToken();
      console.log(response);
      token = response.token.id;
      console.log("tokeen", token);
      const payment = await strapi.createEntry("orders", {
        amount,
        brews: cartItems,
        city,
        postalCode,
        address,
        token
      });
      console.log("responseeeee at payment", payment);
      //set orderProcessing -false, set modal-false
      this.setState({ orderProcessing: false, modal: false });
      // clear user cart of Brews
      clearCart();
      // show success toast
      this.showToast("Your order as benn successfully submited!", true);
    } catch (err) {
      // set order processing - false, modal-false
      this.setState({ orderProcessing: false, modal: false });
      //  show error toast
      console.log("Rrrrrrr", err);
      this.showToast(err.message);
    }
  };

  isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
    return !address || !postalCode || !city || !confirmationEmailAddress;
  };

  showToast = (toastMessage, redirect = false) => {
    this.setState({ toast: true, toastMessage });
    setTimeout(
      () =>
        this.setState(
          { toast: false, toastMessage: "" },
          // if TRUE PASSED TO 'REDIRECT ARGUMENT, REDIRECT HOME'
          () => redirect && this.props.history.push("/")
        ),
      5000
    );
  };

  closeModal = () => this.setState({ modal: false });

  render() {
    const {
      toast,
      toastMessage,
      cartItems,
      modal,
      orderProcessing
    } = this.state;
    return (
      <Container>
        <Box
          color="darkWash"
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Heading color="midnight">Checkout</Heading>
          {cartItems.length > 0 ? (
            <React.Fragment>
              <Box
                marginTop={2}
                marginBottom={6}
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"
              >
                <Text color="darkGray">
                  {cartItems.length} items for checkout
                </Text>
                <Box padding={2}>
                  {cartItems.map(item => {
                    return (
                      <Box key={item._id} padding={1}>
                        <Text color="blue">
                          {item.name} x {item.quantity} - £
                          {item.quantity * item.price}
                        </Text>
                      </Box>
                    );
                  })}
                </Box>
                <Text bold>Total Amount: {calculatePrice(cartItems)}</Text>
              </Box>
              <form
                style={{
                  display: "inlineBlock",
                  textAlign: "center",
                  maxWidth: 450
                }}
                onSubmit={this.handleConfirmOrder}
              >
                <TextField
                  id="address"
                  type="text"
                  name="address"
                  placeholder="Shipping Address"
                  onChange={this.handleChange}
                />
                <TextField
                  id="postalCode"
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  onChange={this.handleChange}
                />
                <TextField
                  id="city"
                  type="text"
                  name="city"
                  placeholder="city of Residence"
                  onChange={this.handleChange}
                />
                <TextField
                  id="confirmationEmailAddress"
                  type="email"
                  name="confirmationEmailAddress"
                  placeholder="Confirmation Email Address"
                  onChange={this.handleChange}
                />
                <CardElement
                  id="stripe__input"
                  onReady={input => input.focus()}
                />
                <button id="stripe__button" type="submit">
                  Submit
                </button>
              </form>
            </React.Fragment>
          ) : (
            <Box color="darkWash" shape="rounded" padding={4}>
              <Heading slign="center" color="watermelon" size="xs">
                Your cart is empty
              </Heading>
              <Text align="center" color="green">
                Add some brews!
              </Text>
            </Box>
          )}
        </Box>
        {modal && (
          <ConfirmationModal
            orderProcessing={orderProcessing}
            cartItems={cartItems}
            closeModal={this.closeModal}
            handleSubmitOrder={this.handleSubmitOrder}
          />
        )}
        <ToastMessage show={toast} message={toastMessage} />
      </Container>
    );
  }
}

const CheckOutForm = withRouter(injectStripe(_CheckOutForm));

const CheckOut = () => {
  return (
    <StripeProvider apiKey="pk_test_xI6XdrHfHYQro9LXrg9QSUbo00u3TPEo71">
      <Elements>
        <CheckOutForm />
      </Elements>
    </StripeProvider>
  );
};

export default CheckOut;
