import { BaseModel, Model, ManyToMany, StringField } from 'warthog';

import { JoinTable } from 'typeorm';

import { Post } from '../post/post.model';
import { Space } from '../space/space.model';

@Model({ api: {} })
export class Tag extends BaseModel {
  @StringField({
    nullable: true
  })
  tag?: string;

  @ManyToMany(
    () => Post,
    (param: Post) => param.tags,
    {
      modelName: 'Tag',
      relModelName: 'Post',
      propertyName: 'posts'
    }
  )
  posts!: Post[];

  @ManyToMany(
    () => Space,
    (param: Space) => param.tags,
    {
      modelName: 'Tag',
      relModelName: 'Space',
      propertyName: 'spaces'
    }
  )
  spaces!: Space[];

  constructor(init?: Partial<Tag>) {
    super();
    Object.assign(this, init);
  }
}
