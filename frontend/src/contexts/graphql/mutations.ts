import { gql, useMutation } from '@apollo/client';
import { SESSION_FIELDS } from './queries';

export const SIGN_IN = gql`
mutation ($input : LoginUserInput!)
{
  signIn(loginUserInput : $input)
  {
    ${SESSION_FIELDS}
  }
}
`;

export const SIGN_OUT = gql`
mutation
{
  logout
}
`;


export const CREATE_ONBOARD_REQUEST = gql`
mutation ($input : CreateOnboardingRequestInput!)
{
  result: createOnboardingRequest(input : $input)
  {
    id
    code
  }
}
`;

export const UPLOAD_PUBLIC_FILE = gql`
mutation ($file: Upload!, $folder: String!)
{
  result : uploadPublicFile(file: $file, folder: $folder)
  {
    id
    key
    url
  }
}
`;


export function useUploadPublicFileMutation() {

  const [ uploadPublicFile, { data, loading, error } ] = useMutation(UPLOAD_PUBLIC_FILE);
  return { uploadPublicFile, data, loading, error };
}