import { Service, Inject } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { WhereInput } from 'warthog';
import { WarthogBaseService } from '../../WarthogBaseService';

import { Tag } from './tag.model';

import {} from '../variants/variants.model';

import { TagWhereArgs, TagWhereInput } from '../../../generated';

import { Post } from '../post/post.model';
import { PostService } from '../post/post.service';
import { Space } from '../space/space.model';
import { SpaceService } from '../space/space.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@Service('TagService')
export class TagService extends WarthogBaseService<Tag> {
  @Inject('PostService')
  public readonly postsService!: PostService;
  @Inject('SpaceService')
  public readonly spacesService!: SpaceService;

  constructor(@InjectRepository(Tag) protected readonly repository: Repository<Tag>) {
    super(Tag, repository);
  }

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Tag[]> {
    let f = fields || [];

    return this.findWithRelations<W>(where, orderBy, limit, offset, f);
  }

  async findWithRelations<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Tag[]> {
    const where = <TagWhereInput>(_where || {});

    // remove relation filters to enable warthog query builders

    const { posts_some, posts_none, posts_every } = where;

    if (+!!posts_some + +!!posts_none + +!!posts_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.posts_some;
    delete where.posts_none;
    delete where.posts_every;
    // remove relation filters to enable warthog query builders

    const { spaces_some, spaces_none, spaces_every } = where;

    if (+!!spaces_some + +!!spaces_none + +!!spaces_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.spaces_some;
    delete where.spaces_none;
    delete where.spaces_every;

    let mainQuery = this.buildFindQueryWithParams(<any>where, orderBy, undefined, fields, 'main').take(undefined); // remove LIMIT

    let parameters = mainQuery.getParameters();

    const postsFilter = posts_some || posts_none || posts_every;

    if (postsFilter) {
      const postsQuery = this.postsService
        .buildFindQueryWithParams(<any>postsFilter, undefined, undefined, ['id'], 'posts')
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...postsQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin('tag.posts', 'posts_filtered', `posts_filtered.id IN (${postsQuery.getQuery()})`)
        .groupBy('tag_id')
        .addSelect('count(posts_filtered.id)', 'cnt_filtered')
        .addSelect('tag.id', 'tag_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('tag.posts', 'posts_total')
        .groupBy('tag_id')
        .addSelect('count(posts_total.id)', 'cnt_total')
        .addSelect('tag.id', 'tag_id');

      const subQuery = `
                SELECT 
                    f.tag_id tag_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total 
                FROM 
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f 
                WHERE 
                    t.tag_id = f.tag_id`;

      if (posts_none) {
        mainQuery = mainQuery.andWhere(`tag.id IN 
                (SELECT 
                    posts_subq.tag_id
                FROM 
                    (${subQuery}) posts_subq 
                WHERE 
                    posts_subq.cnt_filtered = 0
                )`);
      }

      if (posts_some) {
        mainQuery = mainQuery.andWhere(`tag.id IN 
                (SELECT 
                    posts_subq.tag_id
                FROM 
                    (${subQuery}) posts_subq 
                WHERE 
                    posts_subq.cnt_filtered > 0
                )`);
      }

      if (posts_every) {
        mainQuery = mainQuery.andWhere(`tag.id IN 
                (SELECT 
                    posts_subq.tag_id
                FROM 
                    (${subQuery}) posts_subq 
                WHERE 
                    posts_subq.cnt_filtered > 0 
                    AND posts_subq.cnt_filtered = posts_subq.cnt_total
                )`);
      }
    }

    const spacesFilter = spaces_some || spaces_none || spaces_every;

    if (spacesFilter) {
      const spacesQuery = this.spacesService
        .buildFindQueryWithParams(<any>spacesFilter, undefined, undefined, ['id'], 'spaces')
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...spacesQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin('tag.spaces', 'spaces_filtered', `spaces_filtered.id IN (${spacesQuery.getQuery()})`)
        .groupBy('tag_id')
        .addSelect('count(spaces_filtered.id)', 'cnt_filtered')
        .addSelect('tag.id', 'tag_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('tag.spaces', 'spaces_total')
        .groupBy('tag_id')
        .addSelect('count(spaces_total.id)', 'cnt_total')
        .addSelect('tag.id', 'tag_id');

      const subQuery = `
                SELECT 
                    f.tag_id tag_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total 
                FROM 
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f 
                WHERE 
                    t.tag_id = f.tag_id`;

      if (spaces_none) {
        mainQuery = mainQuery.andWhere(`tag.id IN 
                (SELECT 
                    spaces_subq.tag_id
                FROM 
                    (${subQuery}) spaces_subq 
                WHERE 
                    spaces_subq.cnt_filtered = 0
                )`);
      }

      if (spaces_some) {
        mainQuery = mainQuery.andWhere(`tag.id IN 
                (SELECT 
                    spaces_subq.tag_id
                FROM 
                    (${subQuery}) spaces_subq 
                WHERE 
                    spaces_subq.cnt_filtered > 0
                )`);
      }

      if (spaces_every) {
        mainQuery = mainQuery.andWhere(`tag.id IN 
                (SELECT 
                    spaces_subq.tag_id
                FROM 
                    (${subQuery}) spaces_subq 
                WHERE 
                    spaces_subq.cnt_filtered > 0 
                    AND spaces_subq.cnt_filtered = spaces_subq.cnt_total
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
