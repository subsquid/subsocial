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
  KusamaProposalsCreateInput,
  KusamaProposalsCreateManyArgs,
  KusamaProposalsUpdateArgs,
  KusamaProposalsWhereArgs,
  KusamaProposalsWhereInput,
  KusamaProposalsWhereUniqueInput,
  KusamaProposalsOrderByEnum
} from '../../../generated';

import { KusamaProposals } from './kusama-proposals.model';
import { KusamaProposalsService } from './kusama-proposals.service';

@ObjectType()
export class KusamaProposalsEdge {
  @Field(() => KusamaProposals, { nullable: false })
  node!: KusamaProposals;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class KusamaProposalsConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [KusamaProposalsEdge], { nullable: false })
  edges!: KusamaProposalsEdge[];

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
export class KusamaProposalsConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => KusamaProposalsWhereInput, { nullable: true })
  where?: KusamaProposalsWhereInput;

  @Field(() => KusamaProposalsOrderByEnum, { nullable: true })
  orderBy?: [KusamaProposalsOrderByEnum];
}

@Resolver(KusamaProposals)
export class KusamaProposalsResolver {
  constructor(@Inject('KusamaProposalsService') public readonly service: KusamaProposalsService) {}

  @Query(() => [KusamaProposals])
  async kusamaProposals(
    @Args() { where, orderBy, limit, offset }: KusamaProposalsWhereArgs,
    @Fields() fields: string[]
  ): Promise<KusamaProposals[]> {
    return this.service.find<KusamaProposalsWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => KusamaProposals, { nullable: true })
  async kusamaProposalsByUniqueInput(
    @Arg('where') where: KusamaProposalsWhereUniqueInput,
    @Fields() fields: string[]
  ): Promise<KusamaProposals | null> {
    const result = await this.service.find(where, undefined, 1, 0, fields);
    return result && result.length >= 1 ? result[0] : null;
  }

  @Query(() => KusamaProposalsConnection)
  async kusamaProposalsConnection(
    @Args() { where, orderBy, ...pageOptions }: KusamaProposalsConnectionWhereArgs,
    @Info() info: any
  ): Promise<KusamaProposalsConnection> {
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
      result = await this.service.findConnection<KusamaProposalsWhereInput>(where, orderBy, pageOptions, rawFields);
    } catch (err) {
      console.log(err);
      // TODO: should continue to return this on `Error: Items is empty` or throw the error
      if (!(err.message as string).includes('Items is empty')) throw err;
    }

    return result as Promise<KusamaProposalsConnection>;
  }
}
