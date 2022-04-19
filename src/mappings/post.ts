import { resolvePostStruct, resolveIpfsPostData } from './resolvers/resolvePostData';
import { getDateWithoutTime } from './utils';
import { PostId, SpaceId } from '@subsocial/types/substrate/interfaces';
import { isEmptyArray } from "@subsocial/utils"
import { resolveSpaceStruct } from './resolvers/resolveSpaceData';
import { Post, Space } from '../model/generated'
import { EventHandlerContext, Store } from '@subsquid/substrate-processor';
import { PostsPostCreatedEvent, PostsPostSharedEvent, PostsPostUpdatedEvent } from '../types/events';
import BN from 'bn.js';

export async function postCreated(ctx: EventHandlerContext) {
  const event = new PostsPostCreatedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  const [_, id] = event.asV1;

  const post = await insertPost(id, ctx.store)

  if(post) {
    await ctx.store.save<Post>(post)
  }
}

export async function postUpdated(ctx: EventHandlerContext) {
  const event = new PostsPostUpdatedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  const [_, id] = event.asV1;

  const post = await ctx.store.get(Post, { where: `post_id = '${id.toString()}'` })
  if (!post) return

  const postStruct = await resolvePostStruct(id as unknown as PostId)
  if (!postStruct) return

  if (post.updatedAtTime === postStruct.updatedAtTime) return

  post.createdByAccount = postStruct.createdByAccount

  const content = postStruct.content
  post.content = content

  post.updatedAtTime = postStruct.updatedAtTime

  if (postStruct.spaceId != '') {
    await updateCountersInSpace(ctx.store, BigInt(postStruct.spaceId))
  }

  const postContent = await resolveIpfsPostData(content, post.postId)

  if (postContent) {
    post.title = postContent.title
    post.image = postContent.image
    post.summary = postContent.summarize
    post.slug = postContent.slug
    post.tagsOriginal = postContent.tags.join(',')

    // const tags = await insertTagInPostTags(store, postContent.tags, post.postId, post)

    // if (!isEmptyArray(tags)) {
    //   post.tags = tags
    // }
  }

  await ctx.store.save<Post>(post)
}

export async function postShared(ctx: EventHandlerContext) {
  const event = new PostsPostSharedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  const [_, id] = event.asV1;

  const post = await ctx.store.get(Post, { where: `post_id = '${id.toString()}'` })
  if (!post) return

  const postStruct = await resolvePostStruct(id as unknown as PostId)
  if (!postStruct) return

  post.sharesCount = postStruct.sharesCount

  await ctx.store.save<Post>(post)
}

const updateReplyCount = async (store: Store, postId: bigint) => {
  const post = await store.get(Post, { where: `post_id = '${postId.toString()}'` })
  if (!post) return

  const postStruct = await resolvePostStruct(new BN(postId.toString()))
  if (!postStruct) return

  post.repliesCount = postStruct.repliesCount
  post.hiddenRepliesCount = postStruct.hiddenRepliesCount
  post.publicRepliesCount = post.repliesCount - post.hiddenRepliesCount

  await store.save<Post>(post)
}

const updateCountersInSpace = async (store: Store, spaceId: bigint) => {
  const space = await store.get(Space, { where: `space_id = '${spaceId.toString()}'` })
  if (!space) return

  const spaceStruct = await resolveSpaceStruct(new BN(spaceId.toString()))
  if (!spaceStruct) return

  space.postsCount = spaceStruct.postsCount
  space.hiddenPostsCount = spaceStruct.hiddenPostsCount
  space.publicPostsCount = space.postsCount - space.hiddenPostsCount

  await store.save<Space>(space)
}

export const insertPost = async (id: bigint, store?: Store) => {
  const postStruct = await resolvePostStruct(new BN(id.toString()))
  if (!postStruct) return

  const post = new Post()

  post.createdByAccount = postStruct.createdByAccount
  post.createdAtBlock = BigInt(postStruct.createdAtBlock.toString())
  post.createdAtTime = postStruct.createdAtTime
  post.createdOnDay = getDateWithoutTime(postStruct.createdAtTime)
  post.postId = id.toString()
  const content = postStruct.content

  post.content = content

  const postContent = await resolveIpfsPostData(content, post.postId)

  post.kind = postStruct.kind

  post.updatedAtTime = postStruct.updatedAtTime
  post.spaceId = postStruct.spaceId
  if (postStruct.spaceId != '' && store) {
    await updateCountersInSpace(store, BigInt(postStruct.spaceId))
  }

  switch (postStruct.kind) {
    case 'Comment': {
      const extencionParentId = postStruct.extension.asComment.parentId
      const rootPostId =  postStruct.extension.asComment.rootPostId
      const parentId = extencionParentId.isNone ? undefined : extencionParentId.unwrap()

      post.rootPostId = rootPostId.toString()
      post.parentId = parentId?.toString()

      if (rootPostId && rootPostId != null && store)
        await updateReplyCount(store, BigInt(rootPostId.toString()))
      if (parentId && parentId != null && store)
        await updateReplyCount(store, BigInt(parentId.toString()))

      break
    }
    case 'SharedPost': {
      post.sharedPostId = postStruct.extension.asSharedPost.toString()
      break
    }
  }

  post.repliesCount = postStruct.repliesCount
  post.hiddenRepliesCount = postStruct.hiddenRepliesCount
  post.publicRepliesCount = post.repliesCount - post.hiddenRepliesCount
  post.sharesCount = postStruct.sharesCount
  post.upvotesCount = postStruct.upvotesCount
  post.downvotesCount = postStruct.downvotesCount
  post.score = postStruct.score

  if (postContent) {
    post.title = postContent.title
    post.image = postContent.image
    post.summary = postContent.summarize
    post.slug = postContent.slug
    post.tagsOriginal = postContent.tags.join(',')

    if(store) {
      // const tags = await insertTagInPostTags(store, postContent.tags, post.postId, post)
      // if (!isEmptyArray(tags)) {
      //   post.tags = tags
      // }
    }

    const meta = postContent.meta

    if(meta && !isEmptyArray(meta)) {
      post.proposalIndex = meta[0].proposalIndex
    }
  }

  return post
}