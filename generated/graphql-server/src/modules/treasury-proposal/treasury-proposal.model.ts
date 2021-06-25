import { BaseModel, IntField, Model, OneToMany, EnumField, StringField } from 'warthog';

import { Post } from '../post/post.model';

import { Network } from '../enums/enums';
export { Network };

@Model({ api: {} })
export class TreasuryProposal extends BaseModel {
  @StringField({})
  postId!: string;

  @IntField({})
  proposalId!: number;

  @EnumField('Network', Network, {})
  network!: Network;

  @OneToMany(
    () => Post,
    (param: Post) => param.treasuryProposal,
    {
      nullable: true,
      modelName: 'TreasuryProposal',
      relModelName: 'Post',
      propertyName: 'posttreasuryProposal'
    }
  )
  posttreasuryProposal?: Post[];

  constructor(init?: Partial<TreasuryProposal>) {
    super();
    Object.assign(this, init);
  }
}
