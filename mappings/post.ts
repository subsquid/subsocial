import { DatabaseManager, EventContext, StoreContext } from "@joystream/hydra-common"
import { resolvePostStruct, resolveIpfsPostData } from './resolvers/resolvePostData';
import { Post } from '../generated/graphql-server/src/modules/post/post.model';
import { getDateWithoutTime, getOrInsertProposal } from './utils';
import { PostKind } from '../generated/graphql-server/src/modules/enums/enums';
import { PostId, SpaceId } from '@subsocial/types/substrate/interfaces';
import { insertTagInPostTags } from './tag';
import { isEmptyArray } from "@subsocial/utils"
import { resolveSpaceStruct } from './resolvers/resolveSpaceData';
import { Space } from "../generated/graphql-server/src/modules/space/space.model"
import { Posts } from "./generated/types"

type Comment = {
  root_post_id: string,
  parent_id?: string
}

export async function postCreated({ event, store }: EventContext & StoreContext) {
  const [, id ] = new Posts.PostCreatedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  const postStruct = await resolvePostStruct(id)
  if (!postStruct) return

  const post = new Post()

  const [, value] = (Object.entries(
    event.extrinsic.args[1]?.value || event.extrinsic.args[0]?.value
  )[0] || []) as [PostKind, string | object]

  post.createdByAccount = postStruct.createdByAccount
  post.createdAtBlock = postStruct.createdAtBlock
  post.createdAtTime = postStruct.createdAtTime
  post.createdOnDay = getDateWithoutTime(postStruct.createdAtTime)
  post.postId = id.toString()
  const content = postStruct.content

  post.content = content

  const postContent = await resolveIpfsPostData(content, post.postId)

  post.kind = postStruct.kind

  post.updatedAtTime = postStruct.updatedAtTime
  post.spaceId = postStruct.spaceId
  if (postStruct.spaceId != '') {
    await updateCountersInSpace(store, postStruct.spaceId as unknown as SpaceId)
  }

  switch (postStruct.kind) {
    case 'Comment': {
      const comment = value as Comment
      const rootPostId = comment.root_post_id
      const parentId = comment.parent_id

      post.rootPostId = rootPostId
      post.parentId = parentId

      if (rootPostId != '' && rootPostId != null)
        await updateReplyCount(store, rootPostId as unknown as PostId)
      if (parentId != '' && parentId != null)
        await updateReplyCount(store, parentId as unknown as PostId)

      break
    }
    case 'SharedPost': {
      post.sharedPostId = value as string
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

    const tags = await insertTagInPostTags(store, postContent.tags, post.postId, post)


    if (!isEmptyArray(tags)) {
      post.tags = tags
    }

    const meta = postContent.meta

    if(meta && !isEmptyArray(meta)) {
      const proposal = await getOrInsertProposal(store, meta[0], post)
      post.treasuryProposal = proposal
    }
  }

  await store.save<Post>(post)
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

    const tags = await insertTagInPostTags(store, postContent.tags, post.postId, post)

    if (!isEmptyArray(tags)) {
      post.tags = tags
    }
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