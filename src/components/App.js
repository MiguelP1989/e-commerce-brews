import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Box,
  Heading,
  Card,
  Image,
  Text,
  SearchField,
  Icon
} from "gestalt";
import "./App.css";
import Loader from "./loader";

// requestes for all the data
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: [],
    searchTerm: "",
    loadingBrand: true
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

      this.setState({ brands: response.data.brands, loadingBrand: false });
    } catch (err) {
      console.log(err);
      this.setState({ loadingBrand: false });
    }
  }

  handleChange = e => {
    console.log(e.value);
    this.setState({
      searchTerm: e.value
    });
  };

  render() {
    const { brands, searchTerm, loadingBrand } = this.state;
    return (
      <Container>
        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField
            id="serachfield"
            accessibilityLabel="Brands search Field"
            value={searchTerm}
            onChange={this.handleChange}
            placeholder="serach Brands"
          />
          <Box margin={2}>
            <Icon
              accessibilityLabel="filter"
              icon="filter"
              color={searchTerm ? "orange" : "gray"}
              size={20}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" marginBottom={2} size={20}>
          <Heading color="midnight" size="md">
            Brew Brands
          </Heading>
        </Box>

        <Box wrap display="flex" justifyContent="around">
          {brands.map(brand => {
            return (
              <Box margin={3} height={350} width={200} key={brand._id}>
                <Card
                  margin={4}
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
        {loadingBrand && <Loader />}
      </Container>
    );
  }
}

export default App;
