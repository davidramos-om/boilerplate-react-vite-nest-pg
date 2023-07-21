import { gql } from '@apollo/client';


export const FORGOT_PASSWORD = gql`
mutation ($input : ResetPasswordRequestInput!)
{
  sent : forgotPassword(input : $input)
}
`

export const RESET_PASSWORD = gql`
mutation ($input : ResetPasswordConfirmInput!)
{
  success : resetPassword(input : $input)
}
`