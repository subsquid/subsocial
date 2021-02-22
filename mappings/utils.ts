import { Tag } from '../generated/graphql-server/src/modules/tag/tag.model';
import { DB } from '../generated/hydra-processor';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { Post } from '../generated/graphql-server/src/modules/post/post.model';
import { Space } from '../generated/graphql-server/src/modules/space/space.model';

dayjs.extend(localizedFormat)

export const upsertTags = (oldT: string[], modT: string[]) => {
  const modSet = new Set(modT)
  const uniqModifiedTags = [...modSet]

  let tagsAdd: string[] = []
  let tagsRemove: string[] = []

  if (oldT.filter(x => modSet.has(x)).length !== 0 || oldT.length === 0) {
    tagsAdd = uniqModifiedTags.filter(x => ![...oldT].includes(x))
    tagsRemove = oldT.filter(x => !uniqModifiedTags.includes(x))
  } else {
    console.warn('Nothing to update')
  }
  return { tagsAdd, tagsRemove }
}

export const getOrCreatePostTag = async (db: DB, tags: string[], post: Post) => {
  const arr: Tag[] = []
  for (const tag of tags) {
    if (tag && tag !== ' ') {
      const tagByTagName = await db.get(Tag, { where: { tag }, relations: ['posts'] })
      if (tagByTagName) {
        tagByTagName.posts.push(post)
        await db.save<Tag>(tagByTagName)
        arr.push(tagByTagName)
      } else {
        const tagsEntity = new Tag
        if (tagsEntity.posts)
          tagsEntity.spaces.push(post)
        else tagsEntity.posts = [post]
        tagsEntity.tag = tag
        await db.save<Tag>(tagsEntity)
        arr.push(tagsEntity)
      }
    }
  }
  return arr
}

export const getOrCreateSpaceTag = async (db: DB, tags: string[], space: Space) => {
  const arr: Tag[] = []
  for (const tag of tags) {
    if (tag && tag !== ' ') {
      const tagByTagName = await db.get(Tag, { where: { tag }, relations: ['spaces'] })
      if (tagByTagName) {
        tagByTagName.spaces.push(space)
        await db.save<Tag>(tagByTagName)
        arr.push(tagByTagName)
      } else {
        const tagsEntity = new Tag
        if (tagsEntity.spaces)
          tagsEntity.spaces.push(space)
        else tagsEntity.spaces = [space]
        tagsEntity.tag = tag
        await db.save<Tag>(tagsEntity)
        arr.push(tagsEntity)
      }
    }
  }
  return arr
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