import BN from 'bn.js'
import { resolveSubsocialApi } from '../../connection/subsocial'
import { createPostSlug } from '@subsocial/utils/slugify'
import { formatTegs } from '../utils'
import { summarizeMd } from '@subsocial/utils/summarize'
import { AnyPostId, MetaItem } from '@subsocial/types'
import { PostKind } from '../../model'
import { PostExtension } from '@subsocial/types/substrate/interfaces'

export type PostCounters = {
	createdByAccount: string
	createdAtBlock: BN
	createdAtTime: Date | undefined
	updatedAtTime: Date | undefined
	kind: PostKind
	extension: PostExtension
	spaceId: string
	content: string
	repliesCount: number
	hiddenRepliesCount: number
	sharesCount: number
	upvotesCount: number
	downvotesCount: number
	score: number
}

export type PostContent = {
	title: string
	image: string
	summarize: string
	slug: string
	tags: string[]
	meta?: MetaItem[]
}

export const resolvePostStruct = async (
	id: AnyPostId
): Promise<PostCounters | undefined> => {
	const subsocial = await resolveSubsocialApi()

	const post = await subsocial.findPost({ id })
	if (!post) return

	const {
		created,
		spaceId,
		repliesCount,
		hiddenRepliesCount,
		sharesCount,
		upvotesCount,
		downvotesCount,
		score,
		content,
		updated,
		extension,
	} = post.struct

	const { account, block, time } = created
	const createdAtTime = !time.isEmpty ? new Date(time.toNumber()) : undefined
	const updatedAtTime = updated.isSome
		? new Date(updated.unwrap().time.toNumber())
		: undefined
	const spaceIdString = spaceId.isSome ? spaceId.unwrap().toString() : ''
	const kind = extension.type as PostKind

	return {
		createdByAccount: account.toString(),
		createdAtBlock: new BN(block),
		createdAtTime,
		updatedAtTime,
		kind,
		extension: extension as unknown as PostExtension,
		spaceId: spaceIdString,
		content: !content.isNone ? content.asIpfs.toString() : '',
		repliesCount: repliesCount.toNumber(),
		hiddenRepliesCount: hiddenRepliesCount.toNumber(),
		sharesCount: sharesCount.toNumber(),
		upvotesCount: upvotesCount.toNumber(),
		downvotesCount: downvotesCount.toNumber(),
		score: score.toNumber(),
	}
}

export const resolveIpfsPostData = async (
	cid: string,
	postId: string
): Promise<PostContent | undefined> => {
	const { ipfs } = await resolveSubsocialApi()

	const content = await ipfs.findPost(cid)
	if (!content) return

	const title = content.title ? content.title : ''
	const slug = createPostSlug(postId, { body: content.body, title })
	const tags = content.tags ? formatTegs(content.tags) : []

	if (content) {
		return {
			title,
			image: content.image,
			summarize: content.body ? summarizeMd(content.body).summary : '',
			slug,
			tags,
			meta: content.meta,
		}
	}
}
