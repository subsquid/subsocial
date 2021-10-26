import { ArgsType, Field, Args, Query, Resolver } from 'type-graphql';
import { SpaceOrderByEnum, SpaceWhereInput } from '../../../generated';
import { Space } from './space.model';
import { Fields, PaginationArgs } from 'warthog';
import { getRepository } from 'typeorm';
import { camelToSnakeCase, parseLimit, parseOffset, parseOrderBy, parseWhere } from '../../utils';

const named = require('yesql').pg;

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
      ? `space_id in (select child_space_id from subnet where parent_id = :subnetId)`
      : '';

    const params = { subnetId, offset, limit };

    const result: Space[] = await getRepository(Space).query(named(`
        select ${camelToSnakeCase(fields, 'select')} from public.space
        ${parseWhere(where, subnetQueryPart)}
        ${parseOrderBy(orderBy)}
        ${parseOffset(offset)}
        ${parseLimit(limit)}
    `)(params)
    );

    return result;
  }
}
