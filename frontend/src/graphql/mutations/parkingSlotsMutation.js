import { gql } from "@apollo/client"

export const UpdateExpired = gql`
    mutation updateExpired{
        removeExpiredSlots{
            acknowledged
            matchedCount
            modifiedCount
        }
    }
`


