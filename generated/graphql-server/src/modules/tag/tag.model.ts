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
    (param: Post) => param.tags
  )
  @JoinTable({
    name: 'tag_post',
    joinColumn: { name: 'tag_id' },
    inverseJoinColumn: { name: 'post_id' }
  })
  posts!: Post[];

  @ManyToMany(
    () => Space,
    (param: Space) => param.tags
  )
  @JoinTable({
    name: 'tag_space',
    joinColumn: { name: 'tag_id' },
    inverseJoinColumn: { name: 'space_id' }
  })
  spaces!: Space[];

  constructor(init?: Partial<Tag>) {
    super();
    Object.assign(this, init);
  }
}
