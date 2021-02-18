import { SubstrateEvent, DB } from '../generated/hydra-processor'
import { Post, PostKind } from '../generated/graphql-server/src/modules/post/post.model'
import { PostId, SpaceId } from '@subsocial/types/substrate/interfaces';
import { resolvePostStruct, resolveIpfsPostData } from './resolvers/resolvePostData';
import { insertTagInPostTags } from './tag';
import { stringDateToTimestamp } from './utils';
import { Space } from '../generated/graphql-server/src/modules/space/space.model';
import { resolveSpaceStruct } from './resolvers/resolveSpaceData';

type Comment = {
  root_post_id: string,
  parent_id?: string
}

export async function posts_PostCreated(db: DB, event: SubstrateEvent) {
  const [address, id] = event.params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  const postStruct = await resolvePostStruct(id.value as unknown as PostId)
  if (!postStruct) return

  const post = new Post()

  const [kind, value] = (Object.entries(event.extrinsic.args[1].value)[0] || []) as [PostKind, string | object]

  post.postId = id.value as string
  const content = postStruct.content

  post.content = content

  const postContent = await resolveIpfsPostData(content, post.postId)

  post.createdByAccount = address.value.toString()
  post.kind = kind

  post.updatedAtTime = postStruct.updatedAtTime
  post.spaceId = postStruct.spaceId
  if (postStruct.spaceId != '') {
    await updateCountersInSpace(db, postStruct.spaceId as unknown as SpaceId)
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

    await insertTagInPostTags(db, postContent.tags, post.postId)
  }

  switch (kind) {
    case 'Comment': {
      const comment = value as Comment
      const rootPostId = comment.root_post_id
      const parentId = comment.parent_id

      post.rootPostId = rootPostId
      post.parentId = parentId

      if (rootPostId != '' && rootPostId != null)
        await updateReplyCount(db, rootPostId as unknown as PostId)
      if (parentId != '' && parentId != null)
        await updateReplyCount(db, parentId as unknown as PostId)

      break
    }
    case 'SharedPost': {
      post.sharedPostId = value as string
      break
    }
  }

  await db.save<Post>(post)
}

export async function posts_PostUpdated(db: DB, event: SubstrateEvent) {
  const [address, id] = event.params
  console.log('I update post')

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  const post = await db.get(Post, { where: `post_id = '${id.value.toString()}'` })
  if (!post) return

  const postStruct = await resolvePostStruct(id.value as unknown as PostId)
  if (!postStruct) return

  if (stringDateToTimestamp(post.updatedAtTime) === stringDateToTimestamp(postStruct.updatedAtTime)) return

  post.createdByAccount = address.value.toString()

  const content = postStruct.content
  post.content = content

  post.updatedAtTime = postStruct.updatedAtTime
  if (postStruct.spaceId != '') {
    await updateCountersInSpace(db, postStruct.spaceId as unknown as SpaceId)
  }
  const postContent = await resolveIpfsPostData(content, post.postId)

  if (postContent) {
    post.title = postContent.title
    post.image = postContent.image
    post.summary = postContent.summarize
    post.slug = postContent.slug
    post.tagsOriginal = postContent.tags.join(',')

    await insertTagInPostTags(db, postContent.tags, post.postId)
  }

  await db.save<Post>(post)
}

export async function posts_PostShared(db: DB, event: SubstrateEvent) {
  const [address, id] = event.params
  console.log('I update post')

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  const post = await db.get(Post, { where: `post_id = '${id.value.toString()}'` })
  if (!post) return

  const postStruct = await resolvePostStruct(id.value as unknown as PostId)
  if (!postStruct) return

  post.sharesCount = postStruct.sharesCount

  await db.save<Post>(post)
}

const updateReplyCount = async (db: DB, postId: PostId) => {
  const post = await db.get(Post, { where: `post_id = '${postId.toString()}'` })
  if (!post) return

  const postStruct = await resolvePostStruct(postId)
  if (!postStruct) return

  post.repliesCount = postStruct.repliesCount
  post.hiddenRepliesCount = postStruct.hiddenRepliesCount
  post.publicRepliesCount = post.repliesCount - post.hiddenRepliesCount

  await db.save<Post>(post)
}

const updateCountersInSpace = async (db: DB, spaceId: SpaceId) => {
  const space = await db.get(Space, { where: `space_id = '${spaceId.toString()}'` })
  if (!space) return

  const spaceStruct = await resolveSpaceStruct(spaceId)
  if (!spaceStruct) return

  space.postsCount = spaceStruct.postsCount
  space.hiddenPostsCount = spaceStruct.hiddenPostsCount
  space.publicPostsCount = space.postsCount - space.hiddenPostsCount

  await db.save<Space>(space)
}