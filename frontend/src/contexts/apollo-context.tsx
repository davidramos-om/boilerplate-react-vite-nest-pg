import { ReactNode } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache, ApolloCache, NormalizedCacheObject } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

import { getAccessToken } from 'src/utils/jwt'
import { APP_CONFIG } from 'src/config-global';
import { NIL_UUID } from 'src/utils/constants';

const headers = {
  'content-type': 'application/json',
  'x-tenant-id': NIL_UUID,
  'Apollo-Require-Preflight': 'true',
};

const createApolloClient = (authToken: any): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    name: 'main-backend-graphql',
    connectToDevTools: true,
    cache: new InMemoryCache({
      addTypename: false,
    }) as ApolloCache<NormalizedCacheObject>,
    link: createUploadLink({
      uri: APP_CONFIG.GRAPHQL_URL,
      headers: authToken ? { ...headers, 'authorization': `Bearer ${authToken}` } : headers,
    }),
  });

const ApolloContext = ({ children }: { children: ReactNode }) => (
  <ApolloProvider
    client={createApolloClient(getAccessToken())}>
    {children}
  </ApolloProvider>
);

export default ApolloContext;
