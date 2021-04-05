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
  Info
} from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { Inject } from 'typedi';
import { Min } from 'class-validator';
import { Fields, StandardDeleteResponse, UserId, PageInfo, RawFields } from 'warthog';

import {
  SpaceCreateInput,
  SpaceCreateManyArgs,
  SpaceUpdateArgs,
  SpaceWhereArgs,
  SpaceWhereInput,
  SpaceWhereUniqueInput,
  SpaceOrderByEnum
} from '../../../generated';

import { Space } from './space.model';
import { SpaceService } from './space.service';

import { Tag } from '../tag/tag.model';
import { getConnection } from 'typeorm';

@ObjectType()
export class SpaceEdge {
  @Field(() => Space, { nullable: false })
  node!: Space;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class SpaceConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [SpaceEdge], { nullable: false })
  edges!: SpaceEdge[];

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
export class SpaceConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => SpaceWhereInput, { nullable: true })
  where?: SpaceWhereInput;

  @Field(() => SpaceOrderByEnum, { nullable: true })
  orderBy?: SpaceOrderByEnum;
}

@Resolver(Space)
export class SpaceResolver {
  constructor(@Inject('SpaceService') public readonly service: SpaceService) {}

  @Query(() => [Space])
  async spaces(
    @Args() { where, orderBy, limit, offset }: SpaceWhereArgs,
    @Fields() fields: string[]
  ): Promise<Space[]> {
    return this.service.find<SpaceWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => Space, { nullable: true })
  async space(@Arg('where') where: SpaceWhereUniqueInput, @Fields() fields: string[]): Promise<Space | null> {
    const result = await this.service.find(where, undefined, 1, 0, fields);
    return result && result.length >= 1 ? result[0] : null;
  }

  @Query(() => SpaceConnection)
  async spacesConnection(
    @Args() { where, orderBy, ...pageOptions }: SpaceConnectionWhereArgs,
    @Info() info: any
  ): Promise<SpaceConnection> {
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
      result = await this.service.findConnection<SpaceWhereInput>(where, orderBy, pageOptions, rawFields);
    } catch (err) {
      console.log(err);
      // TODO: should continue to return this on `Error: Items is empty` or throw the error
      if (!(err.message as string).includes('Items is empty')) throw err;
    }

    return result as Promise<SpaceConnection>;
  }

  @FieldResolver(() => Tag)
  async tags(@Root() r: Space): Promise<Tag[] | null> {
    const result = await getConnection()
      .getRepository(Space)
      .findOne(r.id, { relations: ['tags'] });
    if (result && result.tags !== undefined) {
      return result.tags;
    }
    return null;
  }
}
