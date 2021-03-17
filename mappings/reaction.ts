import { DatabaseManager } from '@dzlzv/hydra-db-utils'
import { resolvePostStruct } from './resolvers/resolvePostData';
import { PostId, Reaction } from '@subsocial/types/substrate/interfaces';
import { Post } from '../generated/graphql-server/src/modules/post/post.model';
import { Reactions } from './generated/types';

export async function postReactionCreated(db: DatabaseManager, event: Reactions.PostReactionCreatedEvent) {
  const { postId: id } = event.data

  if (event.ctx.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await upvoteOrDownvotePost(db, id)
}

export async function postReactionUpdated(db: DatabaseManager, event: Reactions.PostReactionUpdatedEvent) {
  const { postId: id } = event.data

  if (event.ctx.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await upvoteOrDownvotePost(db, id)
}

export async function postReactionDeleted(db: DatabaseManager, event: Reactions.PostReactionDeletedEvent) {
  const { postId: id } = event.data

  if (event.ctx.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await upvoteOrDownvotePost(db, id)
}

const upvoteOrDownvotePost = async (db: DatabaseManager, id: PostId) => {
  const post = await db.get(Post, { where: `post_id = '${id.toString()}'` })
  if (!post) return

  const postStruct = await resolvePostStruct(id)
  if (!postStruct) return

  post.upvotesCount = postStruct.upvotesCount
  post.downvotesCount = postStruct.downvotesCount
  post.score = postStruct.score

  await db.save<Post>(post)
}
