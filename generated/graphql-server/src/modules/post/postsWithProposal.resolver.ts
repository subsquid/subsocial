import { ArgsType, Field, Args, Query, Resolver, Int } from 'type-graphql';
import { Post } from './post.model';
import { Fields, PaginationArgs, IntField, Model } from 'warthog';
import { getRepository } from 'typeorm';
import { camelToSnakeCase, parseOffset, parseOrderBy, parseWhere, parseLimit } from '../../utils';
import { PostOrderByEnum, PostWhereInput } from '../../../generated';
import { KusamaProposalsWhereInput } from '../../../generated/classes';

const named = require('yesql').pg;

@Model({ api: {} })
export class PostWithCount extends Post {
  @IntField({
    nullable: true
  })
  totalCount?: number;
}

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

@Resolver(PostWithCount)
export class PostWithProposal {
  @Query(() => [PostWithCount])
  async postWithProposal(
    @Args() { where, proposalWhere, orderBy, limit, offset, network, proposalIndex  }: PostwithProposalConnectionWhereArgs,
    @Fields() fields: string[]
  ): Promise<PostWithCount[]> {
    const queryPart = network && proposalIndex
      ? `
        (proposal_index =
          (select proposal_index
            from public.${network}_proposals
            ${proposalWhere ? `${parseWhere(proposalWhere)} and`: 'where'}
            proposal_index = :proposalIndex
          )
        )`
      : '';

    const params = { network, offset, limit, proposalIndex };

    const isCount = fields[0] === 'totalCount'

    const result: PostWithCount[] = await getRepository(Post).query(
      named(`
      select ${isCount ? 'count(*) as "totalCount"' : camelToSnakeCase(fields, 'select')} from public.post
      ${parseWhere(where, queryPart)}
      ${parseOrderBy(orderBy)}
      ${parseOffset(offset)}
      ${parseLimit(limit)}
    `)(params)
    );

    console.log(result)
    return result;
  }
}
