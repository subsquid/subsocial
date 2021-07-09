import { ArgsType, Field, Args, Query, Resolver, Int } from 'type-graphql';
import { Post } from './post.model';
import { Fields, PaginationArgs } from 'warthog';
import { getRepository } from 'typeorm';
import { camelToSnakeCase, parseOffset, parseOrderBy, parseWhere, parseLimit } from '../../utils';
import { PostOrderByEnum, PostWhereInput } from '../../../generated';
import { KusamaProposalsWhereInput } from '../../../generated/classes';

const named = require('yesql').pg;

@ArgsType()
export class PostwithProposalConnectionWhereArgs extends PaginationArgs {
  @Field(() => PostWhereInput, { nullable: true })
  where?: PostWhereInput;

  @Field(() => KusamaProposalsWhereInput, { nullable: true })
  proposalWhere?: KusamaProposalsWhereInput;

  @Field(() => String, { nullable: true })
  network?: String;

  @Field(() => Int, { nullable: true })
  proposalIndex?: number;

  @Field(() => [PostOrderByEnum], { nullable: true })
  orderBy?: PostOrderByEnum[];
}

@Resolver(Post)
export class PostWithProposal {
  @Query(() => [Post])
  async postWithProposal(
    @Args() { where, proposalWhere, orderBy, limit, offset, network, proposalIndex  }: PostwithProposalConnectionWhereArgs,
    @Fields() fields: string[]
  ): Promise<Post[]> {
    const queryPart = network && proposalIndex
      ? `
        (proposal_index = (select proposal_index from public.${network}_proposals ${proposalWhere ? `${parseWhere(proposalWhere)} and`: 'where'} proposal_index = :proposalIndex ))`
      : '';

    const params = { network, offset, limit, proposalIndex };

    const result: Post[] = await getRepository(Post).query(
      named(`
      select ${camelToSnakeCase(fields, 'select')} from public.post
      ${parseWhere(where, queryPart)}
      ${parseOrderBy(orderBy)}
      ${parseOffset(offset)}
      ${parseLimit(limit)}
    `)(params)
    );

    return result;
  }
}
