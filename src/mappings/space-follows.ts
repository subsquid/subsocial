import { SpaceId } from "@subsocial/types/substrate/interfaces"
import { EventHandlerContext, Store } from "@subsquid/substrate-processor";
import BN from "bn.js";
import { Space } from "../model";
import { SpaceFollowsSpaceFollowedEvent, SpaceFollowsSpaceUnfollowedEvent } from "../types/events";
import { resolveSpaceStruct } from './resolvers/resolveSpaceData';

export async function spaceFollowed(ctx: EventHandlerContext) {
  const event = new SpaceFollowsSpaceFollowedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  const [_, id] = event.asV1;

  await spaceFollowedOrUnfollowed(ctx.store, id)
}

export async function spaceUnfollowed(ctx: EventHandlerContext) {
  const event = new SpaceFollowsSpaceUnfollowedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  const [_, id] = event.asV1;

  await spaceFollowedOrUnfollowed(ctx.store, id)
}

const spaceFollowedOrUnfollowed = async (store: Store, spaceId: bigint) => {
  const space = await store.get(Space, { where: `space_id = '${spaceId.toString()}'` })
  if (!space) return

  const spaceStruct = await resolveSpaceStruct(new BN(spaceId.toString()))
  if (!spaceStruct) return

  space.followersCount = spaceStruct.followersCount

  await store.save<Space>(space)
}