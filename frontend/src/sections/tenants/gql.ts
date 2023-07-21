import { gql } from '@apollo/client';


export const BASIC_FIELDS = `
id
name
code
total_cost
contact_name
access_enabled
created_at
last_active
logo_url
slug
`

export const GET_ALL = gql`
query
{
  tenants
  {
    ${BASIC_FIELDS}
  }
}
`;

export const GET_ONE = gql`
query ($id : String!)
{
  tenant(id:$id)
  {
    id
    name    
    code
    description
    slug
    access_enabled
    additional_cost
    subscription_cost
    status
    last_active
    logo_url    
    address
    contact_name
    contact_email
    contact_phone
    schema_error
    schema_populated
    billing_address
    {
      address_line_1
      address_line_2
      city
      state
      country      
      zip_code
    }
  }
}

`;

export const CREATE_TENANT = gql`
mutation ($input : CreateTenantInput!)
{
  result: createTenant(input: $input)
  {
    ${BASIC_FIELDS}
  }
}
`;

export const UPDATE_TENANT = gql`
mutation ($input : UpdateTenantInput!)
{
  result: updateTenant(input: $input)
  {
    ${BASIC_FIELDS}
  }
}
`;

export const SELECT_TENANT = gql`
query
{
  tenants
  {
    id
    name
    code
    logo_url
    access_enabled
  }
}
`;

export const GET_AUTH_TENANT_BY_SLUG = gql`
query ($slug : String!)
{
  tenant:authTenantData(slug:$slug)
  {
    id
    name
    code
    slug
    logo_url
  }
}
`;