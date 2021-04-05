require('dotenv').config()

export const ipfsReadOnlyNodeUrl = process.env.IPFS_READ_ONLY_NODE_URL || 'http://localhost:8080'

export const port = process.env.OFFCHAIN_SERVER_PORT || 3001

export const dbName = process.env.DB_NAME
export const dbUser = process.env.DB_USER
export const dbPass = process.env.DB_PASS
export const dbHost = process.env.DB_HOST
export const dbPost = process.env.DB_PORT || '5432'