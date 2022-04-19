import assert from 'assert'
import {EventContext, Result, deprecateLatest} from './support'
import * as v15 from './v15'

export class PostsPostCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'posts.PostCreated')
  }

  get isV1(): boolean {
    return this.ctx._chain.getEventHash('posts.PostCreated') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1
  }

  get asLatest(): [Uint8Array, bigint] {
    deprecateLatest()
    return this.asV1
  }
}

export class PostsPostSharedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'posts.PostShared')
  }

  get isV1(): boolean {
    return this.ctx._chain.getEventHash('posts.PostShared') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1
  }

  get asLatest(): [Uint8Array, bigint] {
    deprecateLatest()
    return this.asV1
  }
}

export class PostsPostUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'posts.PostUpdated')
  }

  get isV1(): boolean {
    return this.ctx._chain.getEventHash('posts.PostUpdated') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1
  }

  get asLatest(): [Uint8Array, bigint] {
    deprecateLatest()
    return this.asV1
  }
}

export class ReactionsPostReactionCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'reactions.PostReactionCreated')
  }

  get isV1(): boolean {
    return this.ctx._chain.getEventHash('reactions.PostReactionCreated') === '5ecf574fedb0dd818c5b40ec149d9c842d218107d35c4018d00cc169f56e1267'
  }

  get asV1(): [Uint8Array, bigint, bigint] {
    assert(this.isV1)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV15(): boolean {
    return this.ctx._chain.getEventHash('reactions.PostReactionCreated') === 'ca26d2ea071b219e270b1a6e49302db57fadc150e90c604899be4c3c166995ae'
  }

  get asV15(): [Uint8Array, bigint, bigint, v15.ReactionKind] {
    assert(this.isV15)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV15
  }

  get asLatest(): [Uint8Array, bigint, bigint, v15.ReactionKind] {
    deprecateLatest()
    return this.asV15
  }
}

export class ReactionsPostReactionDeletedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'reactions.PostReactionDeleted')
  }

  get isV1(): boolean {
    return this.ctx._chain.getEventHash('reactions.PostReactionDeleted') === '5ecf574fedb0dd818c5b40ec149d9c842d218107d35c4018d00cc169f56e1267'
  }

  get asV1(): [Uint8Array, bigint, bigint] {
    assert(this.isV1)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV15(): boolean {
    return this.ctx._chain.getEventHash('reactions.PostReactionDeleted') === 'ca26d2ea071b219e270b1a6e49302db57fadc150e90c604899be4c3c166995ae'
  }

  get asV15(): [Uint8Array, bigint, bigint, v15.ReactionKind] {
    assert(this.isV15)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV15
  }

  get asLatest(): [Uint8Array, bigint, bigint, v15.ReactionKind] {
    deprecateLatest()
    return this.asV15
  }
}

export class ReactionsPostReactionUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'reactions.PostReactionUpdated')
  }

  get isV1(): boolean {
    return this.ctx._chain.getEventHash('reactions.PostReactionUpdated') === '5ecf574fedb0dd818c5b40ec149d9c842d218107d35c4018d00cc169f56e1267'
  }

  get asV1(): [Uint8Array, bigint, bigint] {
    assert(this.isV1)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isV15(): boolean {
    return this.ctx._chain.getEventHash('reactions.PostReactionUpdated') === 'ca26d2ea071b219e270b1a6e49302db57fadc150e90c604899be4c3c166995ae'
  }

  get asV15(): [Uint8Array, bigint, bigint, v15.ReactionKind] {
    assert(this.isV15)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV15
  }

  get asLatest(): [Uint8Array, bigint, bigint, v15.ReactionKind] {
    deprecateLatest()
    return this.asV15
  }
}

export class SpaceFollowsSpaceFollowedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'spaceFollows.SpaceFollowed')
  }

  get isV1(): boolean {
    return this.ctx._chain.getEventHash('spaceFollows.SpaceFollowed') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1
  }

  get asLatest(): [Uint8Array, bigint] {
    deprecateLatest()
    return this.asV1
  }
}

export class SpaceFollowsSpaceUnfollowedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'spaceFollows.SpaceUnfollowed')
  }

  get isV1(): boolean {
    return this.ctx._chain.getEventHash('spaceFollows.SpaceUnfollowed') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1
  }

  get asLatest(): [Uint8Array, bigint] {
    deprecateLatest()
    return this.asV1
  }
}

export class SpacesSpaceCreatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'spaces.SpaceCreated')
  }

  get isV1(): boolean {
    return this.ctx._chain.getEventHash('spaces.SpaceCreated') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1
  }

  get asLatest(): [Uint8Array, bigint] {
    deprecateLatest()
    return this.asV1
  }
}

export class SpacesSpaceUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'spaces.SpaceUpdated')
  }

  get isV1(): boolean {
    return this.ctx._chain.getEventHash('spaces.SpaceUpdated') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV1
  }

  get asLatest(): [Uint8Array, bigint] {
    deprecateLatest()
    return this.asV1
  }
}
