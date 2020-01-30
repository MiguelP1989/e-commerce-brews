export const calculatePrice = items => {
  return `£${items
    .reduce((acc, item) => acc + item.quantity * item.price, 0)
    .toFixed(2)}`;
};

const CART_KEY = "cart";

export const setCart = (value, cartKey = CART_KEY) => {
  if (localStorage) {
    localStorage.setItem(cartKey, JSON.stringify(value));
  }
};

export const getCart = (cartKey = CART_KEY) => {
  if (localStorage && localStorage.getItem(cartKey)) {
    return JSON.parse(localStorage.getItem(cartKey));
  }
  return [];
};

///       /////////      ///////////

const TOKEN_KEY = "token";

export const setToken = (value, tokenkey = TOKEN_KEY) => {
  if (localStorage) {
    localStorage.setItem(tokenkey, JSON.stringify(value));
  }
};

export const getToken = (tokenkey = TOKEN_KEY) => {
  if (localStorage && localStorage.getItem(tokenkey)) {
    return JSON.parse(localStorage.getItem(tokenkey));
  }
  return null;
};
