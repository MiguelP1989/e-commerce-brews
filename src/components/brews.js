import React from "react";
import { Link } from "react-router-dom";

import {
  Box,
  Heading,
  Card,
  Image,
  Text,
  Button,
  Mask,
  IconButton
} from "gestalt";
import Loader from "./loader";
import { calculatePrice, setCart, getCart } from "../utils";

import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
console.log(apiUrl);
const strapi = new Strapi(apiUrl);

class Brews extends React.Component {
  state = {
    brews: [],
    brand: "",
    cartItems: [],
    loadingBrews: true
  };
  async componentDidMount() {
    let brandId = this.props.match.params.brandid;

    try {
      const response = await strapi.request("POST", "/graphql", {
        data: {
          query: `query {
              brand (id: "${brandId}") {
                  _id
                  name
                  brews {
                      _id
                      name
                      description
                      image{
                          url
                      }
                      price
                  }
              }
          } `
        }
      });
      console.log(response);
      this.setState({
        brews: response.data.brand.brews,
        brand: response.data.brand.name,
        loadingBrews: false,
        cartItems: getCart()
      });
    } catch (err) {
      console.log(err);
      this.setState({ loadingBrews: false });
    }
  }

  addToCart = brew => {
    console.log(localStorage);
    const alreadyInCart = this.state.cartItems.findIndex(
      item => item._id === brew._id
    );

    if (alreadyInCart === -1) {
      const updatedItems = this.state.cartItems.concat({
        ...brew,
        quantity: 1
      });
      this.setState(
        {
          cartItems: updatedItems
        },
        () => setCart(updatedItems)
      );
    } else {
      const updatedItems = [...this.state.cartItems];
      updatedItems[alreadyInCart].quantity += 1;
      this.setState(
        {
          cartItems: updatedItems
        },
        () => setCart(updatedItems)
      );
    }
  };

  deleteItemFromCart = itemToBeDeletedId => {
    const filteredItems = this.state.cartItems.filter(
      item => item._id !== itemToBeDeletedId
    );

    this.setState(
      {
        cartItems: filteredItems
      },
      () => setCart(filteredItems)
    );
  };

  render() {
    const { brand, brews, cartItems, loadingBrews } = this.state;
    return (
      <Box
        marginTop={4}
        display="flex"
        alignItems="start"
        justifyContent="center"
        wrap
      >
        <Box display="flex" direction="column" alignItems="center">
          <Box margin={2}>
            <Heading color="orchid">{brand}</Heading>
            <Box
              shape="rouded"
              display="flex"
              justifyContent="center"
              padding={4}
              wrap
            >
              {brews.map(brew => {
                return (
                  <Box margin={3} height={420} width={200} key={brew._id}>
                    <Card
                      margin={4}
                      image={
                        <Box height={200} width={200}>
                          <Image
                            fit="cover"
                            alt="Brand"
                            naturalHeight={1}
                            naturalWidth={1}
                            src={`${apiUrl}${brew.image.url}`}
                          />
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            direction="column"
                          >
                            <Box marginTop={2}>
                              <Text bold size="xl">
                                {brew.name}
                              </Text>
                            </Box>
                            <Box marginTop={1}>
                              <Text>{brew.description}</Text>
                            </Box>
                            <Text color="orchid">{brew.price}£</Text>
                            <Box marginTop={2}>
                              <Text bold size="xl">
                                <Button
                                  onClick={() => this.addToCart(brew)}
                                  color="blue"
                                  text="Add to cart"
                                />
                              </Text>
                            </Box>
                          </Box>
                        </Box>
                      }
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
          {loadingBrews && <Loader />}
        </Box>
        <Box marginTop={2} marginLeft={8}>
          <Mask shape="rounded" wash>
            <Box
              display="flex"
              direction="column"
              alignItems="center"
              padding={2}
            >
              <Heading align="center" size="md">
                Your Cart
              </Heading>
              <Text color="gray" italic>
                {cartItems.length} itemns selected
              </Text>
              {cartItems.map(item => (
                <Box key={item._id} display="flex" alignItems="center">
                  <Text>
                    {item.name} * {item.quantity} - £
                    {(item.quantity * item.price).toFixed(2)}
                  </Text>
                  <IconButton
                    accessibilityLabel="Delete Item"
                    icon="cancel"
                    size="sm"
                    iconColor="red"
                    onClick={() => this.deleteItemFromCart(item._id)}
                  />
                </Box>
              ))}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                direction="column"
              >
                <Box margin={2}>
                  {cartItems.length === 0 && (
                    <Text color="red">Please select some items</Text>
                  )}
                </Box>
                <Text size="lg">Total: ${calculatePrice(cartItems)}</Text>
                <Text>
                  <Link to="/checkout">Check Out</Link>
                </Text>
              </Box>
            </Box>
          </Mask>
        </Box>
      </Box>
    );
  }
}

export default Brews;
