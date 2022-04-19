import dayjs from "dayjs"
import localizedFormat from 'dayjs/plugin/localizedFormat'
// import { MetaItem } from "@subsocial/types"
// import { PostId } from "@subsocial/types/substrate/interfaces"
// import { Network, TreasuryProposal } from "../generated/graphql-server/src/modules/treasury-proposal/treasury-proposal.model"
import { Space } from '../model/generated/space.model';
import { Post } from '../model/generated/post.model';
import { Store } from "@subsquid/substrate-processor";


dayjs.extend(localizedFormat)

export type ObjectType = Space | Post | undefined

export type RelationFieldType = 'posts' | 'spaces'

export type GetOrCreateTagType = {
  store: Store,
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

// export const getOrInsertProposal = async (db: DatabaseManager, meta: MetaItem, post: Post) => {
//   const { network, proposalIndex: proposalId } = meta

//   const proposalById = await db.get(TreasuryProposal, { where: { proposalId: proposalId }, relations: ['posttreasuryProposal'] })

//   if (proposalById) {
//     if(proposalById.postId !== post.postId) {
//       proposalById['posttreasuryProposal']?.push(post)

//       await db.save<TreasuryProposal>(proposalById)
//     }

//     return proposalById
//   } else {
//     const proposal = new TreasuryProposal()

//     if (proposal['posttreasuryProposal']) {
//       proposal['posttreasuryProposal'].push(post)
//     } else {
//       proposal['posttreasuryProposal'] = [post]
//     }

//     proposal.postId = post.postId,
//     proposal.proposalId = proposalId,
//     proposal.network = network as Network,

//     await db.save<TreasuryProposal>(proposal)
//     return proposal
//   }
// }
