import { registry } from '@subsocial/types/substrate/registry';
import { ApiPromise } from '@polkadot/api';
import { getSubstrateApi, newFlatSubsocialApi } from '@subsocial/api'
import { ipfsReadOnlyNodeUrl, port,  } from '../env'
import { FlatSubsocialApi } from '@subsocial/api/flat-subsocial';

let subsocial: FlatSubsocialApi;

const ipfsConfig = {
  ipfsNodeUrl: ipfsReadOnlyNodeUrl,
  offchainUrl: `http://localhost:${port}`
}

export const resolveSubsocialApi = async (): Promise<FlatSubsocialApi> => {
  // Connect to Subsocial's Substrate node:

  if (!subsocial) {
    const api = await getSubstrateApi(process.env.CHAIN_NODE);
    const properties = await api.rpc.system.properties()

    if(!process.env.CHAIN_NODE) {
      throw new Error("CHAIN_NODE undefined");
    }

    registry.setChainProperties(properties)
    subsocial = await newFlatSubsocialApi({
      substrateNodeUrl: process.env.CHAIN_NODE,
      ...ipfsConfig
    });
  }

  return subsocial;
}
