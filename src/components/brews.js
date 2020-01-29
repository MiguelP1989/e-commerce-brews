import React from "react";

import {
  Container,
  Box,
  Heading,
  Card,
  Image,
  Text,
  SearchField,
  Icon,
  Spinner,
  Button
} from "gestalt";

import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
console.log(apiUrl);
const strapi = new Strapi(apiUrl);

class Brews extends React.Component {
  state = {
    brews: [],
    brand: ""
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
        brand: response.data.brand.name
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { brand, brews } = this.state;
    return (
      <Box
        marginTop={4}
        display="flex"
        alignItems="start"
        justifyContent="center"
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
                  <Box margin={3} height={350} width={200} key={brew._id}>
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
                                <Button color="blue" text="Add to cart" />
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
        </Box>
      </Box>
    );
  }
}

export default Brews;
