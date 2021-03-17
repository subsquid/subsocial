import { DatabaseManager } from '@dzlzv/hydra-db-utils'
import { Space } from '../generated/graphql-server/src/modules/space/space.model';
import { resolveSpaceStruct } from './resolvers/resolveSpaceData';
import { SpaceId } from '@subsocial/types/substrate/interfaces';
import { SpaceFollows } from './generated/types';

export async function spaceFollowed(db: DatabaseManager, event: SpaceFollows.SpaceFollowedEvent) {
  const { spaceId: id } = event.data

  if (event.ctx.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await spaceFollowedOrUnfollowed(db, id)
}

export async function spaceUnfollowed(db: DatabaseManager, event: SpaceFollows.SpaceUnfollowedEvent) {
  const { spaceId: id } = event.data

  if (event.ctx.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await spaceFollowedOrUnfollowed(db, id)
}

const spaceFollowedOrUnfollowed = async (db: DatabaseManager, spaceId: SpaceId) => {
  const space = await db.get(Space, { where: `space_id = '${spaceId.toString()}'` })
  if (!space) return

  const spaceStruct = await resolveSpaceStruct(spaceId)
  if (!spaceStruct) return

  space.followersCount = spaceStruct.followersCount

  await db.save<Space>(space)
}