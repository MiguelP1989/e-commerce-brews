import React from "react";
import { GridLoader } from "react-spinners";
import { Box } from "gestalt";

const Loader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height={400}>
    <GridLoader color="darkorange" size={15} margin="3px" />;
  </Box>
);
export default Loader;
