import { gql } from '@apollo/client';


export const BASIC_FIELDS = `
id  
company
code
fullName
email
phone
status
created_at
`

export const GET_ALL = gql`
query
{
  requests : onboardingRequestsOpen
  {
    ${BASIC_FIELDS}
  }
}
`;

export const GET_ONE = gql`
query ($id: String!)
{
  request : onboardingRequestById(id: $id)
  {
    id
    code
    address
    company
    created_at
    email
    first_name
    last_name
    fullName
    message
    phone
    status
    updated_at
    updated_by
  }
}
`;

export const MARK_AS_READ = gql`
mutation ($id: String!)
{
  result : markRequestAsRead(id : $id)
  {
    id
  }
}
`;

export const MARK_CLOSED = gql`
mutation ($id: String!)
{
  result : markRequestAsClosed(id : $id)
  {
    id
  }
}
`;