import { SpaceTags } from '../generated/graphql-server/src/modules/space-tags/space-tags.model';
import { PostTags } from '../generated/graphql-server/src/modules/post-tags/post-tags.model';
import { Tags } from '../generated/graphql-server/src/modules/tags/tags.model';
import { isEmptyArray } from "@subsocial/utils";
import { DB } from '../generated/hydra-processor';
import { getOrCreateTag, upsertTags, createSpaceTag, createPostTag } from './utils';

export const insertTagInPostTags = async (db: DB, tags: string[], postId: string) => {
  const postTags = await db.getMany(PostTags, { where: `post_id = '${postId}'` })
  if (isEmptyArray(postTags)) {
    const tagId = await getOrCreateTag(db, tags)
    await createPostTag(db, tagId, postId)
  }
  else {
    const oldTags: string[] = []

    for (const postTag of postTags) {
      const tag = await db.get(Tags, { where: `id = '${postTag.tagId}'` })
      if (tag && tag.tag)
        oldTags.push(tag.tag)
    }

    if (!isEmptyArray(oldTags)) {
      const { tagsAdd, tagsRemove } = upsertTags(oldTags, tags)

      if (!isEmptyArray(tagsAdd)) {
        const tagId = await getOrCreateTag(db, tagsAdd)
        await createPostTag(db, tagId, postId)
      }

      if (!isEmptyArray(tagsRemove)) {
        for (const tag of tagsRemove) {
          const tagByTagName = await db.get(Tags, { where: `tag = '${tag}'` })
          if (tagByTagName) {
            const postTag = await db.get(PostTags, { where: `tag_id = '${tagByTagName.id}' AND post_id = '${postId}'` })
            if (postTag)
              await db.remove(postTag)
          }
        }
      }
    }
  }
}

export const insertTagInSpaceTags = async (db: DB, tags: string[], spaceId: string) => {
  const spaceTags = await db.getMany(SpaceTags, { where: `space_id = '${spaceId}'` })
  if (isEmptyArray(spaceTags)) {
    const tagId = await getOrCreateTag(db, tags)
    await createSpaceTag(db, tagId, spaceId)
  }
  else {
    const oldTags: string[] = []

    for (const spaceTag of spaceTags) {
      const tag = await db.get(Tags, { where: `id = '${spaceTag.tagId}'` })
      if (tag && tag.tag)
        oldTags.push(tag.tag)
    }

    if (!isEmptyArray(oldTags)) {
      const { tagsAdd, tagsRemove } = upsertTags(oldTags, tags)

      if (!isEmptyArray(tagsAdd))
        await getOrCreateTag(db, tagsAdd)

      if (!isEmptyArray(tagsRemove)) {
        for (const tag of tagsRemove) {
          const tagByTagName = await db.get(Tags, { where: `tag = '${tag}'` })
          if (tagByTagName) {
            const postTag = await db.get(SpaceTags, { where: `tag_id = '${tagByTagName.id}' AND post_id = '${spaceId}'` })
            if (postTag)
              await db.remove(postTag)
          }
        }
      }
    }
  }
}