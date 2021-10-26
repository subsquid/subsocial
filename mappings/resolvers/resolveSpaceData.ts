import { resolveSubsocialApi } from '../../connection/subsocial';
import { SpaceId } from '@subsocial/types/substrate/interfaces';
import BN from 'bn.js';
import { formatTegs } from '../utils';
import { summarizeMd } from '@subsocial/utils/summarize';

export type SpaceStruct = {
  createdByAccount: string,
  createdAtBlock: BN,
  createdAtTime: Date | undefined,
  updatedAtTime: Date | undefined,
  owner: string,
  content: string,
  postsCount: number,
  hiddenPostsCount: number,
  followersCount: number,
  score: number
}

export type SpaceContent = {
  name: string,
  about: string,
  image: string,
  tags: string[]
}

export const resolveSpaceStruct = async (id: SpaceId): Promise<SpaceStruct | undefined> => {
  const subsocial = await resolveSubsocialApi()

  const space = await subsocial.findSpace({ id })
  if (!space) return

  const { created, owner, content, posts_count, hidden_posts_count, followers_count, score, updated } = space.struct
  const { account, block, time } = created
  const createdAtTime = !time.isEmpty ? new Date(time.toNumber()) : undefined
  const updatedAtTime = updated.isSome ? new Date(updated.unwrap().time.toNumber()) : undefined

  return {
    createdByAccount: account.toString(),
    createdAtBlock: new BN(block),
    createdAtTime,
    updatedAtTime,
    owner: owner.toString(),
    content: !content.isNone ? content.asIpfs.toString() : '',
    postsCount: posts_count.toNumber(),
    hiddenPostsCount: hidden_posts_count.toNumber(),
    followersCount: followers_count.toNumber(),
    score: score.toNumber()
  }
}

export const resolveIpfsSpaceData = async (cid: string): Promise<SpaceContent | undefined> => {
  const { ipfs } = await resolveSubsocialApi()

  const content = await ipfs.findSpace(cid)
  if (!content) return

  const name = content.name ? content.name : ''
  const tags = content.tags ? formatTegs(content.tags) : []

  if (content) {
    return {
      name,
      about: summarizeMd(content.about).summary,
      image: content.image,
      tags
    }
  }
}