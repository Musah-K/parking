import { gql } from "@apollo/client";

 export const Authenticate = gql`
 query GetAuthenticatedUser{
    authUser {
        _id
        admin
        role
        name
        phone
        vehicle
  }
 }
`