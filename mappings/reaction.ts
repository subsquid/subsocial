import { DatabaseManager, EventContext, StoreContext } from "@joystream/hydra-common"
import { PostId } from "@subsocial/types/substrate/interfaces"
import { Post } from "../generated/graphql-server/src/modules/post/post.model"
import { Reactions } from "./generated/types"
import { resolvePostStruct } from './resolvers/resolvePostData';

export async function postReactionCreated({ event, store }: EventContext & StoreContext) {
  const [, id] = new Reactions.PostReactionCreatedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await upvoteOrDownvotePost(store, id)
}

export async function postReactionUpdated({ event, store }: EventContext & StoreContext) {
  const [, id] = new Reactions.PostReactionUpdatedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await upvoteOrDownvotePost(store, id)
}

export async function postReactionDeleted({ event, store }: EventContext & StoreContext) {
    const [, id] = new Reactions.PostReactionDeletedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await upvoteOrDownvotePost(store, id)
}

const upvoteOrDownvotePost = async (store: DatabaseManager, id: PostId) => {
  const post = await store.get(Post, { where: `post_id = '${id.toString()}'` })
  if (!post) return

  const postStruct = await resolvePostStruct(id)
  if (!postStruct) return

  post.upvotesCount = postStruct.upvotesCount
  post.downvotesCount = postStruct.downvotesCount
  post.score = postStruct.score

  await store.save<Post>(post)
}
