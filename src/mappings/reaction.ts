import { PostId } from "@subsocial/types/substrate/interfaces"
import { EventHandlerContext, Store } from "@subsquid/substrate-processor";
import BN from "bn.js";
import { Post } from "../model";
import { ReactionsPostReactionCreatedEvent, ReactionsPostReactionDeletedEvent, ReactionsPostReactionUpdatedEvent } from "../types/events";
import { resolvePostStruct } from './resolvers/resolvePostData';

export async function postReactionCreatedV1(ctx: EventHandlerContext) {
  const event = new ReactionsPostReactionCreatedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  if (event.isV1) {
    const [_, id] = event.asV1;

    await upvoteOrDownvotePost(ctx.store, id)
  }
}

export async function postReactionUpdatedV1(ctx: EventHandlerContext) {
  const event = new ReactionsPostReactionUpdatedEvent(ctx);
  
  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  if (event.isV1) {
    const [_, id] = event.asV1;

    await upvoteOrDownvotePost(ctx.store, id)
  }
}

export async function postReactionDeletedV1(ctx: EventHandlerContext) {
  const event = new ReactionsPostReactionDeletedEvent(ctx);
  
  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  if (event.isV1) {
    const [_, id] = event.asV1;

    await upvoteOrDownvotePost(ctx.store, id)
  }
}

export async function postReactionCreatedV2(ctx: EventHandlerContext) {
  const event = new ReactionsPostReactionCreatedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  if (event.isV15) {
    const [_, id] = event.asV15;

    await upvoteOrDownvotePost(ctx.store, id)
  }
}

export async function postReactionUpdatedV2(ctx: EventHandlerContext) {
  const event = new ReactionsPostReactionUpdatedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  if (event.isV15) {
    const [_, id] = event.asV15; 

    await upvoteOrDownvotePost(ctx.store, id)
  }
}

export async function postReactionDeletedV2(ctx: EventHandlerContext) {
    const event = new ReactionsPostReactionDeletedEvent(ctx);

  if (ctx.event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  if (event.isV15) {
    const [_, id] = event.asV15; 

    await upvoteOrDownvotePost(ctx.store, id)
  }
}

const upvoteOrDownvotePost = async (store: Store, id: bigint) => {
  const post = await store.get(Post, { where: { postId: id.toString()} })
  if (!post) return

  const postStruct = await resolvePostStruct(new BN(id.toString(), 10))
  if (!postStruct) return

  post.upvotesCount = postStruct.upvotesCount
  post.downvotesCount = postStruct.downvotesCount
  post.score = postStruct.score

  await store.save<Post>(post)
}
