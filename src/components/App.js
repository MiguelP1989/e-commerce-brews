import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Box,
  Heading,
  Card,
  Image,
  Text,
  SearchField
} from "gestalt";
import "./App.css";

// requestes for all the data
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: [],
    serachTerm: ""
  };

  async componentDidMount() {
    try {
      const response = await strapi.request("POST", "/graphql", {
        data: {
          query: `query {
                    brands {
                        _id
                        name
                        description
                        image {
                            url
                        }
                    }
                }`
        }
      });
      console.log(response);

      this.setState({ brands: response.data.brands });
    } catch (err) {
      console.log(err);
    }

    // handleChange(e) {
    //     console.log(e);
    // }
  }
  render() {
    return (
      <Container>
        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField
            id="serachfield"
            accessibilityLabels="Brands search Field"
            placeholder="serach Brands"
          />
        </Box>
        <Box display="flex" justifyContent="center" marginBottom={2}>
          <Heading color="midnight" size="md">
            Brew Brands
          </Heading>
        </Box>
        <Box wrap display="flex" justifyContent="around">
          {this.state.brands.map(brand => {
            return (
              <Box margin={3} height={350} width={200} key={brand._id}>
                <Card
                  image={
                    <Box height={200} width={200}>
                      <Image
                        fit="cover"
                        alt="Brand"
                        naturalHeight={1}
                        naturalWidth={1}
                        src={`${apiUrl}${brand.image.url}`}
                      />
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                      >
                        <Text bold size="xl">
                          {brand.name}
                        </Text>
                        <Text>{brand.description}</Text>
                        <Link sixe="xl" to={`/${brand._id}`}>
                          See Brews
                        </Link>
                      </Box>
                    </Box>
                  }
                />
              </Box>
            );
          })}
        </Box>
      </Container>
    );
  }
}

export default App;
