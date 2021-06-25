import {
  Arg,
  Args,
  Mutation,
  Query,
  Root,
  Resolver,
  FieldResolver,
  ObjectType,
  Field,
  Int,
  ArgsType,
  Info,
  Ctx
} from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { Inject } from 'typedi';
import { Min } from 'class-validator';
import { Fields, StandardDeleteResponse, UserId, PageInfo, RawFields, NestedFields, BaseContext } from 'warthog';

import {
  TreasuryProposalCreateInput,
  TreasuryProposalCreateManyArgs,
  TreasuryProposalUpdateArgs,
  TreasuryProposalWhereArgs,
  TreasuryProposalWhereInput,
  TreasuryProposalWhereUniqueInput,
  TreasuryProposalOrderByEnum
} from '../../../generated';

import { TreasuryProposal } from './treasury-proposal.model';
import { TreasuryProposalService } from './treasury-proposal.service';

import { Post } from '../post/post.model';
import { PostService } from '../post/post.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@ObjectType()
export class TreasuryProposalEdge {
  @Field(() => TreasuryProposal, { nullable: false })
  node!: TreasuryProposal;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class TreasuryProposalConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [TreasuryProposalEdge], { nullable: false })
  edges!: TreasuryProposalEdge[];

  @Field(() => PageInfo, { nullable: false })
  pageInfo!: PageInfo;
}

@ArgsType()
export class ConnectionPageInputOptions {
  @Field(() => Int, { nullable: true })
  @Min(0)
  first?: number;

  @Field(() => String, { nullable: true })
  after?: string; // V3: TODO: should we make a RelayCursor scalar?

  @Field(() => Int, { nullable: true })
  @Min(0)
  last?: number;

  @Field(() => String, { nullable: true })
  before?: string;
}

@ArgsType()
export class TreasuryProposalConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => TreasuryProposalWhereInput, { nullable: true })
  where?: TreasuryProposalWhereInput;

  @Field(() => TreasuryProposalOrderByEnum, { nullable: true })
  orderBy?: [TreasuryProposalOrderByEnum];
}

@Resolver(TreasuryProposal)
export class TreasuryProposalResolver {
  constructor(@Inject('TreasuryProposalService') public readonly service: TreasuryProposalService) {}

  @Query(() => [TreasuryProposal])
  async treasuryProposals(
    @Args() { where, orderBy, limit, offset }: TreasuryProposalWhereArgs,
    @Fields() fields: string[]
  ): Promise<TreasuryProposal[]> {
    return this.service.find<TreasuryProposalWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => TreasuryProposal, { nullable: true })
  async treasuryProposalByUniqueInput(
    @Arg('where') where: TreasuryProposalWhereUniqueInput,
    @Fields() fields: string[]
  ): Promise<TreasuryProposal | null> {
    const result = await this.service.find(where, undefined, 1, 0, fields);
    return result && result.length >= 1 ? result[0] : null;
  }

  @Query(() => TreasuryProposalConnection)
  async treasuryProposalsConnection(
    @Args() { where, orderBy, ...pageOptions }: TreasuryProposalConnectionWhereArgs,
    @Info() info: any
  ): Promise<TreasuryProposalConnection> {
    const rawFields = graphqlFields(info, {}, { excludedFields: ['__typename'] });

    let result: any = {
      totalCount: 0,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
    // If the related database table does not have any records then an error is thrown to the client
    // by warthog
    try {
      result = await this.service.findConnection<TreasuryProposalWhereInput>(where, orderBy, pageOptions, rawFields);
    } catch (err) {
      console.log(err);
      // TODO: should continue to return this on `Error: Items is empty` or throw the error
      if (!(err.message as string).includes('Items is empty')) throw err;
    }

    return result as Promise<TreasuryProposalConnection>;
  }

  @FieldResolver(() => Post)
  async posttreasuryProposal(@Root() r: TreasuryProposal, @Ctx() ctx: BaseContext): Promise<Post[] | null> {
    return ctx.dataLoader.loaders.TreasuryProposal.posttreasuryProposal.load(r);
  }
}
