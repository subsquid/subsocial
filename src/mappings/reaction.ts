import { PostId } from "@subsocial/types/substrate/interfaces"
import { DatabaseManager, EventContext, StoreContext } from "@subsquid/hydra-common"
import { Reactions as ReactionsV1 } from "../types-V1"
import { Reactions as ReactionsV2 } from "../types-V2"
import { resolvePostStruct } from './resolvers/resolvePostData';
import { Post } from '../generated/model/post.model';

export async function postReactionCreatedV1({ event, store }: EventContext & StoreContext) {

  const [, id] = new ReactionsV1.PostReactionCreatedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await upvoteOrDownvotePost(store, id)
}

export async function postReactionUpdatedV1({ event, store }: EventContext & StoreContext) {
  const [, id] = new ReactionsV1.PostReactionUpdatedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await upvoteOrDownvotePost(store, id)
}

export async function postReactionDeletedV1({ event, store }: EventContext & StoreContext) {
    const [, id] = new ReactionsV1.PostReactionDeletedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await upvoteOrDownvotePost(store, id)
}

export async function postReactionCreatedV2({ event, store }: EventContext & StoreContext) {

  const [, id] = new ReactionsV2.PostReactionCreatedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await upvoteOrDownvotePost(store, id)
}

export async function postReactionUpdatedV2({ event, store }: EventContext & StoreContext) {
  const [, id] = new ReactionsV2.PostReactionUpdatedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await upvoteOrDownvotePost(store, id)
}

export async function postReactionDeletedV2({ event, store }: EventContext & StoreContext) {
    const [, id] = new ReactionsV2.PostReactionDeletedEvent(event).params

  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  await upvoteOrDownvotePost(store, id)
}

const upvoteOrDownvotePost = async (store: DatabaseManager, id: PostId) => {
  const post = await store.get(Post, { where: { postId: id.toString()} })
  if (!post) return

  const postStruct = await resolvePostStruct(id)
  if (!postStruct) return

  post.upvotesCount = postStruct.upvotesCount
  post.downvotesCount = postStruct.downvotesCount
  post.score = postStruct.score

  await store.save<Post>(post)
}
