import { BaseModel, IntField, NumericField, DateTimeField, Model, ManyToMany, StringField } from 'warthog';

import BN from 'bn.js';

import { JoinTable } from 'typeorm';

import { Tag } from '../tag/tag.model';

@Model({ api: {} })
export class Space extends BaseModel {
  @StringField({
    nullable: true
  })
  createdByAccount?: string;

  @NumericField({
    nullable: true,

    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined
    }
  })
  createdAtBlock?: BN;

  @DateTimeField({
    nullable: true
  })
  createdAtTime?: Date;

  @StringField({})
  spaceId!: string;

  @DateTimeField({
    nullable: true
  })
  updatedAtTime?: Date;

  @StringField({
    nullable: true
  })
  ownerId?: string;

  @IntField({
    nullable: true
  })
  postsCount?: number;

  @IntField({
    nullable: true
  })
  publicPostsCount?: number;

  @IntField({
    nullable: true
  })
  hiddenPostsCount?: number;

  @IntField({
    nullable: true
  })
  followersCount?: number;

  @IntField({
    nullable: true
  })
  score?: number;

  @StringField({
    nullable: true
  })
  content?: string;

  @StringField({
    nullable: true
  })
  name?: string;

  @StringField({
    nullable: true
  })
  image?: string;

  @StringField({
    nullable: true
  })
  summary?: string;

  @StringField({
    nullable: true
  })
  tagsOriginal?: string;

  @ManyToMany(
    () => Tag,
    (param: Tag) => param.spaces
  )
  tags!: Tag[];

  constructor(init?: Partial<Space>) {
    super();
    Object.assign(this, init);
  }
}
