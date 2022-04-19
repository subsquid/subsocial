import { registry } from '@subsocial/types/substrate/registry';
import { ApiPromise } from '@polkadot/api';
import { getSubstrateApi, newFlatSubsocialApi } from '@subsocial/api'
import { ipfsReadOnlyNodeUrl, offchainUrl } from '../env'
import { FlatSubsocialApi } from '@subsocial/api/flat-subsocial';
import { chainNode } from "../env";

let subsocial: FlatSubsocialApi;

const ipfsConfig = {
  ipfsNodeUrl: ipfsReadOnlyNodeUrl,
  offchainUrl,
}

export const resolveSubsocialApi = async (): Promise<FlatSubsocialApi> => {
  // Connect to Subsocial's Substrate node:

  if (!subsocial) {
    const api = await getSubstrateApi(chainNode);
    const properties = await api.rpc.system.properties()

    registry.setChainProperties(properties)
    subsocial = await newFlatSubsocialApi({
      substrateNodeUrl: chainNode,
      ...ipfsConfig
    });
  }

  return subsocial;
}
