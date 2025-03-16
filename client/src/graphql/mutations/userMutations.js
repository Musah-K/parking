import { gql } from "@apollo/client";

export const LoginMutation = gql`
    mutation Login($input:loginUserInput!){
        loginUser(input: $input){
            _id
            name
            phone
            role
            vehicle
        }
    }
`

export const RegisterMutation = gql`
    mutation register($input: createUserInput!) {
  createUser(input: $input) {
    _id
    admin
    name
    phone
    role
    vehicle
  }
}
`

export const LOGOUT=  gql`
  mutation Logout{
    logout{
      message
    }
  }
`