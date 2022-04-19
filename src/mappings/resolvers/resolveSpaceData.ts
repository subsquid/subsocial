import { resolveSubsocialApi } from '../../connection/subsocial';
import BN from 'bn.js';
import { formatTegs } from '../utils';
import { summarizeMd } from '@subsocial/utils/summarize';
import { AnySpaceId } from '@subsocial/types';
import { SpaceData, SpaceStruct } from '@subsocial/types/dto';

export const resolveSpace = async (id: AnySpaceId): Promise<SpaceData | undefined> => {
  const subsocial = await resolveSubsocialApi()

  return await subsocial.findSpace({ id: id.toString() });
}

export const resolveSpaceStruct = async (id: AnySpaceId): Promise<SpaceStruct | undefined> => {
  const subsocial = await resolveSubsocialApi()

  return await subsocial.findSpaceStruct(id.toString());
}
