import { Service, Inject } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { WhereInput } from 'warthog';
import { WarthogBaseService } from '../../WarthogBaseService';

import { Post } from './post.model';

import {} from '../variants/variants.model';

import { PostWhereArgs, PostWhereInput } from '../../../generated';

import { Tag } from '../tag/tag.model';
import { TagService } from '../tag/tag.service';
import { TreasuryProposal } from '../treasury-proposal/treasury-proposal.model';
import { TreasuryProposalService } from '../treasury-proposal/treasury-proposal.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@Service('PostService')
export class PostService extends WarthogBaseService<Post> {
  @Inject('TagService')
  public readonly tagsService!: TagService;
  @Inject('TreasuryProposalService')
  public readonly treasuryProposalService!: TreasuryProposalService;

  constructor(@InjectRepository(Post) protected readonly repository: Repository<Post>) {
    super(Post, repository);
  }

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Post[]> {
    let f = fields || [];

    return this.findWithRelations<W>(where, orderBy, limit, offset, f);
  }

  async findWithRelations<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Post[]> {
    const where = <PostWhereInput>(_where || {});

    // remove relation filters to enable warthog query builders

    const { tags_some, tags_none, tags_every } = where;

    if (+!!tags_some + +!!tags_none + +!!tags_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.tags_some;
    delete where.tags_none;
    delete where.tags_every;
    // remove relation filters to enable warthog query builders
    const { treasuryProposal } = where;
    delete where.treasuryProposal;

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
        .leftJoin('post.tags', 'tags_filtered', `tags_filtered.id IN (${tagsQuery.getQuery()})`)
        .groupBy('post_id')
        .addSelect('count(tags_filtered.id)', 'cnt_filtered')
        .addSelect('post.id', 'post_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('post.tags', 'tags_total')
        .groupBy('post_id')
        .addSelect('count(tags_total.id)', 'cnt_total')
        .addSelect('post.id', 'post_id');

      const subQuery = `
                SELECT 
                    f.post_id post_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total 
                FROM 
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f 
                WHERE 
                    t.post_id = f.post_id`;

      if (tags_none) {
        mainQuery = mainQuery.andWhere(`post.id IN 
                (SELECT 
                    tags_subq.post_id
                FROM 
                    (${subQuery}) tags_subq 
                WHERE 
                    tags_subq.cnt_filtered = 0
                )`);
      }

      if (tags_some) {
        mainQuery = mainQuery.andWhere(`post.id IN 
                (SELECT 
                    tags_subq.post_id
                FROM 
                    (${subQuery}) tags_subq 
                WHERE 
                    tags_subq.cnt_filtered > 0
                )`);
      }

      if (tags_every) {
        mainQuery = mainQuery.andWhere(`post.id IN 
                (SELECT 
                    tags_subq.post_id
                FROM 
                    (${subQuery}) tags_subq 
                WHERE 
                    tags_subq.cnt_filtered > 0 
                    AND tags_subq.cnt_filtered = tags_subq.cnt_total
                )`);
      }
    }

    if (treasuryProposal) {
      // OTO or MTO
      const treasuryProposalQuery = this.treasuryProposalService
        .buildFindQueryWithParams(<any>treasuryProposal, undefined, undefined, ['id'], 'treasuryProposal')
        .take(undefined); // remove the default LIMIT

      mainQuery = mainQuery.andWhere(`"post"."treasury_proposal_id" IN (${treasuryProposalQuery.getQuery()})`);

      parameters = { ...parameters, ...treasuryProposalQuery.getParameters() };
    }

    mainQuery = mainQuery.setParameters(parameters);

    return mainQuery
      .take(limit || 50)
      .skip(offset || 0)
      .getMany();
  }
}
