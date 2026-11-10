import mongoose, { Connection, ConnectOptions } from 'mongoose';

export interface ConnectionResult {
  connection: Connection;
  close: () => Promise<void>;
}

export const createConnection = async (uri: string): Promise<ConnectionResult> => {
  const options: Partial<ConnectOptions> = {
    maxPoolSize: 1,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 5000,
  };

  const connection = mongoose.createConnection(uri, options as ConnectOptions);

  await connection.asPromise();

  return {
    connection,
    close: async () => {
      await connection.close();
    },
  };
};