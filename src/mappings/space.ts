import {
	resolveSpaceStruct,
	resolveIpfsSpaceData,
} from './resolvers/resolveSpaceData'
import { getDateWithoutTime } from './utils'
import { SpaceId } from '@subsocial/types/substrate/interfaces'
import { EventContext } from '../types/support'
import { Space } from '../model'
import { EventHandlerContext, Store, SubstrateEvent } from '@subsquid/substrate-processor'
import { SpacesSpaceCreatedEvent, SpacesSpaceUpdatedEvent } from '../types/events'
import BN from 'bn.js';

export async function spaceCreated(ctx: EventHandlerContext) {
	await createSpace(ctx)
}

export async function spaceUpdated(ctx: EventHandlerContext) {
	const event = new SpacesSpaceUpdatedEvent(ctx);

	if (ctx.event.extrinsic === undefined) {
		throw new Error(`No extrinsic has been provided`)
	}

	const [_, id] = event.asV1;

	let space = await ctx.store.get(Space, { where: `space_id = '${id.toString()}'` })
	if (!space) {
		await createSpace(ctx)
		return
	}

	const spaceStruct = await resolveSpaceStruct(new BN(id.toString()))
	if (!spaceStruct) return

	if (space.updatedAtTime === spaceStruct.updatedAtTime) return

	space.createdByAccount = spaceStruct.createdByAccount
	space.ownerId = spaceStruct.owner

	const content = spaceStruct.content
	space.content = content

	const spaceContent = await resolveIpfsSpaceData(content)

	space.postsCount = spaceStruct.postsCount
	space.hiddenPostsCount = spaceStruct.hiddenPostsCount
	space.followersCount = spaceStruct.followersCount
	space.score = spaceStruct.score

	if (spaceContent) {
		space.name = spaceContent.name
		space.summary = spaceContent.about
		space.image = spaceContent.image
		space.tagsOriginal = spaceContent.tags.join(',')

		// const tags = await insertTagInSpaceTags(store, spaceContent.tags, space.spaceId, space)

		// if (!isEmptyArray(tags)) {
		//   space.tags = tags
		// }
	}

	await ctx.store.save<Space>(space)
}

const createSpace = async (ctx: EventHandlerContext) => {
	const event = new SpacesSpaceCreatedEvent(ctx);

	if (ctx.event.extrinsic === undefined) {
		throw new Error(`No extrinsic has been provided`)
	}

	const [_, id] = event.asV1;

	const space = await insertSpace(id, ctx.store)

	if (space) {
		await ctx.store.save<Space>(space)
	}
}

export const insertSpace = async (id: bigint, store?: Store) => {
	const spaceStruct = await resolveSpaceStruct(new BN(id.toString()))
	if (!spaceStruct) return

	const space = new Space()

	space.spaceId = id.toString()
	space.createdByAccount = spaceStruct.createdByAccount
	space.createdAtBlock = BigInt(spaceStruct.createdAtBlock.toString())
	space.createdAtTime = spaceStruct.createdAtTime
	space.createdOnDay = getDateWithoutTime(spaceStruct.createdAtTime)

	space.ownerId = spaceStruct.owner

	const content = spaceStruct.content
	space.content = content

	space.postsCount = spaceStruct.postsCount
	space.hiddenPostsCount = spaceStruct.hiddenPostsCount
	space.publicPostsCount = space.postsCount - space.hiddenPostsCount
	space.followersCount = spaceStruct.followersCount
	space.score = spaceStruct.score

	if (content !== '') {
		const spaceContent = await resolveIpfsSpaceData(content)

		if (spaceContent) {
			space.name = spaceContent.name
			space.summary = spaceContent.about
			space.image = spaceContent.image
			space.tagsOriginal = spaceContent.tags.join(',')

			if (store) {
				// const tags = await insertTagInSpaceTags(
				// 	store,
				// 	spaceContent.tags,
				// 	space.spaceId,
				// 	space
				// )
				// if (!isEmptyArray(tags)) {
				// 	space.tags = tags
				// }
			}
		}
	}

	return space
}
