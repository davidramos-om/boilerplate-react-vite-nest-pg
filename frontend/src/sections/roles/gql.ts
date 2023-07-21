import { gql } from '@apollo/client';

export const BASIC_FIELDS = `
id
name  	
description
role_type
`

export const GET_ALL = gql`
query
{
  roles
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
query($id: String!)
{
  role(id: $id)
  {
    ${BASIC_FIELDS}
    tenant
    {
      id
      name
    }
    permissions
    {
      id 
    }
  }
}
`;

export const SELECT_ROLE = gql`
query
{
  roles : rolesSelector
  {
    id
    name
    role_type
    tenant
    {
      id
      name
    }
  }
}
`

export const GET_ALL_PERMISSIONS = gql`
query
{
 permissions
  {
    id  
    name
    description
    resource
    action
    code
    order
    resource_order
  }
}
`;

export const CREATE_ROLE = gql`
mutation ($input : CreateRoleInput!)
{
  result : createRole(input : $input)
  {
    ${BASIC_FIELDS}
  }
}
`;

export const UPDATE_ROLE = gql`
mutation ($input : UpdateRoleInput!)
{
  result : updateRole(input : $input)
  {
    ${BASIC_FIELDS}
  }
}
`;
