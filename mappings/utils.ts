import { DatabaseManager } from '@dzlzv/hydra-db-utils'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { Post } from '../generated/graphql-server/src/modules/post/post.model'
import { Space } from '../generated/graphql-server/src/modules/space/space.model'

dayjs.extend(localizedFormat)

export type ObjectType = Space | Post | undefined

export type RelationFieldType = 'posts' | 'spaces'

export type GetOrCreateTagType = {
  db: DatabaseManager,
  tags: string[],
  entity: ObjectType,
  relationField: RelationFieldType,
}

export type TagInEntityTagType = GetOrCreateTagType & {
  entityWithRelations: ObjectType
}

export const formatTegs = (tags: string[]) => {
  return tags.flatMap((value) => {
    value = value.trim()
    let splitter = ' '
    if (value.includes(';')) splitter = ';'

    return value
      .split(splitter)
      .filter((el) => el != '')
      .map((value) => {
        if (value.startsWith('#')) {
          value = value.replace('#', '')
        }

        return value
          .trim()
          .toLowerCase()
          .replace(',', '')
          .replace(/'/g, '`')
      })
  })
}

export const formatDate = (date: string) =>
  dayjs(Number(date)).format('YYYY-MM-DD hh:mm:ss')

export const stringDateToTimestamp = (date: string | undefined) =>
  date && date != '' && new Date(Number(date)).getTime()

export const getDateWithoutTime = (date: Date | undefined): Date | undefined =>
  date ? new Date(dayjs(date).format('YYYY-MM-DD')) : undefined;
