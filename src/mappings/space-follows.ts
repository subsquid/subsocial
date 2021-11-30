import { SpaceId } from "@subsocial/types/substrate/interfaces"
import { DatabaseManager, EventContext, StoreContext } from "@subsquid/hydra-common"
import { SpaceFollows } from "../types-V2"
import { resolveSpaceStruct } from './resolvers/resolveSpaceData';
import { Space } from '../generated/model/space.model';

export async function spaceFollowed({ event, store }: EventContext & StoreContext) {
  const [, id ] = new SpaceFollows.SpaceFollowedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await spaceFollowedOrUnfollowed(store, id)
}

export async function spaceUnfollowed({ event, store }: EventContext & StoreContext) {
  const [, id ] = new SpaceFollows.SpaceUnfollowedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await spaceFollowedOrUnfollowed(store, id)
}

const spaceFollowedOrUnfollowed = async (store: DatabaseManager, spaceId: SpaceId) => {
  const space = await store.get(Space, { where: `space_id = '${spaceId.toString()}'` })
  if (!space) return

  const spaceStruct = await resolveSpaceStruct(spaceId)
  if (!spaceStruct) return

  space.followersCount = spaceStruct.followersCount

  await store.save<Space>(space)
}