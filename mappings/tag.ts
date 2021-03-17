import { Tag } from '../generated/graphql-server/src/modules/tag/tag.model';
import { isEmptyArray } from "@subsocial/utils";
import { DatabaseManager } from '@dzlzv/hydra-db-utils'
import { getOrCreatePostTag, upsertTags, getOrCreateSpaceTag } from './utils';
import { Post } from '../generated/graphql-server/src/modules/post/post.model';
import { Space } from '../generated/graphql-server/src/modules/space/space.model';

export const insertTagInPostTags = async (db: DatabaseManager, tags: string[], postId: string, post: Post) => {
  const postWithRelations = await db.get(Post, { where: { postId }, relations: [`tags`] })
  let postTags: Tag[] = []

  if (!postWithRelations) {
    if (!isEmptyArray(tags)) {
      const { tagsAdd } = upsertTags([], tags)
      if (!isEmptyArray(tagsAdd)) {
        const newTags = await getOrCreatePostTag(db, tagsAdd, post)
        newTags.map(value => postTags.push(value))
      }
    }
  } else {
    let oldTags: string[] = []

    for (const postTag of postWithRelations.tags) {
      if (postTag && postTag.tag)
        oldTags.push(postTag.tag)
    }

    const { tagsAdd, tagsRemove } = upsertTags(oldTags, tags)

    if (!isEmptyArray(tagsAdd)) oldTags = oldTags.concat(tagsAdd)

    if (!isEmptyArray(tagsRemove)) {
      oldTags = oldTags.filter(x => !tagsRemove.includes(x))
    }

    const newTags = await getOrCreatePostTag(db, oldTags, post)
    newTags.map(value => postTags.push(value))
  }

  return postTags
}

export const insertTagInSpaceTags = async (db: DatabaseManager, tags: string[], spaceId: string, space: Space) => {
  const spaceWithRelations = await db.get(Space, { where: { spaceId }, relations: [`tags`] })
  let postTags: Tag[] = []

  if (!spaceWithRelations) {
    if (!isEmptyArray(tags)) {
      const { tagsAdd } = upsertTags([], tags)
      if (!isEmptyArray(tagsAdd)) {
        const newTags = await getOrCreateSpaceTag(db, tagsAdd, space)
        newTags.map(value => postTags.push(value))
      }
    }
  } else {
    let oldTags: string[] = []

    for (const spaceTag of spaceWithRelations.tags) {
      if (spaceTag && spaceTag.tag)
        oldTags.push(spaceTag.tag)
    }

    const { tagsAdd, tagsRemove } = upsertTags(oldTags, tags)

    if (!isEmptyArray(tagsAdd)) oldTags = oldTags.concat(tagsAdd)

    if (!isEmptyArray(tagsRemove)) {
      oldTags = oldTags.filter(x => !tagsRemove.includes(x))
    }

    const newTags = await getOrCreateSpaceTag(db, oldTags, space)
    newTags.map(value => postTags.push(value))
  }

  return postTags
}
