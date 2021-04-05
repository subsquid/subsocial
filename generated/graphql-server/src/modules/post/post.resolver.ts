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
  PostCreateInput,
  PostCreateManyArgs,
  PostUpdateArgs,
  PostWhereArgs,
  PostWhereInput,
  PostWhereUniqueInput,
  PostOrderByEnum
} from '../../../generated';

import { Post } from './post.model';
import { PostService } from './post.service';

import { Tag } from '../tag/tag.model';
import { getConnection } from 'typeorm';

@ObjectType()
export class PostEdge {
  @Field(() => Post, { nullable: false })
  node!: Post;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class PostConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [PostEdge], { nullable: false })
  edges!: PostEdge[];

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
export class PostConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => PostWhereInput, { nullable: true })
  where?: PostWhereInput;

  @Field(() => PostOrderByEnum, { nullable: true })
  orderBy?: PostOrderByEnum;
}

@Resolver(Post)
export class PostResolver {
  constructor(@Inject('PostService') public readonly service: PostService) {}

  @Query(() => [Post])
  async posts(@Args() { where, orderBy, limit, offset }: PostWhereArgs, @Fields() fields: string[]): Promise<Post[]> {
    return this.service.find<PostWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg('where') where: PostWhereUniqueInput, @Fields() fields: string[]): Promise<Post | null> {
    const result = await this.service.find(where, undefined, 1, 0, fields);
    return result && result.length >= 1 ? result[0] : null;
  }

  @Query(() => PostConnection)
  async postsConnection(
    @Args() { where, orderBy, ...pageOptions }: PostConnectionWhereArgs,
    @Info() info: any
  ): Promise<PostConnection> {
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
      result = await this.service.findConnection<PostWhereInput>(where, orderBy, pageOptions, rawFields);
    } catch (err) {
      console.log(err);
      // TODO: should continue to return this on `Error: Items is empty` or throw the error
      if (!(err.message as string).includes('Items is empty')) throw err;
    }

    return result as Promise<PostConnection>;
  }

  @FieldResolver(() => Tag)
  async tags(@Root() r: Post): Promise<Tag[] | null> {
    const result = await getConnection()
      .getRepository(Post)
      .findOne(r.id, { relations: ['tags'] });
    if (result && result.tags !== undefined) {
      return result.tags;
    }
    return null;
  }
}
