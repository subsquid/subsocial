import { ArgsType, Field, Args, Query, Resolver } from 'type-graphql';
import { Post } from './post.model';
import { Fields, PaginationArgs } from 'warthog';
import { getRepository } from 'typeorm';
import { camelToSnakeCase, parseOffset, parseOrderBy, parseWhere, parseLimit } from '../../utils';
import { PostOrderByEnum, PostWhereInput } from '../../../generated';

const named = require('yesql').pg;

@ArgsType()
export class PostWithSubnetConnectionWhereArgs extends PaginationArgs {
  @Field(() => PostWhereInput, { nullable: true })
  where?: PostWhereInput;

  @Field(() => String, { nullable: true })
  subnetId?: string;

  @Field(() => [PostOrderByEnum], { nullable: true })
  orderBy?: PostOrderByEnum[];
}

@Resolver(Post)
export class SpaceResolver {
  @Query(() => [Post])
  async postsWithSubnet(
    @Args() { where, orderBy, limit, offset, subnetId: subnetId }: PostWithSubnetConnectionWhereArgs,
    @Fields() fields: string[]
  ): Promise<Post[]> {
    const subnetQueryPart = subnetId
      ? `
        (space_id in (select child_space_id from subnet where parent_id = :subnetId) or root_post_id in
          (select post_id from public.post where space_id in
            (select child_space_id from subnet where parent_id = :subnetId)))`
      : '';

    const params = { subnetId, offset, limit };

    const result: Post[] = await getRepository(Post).query(
      named(`
      select ${camelToSnakeCase(fields, 'select')} from public.post
      ${parseWhere(where, subnetQueryPart)}
      ${parseOrderBy(orderBy)}
      ${parseOffset(offset)}
      ${parseLimit(limit)}
    `)(params)
    );

    return result;
  }
}
