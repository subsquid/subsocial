import { DB } from "../generated/hydra-processor"
import { SpaceTags } from '../generated/graphql-server/src/modules/space-tags/space-tags.model';
import { PostTags } from '../generated/graphql-server/src/modules/post-tags/post-tags.model';
import { Tags } from '../generated/graphql-server/src/modules/tags/tags.model';
import { isEmptyArray } from "@subsocial/utils";

export const insertTagInPostTags = async (db: DB, tags: string[], postId: string) => {
  const postTags = await db.getMany(PostTags, { where: `post_id = '${postId}'` })
  console.log(postTags)
  if (isEmptyArray(postTags)) {
    await createTag(db, tags, postId)
  }
  else {
    const oldTags: string[] = []

    for (const postTag of postTags) {
      const tag = await db.get(Tags, { where: `id = ${postTag.tagId}` })
      if (tag && tag.tag)
        oldTags.push(tag.tag)
    }

    if (!isEmptyArray(oldTags))
      upsertTags(db, postId, oldTags, tags)
  }
}

const createTag = async (db: DB, tags: string[], postId: string) => {
  for (const tag of tags) {
    if (tag && tag !== ' ') {
      let tagId = ''
      const isTagExist = await db.get(Tags, { where: `tag = '${tag}'` })
      if (isTagExist && isTagExist.id != undefined) tagId = isTagExist.id
      else {
        const tags = new Tags
        tags.tag = tag
        await db.save<Tags>(tags)
        const tagByTagText = await db.get(Tags, { where: `tag = '${tag}'` })
        if (!tagByTagText || !tagByTagText.id) return
        tagId = tagByTagText.id
      }
      if (tagId) {
        const postTags = new PostTags()
        postTags.postId = postId
        postTags.tagId = tagId
        await db.save<PostTags>(postTags)
      }
    }
  }
}

const upsertTags = async (db: DB, postId: string, oldT: string[], modT: string[]) => {
  const modSet = new Set(modT)
  const uniqModifiedTags = [...modSet]

  let tagsAdd: string[] = []
  let tagsRemove: string[] = []

  if (oldT.filter(x => modSet.has(x)).length !== 0) {
    tagsAdd = uniqModifiedTags.filter(x => ![...oldT].includes(x))
    tagsRemove = oldT.filter(x => !uniqModifiedTags.includes(x))
  } else {
    return console.warn('Nothing to update')
  }

  if (!isEmptyArray(tagsAdd))
    await createTag(db, tagsAdd, postId)

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

export const insertTagInSpaceTags = async (db: DB, tags: string[], spaceId: string) => {
  for (const tag of tags) {
    if (tag && tag !== ' ') {
      const tags = new Tags
      tags.tag = tag
      await db.save<Tags>(tags)
      const tagId = await db.get(Tags, { where: `tag = "${tag}"` })
      if (tagId) {
        const spaceTags = new SpaceTags()
        spaceTags.tagId = tagId.id
        spaceTags.spaceId = spaceId
        await db.save<SpaceTags>(spaceTags)
      }
    }
  }
}

export const formatTegs = (tags: string[]) => {
  return tags.flatMap(value => {
    return value.split(' ').map(value => {
      if (value.startsWith('#'))
        value = value.replace('#', '')

      return value.trim().toLowerCase().replace('#', '').replace("'", "`")
    })
  })
}