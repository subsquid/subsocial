import { SubstrateEvent, DB } from '../generated/hydra-processor'
import { resolvePostStruct } from './resolvers/resolvePostData';
import { PostId } from '@subsocial/types/substrate/interfaces';
import { Post } from '../generated/graphql-server/src/modules/post/post.model';

export async function reactions_PostReactionCreated(db: DB, event: SubstrateEvent) {
  const [address, id] = event.params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await upvoteOrDownvotePost(db, id.value as unknown as PostId)
}

export async function reactions_PostReactionUpdated(db: DB, event: SubstrateEvent) {
  const [address, id] = event.params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await upvoteOrDownvotePost(db, id.value as unknown as PostId)
}

export async function reactions_PostReactionDeleted(db: DB, event: SubstrateEvent) {
  const [address, id] = event.params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await upvoteOrDownvotePost(db, id.value as unknown as PostId)
}

const upvoteOrDownvotePost = async (db: DB, id: PostId) => {
  const post = await db.get(Post, { where: `post_id = '${id.toString()}'` })
  if (!post) return

  const postStruct = await resolvePostStruct(id)
  if (!postStruct) return

  post.upvotesCount = postStruct.upvotesCount
  post.downvotesCount = postStruct.downvotesCount
  post.score = postStruct.score

  await db.save<Post>(post)
}
