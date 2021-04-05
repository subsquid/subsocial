import { ArgsType, Field, Args, Query, Resolver } from 'type-graphql';
import { SpaceOrderByEnum, SpaceWhereInput } from '../../../generated';
import { Space } from './space.model';
import { Fields, PaginationArgs } from 'warthog';
import { getRepository } from 'typeorm';
import { camelToSnakeCase, parseOrderBy, parseWhere } from '../../utils';

@ArgsType()
export class CustomSpaceConnectionWhereArgs extends PaginationArgs {
  @Field(() => SpaceWhereInput, { nullable: true })
  where?: SpaceWhereInput;

  @Field(() => String, { nullable: true })
  subnetId?: string;

  @Field(() => [SpaceOrderByEnum], { nullable: true })
  orderBy?: SpaceOrderByEnum[];
}

@Resolver(Space)
export class SpaceResolver {
  @Query(() => [Space])
  async spacesWithSubnet(
    @Args() { where, orderBy, limit, offset, subnetId }: CustomSpaceConnectionWhereArgs,
    @Fields() fields: string[]
  ): Promise<Space[]> {
    const subnetQueryPart = subnetId
      ? `where space_id in (select child_space_id from subnet where parent_id = '${subnetId}')`
      : '';

    const result: Space[] = await getRepository(Space).query(`
      select ${camelToSnakeCase(fields, 'select')} from public.space
      ${subnetQueryPart} ${parseWhere(where, subnetQueryPart)}
      ${parseOrderBy(orderBy)}
      ${offset ? `offset ${offset}` : ''}
      ${limit ? `limit ${limit}` : ''}
    `);

    return result;
  }
}
