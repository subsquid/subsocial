import { DatabaseManager, EventContext, StoreContext, SubstrateEvent } from '@joystream/hydra-common';
import { isEmptyArray } from "@subsocial/utils"
import { Space } from "../generated/graphql-server/src/modules/space/space.model"
import { Spaces } from "./generated/types"
import { resolveSpaceStruct, resolveIpfsSpaceData } from './resolvers/resolveSpaceData';
import { insertTagInSpaceTags } from './tag';
import { getDateWithoutTime } from './utils';
import { SpaceId } from '@subsocial/types/substrate/interfaces';

export async function spaceCreated({ event, store }: EventContext & StoreContext) {
  await createSpace(store, event)
}

export async function spaceUpdated({ event, store }: EventContext & StoreContext) {
  const [, id] = new Spaces.SpaceUpdatedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  let space = await store.get(Space, { where: `space_id = '${id.toString()}'` })
  if (!space) {
    await createSpace(store, event)
    return
  }

  const spaceStruct = await resolveSpaceStruct(id)
  if (!spaceStruct) return

  if (space.updatedAtTime === spaceStruct.updatedAtTime) return

  space.createdByAccount = spaceStruct.createdByAccount
  space.ownerId = spaceStruct.owner

  const content = spaceStruct.content
  space.content = content

  const spaceContent = await resolveIpfsSpaceData(content)

  space.postsCount = spaceStruct.postsCount
  space.hiddenPostsCount = spaceStruct.hiddenPostsCount
  space.followersCount = spaceStruct.followersCount
  space.score = spaceStruct.score

  if (spaceContent) {
    space.name = spaceContent.name
    space.summary = spaceContent.about
    space.image = spaceContent.image
    space.tagsOriginal = spaceContent.tags.join(',')

    const tags = await insertTagInSpaceTags(store, spaceContent.tags, space.spaceId, space)

    if (!isEmptyArray(tags)) {
      space.tags = tags
    }
  }

  await store.save<Space>(space)
}

const createSpace = async (store: DatabaseManager, event: SubstrateEvent) => {
  const [, id] = new Spaces.SpaceCreatedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }
  const space = await insertSpace(id, store)

  if(space) {
    await store.save<Space>(space)
  }
}

export const insertSpace = async (id: SpaceId, store?: DatabaseManager) => {
  const spaceStruct = await resolveSpaceStruct(id)
  if (!spaceStruct) return

  const space = new Space()

  space.spaceId = id.toString()
  space.createdByAccount = spaceStruct.createdByAccount
  space.createdAtBlock = spaceStruct.createdAtBlock
  space.createdAtTime = spaceStruct.createdAtTime
  space.createdOnDay = getDateWithoutTime(spaceStruct.createdAtTime)

  space.ownerId = spaceStruct.owner

  const content = spaceStruct.content
  space.content = content

  space.postsCount = spaceStruct.postsCount
  space.hiddenPostsCount = spaceStruct.hiddenPostsCount
  space.publicPostsCount = space.postsCount - space.hiddenPostsCount
  space.followersCount = spaceStruct.followersCount
  space.score = spaceStruct.score

  if(content !== '') {
    const spaceContent = await resolveIpfsSpaceData(content)

    if (spaceContent) {
      space.name = spaceContent.name
      space.summary = spaceContent.about
      space.image = spaceContent.image
      space.tagsOriginal = spaceContent.tags.join(',')

      if(store) {
        const tags = await insertTagInSpaceTags(store, spaceContent.tags, space.spaceId, space)
        if (!isEmptyArray(tags)) {
          space.tags = tags
        }
      }
    }
  }

  return space
}
