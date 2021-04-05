import { ArgsType, Field, Args, Query, Resolver } from 'type-graphql';
import { Post } from './post.model';
import { Fields, PaginationArgs } from 'warthog';
import { getRepository } from 'typeorm';
import { camelToSnakeCase, parseOrderBy, parseWhere } from '../../utils';
import { PostOrderByEnum, PostWhereInput } from '../../../generated';

@ArgsType()
export class CustomSpaceConnectionWhereArgs extends PaginationArgs {
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
    @Args() { where, orderBy, limit, offset, subnetId: subnetId }: CustomSpaceConnectionWhereArgs,
    @Fields() fields: string[]
  ): Promise<Post[]> {
    const subnetQueryPart = subnetId
      ? `
        where (space_id in (select child_space_id from subnet where parent_id = '${subnetId}') or root_post_id in
          (select post_id from public.post where space_id in
            (select child_space_id from subnet where parent_id = '${subnetId}')))`
      : '';

    const result: Post[] = await getRepository(Post).query(`
      select ${camelToSnakeCase(fields, 'select')} from public.post
      ${subnetQueryPart} ${parseWhere(where, subnetQueryPart)}
      ${parseOrderBy(orderBy)}
      ${offset ? `offset ${offset}` : ''}
      ${limit ? `limit ${limit}` : ''}
    `);

    return result;
  }
}
