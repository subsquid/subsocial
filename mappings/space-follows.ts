import { SubstrateEvent, DB } from '../generated/hydra-processor'
import { Space } from '../generated/graphql-server/src/modules/space/space.model';
import { resolveSpaceStruct } from './resolvers/resolveSpaceData';
import { SpaceId } from '@subsocial/types/substrate/interfaces';

export async function spaceFollows_SpaceFollowed(db: DB, event: SubstrateEvent) {
  const [address, id] = event.params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await spaceFollowedOrUnfollowed(db, id.value as unknown as SpaceId)
}

export async function spaceFollows_SpaceUnfollowed(db: DB, event: SubstrateEvent) {
  const [address, id] = event.params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await spaceFollowedOrUnfollowed(db, id.value as unknown as SpaceId)
}

const spaceFollowedOrUnfollowed = async (db: DB, spaceId: SpaceId) => {
  const space = await db.get(Space, { where: `space_id = '${spaceId.toString()}'` })
  if (!space) return

  const spaceStruct = await resolveSpaceStruct(spaceId)
  if (!spaceStruct) return

  space.followersCount = spaceStruct.followersCount

  await db.save<Space>(space)
}