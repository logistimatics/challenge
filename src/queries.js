import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export const USER = gql`
  query User {
    me {
      id
      name
      email
    }
  }
`;

export const withUser = graphql(USER);

export const DEVICE_LOCATIONS = gql`
  query PositionsByDateRange($upper: Datetime!, $lower: Datetime!) {
    positionsByDateRange(upper: $upper, lower: $lower) {
      nodes {
        deviceId
        id
        latitude
        longitude
        positionAt
        address
        deviceByDeviceId {
          name
          batteryPercentage
          userId
        }
      }
    }
  }
`;
