import { SpaceId } from "@subsocial/types/substrate/interfaces";
import { resolveSubsocialApi } from '../../connection/subsocial';
import { summarize } from '@subsocial/utils/summarize';
import { formatTegs } from '../tag';

export type SpaceStruct = {
  updatedAtTime: string,
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

  const { owner, content, posts_count, hidden_posts_count, followers_count, score, updated } = space.struct

  const updatedAtTime = updated.isSome ? updated.unwrap().time.toString() : ''

  return {
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
      about: summarize(content.about),
      image: content.image,
      tags
    }
  }
}