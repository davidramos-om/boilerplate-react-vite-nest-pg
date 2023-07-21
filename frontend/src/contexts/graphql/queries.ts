import { gql } from '@apollo/client';

export const SESSION_FIELDS = `
session
{
  userId
  tenantId
  tenantLogo
  tenantSlug
  email
  screenName
  picture
  userType
  accessToken
  exp
}
permissions
{
  menu
  actions
}
`

export const SESSION = gql`
query
{
    info : session
    {
        ${SESSION_FIELDS}
    }
    }
`;
