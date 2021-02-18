// Export here all the event handler functions
// so that the indexer picks them up
export { posts_PostCreated, posts_PostUpdated, posts_PostShared } from './post'
export { reactions_PostReactionCreated, reactions_PostReactionUpdated, reactions_PostReactionDeleted } from './reaction'
export { spaces_SpaceCreated, spaces_SpaceUpdated } from './space'
export { spaceFollows_SpaceFollowed, spaceFollows_SpaceUnfollowed } from './space-follows'

