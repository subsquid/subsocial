import { SubsocialSubstrateApi } from '@subsocial/api'
import BN from 'bn.js';
import { SpaceId, PostId } from '@subsocial/types/substrate/interfaces';
import { insertSpace } from './space';
import { newLogger } from '@subsocial/utils'
import pThrottle from "p-throttle"
import { dbUser, dbHost, dbName, dbPass, dbPort } from '../env';
import { Pool } from 'pg';
import { insertPost } from './post';
import { resolveSubsocialApi } from '../connection/subsocial'
const named = require('yesql').pg

const log = newLogger('PreBlockHooks')

const one = new BN(1)

const pgConf: any = {
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPass,
  port: dbPort,
}

const pg = new Pool(pgConf)

const insertPosQuery = `INSERT INTO public.post (id,created_at, created_by_id, "version",
  created_by_account, created_at_block, created_at_time, created_on_day, post_id, updated_at_time, space_id, "content", kind, parent_id,
  root_post_id, shared_post_id, replies_count, public_replies_count, hidden_replies_count, shares_count, upvotes_count,
  downvotes_count, score, title, slug, summary, image, canonical, tags_original, proposal_index)
VALUES(:id, :createdAt, :createdById, :version, :createdByAccount, :createdAtBlock,
:createdAtTime, :createdOnDay, :postId, :updatedAtTime, :spaceId, :content, :kind, :parentId, :rootPostId, :sharedPostId,
:repliesCount, :publicRepliesCount, :hiddenRepliesCount, :sharesCount, :upvotesCount, :downvotesCount, :score, :title, :slug,
:summary, :image, :canonical, :tagsOriginal, :proposalIndex)
RETURNING *`

const insertSpaceQuery = `INSERT INTO public.space (id, created_at, created_by_id, "version",
  created_by_account, created_at_block, created_at_time, created_on_day, space_id, updated_at_time, owner_id, posts_count,
  public_posts_count, hidden_posts_count, followers_count, score, "content", "name", image, summary, tags_original)
VALUES(:id, :createdAt, :createdById, :version,
  :createdByAccount, :createdAtBlock, :createdAtTime, :createdOnDay, :spaceId, :updatedAtTime, :ownerId, :postsCount,
  :publicPostsCount, :hiddenPostsCount, :followersCount, :score, :content, :name, :image, :summary, :tagsOriginal)
RETURNING *`


type ReindexerFn = (substrate: SubsocialSubstrateApi) => Promise<void>

const throttle = pThrottle({
  limit: 6,
  interval: 5000
});

const reindexSpaces: ReindexerFn = async (substrate) => {
  const spaceId = await substrate.nextSpaceId();
  const lastSpaceId = (new BN(spaceId.toString(), 10)).sub(one)
  const lastSpaceIdStr = lastSpaceId.toString()

  const spaceIds = Array.from({ length: lastSpaceId.toNumber() }, (_, i) => i + 1)

  for (const spaceId of spaceIds) {
    const id = BigInt(spaceId);

    log.info(`Index space # ${spaceId} out of ${lastSpaceIdStr}`)

    const space = await insertSpace(id)

    if(space) {

      space.id = id.toString()
      // space.createdAt = new Date()
      // space.createdById = space.createdByAccount || ''
      // space.version = 1

      space.updatedAtTime = space?.updatedAtTime
      space.name = space?.name
      space.image = space?.image
      space.summary = space?.summary
      space.tagsOriginal = space?.tagsOriginal

      log.info(`Inserting space with id: ${id.toString()}`)
      await pg.query(named(insertSpaceQuery)(space))
      log.info(`Space with id - ${id.toString()} is inserted`)
    }
  }
}

const reindexPosts: ReindexerFn = async (substrate) => {
  const postId = await substrate.nextPostId();
  const lastPostId = (new BN(postId.toString(), 10)).sub(one)
  const lastPostIdStr = lastPostId.toString()

  const postIds = Array.from({ length: lastPostId.toNumber() }, (_, i) => i + 1)

  for (const postId of postIds) {
    const id = new BN(postId);

    log.info(`Index post # ${postId} out of ${lastPostIdStr}`)

    const post = await insertPost(BigInt(id.toString()))
    if(post) {
      post.id = id.toString()
      // post.createdAt = new Date()
      // post.createdById = post.createdByAccount || ''
      // post.version = 1

      post.updatedAtTime = post?.updatedAtTime
      post.parentId = post?.parentId
      post.sharedPostId = post?.sharedPostId
      post.rootPostId = post?.rootPostId
      post.proposalIndex = post?.proposalIndex
      post.canonical = post?.canonical
      post.title = post?.title
      post.image = post?.image
      post.summary = post?.summary
      post.slug = post?.slug
      post.tagsOriginal = post?.tagsOriginal

      log.info(`Inserting post with id: ${id.toString()}`)
      await pg.query(named(insertPosQuery)(post))
      log.info(`Post with id - ${id.toString()} is insetred`)
    }
  }
}

type IReindexerFunction = Record<string, ReindexerFn>

const ReindexerFunction: IReindexerFunction = {
  spaces: reindexSpaces,
  posts: reindexPosts,
}

const AllReindexerFunctions = Object.values(ReindexerFunction)

async function reindexContentFromStorages(substrate: SubsocialSubstrateApi  ) {
  for (const fn of AllReindexerFunctions) {
    await fn(substrate)
  }
}

resolveSubsocialApi().then(async (api) => {
  await reindexContentFromStorages(api.subsocial.substrate)
})