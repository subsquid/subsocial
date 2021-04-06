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
  TagCreateInput,
  TagCreateManyArgs,
  TagUpdateArgs,
  TagWhereArgs,
  TagWhereInput,
  TagWhereUniqueInput,
  TagOrderByEnum
} from '../../../generated';

import { Tag } from './tag.model';
import { TagService } from './tag.service';

import { Post } from '../post/post.model';
import { Space } from '../space/space.model';
import { getConnection } from 'typeorm';

@ObjectType()
export class TagEdge {
  @Field(() => Tag, { nullable: false })
  node!: Tag;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class TagConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [TagEdge], { nullable: false })
  edges!: TagEdge[];

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
export class TagConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => TagWhereInput, { nullable: true })
  where?: TagWhereInput;

  @Field(() => TagOrderByEnum, { nullable: true })
  orderBy?: TagOrderByEnum;
}

@Resolver(Tag)
export class TagResolver {
  constructor(@Inject('TagService') public readonly service: TagService) {}

  @Query(() => [Tag])
  async tags(@Args() { where, orderBy, limit, offset }: TagWhereArgs, @Fields() fields: string[]): Promise<Tag[]> {
    return this.service.find<TagWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => Tag, { nullable: true })
  async tag(@Arg('where') where: TagWhereUniqueInput, @Fields() fields: string[]): Promise<Tag | null> {
    const result = await this.service.find(where, undefined, 1, 0, fields);
    return result && result.length >= 1 ? result[0] : null;
  }

  @Query(() => TagConnection)
  async tagsConnection(
    @Args() { where, orderBy, ...pageOptions }: TagConnectionWhereArgs,
    @Info() info: any
  ): Promise<TagConnection> {
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
      result = await this.service.findConnection<TagWhereInput>(where, orderBy, pageOptions, rawFields);
    } catch (err) {
      console.log(err);
      // TODO: should continue to return this on `Error: Items is empty` or throw the error
      if (!(err.message as string).includes('Items is empty')) throw err;
    }

    return result as Promise<TagConnection>;
  }

  @FieldResolver(() => Post)
  async posts(@Root() r: Tag): Promise<Post[] | null> {
    const result = await getConnection()
      .getRepository(Tag)
      .findOne(r.id, { relations: ['posts'] });
    if (result && result.posts !== undefined) {
      return result.posts;
    }
    return null;
  }
  @FieldResolver(() => Space)
  async spaces(@Root() r: Tag): Promise<Space[] | null> {
    const result = await getConnection()
      .getRepository(Tag)
      .findOne(r.id, { relations: ['spaces'] });
    if (result && result.spaces !== undefined) {
      return result.spaces;
    }
    return null;
  }
}
