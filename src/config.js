import ApolloClient from 'apollo-boost';

export const SERVER = 'http://localhost:5002';
export let TOKEN = null;

export const client = new ApolloClient({
  uri: `${SERVER}/graphql`,
  request: async (operation) => {
    if (TOKEN) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${TOKEN}`,
        },
      });
    }
  },
  onError: ({ graphQLErrors, networkError, response, operation }) => {
    if (networkError && (networkError.statusCode >= 401 && networkError.statusCode <= 403)) {
      setToken(null);
      window.location = '/';
    }
  },
});

export function getToken() {
  return TOKEN;
}

export function setToken(token) {
  TOKEN = token;

  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }

  return token;
}

setToken(localStorage.getItem('token'));
