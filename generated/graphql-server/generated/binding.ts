import 'graphql-import-node'; // Needed so you can import *.graphql files 

import { makeBindingClass, Options } from 'graphql-binding'
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import * as schema from  './schema.graphql'

export interface Query {
    posts: <T = Array<Post>>(args: { offset?: Int | null, limit?: Int | null, where?: PostWhereInput | null, orderBy?: Array<PostOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    postByUniqueInput: <T = Post | null>(args: { where: PostWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    postsConnection: <T = PostConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: PostWhereInput | null, orderBy?: Array<PostOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    postsWithSubnet: <T = Array<Post>>(args: { offset?: Int | null, limit?: Int | null, where?: PostWhereInput | null, subnetId?: String | null, orderBy?: Array<PostOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    spaces: <T = Array<Space>>(args: { offset?: Int | null, limit?: Int | null, where?: SpaceWhereInput | null, orderBy?: Array<SpaceOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    spaceByUniqueInput: <T = Space | null>(args: { where: SpaceWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    spacesConnection: <T = SpaceConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: SpaceWhereInput | null, orderBy?: Array<SpaceOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    spacesWithSubnet: <T = Array<Space>>(args: { offset?: Int | null, limit?: Int | null, where?: SpaceWhereInput | null, subnetId?: String | null, orderBy?: Array<SpaceOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    tags: <T = Array<Tag>>(args: { offset?: Int | null, limit?: Int | null, where?: TagWhereInput | null, orderBy?: Array<TagOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    tagByUniqueInput: <T = Tag | null>(args: { where: TagWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    tagsConnection: <T = TagConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: TagWhereInput | null, orderBy?: Array<TagOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    treasuryProposals: <T = Array<TreasuryProposal>>(args: { offset?: Int | null, limit?: Int | null, where?: TreasuryProposalWhereInput | null, orderBy?: Array<TreasuryProposalOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    treasuryProposalByUniqueInput: <T = TreasuryProposal | null>(args: { where: TreasuryProposalWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    treasuryProposalsConnection: <T = TreasuryProposalConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: TreasuryProposalWhereInput | null, orderBy?: Array<TreasuryProposalOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Mutation {}

export interface Subscription {
    stateSubscription: <T = ProcessorState>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> 
  }

export interface Binding {
  query: Query
  mutation: Mutation
  subscription: Subscription
  request: <T = any>(query: string, variables?: {[key: string]: any}) => Promise<T>
  delegate(operation: 'query' | 'mutation', fieldName: string, args: {
      [key: string]: any;
  }, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<any>;
  delegateSubscription(fieldName: string, args?: {
      [key: string]: any;
  }, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<AsyncIterator<any>>;
  getAbstractResolvers(filterSchema?: GraphQLSchema | string): IResolvers;
}

export interface BindingConstructor<T> {
  new(...args: any[]): T
}

export const Binding = makeBindingClass<BindingConstructor<Binding>>({ schema: schema as any })

/**
 * Types
*/

export type Network =   'Subsocial' |
  'Polkadot' |
  'Kusama'

export type PostKind =   'Comment' |
  'SharedPost' |
  'RegularPost'

export type PostOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'createdByAccount_ASC' |
  'createdByAccount_DESC' |
  'createdAtBlock_ASC' |
  'createdAtBlock_DESC' |
  'createdAtTime_ASC' |
  'createdAtTime_DESC' |
  'createdOnDay_ASC' |
  'createdOnDay_DESC' |
  'postId_ASC' |
  'postId_DESC' |
  'updatedAtTime_ASC' |
  'updatedAtTime_DESC' |
  'spaceId_ASC' |
  'spaceId_DESC' |
  'content_ASC' |
  'content_DESC' |
  'kind_ASC' |
  'kind_DESC' |
  'parentId_ASC' |
  'parentId_DESC' |
  'rootPostId_ASC' |
  'rootPostId_DESC' |
  'sharedPostId_ASC' |
  'sharedPostId_DESC' |
  'repliesCount_ASC' |
  'repliesCount_DESC' |
  'publicRepliesCount_ASC' |
  'publicRepliesCount_DESC' |
  'hiddenRepliesCount_ASC' |
  'hiddenRepliesCount_DESC' |
  'sharesCount_ASC' |
  'sharesCount_DESC' |
  'upvotesCount_ASC' |
  'upvotesCount_DESC' |
  'downvotesCount_ASC' |
  'downvotesCount_DESC' |
  'score_ASC' |
  'score_DESC' |
  'title_ASC' |
  'title_DESC' |
  'slug_ASC' |
  'slug_DESC' |
  'summary_ASC' |
  'summary_DESC' |
  'image_ASC' |
  'image_DESC' |
  'canonical_ASC' |
  'canonical_DESC' |
  'tagsOriginal_ASC' |
  'tagsOriginal_DESC' |
  'treasuryProposal_ASC' |
  'treasuryProposal_DESC'

export type SpaceOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'createdByAccount_ASC' |
  'createdByAccount_DESC' |
  'createdAtBlock_ASC' |
  'createdAtBlock_DESC' |
  'createdAtTime_ASC' |
  'createdAtTime_DESC' |
  'createdOnDay_ASC' |
  'createdOnDay_DESC' |
  'spaceId_ASC' |
  'spaceId_DESC' |
  'updatedAtTime_ASC' |
  'updatedAtTime_DESC' |
  'ownerId_ASC' |
  'ownerId_DESC' |
  'postsCount_ASC' |
  'postsCount_DESC' |
  'publicPostsCount_ASC' |
  'publicPostsCount_DESC' |
  'hiddenPostsCount_ASC' |
  'hiddenPostsCount_DESC' |
  'followersCount_ASC' |
  'followersCount_DESC' |
  'score_ASC' |
  'score_DESC' |
  'content_ASC' |
  'content_DESC' |
  'name_ASC' |
  'name_DESC' |
  'image_ASC' |
  'image_DESC' |
  'summary_ASC' |
  'summary_DESC' |
  'tagsOriginal_ASC' |
  'tagsOriginal_DESC'

export type TagOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'tag_ASC' |
  'tag_DESC'

export type TreasuryProposalOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'postId_ASC' |
  'postId_DESC' |
  'proposalId_ASC' |
  'proposalId_DESC' |
  'network_ASC' |
  'network_DESC'

export interface BaseWhereInput {
  id_eq?: String | null
  id_in?: String[] | String | null
  createdAt_eq?: String | null
  createdAt_lt?: String | null
  createdAt_lte?: String | null
  createdAt_gt?: String | null
  createdAt_gte?: String | null
  createdById_eq?: String | null
  updatedAt_eq?: String | null
  updatedAt_lt?: String | null
  updatedAt_lte?: String | null
  updatedAt_gt?: String | null
  updatedAt_gte?: String | null
  updatedById_eq?: String | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: String | null
  deletedAt_lt?: String | null
  deletedAt_lte?: String | null
  deletedAt_gt?: String | null
  deletedAt_gte?: String | null
  deletedById_eq?: String | null
}

export interface PostCreateInput {
  createdByAccount?: String | null
  createdAtBlock?: BigInt | null
  createdAtTime?: DateTime | null
  createdOnDay?: DateTime | null
  postId: String
  updatedAtTime?: DateTime | null
  spaceId: String
  content?: String | null
  kind?: PostKind | null
  parentId?: String | null
  rootPostId?: String | null
  sharedPostId?: String | null
  repliesCount?: Float | null
  publicRepliesCount?: Float | null
  hiddenRepliesCount?: Float | null
  sharesCount?: Float | null
  upvotesCount?: Float | null
  downvotesCount?: Float | null
  score?: Float | null
  title?: String | null
  slug?: String | null
  summary?: String | null
  image?: String | null
  canonical?: String | null
  tagsOriginal?: String | null
  treasuryProposal?: ID_Input | null
}

export interface PostUpdateInput {
  createdByAccount?: String | null
  createdAtBlock?: BigInt | null
  createdAtTime?: DateTime | null
  createdOnDay?: DateTime | null
  postId?: String | null
  updatedAtTime?: DateTime | null
  spaceId?: String | null
  content?: String | null
  kind?: PostKind | null
  parentId?: String | null
  rootPostId?: String | null
  sharedPostId?: String | null
  repliesCount?: Float | null
  publicRepliesCount?: Float | null
  hiddenRepliesCount?: Float | null
  sharesCount?: Float | null
  upvotesCount?: Float | null
  downvotesCount?: Float | null
  score?: Float | null
  title?: String | null
  slug?: String | null
  summary?: String | null
  image?: String | null
  canonical?: String | null
  tagsOriginal?: String | null
  treasuryProposal?: ID_Input | null
}

export interface PostWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  createdByAccount_eq?: String | null
  createdByAccount_contains?: String | null
  createdByAccount_startsWith?: String | null
  createdByAccount_endsWith?: String | null
  createdByAccount_in?: String[] | String | null
  createdAtBlock_eq?: BigInt | null
  createdAtBlock_gt?: BigInt | null
  createdAtBlock_gte?: BigInt | null
  createdAtBlock_lt?: BigInt | null
  createdAtBlock_lte?: BigInt | null
  createdAtBlock_in?: BigInt[] | BigInt | null
  createdAtTime_eq?: DateTime | null
  createdAtTime_lt?: DateTime | null
  createdAtTime_lte?: DateTime | null
  createdAtTime_gt?: DateTime | null
  createdAtTime_gte?: DateTime | null
  createdOnDay_eq?: DateTime | null
  createdOnDay_lt?: DateTime | null
  createdOnDay_lte?: DateTime | null
  createdOnDay_gt?: DateTime | null
  createdOnDay_gte?: DateTime | null
  postId_eq?: String | null
  postId_contains?: String | null
  postId_startsWith?: String | null
  postId_endsWith?: String | null
  postId_in?: String[] | String | null
  updatedAtTime_eq?: DateTime | null
  updatedAtTime_lt?: DateTime | null
  updatedAtTime_lte?: DateTime | null
  updatedAtTime_gt?: DateTime | null
  updatedAtTime_gte?: DateTime | null
  spaceId_eq?: String | null
  spaceId_contains?: String | null
  spaceId_startsWith?: String | null
  spaceId_endsWith?: String | null
  spaceId_in?: String[] | String | null
  content_eq?: String | null
  content_contains?: String | null
  content_startsWith?: String | null
  content_endsWith?: String | null
  content_in?: String[] | String | null
  kind_eq?: PostKind | null
  kind_in?: PostKind[] | PostKind | null
  parentId_eq?: String | null
  parentId_contains?: String | null
  parentId_startsWith?: String | null
  parentId_endsWith?: String | null
  parentId_in?: String[] | String | null
  rootPostId_eq?: String | null
  rootPostId_contains?: String | null
  rootPostId_startsWith?: String | null
  rootPostId_endsWith?: String | null
  rootPostId_in?: String[] | String | null
  sharedPostId_eq?: String | null
  sharedPostId_contains?: String | null
  sharedPostId_startsWith?: String | null
  sharedPostId_endsWith?: String | null
  sharedPostId_in?: String[] | String | null
  repliesCount_eq?: Int | null
  repliesCount_gt?: Int | null
  repliesCount_gte?: Int | null
  repliesCount_lt?: Int | null
  repliesCount_lte?: Int | null
  repliesCount_in?: Int[] | Int | null
  publicRepliesCount_eq?: Int | null
  publicRepliesCount_gt?: Int | null
  publicRepliesCount_gte?: Int | null
  publicRepliesCount_lt?: Int | null
  publicRepliesCount_lte?: Int | null
  publicRepliesCount_in?: Int[] | Int | null
  hiddenRepliesCount_eq?: Int | null
  hiddenRepliesCount_gt?: Int | null
  hiddenRepliesCount_gte?: Int | null
  hiddenRepliesCount_lt?: Int | null
  hiddenRepliesCount_lte?: Int | null
  hiddenRepliesCount_in?: Int[] | Int | null
  sharesCount_eq?: Int | null
  sharesCount_gt?: Int | null
  sharesCount_gte?: Int | null
  sharesCount_lt?: Int | null
  sharesCount_lte?: Int | null
  sharesCount_in?: Int[] | Int | null
  upvotesCount_eq?: Int | null
  upvotesCount_gt?: Int | null
  upvotesCount_gte?: Int | null
  upvotesCount_lt?: Int | null
  upvotesCount_lte?: Int | null
  upvotesCount_in?: Int[] | Int | null
  downvotesCount_eq?: Int | null
  downvotesCount_gt?: Int | null
  downvotesCount_gte?: Int | null
  downvotesCount_lt?: Int | null
  downvotesCount_lte?: Int | null
  downvotesCount_in?: Int[] | Int | null
  score_eq?: Int | null
  score_gt?: Int | null
  score_gte?: Int | null
  score_lt?: Int | null
  score_lte?: Int | null
  score_in?: Int[] | Int | null
  title_eq?: String | null
  title_contains?: String | null
  title_startsWith?: String | null
  title_endsWith?: String | null
  title_in?: String[] | String | null
  slug_eq?: String | null
  slug_contains?: String | null
  slug_startsWith?: String | null
  slug_endsWith?: String | null
  slug_in?: String[] | String | null
  summary_eq?: String | null
  summary_contains?: String | null
  summary_startsWith?: String | null
  summary_endsWith?: String | null
  summary_in?: String[] | String | null
  image_eq?: String | null
  image_contains?: String | null
  image_startsWith?: String | null
  image_endsWith?: String | null
  image_in?: String[] | String | null
  canonical_eq?: String | null
  canonical_contains?: String | null
  canonical_startsWith?: String | null
  canonical_endsWith?: String | null
  canonical_in?: String[] | String | null
  tagsOriginal_eq?: String | null
  tagsOriginal_contains?: String | null
  tagsOriginal_startsWith?: String | null
  tagsOriginal_endsWith?: String | null
  tagsOriginal_in?: String[] | String | null
  treasuryProposal_eq?: ID_Input | null
  treasuryProposal_in?: ID_Output[] | ID_Output | null
  tags_none?: TagWhereInput | null
  tags_some?: TagWhereInput | null
  tags_every?: TagWhereInput | null
  treasuryProposal?: TreasuryProposalWhereInput | null
  AND?: PostWhereInput[] | PostWhereInput | null
  OR?: PostWhereInput[] | PostWhereInput | null
}

export interface PostWhereUniqueInput {
  id: ID_Output
}

export interface SpaceCreateInput {
  createdByAccount?: String | null
  createdAtBlock?: BigInt | null
  createdAtTime?: DateTime | null
  createdOnDay?: DateTime | null
  spaceId: String
  updatedAtTime?: DateTime | null
  ownerId?: String | null
  postsCount?: Float | null
  publicPostsCount?: Float | null
  hiddenPostsCount?: Float | null
  followersCount?: Float | null
  score?: Float | null
  content?: String | null
  name?: String | null
  image?: String | null
  summary?: String | null
  tagsOriginal?: String | null
}

export interface SpaceUpdateInput {
  createdByAccount?: String | null
  createdAtBlock?: BigInt | null
  createdAtTime?: DateTime | null
  createdOnDay?: DateTime | null
  spaceId?: String | null
  updatedAtTime?: DateTime | null
  ownerId?: String | null
  postsCount?: Float | null
  publicPostsCount?: Float | null
  hiddenPostsCount?: Float | null
  followersCount?: Float | null
  score?: Float | null
  content?: String | null
  name?: String | null
  image?: String | null
  summary?: String | null
  tagsOriginal?: String | null
}

export interface SpaceWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  createdByAccount_eq?: String | null
  createdByAccount_contains?: String | null
  createdByAccount_startsWith?: String | null
  createdByAccount_endsWith?: String | null
  createdByAccount_in?: String[] | String | null
  createdAtBlock_eq?: BigInt | null
  createdAtBlock_gt?: BigInt | null
  createdAtBlock_gte?: BigInt | null
  createdAtBlock_lt?: BigInt | null
  createdAtBlock_lte?: BigInt | null
  createdAtBlock_in?: BigInt[] | BigInt | null
  createdAtTime_eq?: DateTime | null
  createdAtTime_lt?: DateTime | null
  createdAtTime_lte?: DateTime | null
  createdAtTime_gt?: DateTime | null
  createdAtTime_gte?: DateTime | null
  createdOnDay_eq?: DateTime | null
  createdOnDay_lt?: DateTime | null
  createdOnDay_lte?: DateTime | null
  createdOnDay_gt?: DateTime | null
  createdOnDay_gte?: DateTime | null
  spaceId_eq?: String | null
  spaceId_contains?: String | null
  spaceId_startsWith?: String | null
  spaceId_endsWith?: String | null
  spaceId_in?: String[] | String | null
  updatedAtTime_eq?: DateTime | null
  updatedAtTime_lt?: DateTime | null
  updatedAtTime_lte?: DateTime | null
  updatedAtTime_gt?: DateTime | null
  updatedAtTime_gte?: DateTime | null
  ownerId_eq?: String | null
  ownerId_contains?: String | null
  ownerId_startsWith?: String | null
  ownerId_endsWith?: String | null
  ownerId_in?: String[] | String | null
  postsCount_eq?: Int | null
  postsCount_gt?: Int | null
  postsCount_gte?: Int | null
  postsCount_lt?: Int | null
  postsCount_lte?: Int | null
  postsCount_in?: Int[] | Int | null
  publicPostsCount_eq?: Int | null
  publicPostsCount_gt?: Int | null
  publicPostsCount_gte?: Int | null
  publicPostsCount_lt?: Int | null
  publicPostsCount_lte?: Int | null
  publicPostsCount_in?: Int[] | Int | null
  hiddenPostsCount_eq?: Int | null
  hiddenPostsCount_gt?: Int | null
  hiddenPostsCount_gte?: Int | null
  hiddenPostsCount_lt?: Int | null
  hiddenPostsCount_lte?: Int | null
  hiddenPostsCount_in?: Int[] | Int | null
  followersCount_eq?: Int | null
  followersCount_gt?: Int | null
  followersCount_gte?: Int | null
  followersCount_lt?: Int | null
  followersCount_lte?: Int | null
  followersCount_in?: Int[] | Int | null
  score_eq?: Int | null
  score_gt?: Int | null
  score_gte?: Int | null
  score_lt?: Int | null
  score_lte?: Int | null
  score_in?: Int[] | Int | null
  content_eq?: String | null
  content_contains?: String | null
  content_startsWith?: String | null
  content_endsWith?: String | null
  content_in?: String[] | String | null
  name_eq?: String | null
  name_contains?: String | null
  name_startsWith?: String | null
  name_endsWith?: String | null
  name_in?: String[] | String | null
  image_eq?: String | null
  image_contains?: String | null
  image_startsWith?: String | null
  image_endsWith?: String | null
  image_in?: String[] | String | null
  summary_eq?: String | null
  summary_contains?: String | null
  summary_startsWith?: String | null
  summary_endsWith?: String | null
  summary_in?: String[] | String | null
  tagsOriginal_eq?: String | null
  tagsOriginal_contains?: String | null
  tagsOriginal_startsWith?: String | null
  tagsOriginal_endsWith?: String | null
  tagsOriginal_in?: String[] | String | null
  tags_none?: TagWhereInput | null
  tags_some?: TagWhereInput | null
  tags_every?: TagWhereInput | null
  AND?: SpaceWhereInput[] | SpaceWhereInput | null
  OR?: SpaceWhereInput[] | SpaceWhereInput | null
}

export interface SpaceWhereUniqueInput {
  id: ID_Output
}

export interface TagCreateInput {
  tag?: String | null
}

export interface TagUpdateInput {
  tag?: String | null
}

export interface TagWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  tag_eq?: String | null
  tag_contains?: String | null
  tag_startsWith?: String | null
  tag_endsWith?: String | null
  tag_in?: String[] | String | null
  posts_none?: PostWhereInput | null
  posts_some?: PostWhereInput | null
  posts_every?: PostWhereInput | null
  spaces_none?: SpaceWhereInput | null
  spaces_some?: SpaceWhereInput | null
  spaces_every?: SpaceWhereInput | null
  AND?: TagWhereInput[] | TagWhereInput | null
  OR?: TagWhereInput[] | TagWhereInput | null
}

export interface TagWhereUniqueInput {
  id: ID_Output
}

export interface TreasuryProposalCreateInput {
  postId: String
  proposalId: Float
  network: Network
}

export interface TreasuryProposalUpdateInput {
  postId?: String | null
  proposalId?: Float | null
  network?: Network | null
}

export interface TreasuryProposalWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  postId_eq?: String | null
  postId_contains?: String | null
  postId_startsWith?: String | null
  postId_endsWith?: String | null
  postId_in?: String[] | String | null
  proposalId_eq?: Int | null
  proposalId_gt?: Int | null
  proposalId_gte?: Int | null
  proposalId_lt?: Int | null
  proposalId_lte?: Int | null
  proposalId_in?: Int[] | Int | null
  network_eq?: Network | null
  network_in?: Network[] | Network | null
  posttreasuryProposal_none?: PostWhereInput | null
  posttreasuryProposal_some?: PostWhereInput | null
  posttreasuryProposal_every?: PostWhereInput | null
  AND?: TreasuryProposalWhereInput[] | TreasuryProposalWhereInput | null
  OR?: TreasuryProposalWhereInput[] | TreasuryProposalWhereInput | null
}

export interface TreasuryProposalWhereUniqueInput {
  id: ID_Output
}

export interface BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
}

export interface DeleteResponse {
  id: ID_Output
}

export interface BaseModel extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
}

export interface BaseModelUUID extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
}

export interface PageInfo {
  hasNextPage: Boolean
  hasPreviousPage: Boolean
  startCursor?: String | null
  endCursor?: String | null
}

export interface Post extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  createdByAccount?: String | null
  createdAtBlock?: BigInt | null
  createdAtTime?: DateTime | null
  createdOnDay?: DateTime | null
  postId: String
  updatedAtTime?: DateTime | null
  spaceId: String
  content?: String | null
  kind?: PostKind | null
  parentId?: String | null
  rootPostId?: String | null
  sharedPostId?: String | null
  repliesCount?: Int | null
  publicRepliesCount?: Int | null
  hiddenRepliesCount?: Int | null
  sharesCount?: Int | null
  upvotesCount?: Int | null
  downvotesCount?: Int | null
  score?: Int | null
  title?: String | null
  slug?: String | null
  summary?: String | null
  image?: String | null
  canonical?: String | null
  tagsOriginal?: String | null
  tags: Array<Tag>
  treasuryProposal?: TreasuryProposal | null
  treasuryProposalId?: String | null
}

export interface PostConnection {
  totalCount: Int
  edges: Array<PostEdge>
  pageInfo: PageInfo
}

export interface PostEdge {
  node: Post
  cursor: String
}

export interface ProcessorState {
  lastCompleteBlock: Float
  lastProcessedEvent: String
  indexerHead: Float
  chainHead: Float
}

export interface Space extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  createdByAccount?: String | null
  createdAtBlock?: BigInt | null
  createdAtTime?: DateTime | null
  createdOnDay?: DateTime | null
  spaceId: String
  updatedAtTime?: DateTime | null
  ownerId?: String | null
  postsCount?: Int | null
  publicPostsCount?: Int | null
  hiddenPostsCount?: Int | null
  followersCount?: Int | null
  score?: Int | null
  content?: String | null
  name?: String | null
  image?: String | null
  summary?: String | null
  tagsOriginal?: String | null
  tags: Array<Tag>
}

export interface SpaceConnection {
  totalCount: Int
  edges: Array<SpaceEdge>
  pageInfo: PageInfo
}

export interface SpaceEdge {
  node: Space
  cursor: String
}

export interface StandardDeleteResponse {
  id: ID_Output
}

export interface Tag extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  tag?: String | null
  posts: Array<Post>
  spaces: Array<Space>
}

export interface TagConnection {
  totalCount: Int
  edges: Array<TagEdge>
  pageInfo: PageInfo
}

export interface TagEdge {
  node: Tag
  cursor: String
}

export interface TreasuryProposal extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  postId: String
  proposalId: Int
  network: Network
  posttreasuryProposal?: Array<Post> | null
}

export interface TreasuryProposalConnection {
  totalCount: Int
  edges: Array<TreasuryProposalEdge>
  pageInfo: PageInfo
}

export interface TreasuryProposalEdge {
  node: TreasuryProposal
  cursor: String
}

/*
GraphQL representation of BigInt
*/
export type BigInt = string

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean

/*
The javascript `Date` as string. Type represents date and time as the ISO Date string.
*/
export type DateTime = Date | string

/*
The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).
*/
export type Float = number

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number
export type ID_Output = string

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
*/
export type Int = number

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string