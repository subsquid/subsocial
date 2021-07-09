import { Service, Inject } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { WhereInput } from 'warthog';
import { WarthogBaseService } from '../../WarthogBaseService';

import { KusamaProposals } from './kusama-proposals.model';

import {} from '../variants/variants.model';

import { KusamaProposalsWhereArgs, KusamaProposalsWhereInput } from '../../../generated';

@Service('KusamaProposalsService')
export class KusamaProposalsService extends WarthogBaseService<KusamaProposals> {
  constructor(@InjectRepository(KusamaProposals) protected readonly repository: Repository<KusamaProposals>) {
    super(KusamaProposals, repository);
  }

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<KusamaProposals[]> {
    let f = fields || [];

    return this.findWithRelations<W>(where, orderBy, limit, offset, f);
  }

  async findWithRelations<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<KusamaProposals[]> {
    const where = <KusamaProposalsWhereInput>(_where || {});

    let mainQuery = this.buildFindQueryWithParams(<any>where, orderBy, undefined, fields, 'main').take(undefined); // remove LIMIT

    let parameters = mainQuery.getParameters();

    mainQuery = mainQuery.setParameters(parameters);

    return mainQuery
      .take(limit || 50)
      .skip(offset || 0)
      .getMany();
  }
}
