import { Tags } from '../generated/graphql-server/src/modules/tags/tags.model';
import { PostTags } from '../generated/graphql-server/src/modules/post-tags/post-tags.model';
import { SpaceTags } from '../generated/graphql-server/src/modules/space-tags/space-tags.model';
import { DB } from '../generated/hydra-processor';
import { isEmptyArray } from '@subsocial/utils';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

export const getOrCreateTag = async (db: DB, tags: string[]) => {
  const tagArr: string[] = []
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

      tagArr.push(tagId)
    }
  }
  return tagArr
}

export const upsertTags = (oldT: string[], modT: string[]) => {
  const modSet = new Set(modT)
  const uniqModifiedTags = [...modSet]

  let tagsAdd: string[] = []
  let tagsRemove: string[] = []

  if (oldT.filter(x => modSet.has(x)).length !== 0) {
    tagsAdd = uniqModifiedTags.filter(x => ![...oldT].includes(x))
    tagsRemove = oldT.filter(x => !uniqModifiedTags.includes(x))
  } else {
    console.warn('Nothing to update')
  }

  return { tagsAdd, tagsRemove }
}

export const createPostTag = async (db: DB, tagIds: string[] | undefined, postId: string) => {
  if (tagIds && !isEmptyArray(tagIds)) {
    for (const tagId of tagIds) {
      const postTags = new PostTags()
      postTags.postId = postId
      postTags.tagId = tagId
      await db.save<PostTags>(postTags)
    }
  }
}

export const createSpaceTag = async (db: DB, tagIds: string[] | undefined, spaceId: string) => {
  if (tagIds && !isEmptyArray(tagIds)) {
    for (const tagId of tagIds) {
      const spaceTags = new SpaceTags()
      spaceTags.spaceId = spaceId
      spaceTags.tagId = tagId
      await db.save<SpaceTags>(spaceTags)
    }
  }
}

export const formatTegs = (tags: string[]) => {
  return tags.flatMap(value => {
    value = value.trim()
    let splitter = ' '
    if (value.includes(';')) splitter = ';'

    return value.split(splitter)
      .filter(el => el != '')
      .map(value => {
        if (value.startsWith('#')) value = value.replace('#', '')

        return value.trim().toLowerCase().replace(',', '').replace(/'/g, "`")
      })
  })
}

export const formatDate = (date: string) => {
  return dayjs(Number(date)).format('YYYY-MM-DD hh:mm:ss')
}

export const stringDateToTimestamp = (date: string | undefined) => {
  if (date && date != '')
    return new Date(Number(date)).getTime()
}