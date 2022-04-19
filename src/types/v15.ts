import type {Result} from './support'

export type ReactionKind = ReactionKind_Upvote | ReactionKind_Downvote

export interface ReactionKind_Upvote {
  __kind: 'Upvote'
}

export interface ReactionKind_Downvote {
  __kind: 'Downvote'
}
