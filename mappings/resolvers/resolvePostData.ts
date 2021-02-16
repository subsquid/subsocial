import { PostId } from "@subsocial/types/substrate/interfaces";
import { resolveSubsocialApi } from '../../connection/subsocial';
import { summarize } from '@subsocial/utils/summarize';
import { createPostSlug } from '@subsocial/utils/slugify';
import { formatTegs } from '../tag';

export type PostCounters = {
  updatedAtTime: string
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

  const { replies_count, hidden_replies_count, shares_count, upvotes_count, downvotes_count, score, content, updated } = post.struct

  const updatedAtTime = updated.isSome ? updated.unwrap().time.toString() : ''

  return {
    updatedAtTime,
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
      summarize: content.body ? summarize(content.body) : '',
      slug,
      tags
    }
  }
}