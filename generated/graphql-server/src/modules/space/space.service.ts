import { Service, Inject } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { WhereInput } from 'warthog';
import { WarthogBaseService } from '../../WarthogBaseService';

import { Space } from './space.model';

import {} from '../variants/variants.model';

import { SpaceWhereArgs, SpaceWhereInput } from '../../../generated';

import { Tag } from '../tag/tag.model';
import { TagService } from '../tag/tag.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@Service('SpaceService')
export class SpaceService extends WarthogBaseService<Space> {
  @Inject('TagService')
  public readonly tagsService!: TagService;

  constructor(@InjectRepository(Space) protected readonly repository: Repository<Space>) {
    super(Space, repository);
  }

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Space[]> {
    let f = fields || [];

    return this.findWithRelations<W>(where, orderBy, limit, offset, f);
  }

  async findWithRelations<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Space[]> {
    const where = <SpaceWhereInput>(_where || {});

    // remove relation filters to enable warthog query builders

    const { tags_some, tags_none, tags_every } = where;

    if (+!!tags_some + +!!tags_none + +!!tags_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.tags_some;
    delete where.tags_none;
    delete where.tags_every;

    let mainQuery = this.buildFindQueryWithParams(<any>where, orderBy, undefined, fields, 'main').take(undefined); // remove LIMIT

    let parameters = mainQuery.getParameters();

    const tagsFilter = tags_some || tags_none || tags_every;

    if (tagsFilter) {
      const tagsQuery = this.tagsService
        .buildFindQueryWithParams(<any>tagsFilter, undefined, undefined, ['id'], 'tags')
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...tagsQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin('space.tags', 'tags_filtered', `tags_filtered.id IN (${tagsQuery.getQuery()})`)
        .groupBy('space_id')
        .addSelect('count(tags_filtered.id)', 'cnt_filtered')
        .addSelect('space.id', 'space_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('space.tags', 'tags_total')
        .groupBy('space_id')
        .addSelect('count(tags_total.id)', 'cnt_total')
        .addSelect('space.id', 'space_id');

      const subQuery = `
                SELECT 
                    f.space_id space_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total 
                FROM 
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f 
                WHERE 
                    t.space_id = f.space_id`;

      if (tags_none) {
        mainQuery = mainQuery.andWhere(`space.id IN 
                (SELECT 
                    tags_subq.space_id
                FROM 
                    (${subQuery}) tags_subq 
                WHERE 
                    tags_subq.cnt_filtered = 0
                )`);
      }

      if (tags_some) {
        mainQuery = mainQuery.andWhere(`space.id IN 
                (SELECT 
                    tags_subq.space_id
                FROM 
                    (${subQuery}) tags_subq 
                WHERE 
                    tags_subq.cnt_filtered > 0
                )`);
      }

      if (tags_every) {
        mainQuery = mainQuery.andWhere(`space.id IN 
                (SELECT 
                    tags_subq.space_id
                FROM 
                    (${subQuery}) tags_subq 
                WHERE 
                    tags_subq.cnt_filtered > 0 
                    AND tags_subq.cnt_filtered = tags_subq.cnt_total
                )`);
      }
    }

    mainQuery = mainQuery.setParameters(parameters);

    return mainQuery
      .take(limit || 50)
      .skip(offset || 0)
      .getMany();
  }
}
