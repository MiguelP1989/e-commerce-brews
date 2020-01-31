import React from "react";

import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  TextField,
  Modal,
  Spinner
} from "gestalt";
import ToastMessage from "./toastmessage";
import { getCart, calculatePrice } from "../utils";

class CheckOut extends React.Component {
  state = {
    cartItems: [],
    address: "",
    postalCode: "",
    city: "",
    confirmationEmailAddress: "",
    toast: false,
    toastMessage: "",
    orderProcessing: false,
    modal: false
  };

  componentDidMount() {
    console.log("mounting");
    this.setState({ cartItems: getCart() });
    console.log(this.state.cartItems);
  }

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleConfirmOrder = async event => {
    event.preventDefault();

    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill all the field");
      return;
    }
    this.setState({ modal: true });
  };

  handleSubmitOrder = () => {};

  isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
    return !address || !postalCode || !city || !confirmationEmailAddress;
  };

  showToast = toastMessage => {
    this.setState({ toast: true, toastMessage });
    setTimeout(() => this.setState({ toast: false, toastMessage: "" }), 5000);
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
                  type="number"
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

                <button id="stripe_button" type="submit">
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

const ConfirmationModal = ({
  orderProcessing,
  cartItems,
  closeModal,
  handleSubmitOrder
}) => (
  <Modal
    accessibilityCloseLavel="close"
    accessibilityModalLavel="Confirm your order"
    heading="Confirm your order"
    onDismiss={closeModal}
    footer={
      <Box
        display="flex"
        marginRight={-1}
        marginLeft={-1}
        justifyContent="center"
      >
        <Box padding={1}>
          <Button
            size="lg"
            color="red"
            text="submit"
            disable={orderProcessing}
            onClick={handleSubmitOrder}
          />
        </Box>
        <Box padding={1}>
          <Button
            size="lg"
            color="red"
            text="cancel"
            disable={orderProcessing}
            onClick={closeModal}
          />
        </Box>
      </Box>
    }
    role="alerdialog"
    size="sm"
  >
    {!orderProcessing && (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        direction="column"
        padding={1}
        color="lightWash"
      >
        {cartItems.map(item => {
          return (
            <Box key={item._id} padding={1}>
              <Text size="lg" color="red">
                {item.name} x {item.quantity} - £{item.quantity * item.price}
              </Text>
            </Box>
          );
        })}
        <Box padding={2}>
          <Text size="lg" bold>
            Total : {calculatePrice(cartItems)}
          </Text>
        </Box>
      </Box>
    )}
    <Spinner
      show={orderProcessing}
      accessibilityLavel="order Processing Spinner"
    />
    {orderProcessing && (
      <Text align="center" italic>
        {" "}
        Submiting item...
      </Text>
    )}
  </Modal>
);

export default CheckOut;
