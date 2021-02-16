import { SubstrateEvent, DB } from '../generated/hydra-processor'
import { Post, PostKind } from '../generated/graphql-server/src/modules/post/post.model'
import { PostId } from '@subsocial/types/substrate/interfaces';
import { resolvePostStruct, resolveIpfsPostData } from './resolvers/resolvePostData';
import { insertTagInPostTags } from './tag';

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
  post.repliesCount = postStruct.repliesCount
  post.hiddenRepliesCount = postStruct.hiddenRepliesCount
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
      post.rootPostId = comment.root_post_id
      post.parentId = comment.parent_id
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

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  const post = await db.get(Post, { where: `post_id = '${id.value.toString()}'` })
  if (!post) return

  const postStruct = await resolvePostStruct(id.value as unknown as PostId)
  if (!postStruct) return

  if (Number(post.updatedAtTime) >= Number(postStruct.updatedAtTime)) return

  post.createdByAccount = address.value.toString()

  const content = postStruct.content
  post.content = content

  post.updatedAtTime = postStruct.updatedAtTime
  post.repliesCount = postStruct.repliesCount
  post.hiddenRepliesCount = postStruct.hiddenRepliesCount
  post.sharesCount = postStruct.sharesCount
  post.upvotesCount = postStruct.upvotesCount
  post.downvotesCount = postStruct.downvotesCount
  post.score = postStruct.score

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