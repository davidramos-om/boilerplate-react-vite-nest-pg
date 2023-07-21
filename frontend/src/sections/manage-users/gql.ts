import { gql } from '@apollo/client';


export const BASIC_FIELDS = `
id
image_url
user_id
email
type
fullName
created_at
status
`

export const GET_ALL = gql`
query
{
  users
  {
    ${BASIC_FIELDS}
    tenant
    {
      id
      name
    }
  }
}
`;

export const GET_ONE = gql`
query ($id : String!)
{
  user(id: $id)
  {
    ${BASIC_FIELDS}
    first_name
    last_name
    tenant
    {
      id
      name
    }
    roles
    {
      id
      name
      role_id
    }
  }
}
`


export const CREATE_USER = gql`
mutation ($input : CreateUserInput!)
{
  result : createUser(input : $input)
  {
    ${BASIC_FIELDS}
  }
}
`;

export const UPDATE_USER = gql`
mutation ($input : UpdateUserInput!)
{
  result : updateUser(input : $input)
  {
    ${BASIC_FIELDS}
  }
}
`;

export const ASSIGN_PASSWORD = gql`
mutation ($input : SetUserPasswordInput!)
{
  assignUserPassword(input : $input)
}
`;

export const DEACTIVATE_USER = gql`
mutation ($id : String!)
{
  deactivateUser(id : $id)
}
`;

export const REACTIVATE_USER = gql`
mutation ($id : String!)
{
  reactivateUser(id : $id)
}
`