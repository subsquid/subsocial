import { DatabaseManager } from '@dzlzv/hydra-db-utils'
import { Space } from '../generated/graphql-server/src/modules/space/space.model'
import { resolveIpfsSpaceData, resolveSpaceStruct } from './resolvers/resolveSpaceData';
import { insertTagInSpaceTags } from './tag';
import { isEmptyArray } from '@subsocial/utils';
import { Spaces } from './generated/types';
import dayjs from 'dayjs';

export async function spaceCreated(db: DatabaseManager, event: Spaces.SpaceCreatedEvent) {
  await createSpace(db, event)
}

export async function spaceUpdated(db: DatabaseManager, event: Spaces.SpaceUpdatedEvent) {
  const { spaceId: id } = event.data

  if (event.ctx.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  let space = await db.get(Space, { where: `space_id = '${id.toString()}'` })
  if (!space) {
    await createSpace(db, event)
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

    const tags = await insertTagInSpaceTags(db, spaceContent.tags, space.spaceId, space)
    if (!isEmptyArray(tags))
      space.tags = tags
  }

  await db.save<Space>(space)
}

const createSpace = async (db: DatabaseManager, event: Spaces.SpaceCreatedEvent | Spaces.SpaceUpdatedEvent) => {
  const { spaceId: id } = event.data

  if (event.ctx.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  const space = new Space()

  const spaceStruct = await resolveSpaceStruct(id)
  if (!spaceStruct) return
  space.spaceId = id.toString()
  space.createdByAccount = spaceStruct.createdByAccount
  space.createdAtBlock = spaceStruct.createdAtBlock
  space.createdAtTime = spaceStruct.createdAtTime
  space.createdOnDate = dayjs(dayjs(spaceStruct.createdAtTime).format("YYYY-MM-DD")).toDate()

  space.ownerId = spaceStruct.owner

  const content = spaceStruct.content
  space.content = content

  const spaceContent = await resolveIpfsSpaceData(content)

  space.postsCount = spaceStruct.postsCount
  space.hiddenPostsCount = spaceStruct.hiddenPostsCount
  space.publicPostsCount = space.postsCount - space.hiddenPostsCount
  space.followersCount = spaceStruct.followersCount
  space.score = spaceStruct.score
  if (spaceContent) {
    space.name = spaceContent.name
    space.summary = spaceContent.about
    space.image = spaceContent.image
    space.tagsOriginal = spaceContent.tags.join(',')

    const tags = await insertTagInSpaceTags(db, spaceContent.tags, space.spaceId, space)
    if (!isEmptyArray(tags))
      space.tags = tags
  }

  await db.save<Space>(space)
}