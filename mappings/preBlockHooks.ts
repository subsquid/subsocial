import { BlockContext, DatabaseManager, StoreContext } from "@joystream/hydra-common"
import { SubsocialSubstrateApi } from '@subsocial/api'
import BN from 'bn.js';
import { argv } from 'process'
import { isEmptyArray } from '@subsocial/utils';
import { getUniqueIds } from '@subsocial/api'
import { resolveSubsocialApi } from "../connection/subsocial"
import { SpaceId, PostId } from '@subsocial/types/substrate/interfaces';
import { insertSpace } from './space';
import { insertPost } from './post';
import { newLogger } from '@subsocial/utils'
import pThrottle from "p-throttle"

const log = newLogger('PreBlockHooks')

const one = new BN(1)

type ReindexerFn = (substrate: SubsocialSubstrateApi, store: DatabaseManager) => Promise<void>

export async function genesisLoader({ store }: BlockContext & StoreContext) {
  const { substrate } = await resolveSubsocialApi()
  await reindexContentFromStorages(substrate, store)
}

const reindexSpaces: ReindexerFn = async (substrate, store) => {
  const lastSpaceId = (await substrate.nextSpaceId()).sub(one)
  const lastSpaceIdStr = lastSpaceId.toString()

  const spaceIds = Array.from({ length: lastSpaceId.toNumber() }, (_, i) => i + 1)

  const spaceIndexators = spaceIds.map(async (spaceId) => {
    const id = new BN(spaceId) as SpaceId

    log.info(`Index space # ${spaceId} out of ${lastSpaceIdStr}`)

    const space = await insertSpace(id, store)

    if(space) {
      log.info(`Inserting space with id: ${id.toString()}`)
      await store.save(space)
    }
  })

  const throttle = pThrottle({
    limit: 2,
    interval: 5000
  });


  throttle(() => spaceIndexators)
}

const reindexPosts: ReindexerFn = async (substrate, store) => {
  const lastPostId = (await substrate.nextPostId()).sub(one)
  const lastPostIdStr = lastPostId.toString()

  const postIds = Array.from({ length: lastPostId.toNumber() }, (_, i) => i + 1)

  const postIndexators = postIds.map(async (postId) => {
    const id = new BN(postId) as PostId

    log.info(`Index post # ${postId} out of ${lastPostIdStr}`)

    const post = await insertPost(id, store)

    if(post) {
      log.info(`Inserting post with id: ${id.toString()}`)
      await store.save(post)
    }
  })

  const throttle = pThrottle({
    limit: 4,
    interval: 5000
  });

  throttle(() => postIndexators)
}

type IReindexerFunction = Record<string, ReindexerFn>

const ReindexerFunction: IReindexerFunction = {
  spaces: reindexSpaces,
  posts: reindexPosts,
}

const AllReindexerFunctions = Object.values(ReindexerFunction)

async function reindexContentFromStorages(substrate: SubsocialSubstrateApi, store: DatabaseManager  ) {
  for (const fn of AllReindexerFunctions) {
    await fn(substrate, store)
  }
}
