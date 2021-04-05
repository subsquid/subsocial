import { PostId } from "@subsocial/types/substrate/interfaces";
import { resolveSubsocialApi } from '../../connection/subsocial';
import { summarizeMd } from '@subsocial/utils/summarize';
import { createPostSlug } from '@subsocial/utils/slugify';
import { formatTegs } from '../utils';
import BN from 'bn.js';

export type PostCounters = {
  createdByAccount: string,
  createdAtBlock: BN,
  createdAtTime: Date | undefined,
  updatedAtTime: Date | undefined,
  spaceId: string,
  content: string,
  repliesCount: number,
  hiddenRepliesCount: number,
  sharesCount: number,
  upvotesCount: number,
  downvotesCount: number,
  score: number
}

export type PostContent = {
  title: string,
  image: string,
  summarize: string,
  slug: string,
  tags: string[]
}

export const resolvePostStruct = async (id: PostId): Promise<PostCounters | undefined> => {
  const subsocial = await resolveSubsocialApi()

  const post = await subsocial.findPost({ id })
  if (!post) return

  const { created, space_id, replies_count, hidden_replies_count, shares_count, upvotes_count, downvotes_count, score, content, updated } = post.struct

  const { account, block, time } = created
  const createdAtTime = !time.isEmpty ? new Date(time.toNumber()) : undefined
  const updatedAtTime = updated.isSome ? new Date(updated.unwrap().time.toNumber()) : undefined
  const spaceId = space_id.isSome ? space_id.unwrap().toString() : ''

  return {
    createdByAccount: account.toString(),
    createdAtBlock: new BN(block),
    createdAtTime,
    updatedAtTime,
    spaceId,
    content: !content.isNone ? content.asIpfs.toString() : '',
    repliesCount: replies_count.toNumber(),
    hiddenRepliesCount: hidden_replies_count.toNumber(),
    sharesCount: shares_count.toNumber(),
    upvotesCount: upvotes_count.toNumber(),
    downvotesCount: downvotes_count.toNumber(),
    score: score.toNumber()
  }
}

export const resolveIpfsPostData = async (cid: string, postId: string): Promise<PostContent | undefined> => {
  const { ipfs } = await resolveSubsocialApi()

  const content = await ipfs.findPost(cid)
  if (!content) return

  const title = content.title ? content.title : ''
  const slug = createPostSlug(postId, { body: content.body, title })
  const tags = content.tags ? formatTegs(content.tags) : []

  if (content) {
    return {
      title,
      image: content.image,
      summarize: content.body ? summarizeMd(content.body).summary : '',
      slug,
      tags
    }
  }
}