import React from "react";
import { Toast, Box } from "gestalt";

const ToastMessage = ({ show, message }) => {
  console.log(this.props);
  return (
    show && (
      <Box display="flex" justifyContent="center">
        <Toast color="orange" text={message} />
      </Box>
    )
  );
};

export default ToastMessage;
