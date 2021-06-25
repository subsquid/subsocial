import { Service, Inject } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { WhereInput } from 'warthog';
import { WarthogBaseService } from '../../WarthogBaseService';

import { TreasuryProposal } from './treasury-proposal.model';

import {} from '../variants/variants.model';

import { TreasuryProposalWhereArgs, TreasuryProposalWhereInput } from '../../../generated';

import { Post } from '../post/post.model';
import { PostService } from '../post/post.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@Service('TreasuryProposalService')
export class TreasuryProposalService extends WarthogBaseService<TreasuryProposal> {
  @Inject('PostService')
  public readonly posttreasuryProposalService!: PostService;

  constructor(@InjectRepository(TreasuryProposal) protected readonly repository: Repository<TreasuryProposal>) {
    super(TreasuryProposal, repository);
  }

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<TreasuryProposal[]> {
    let f = fields || [];

    return this.findWithRelations<W>(where, orderBy, limit, offset, f);
  }

  async findWithRelations<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<TreasuryProposal[]> {
    const where = <TreasuryProposalWhereInput>(_where || {});

    // remove relation filters to enable warthog query builders

    const { posttreasuryProposal_some, posttreasuryProposal_none, posttreasuryProposal_every } = where;

    if (+!!posttreasuryProposal_some + +!!posttreasuryProposal_none + +!!posttreasuryProposal_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.posttreasuryProposal_some;
    delete where.posttreasuryProposal_none;
    delete where.posttreasuryProposal_every;

    let mainQuery = this.buildFindQueryWithParams(<any>where, orderBy, undefined, fields, 'main').take(undefined); // remove LIMIT

    let parameters = mainQuery.getParameters();

    const posttreasuryProposalFilter =
      posttreasuryProposal_some || posttreasuryProposal_none || posttreasuryProposal_every;

    if (posttreasuryProposalFilter) {
      const posttreasuryProposalQuery = this.posttreasuryProposalService
        .buildFindQueryWithParams(<any>posttreasuryProposalFilter, undefined, undefined, ['id'], 'posttreasuryProposal')
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...posttreasuryProposalQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin(
          'treasuryproposal.posttreasuryProposal',
          'posttreasuryProposal_filtered',
          `posttreasuryProposal_filtered.id IN (${posttreasuryProposalQuery.getQuery()})`
        )
        .groupBy('treasuryproposal_id')
        .addSelect('count(posttreasuryProposal_filtered.id)', 'cnt_filtered')
        .addSelect('treasuryproposal.id', 'treasuryproposal_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('treasuryproposal.posttreasuryProposal', 'posttreasuryProposal_total')
        .groupBy('treasuryproposal_id')
        .addSelect('count(posttreasuryProposal_total.id)', 'cnt_total')
        .addSelect('treasuryproposal.id', 'treasuryproposal_id');

      const subQuery = `
                SELECT 
                    f.treasuryproposal_id treasuryproposal_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total 
                FROM 
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f 
                WHERE 
                    t.treasuryproposal_id = f.treasuryproposal_id`;

      if (posttreasuryProposal_none) {
        mainQuery = mainQuery.andWhere(`treasuryproposal.id IN 
                (SELECT 
                    posttreasuryProposal_subq.treasuryproposal_id
                FROM 
                    (${subQuery}) posttreasuryProposal_subq 
                WHERE 
                    posttreasuryProposal_subq.cnt_filtered = 0
                )`);
      }

      if (posttreasuryProposal_some) {
        mainQuery = mainQuery.andWhere(`treasuryproposal.id IN 
                (SELECT 
                    posttreasuryProposal_subq.treasuryproposal_id
                FROM 
                    (${subQuery}) posttreasuryProposal_subq 
                WHERE 
                    posttreasuryProposal_subq.cnt_filtered > 0
                )`);
      }

      if (posttreasuryProposal_every) {
        mainQuery = mainQuery.andWhere(`treasuryproposal.id IN 
                (SELECT 
                    posttreasuryProposal_subq.treasuryproposal_id
                FROM 
                    (${subQuery}) posttreasuryProposal_subq 
                WHERE 
                    posttreasuryProposal_subq.cnt_filtered > 0 
                    AND posttreasuryProposal_subq.cnt_filtered = posttreasuryProposal_subq.cnt_total
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
