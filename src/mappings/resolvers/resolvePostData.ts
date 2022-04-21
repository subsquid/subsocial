// import BN from 'bn.js'
import { resolveSubsocialApi } from '../../connection/subsocial'
// import { createPostSlug } from '@subsocial/utils/slugify'
// import { formatTegs } from '../utils'
// import { summarizeMd } from '@subsocial/utils/summarize'
import { AnyPostId/* , MetaItem */ } from '@subsocial/types'
// import { PostKind } from '../../model'
// import { PostExtension } from '@subsocial/types/substrate/interfaces'
import { PostStruct, PostWithSomeDetails } from '@subsocial/types/dto'

export const resolvePost = async (
	id: AnyPostId
): Promise<PostWithSomeDetails | undefined> => {
	const subsocial = await resolveSubsocialApi()

	return await subsocial.findPostWithSomeDetails({ id });
}

export const resolvePostStruct = async (
	id: AnyPostId
): Promise<PostStruct | undefined> => {
	const subsocial = await resolveSubsocialApi()

	return await subsocial.findPostStruct(id.toString());
}
