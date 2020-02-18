import React from "react";

import { Container, Box, Text, Button, Modal, Spinner } from "gestalt";

import { calculatePrice } from "../utils";

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

export default ConfirmationModal;
