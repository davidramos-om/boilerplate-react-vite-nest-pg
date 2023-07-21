import { getConnectionManager, DataSource } from 'typeorm';

import { dataSourceOptions } from 'src/orm-tenanted.config';
import { generateCodeFromUUID, generatePgKey } from "src/common/security/password-hasher";

export async function getTenantConnection(tenantId: string): Promise<DataSource> {

  const connectionName = `tenant_${tenantId}`;
  const connectionManager = getConnectionManager();

  if (connectionManager.has(connectionName)) {
    const connection = connectionManager.get(connectionName);
    return Promise.resolve(connection.isConnected ? connection : connection.connect());
  }

  const pgUser = `tnt_${generateCodeFromUUID(tenantId)}`;
  const pgPw = generatePgKey(tenantId, pgUser);

  const ds = new DataSource({
    ...dataSourceOptions,
    type: 'postgres',
    name: connectionName,
    schema: connectionName,
    username: pgUser,
    password: pgPw,
  });

  return await ds.initialize();
}
