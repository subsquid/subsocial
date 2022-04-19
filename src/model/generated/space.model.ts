import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Space {
  constructor(props?: Partial<Space>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: true})
  createdByAccount!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  createdAtBlock!: bigint | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  createdAtTime!: Date | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  createdOnDay!: Date | undefined | null

  @Column_("text", {nullable: false})
  spaceId!: string

  @Column_("timestamp with time zone", {nullable: true})
  updatedAtTime!: Date | undefined | null

  @Column_("text", {nullable: true})
  ownerId!: string | undefined | null

  @Column_("integer", {nullable: true})
  postsCount!: number | undefined | null

  @Column_("integer", {nullable: true})
  publicPostsCount!: number | undefined | null

  @Column_("integer", {nullable: true})
  hiddenPostsCount!: number | undefined | null

  @Column_("integer", {nullable: true})
  followersCount!: number | undefined | null

  @Column_("integer", {nullable: true})
  score!: number | undefined | null

  @Column_("text", {nullable: true})
  content!: string | undefined | null

  @Column_("text", {nullable: true})
  name!: string | undefined | null

  @Column_("text", {nullable: true})
  image!: string | undefined | null

  @Column_("text", {nullable: true})
  summary!: string | undefined | null

  @Column_("text", {nullable: true})
  tagsOriginal!: string | undefined | null
}
