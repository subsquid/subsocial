require('dotenv').config()

export const ipfsReadOnlyNodeUrl = process.env.IPFS_READ_ONLY_NODE_URL || 'http://localhost:8080'

export const port = process.env.OFFCHAIN_SERVER_PORT || 3001

export const dbName = process.env.DB_NAME || "subsocial";
export const dbUser = process.env.DB_USER || "dev";
export const dbPass = process.env.DB_PASS || "1986";
export const dbHost = process.env.DB_HOST || "localhost";
export const dbPort = parseInt(process.env.DB_PORT || '') || 5432
export const batchSize = process.env.BATCH_SIZE ? parseInt(process.env.BATCH_SIZE) : 500;
export const chainNode = process.env.CHAIN_NODE || "wss://arch.subsocial.network";