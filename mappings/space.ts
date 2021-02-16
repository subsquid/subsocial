import { SubstrateEvent, DB } from '../generated/hydra-processor'
import { Space } from '../generated/graphql-server/src/modules/space/space.model'
import { SpaceId } from '@subsocial/types/substrate/interfaces';
import { resolveIpfsSpaceData, resolveSpaceStruct } from './resolvers/resolveSpaceData';
import { insertTagInSpaceTags } from './tag';

export async function spaces_SpaceCreated(db: DB, event: SubstrateEvent) {
  const [address, id] = event.params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  const space = new Space()

  const spaceStruct = await resolveSpaceStruct(id.value as unknown as SpaceId)
  if (!spaceStruct) return
  space.spaceId = id.value as string
  space.createdByAccount = address.value.toString()

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
    space.tags = spaceContent.tags.join(',')

    await insertTagInSpaceTags(db, spaceContent.tags, space.spaceId)
  }

  await db.save<Space>(space)
}

export async function spaces_SpaceUpdated(db: DB, event: SubstrateEvent) {
  const [address, id] = event.params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  const space = await db.get(Space, { where: `space_id = '${id.value.toString()}'` })
  if (!space) return

  const spaceStruct = await resolveSpaceStruct(id.value as unknown as SpaceId)
  if (!spaceStruct) return

  if (Number(space.updatedAtTime) == Number(spaceStruct.updatedAtTime)) return

  space.createdByAccount = address.value.toString()
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
    space.tags = spaceContent.tags.join(',')

    await insertTagInSpaceTags(db, spaceContent.tags, space.spaceId)
  }

  console.log("updated")

  await db.save<Space>(space)
}