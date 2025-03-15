import { gql } from "@apollo/client";

export const AvailableSlots = gql`
 query GetavailableSlots($availabe: Boolean!){
    availableSlots(available: $available) {
        _id
        slotNumber
        isAvailable
  }
 }
`
export const UserSlots = gql`
 query slots{
    userSlots{
      _id
      slotNumber
      validFrom
      validTill
      paymentId
    }
 }   
`
