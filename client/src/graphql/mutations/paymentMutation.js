import { gql } from "@apollo/client";

 export const ReserveSpace = gql`
    mutation ReserveSlot($input: CreatePaymentInput!){
        createPayment(input: $input){
             _id
             receipt
             status
             transactionId
             amount
        }
}
`
