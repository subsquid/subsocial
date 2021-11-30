import { resolvePostStruct, resolveIpfsPostData } from './resolvers/resolvePostData';
import { getDateWithoutTime } from './utils';
import { PostId, SpaceId } from '@subsocial/types/substrate/interfaces';
import { isEmptyArray } from "@subsocial/utils"
import { resolveSpaceStruct } from './resolvers/resolveSpaceData';
import { DatabaseManager, EventContext, StoreContext } from '@subsquid/hydra-common'
import { Posts } from '../types-V2'
import { Post, Space } from '../generated/model'

export async function postCreated({ event, store }: EventContext & StoreContext) {
  const [, id ] = new Posts.PostCreatedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  const post = await insertPost(id, store)

  if(post) {
    await store.save<Post>(post)
  }
}

export async function postUpdated({ event, store }: EventContext & StoreContext) {
  const [, id ] = new Posts.PostUpdatedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  const post = await store.get(Post, { where: `post_id = '${id.toString()}'` })
  if (!post) return

  const postStruct = await resolvePostStruct(id as unknown as PostId)
  if (!postStruct) return

  if (post.updatedAtTime === postStruct.updatedAtTime) return

  post.createdByAccount = postStruct.createdByAccount

  const content = postStruct.content
  post.content = content

  post.updatedAtTime = postStruct.updatedAtTime

  if (postStruct.spaceId != '') {
    await updateCountersInSpace(store, postStruct.spaceId as unknown as SpaceId)
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

  await store.save<Post>(post)
}

export async function postShared({ event, store }: EventContext & StoreContext) {
  const [, id ] = new Posts.PostSharedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  const post = await store.get(Post, { where: `post_id = '${id.toString()}'` })
  if (!post) return

  const postStruct = await resolvePostStruct(id as unknown as PostId)
  if (!postStruct) return

  post.sharesCount = postStruct.sharesCount

  await store.save<Post>(post)
}

const updateReplyCount = async (store: DatabaseManager, postId: PostId) => {
  const post = await store.get(Post, { where: `post_id = '${postId.toString()}'` })
  if (!post) return

  const postStruct = await resolvePostStruct(postId)
  if (!postStruct) return

  post.repliesCount = postStruct.repliesCount
  post.hiddenRepliesCount = postStruct.hiddenRepliesCount
  post.publicRepliesCount = post.repliesCount - post.hiddenRepliesCount

  await store.save<Post>(post)
}

const updateCountersInSpace = async (store: DatabaseManager, spaceId: SpaceId) => {
  const space = await store.get(Space, { where: `space_id = '${spaceId.toString()}'` })
  if (!space) return

  const spaceStruct = await resolveSpaceStruct(spaceId)
  if (!spaceStruct) return

  space.postsCount = spaceStruct.postsCount
  space.hiddenPostsCount = spaceStruct.hiddenPostsCount
  space.publicPostsCount = space.postsCount - space.hiddenPostsCount

  await store.save<Space>(space)
}

export const insertPost = async (id: PostId, store?: DatabaseManager) => {
  const postStruct = await resolvePostStruct(id)
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
    await updateCountersInSpace(store, postStruct.spaceId as unknown as SpaceId)
  }

  switch (postStruct.kind) {
    case 'Comment': {
      const extencionParentId = postStruct.extension.asComment.parent_id
      const rootPostId =  postStruct.extension.asComment.root_post_id
      const parentId = extencionParentId.isNone ? undefined : extencionParentId.unwrap()

      post.rootPostId = rootPostId.toString()
      post.parentId = parentId?.toString()

      if (rootPostId && rootPostId != null && store)
        await updateReplyCount(store, rootPostId)
      if (parentId && parentId != null && store)
        await updateReplyCount(store, parentId)

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